import express from 'express';
import battleRoutes from './routes/saveRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

app.use('/api/v1/save', battleRoutes);

app.use(errorHandler);

export default app;