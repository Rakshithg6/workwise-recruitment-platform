import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './auth.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Workwise Auth API running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
