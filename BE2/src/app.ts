import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import subtitlesRoutes from './routes/mainRoute';
import cors from 'cors';

dotenv.config();


const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());

// Use the subtitles routes
app.use('/api/v1', subtitlesRoutes);

// Error-handling middleware (optional)
//@ts-ignore
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
