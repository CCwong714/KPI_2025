import 'dotenv/config';
import express, { Express, NextFunction, Request, Response } from 'express';
import authRoutes from './routes/auth-routes';
import userRoutes from './routes/user-routes';
import postedRoutes from './routes/posted-routes';
import connectToDB from './database/db';
import cors from 'cors';
import path from 'path';

console.log('MONGO_URI from env:', process.env.MONGO_URI);

const app: Express = express();
const PORT = process.env.PORT || 3000;

connectToDB();
app.use(
  cors({
    origin: 'http://localhost:5173', // 允许前端的地址
    credentials: true, // 如果要传 cookie 或 header token
  })
);

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

interface ICustomRequest extends Request {
  startTime?: number;
}

// middleware -> add startTime to request
app.use((req: ICustomRequest, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posted', postedRoutes);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
