import { errors } from 'celebrate';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import notesRouter from './routes/notesRoutes.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
  await connectMongoDB();

  const app = express();

  app.use(logger);
  app.use(express.json());
  app.use(cors());

  app.use(notesRouter);

  app.use(errors());
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
