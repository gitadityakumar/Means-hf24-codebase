import express from 'express';
import videoController  from '../controllers/videoController';


const router = express.Router();

router.post('/processVideo', videoController.processVideo);
router.get('/jobStatus/:jobId', videoController.getJobStatus);
router.get('/healthCheck', videoController.healthCheck); 

export default router;
