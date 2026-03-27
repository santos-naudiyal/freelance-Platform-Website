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
import workspaceRoutes from './routes/workspaceRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import invitationRoutes from './routes/invitationRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { createServer } from 'http';
import { initSocket } from './services/socketService';

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Diagnostic Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/invites', invitationRoutes);
app.use('/api/dashboard', dashboardRoutes);


httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

