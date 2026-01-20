import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import apiRoutes from './api';
import analysisRoutes from './analysis';

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/api/analysis', analysisRoutes);


app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Aadhaar Insights Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
