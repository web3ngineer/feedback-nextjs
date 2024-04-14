import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number,
}

const connection: ConnectionObject = {}

export async function dbConnect(): Promise<void> {
    // If already connected, return early
    if (connection.isConnected) {
        console.log('Already connected to MongoDB');
        return;
    }

    try {
        // Attempt to establish connection
        const db = await mongoose.connect(process.env.MONGODB_URI! as string || "");
        // console.log(db)

        connection.isConnected = db.connections[0].readyState;

        // Handle connection events
        db.connection.on('connected', () => {
            console.log('MongoDB Connected');
        });
        
        // Handle connection errors
        db.connection.on('error', (error) => {
            console.log('MongoDB Connection error: ' + error);
            process.exit(1);
        });

        // Handle disconnection events
        db.connection.on('disconnected', () => {
            console.log('MongoDB Disconnected');
        })

    } catch (error) {
        // Handle connection errors during initial connection
        console.log("Error occurred while establishing DB connection.");
        console.log(error);
        process.exit(1);
    }
}