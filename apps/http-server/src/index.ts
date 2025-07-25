import express from "express";
import { client } from "@repo/db/client";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the HTTP server!");
});

app.post("/signup", async( req, res) => {
    const { username, password } = req.body;

    try {
        const user = await client.user.create({
            data: {
                username,
                password
            }
        });
        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

app.listen(PORT, () => {
  console.log(`HTTP server is running on http://localhost:${PORT}`);
});