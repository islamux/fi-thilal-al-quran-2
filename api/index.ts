import express from 'express';
import healthRouter from '../server/routes/health';

const app = express();
app.use(healthRouter);

export default app;
