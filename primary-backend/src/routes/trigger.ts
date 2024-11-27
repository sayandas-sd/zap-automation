import { Router } from "express";
import { authMiddleware } from "../middleware";
import { TaskSchema } from "../types";
import { prisma } from "../db";


const router = Router();

router.get("/details", async (req,res)=> {
    const availableTriggers = await prisma.availableTrigger.findMany({});

    res.json({
        availableTriggers
    })
})

export const triggerRouter = router;