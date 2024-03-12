import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import dotenv from 'dotenv';
import { router as v1Router } from './src/api/v1/view/routes/router';
import { swaggerDocs } from './src/utils/swagger';

dotenv.config();

const app = express();
app.use(helmet());
app.use(logger('dev'));
swaggerDocs(app);

app.use('/api/v1', v1Router);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

