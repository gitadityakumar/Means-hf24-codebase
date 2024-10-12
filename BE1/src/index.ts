import express from 'express';
import { configureRoutes } from './routes';
import { startPeriodicDatabaseUpdate } from './services/databaseService';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

 export const secret = process.env.SECRET;
// console.log(secret);
// Middleware to parse JSON bodies
app.use(express.json());

const port = process.env.PORT || 3002;

// Configure routes
configureRoutes(app);

// Start periodic database update
startPeriodicDatabaseUpdate();

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
