import express from "express";

import cors from "cors";
import { userRouter } from "./routes/user";
import { taskRouter } from "./routes/task";
import { triggerRouter } from "./routes/trigger";
import { actionRouter } from "./routes/action";

const app = express()
const port = 3000;

app.use(express.json());
app.use(cors())


app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);

app.listen(port, () => {
    console.log(`server is running at ${port}`);
})