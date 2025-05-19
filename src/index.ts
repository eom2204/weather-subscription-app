import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger/swagger.json';
import path from 'path';
import routes from './routes';
import { migrate } from './utils/migrate';

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(' ', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', routes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI!)
    .then(async () => {
        console.log('MongoDB connected');
        await migrate();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('DB connection error:', err));