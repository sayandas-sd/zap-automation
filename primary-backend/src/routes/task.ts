import { Router } from "express";
import { authMiddleware } from "../middleware";
import { TaskSchema } from "../types";
import { prisma } from "../db";

const router = Router();

router.post("/", authMiddleware, async (req,res) => {
    const body = req.body;
    //@ts-ignore
    const id: string = req.id;
    const parseData = TaskSchema.safeParse(body);

    if(!parseData.success) {
        res.status(411).json({
            msg: "Incorrect Input"
        })
        return;
    }

    const allTaskId = await prisma.$transaction(async tx => {
        const task = await prisma.task.create({
            data: {
                userId: parseInt(id),
                triggerId: "",
                action: {
                    create: parseData.data.action.map((r, index) => ({
                        actionId: r.availableActionId,
                        sortingOrder: index,
                        metadata: r.actionMetadata
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

        await tx.task.update({
            where: {
                id: task.id
            },
            data: {
                triggerId: trigger.id
            }
        })
         
        return task.id;
    })
    
    res.status(200).json({
        allTaskId
    })

    
})

router.get("/", authMiddleware, async (req,res) => {
    //@ts-ignore
    const id = req.id;
    const task = await prisma.task.findMany({
        where: {
            userId: id
        },
        include: {
            action: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    })
    
    res.json({
        task
    })

})

router.get("/:taskId", authMiddleware, async (req,res) => {
    //@ts-ignore
    const id = req.id;
    const taskId = req.params.taskId;

    const task = await prisma.task.findMany({
        where: {
            id: taskId,
            userId: id,
        },
        include: {
            action: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    })

    res.json({
        task
    })
})

export const taskRouter = router;