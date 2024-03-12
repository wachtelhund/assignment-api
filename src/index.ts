import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(helmet());
app.use(logger('dev'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

