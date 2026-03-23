import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Configure dotenv before any other imports that might use process.env
dotenv.config();

// Firebase and Routes
import userRoutes from './routes/userRoutes';
import freelancerRoutes from './routes/freelancerRoutes';
import projectRoutes from './routes/projectRoutes';
import proposalRoutes from './routes/proposalRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import paymentRoutes from './routes/paymentRoutes';
import aiRoutes from './routes/aiRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Firebase Admin is initialized automatically when imported

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/freelancers', freelancerRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
