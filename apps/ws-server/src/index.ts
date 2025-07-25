import { WebSocketServer } from "ws";
import { client } from "@repo/db/client";

const server = new WebSocketServer({ port: 3001 });

async function createUser(username: string, password: string) {
  
  const user = await client.user.create({
		data: {
			username,
			password
		}
	}).catch((error: Error) => {
		console.error("Error creating user:", error);
		throw new Error("Failed to create user");
	})
  return user;
}

server.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", (message) => {
    const data = JSON.parse(message.toString());

		const { username, password } = data;
		console.log(`Received data: ${username}, ${password}`);

		createUser(username, password)
			.then((user) => {
				console.log("User created successfully:", user);
				socket.send(JSON.stringify({ status: "success", user }));
			})
			.catch((error: Error) => {
				socket.send(JSON.stringify({ status: "error", message: error.message }));
			});
			
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:3001");