import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import { connect } from "./db/connection";

const app = express();
const PORT = 3100;

const startServer = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world com TS");
});

app.use("/auth", authRoutes);
