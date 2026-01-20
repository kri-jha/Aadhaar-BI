const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchKPIs = async (filters: any) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/kpis?${query}`);
    if (!res.ok) throw new Error('Failed to fetch KPIs');
    return res.json();
};

export const fetchDemandSpikes = async (filters: any) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/demand-spikes?${query}`);
    if (!res.ok) throw new Error('Failed to fetch Demand Spikes');
    return res.json();
};

export const fetchBehavioralPatterns = async (filters: any) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/behavioral-patterns?${query}`);
    if (!res.ok) throw new Error('Failed to fetch Patterns');
    return res.json();
};

export const fetchExclusionRisk = async (filters: any) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/exclusion-risk?${query}`);
    if (!res.ok) throw new Error('Failed to fetch Risk Data');
    return res.json();
};

export const fetchRecommendations = async (filters: any) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/recommendations?${query}`);
    if (!res.ok) throw new Error('Failed to fetch Recommendations');
    return res.json();
};
