import { Express, Request, Response } from 'express';
import { processVideoData } from "./services/videoDataService";
import { secret } from './index';
import { getProcessedDataFromDB } from './services/databaseService';

let receivedUserData: any = null; // Variable to store received user data

export function configureRoutes(app: Express) {
    app.get('/healthCheck', (req: Request, res: Response) => {
        res.send('Everything is Healthy!');
    });

    app.get('/', (req: Request, res: Response) => {
        res.redirect('/healthCheck');
    });

    app.post('/url', (req: Request, res: Response) => {
        try {
            const videoData = req.body;
            processVideoData(videoData);
            res.status(200).send("Data processed successfully");
        } catch (error) {
            console.error('Error processing video data:', error);
            res.status(500).send("Error processing data");
        }
    });

    app.get('/processedData', async (req: Request, res: Response) => { 
        try {
            const processedData = await getProcessedDataFromDB(); 
            res.json(processedData);
        } catch (error) {
            console.error('Error fetching processed data:', error);
            res.status(500).send("Error fetching processed data");
        }
    });
    

    // Endpoint to receive user data
    app.post('/api/user', (req: Request, res: Response) => {
        const userData = req.body;

        if (!userData || !userData.id || userData.secret !== secret) {
            return res.status(400).json({ error: 'Invalid user data' });
        }

        console.log('Received user data:', userData);

        // Store received user data
        receivedUserData = userData.id;

        // Respond with a success message
        res.status(200).json({ message: 'User data received successfully', userData });
    });

    // Endpoint to handle authentication requests
    app.post('/api/auth', (req: Request, res: Response) => {
        const authData = req.body;

        if (!authData.key || authData.key !== secret) {
            return res.status(400).json({ error: 'Invalid authentication key' });
        }

        if (!receivedUserData) {
            return res.status(400).json({ error: 'No user data received yet' });
        }

        console.log('Received auth request with key from extension:', authData.key);

        // Respond with the received user data
        res.status(200).json({ message: 'User data retrieved successfully', userData: receivedUserData });
    });
}
