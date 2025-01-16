import "dotenv/config";
import connectDb from "./db/index.js";
import { app } from "./app.js";
import { Server } from "socket.io";
import http from "http";
import { updateAttendees } from "./controllers/event.controller.js";

connectDb()
  .then(() => {
    const server = http.createServer(app); // Create an HTTP server
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173", // Replace with your frontend's origin
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("updateAttendees", async (eventId, newAttendee) => {
        const updatedEvent = await updateAttendees(eventId, newAttendee);
        io.emit("attendeesUpdated", updatedEvent);
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });

    app.on("error", (error) => {
      console.log("App error: ", error);
      throw error;
    });

    server.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running on port ${process.env.PORT || 8080}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed! ", error);
  });
