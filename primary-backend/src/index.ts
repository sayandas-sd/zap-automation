import express from "express";

import cors from "cors";
import { userRouter } from "./routes/user";
import { taskRouter } from "./routes/task";

const app = express()
const port = 3002;

app.use(express.json());
app.use(cors())


app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

app.listen(port, () => {
    console.log(`server is running at ${port}`);
})