import express from "express";
import { PrismaClient } from '@prisma/client'

const port = 3000
const app = express();
const prisma = new PrismaClient();


app.post("/hooks/catch/:userId/:taskId", async (req, res) => {
    const body = req.body;
    const userId = req.params.userId;
    const taskId = req.params.taskId;
    
    await prisma.$transaction(async tx => {
        const taskRun = await prisma.taskRun.create({
            data: {
                taskId: taskId,
                metadata: body
            }
        });

        await prisma.taskRunOut.create({
            data: {
                taskRunId: taskRun.id
            }
        })
    })

})

app.listen(port, () => {
    console.log(`server is running at ${port}`);
})