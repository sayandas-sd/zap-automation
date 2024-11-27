"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const task_1 = require("./routes/task");
const trigger_1 = require("./routes/trigger");
const action_1 = require("./routes/action");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/user", user_1.userRouter);
app.use("/api/v1/task", task_1.taskRouter);
app.use("/api/v1/trigger", trigger_1.triggerRouter);
app.use("/api/v1/action", action_1.actionRouter);
app.listen(port, () => {
    console.log(`server is running at ${port}`);
});
