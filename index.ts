import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import dotenv from 'dotenv';
import { swaggerDocs } from './src/utils/swagger';
import { router as v1Router } from './src/api/v1/view/routes/router';
import mongoose, { Mongoose } from 'mongoose';
import { errorHandler } from './src/utils/errorHandler';
import bodyParser from 'body-parser';

dotenv.config();

if (process.env.MONGO_URI !== undefined) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Database connection OK!');
      const app = express();
      app.use(helmet());
      app.use(logger('dev'));
      app.use(bodyParser.json());

      
      swaggerDocs(app);

      app.use('/api/v1', v1Router);

      app.use(errorHandler);

      app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
      });
    })
    .catch((err) => {
      console.error('Error connecting to the database');
      console.error(err);
      process.exit(1);
    });
} else {
  console.error('MONGO_URI is not defined');
  process.exit(1);
}


