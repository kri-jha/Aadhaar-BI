import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Unique filename: timestamp-originalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// POST /api/analysis/submit
router.post('/submit', upload.single('file'), async (req, res): Promise<any> => {
    try {
        const { participantName, description } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!participantName) {
            return res.status(400).json({ error: 'Participant name is required' });
        }

        const submission = await prisma.analysisSubmission.create({
            data: {
                participantName,
                description,
                filePath: file.path
            }
        });

        res.status(201).json({
            message: 'Analysis submitted successfully',
            submission
        });
    } catch (error) {
        console.error('Error submitting analysis:', error);
        res.status(500).json({ error: 'Failed to submit analysis' });
    }
});

// GET /api/analysis/submissions
router.get('/submissions', async (req, res) => {
    try {
        const submissions = await prisma.analysisSubmission.findMany({
            orderBy: { submittedAt: 'desc' }
        });
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

export default router;
