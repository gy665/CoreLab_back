import express from 'express';
import mongoose from 'mongoose';
import equipmentRoutes from './routes/equipment.route.js'; // also fixed import path
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import subscriptionRoutes from './routes/subscription.route.js';
import courseRoutes from './routes/course.route.js';
import reservationRoutes from './routes/reservation.route.js';
import notificationRoutes from './routes/notification.route.js';
import statistiqueRoutes from './routes/statistique.routes.js';
import  chatRoutes  from './routes/chat.route.js';





const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/equipments", equipmentRoutes);
app.use('/api/user', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/statistiques', statistiqueRoutes);
app.use('/api', chatRoutes);

app.get('/', (req, res) => {
    res.send("hello from node Api");
});

//config
dotenv.config();

// MongoDB connection
mongoose.connect("mongodb+srv://rockitiyoussef33:80HAkuFcNZDORduz@backend-corelab.zreebzy.mongodb.net/?retryWrites=true&w=majority&appName=backend-corelab")
    .then(() => {
        console.log("Connected to database!");
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((error) => {
        console.log("Connection failure:", error);
    });
