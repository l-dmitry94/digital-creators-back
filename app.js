import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocumention from './swagger.json' with { type: 'json' };
import fs from 'fs';
import cloudinary from './helpers/cloudinary.js';
import authRouter from './routes/authRouter.js';
import supportRouter from './routes/supportRouter.js';
import uploadsRouter from './routes/uploadsRouter.js';
import boardRouter from './routes/boardRouter.js';
import columnRouter from './routes/columnRouter.js';
import cardRouter from './routes/cardRouter.js';
import { emailError, passwordError } from './constants/avatar-constants.js';
const { DB_HOST, PORT } = process.env;

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumention));

app.use('/api/user', uploadsRouter);
app.use('/api/auth', authRouter);
app.use('/api/boards', boardRouter);
app.use('/api/boards/:boardId/columns', columnRouter);
app.use('/api/boards/:boardId/columns/:columnId/cards', cardRouter);
app.use('/api/support', supportRouter);

app.use((_, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(async (err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    if (message === emailError || message === passwordError) {
        if (req.file?.path) {
            fs.promises.unlink(req.file.path);
            await cloudinary.api.delete_resources(req.avatar);
        }
    }
    res.status(status).json({ message });
});

mongoose
    .connect(DB_HOST)
    .then(() => {
        console.log('Database connection successful');

        app.listen(PORT, () => {
            console.log(`Server is running. Use our API on port: ${PORT}`);
        });
    })
    .catch(error => {
        console.error(error.message);
        process.exit(1);
    });
