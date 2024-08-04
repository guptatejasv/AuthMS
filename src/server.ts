import express from "express";
import dotenv from "dotenv";
import router from "./routes/auth.routes";
import connectDB from "./config/auth.db";
// import { Auth } from "./models/auth.model";
// import amqp from "amqplib";
// const RABBITMQ_URI = "amqp://localhost";

// async function listenForAdminCommands() {
//   try {
//     const connection = await amqp.connect(RABBITMQ_URI);
//     const channel = await connection.createChannel();
//     const queue = "admin_commands";

//     await channel.assertQueue(queue, { durable: false });
//     console.log("Auth service is listening for admin commands...");

//     channel.consume(queue, async (msg) => {
//       if (msg !== null) {
//         const command = JSON.parse(msg.content.toString());
//         console.log("Received command:", command);

//         if (command.type === "Block") {
//           await Auth.updateOne({ _id: command._id }, { isBlocked: true, isBlockedBy: command.blockedBy });
//           console.log(`User ${command._id} has been blocked.`);
//         } else if (command.type === "Unblock") {
//           await Auth.updateOne({ _id: command._id }, { isBlocked: false });
//           console.log(`User ${command._id} has been unblocked.`);
//         }
//         // Handle other commands...

//         channel.ack(msg);
//       }
//     });
//   } catch (error) {
//     console.error("Error in Auth microservice:", error);
//   }
// }

// listenForAdminCommands();

dotenv.config();
connectDB();

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
