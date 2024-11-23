import express from "express";
import { PrismaClient } from '@prisma/client'

const port = 3000
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.post("/hooks/catch/:userId/:taskId", async (req, res) => {
    const body = req.body;
    const userId = req.params.userId;
    const taskId = req.params.taskId;
    
    await prisma.$transaction(async tx => {
        const taskRun = await tx.taskRun.create({
            data: {
                taskId: taskId,
                metadata: body
            }
        });

        await tx.taskRunOut.create({
            data: {
                taskRunId: taskRun.id
            }
        })
    })

    res.json({
        msg: "webhook received"
    })

})

app.listen(port, () => {
    console.log(`server is running at ${port}`);
})