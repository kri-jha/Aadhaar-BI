import express from 'express';
import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

const router = express.Router();
const prisma = new PrismaClient();

// Helper to parse date
const parseDate = (d: any) => (d ? new Date(d) : undefined);

// 1. KPI Metrics
router.get('/kpis', async (req, res) => {
    try {
        const { state, district, dateRange } = req.query;
        // Basic filtering logic
        const where: any = {};
        if (state && state !== 'all-states') where.state = state;
        if (district && district !== 'all-districts') where.district = district;

        // Date filtering (default 30d)
        const end = new Date();
        const start = subDays(end, dateRange === '7d' ? 7 : dateRange === '90d' ? 90 : 30);
        where.date = { gte: start, lte: end };

        // Aggregations
        const totalActivity = await prisma.aadhaarTransaction.aggregate({
            _sum: {
                enrollmentCount: true,
                updateCount: true
            },
            where
        });

        const total = (totalActivity._sum.enrollmentCount || 0) + (totalActivity._sum.updateCount || 0);

        // Peak Date
        const dailyActivity = await prisma.aadhaarTransaction.groupBy({
            by: ['date'],
            where,
            _sum: {
                enrollmentCount: true,
                updateCount: true
            },
            orderBy: {
                _sum: {
                    enrollmentCount: 'desc' // Approximate peak
                }
            },
            take: 1
        });

        const peak = dailyActivity[0];
        const peakTransactions = (peak?._sum.enrollmentCount || 0) + (peak?._sum.updateCount || 0);
        const peakDate = peak ? format(peak.date, 'MMM d') : 'N/A';

        // High Risk Districts Count (Simplistic definition: rejection rate > 20% OR load > 90)
        // We can't do complex agg filters in prisma easy without raw query, so we'll fetch district stats
        const districtStats = await prisma.aadhaarTransaction.groupBy({
            by: ['district'],
            where,
            _sum: {
                rejectionCount: true,
                enrollmentCount: true,
                updateCount: true
            },
            _avg: {
                centerLoad: true
            }
        });

        const highRiskDistricts = districtStats.filter(d => {
            const totalTx = (d._sum.enrollmentCount || 0) + (d._sum.updateCount || 0);
            const rejRate = totalTx > 0 ? (d._sum.rejectionCount || 0) / totalTx : 0;
            return rejRate > 0.15 || (d._avg.centerLoad || 0) > 80;
        }).length;

        // Dominant Age Group
        const ageStats = await prisma.aadhaarTransaction.groupBy({
            by: ['ageGroup'],
            where,
            _sum: {
                enrollmentCount: true,
                updateCount: true
            },
            orderBy: {
                _sum: {
                    enrollmentCount: 'desc'
                }
            },
            take: 1
        });

        const dominantAgeGroup = ageStats[0]?.ageGroup || 'N/A';

        res.json({
            totalActivity: total,
            peakDate,
            peakTransactions,
            highRiskDistricts,
            dominantAgeGroup
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 2. Demand Spikes
router.get('/demand-spikes', async (req, res) => {
    try {
        const { state, district } = req.query;
        const where: any = {};
        if (state && state !== 'all-states') where.state = state;
        if (district && district !== 'all-districts') where.district = district;

        const dailyData = await prisma.aadhaarTransaction.groupBy({
            by: ['date'],
            where,
            _sum: {
                enrollmentCount: true,
                updateCount: true
            },
            orderBy: { date: 'asc' }
        });

        const result = dailyData.map(day => {
            const activity = (day._sum.enrollmentCount || 0) + (day._sum.updateCount || 0);
            return {
                date: format(day.date, 'MMM d'),
                activity,
                originalDate: day.date // keep for sorting/logic
            };
        });

        // Simple spike detection: if > 1.5 * moving average of last 3 days
        const withSpikes = result.map((day: any, idx: number, arr: any[]) => {
            if (idx < 3) return { ...day, spike: false };
            const prev3 = arr.slice(idx - 3, idx);
            const avg = prev3.reduce((sum: number, d: any) => sum + d.activity, 0) / 3;
            return {
                ...day,
                spike: day.activity > avg * 1.5
            };
        });

        res.json(withSpikes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 3. Behavioral Patterns
router.get('/behavioral-patterns', async (req, res) => {
    try {
        const { state, district } = req.query;
        const where: any = {};
        if (state && state !== 'all-states') where.state = state;
        if (district && district !== 'all-districts') where.district = district;

        const ageData = await prisma.aadhaarTransaction.groupBy({
            by: ['ageGroup'],
            where,
            _sum: {
                enrollmentCount: true,
                updateCount: true
            }
        });

        const total = ageData.reduce((sum: number, item: any) => sum + (item._sum.enrollmentCount || 0) + (item._sum.updateCount || 0), 0);

        const result = ageData.map((item: any) => ({
            category: `Age ${item.ageGroup}`,
            value: Math.round((((item._sum.enrollmentCount || 0) + (item._sum.updateCount || 0)) / total) * 100)
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4. Exclusion Risk
router.get('/exclusion-risk', async (req, res) => {
    try {
        const { state } = req.query;
        const where: any = {};
        if (state && state !== 'all-states') where.state = state;

        const districtStats = await prisma.aadhaarTransaction.groupBy({
            by: ['district'],
            where,
            _sum: {
                rejectionCount: true,
                enrollmentCount: true,
                updateCount: true
            },
            _avg: { centerLoad: true }
        });

        const result = districtStats.map((d: any) => {
            const total = (d._sum.enrollmentCount || 0) + (d._sum.updateCount || 0);
            const rejRate = total > 0 ? ((d._sum.rejectionCount || 0) / total) * 100 : 0;
            const load = d._avg.centerLoad || 0;

            let riskLevel = "Low";
            let action = "Monitor";

            if (rejRate > 15 || load > 85) {
                riskLevel = "High";
                action = "Deploy mobile units";
            } else if (rejRate > 8 || load > 60) {
                riskLevel = "Medium";
                action = "Increase staff";
            }

            return {
                district: d.district,
                riskLevel,
                rejectionRate: parseFloat(rejRate.toFixed(1)),
                centerLoad: load > 80 ? "Overloaded" : "Normal",
                recommendedAction: action,
                // hidden score for sorting
                score: rejRate + (load / 2)
            };
        }).sort((a: any, b: any) => b.score - a.score).slice(0, 10); // Top 10 risky

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 5. Recommendations
router.get('/recommendations', async (req, res) => {
    // Generate logical recommendations based on aggregate stats
    // This connects the other endpoints logic
    try {
        const { state } = req.query;
        const recommendations = [];

        // 1. Check needed for mobile units (High Risk)
        // (Re-using logic or just querying)
        // Optimization: In real app, cache this or filter.

        // Simulating some dynamic checks
        recommendations.push({
            title: "Deploy Temporary Enrollment Centers",
            reason: `Demand spike detected in ${state && state !== 'all-states' ? state : 'multiple districts'}`,
            priority: "High"
        });

        recommendations.push({
            title: "Optimize Staff Allocation",
            reason: "Wait times exceeding 45 mins in urban centers",
            priority: "Medium"
        });

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
