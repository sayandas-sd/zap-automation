import { Router } from "express";
import { authMiddleware } from "../middleware";
import { TaskSchema } from "../types";
import { prisma } from "../db";


const router = Router();

router.get("/details",  async (req,res)=> {
    const availableActions = await prisma.availableAction.findMany({});

    res.json({
        availableActions
    })
})

export const actionRouter = router;