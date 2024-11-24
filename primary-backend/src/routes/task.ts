import { Router } from "express";
import { authMiddleware } from "../middleware";
import { TaskSchema } from "../types";
import { prisma } from "../db";

const router = Router();

router.post("/", authMiddleware, async (req,res) => {
    const body = req.body;
    const parseData = TaskSchema.safeParse(body);

    if(!parseData.success) {
        res.status(411).json({
            msg: "Incorrect Input"
        })
        return;
    }

    await prisma.$transaction(async tx => {
        const task = await prisma.task.create({
            data: {
                triggerId: "",
                action: {
                        create: parseData.data.action.map((r, index) => ({
                            actionId: r.availablActionId,
                            sortingOrder: index
                        }))
                }
            }
        })

        const trigger = await tx.trigger.create({
            data: {
                triggerId: parseData.data.availableTriggerId,
                TaskId: task.id
            }
        })

        

    })

    
})

router.get("/", authMiddleware, (req,res) => {

})

router.get("/:taskId", authMiddleware, (req,res) => {

})

export const taskRouter = router;