import { Router } from "express";
import { authMiddleware } from "../middleware";
import { TaskSchema } from "../types";
import { prisma } from "../db";


const router = Router();

router.get("/details", async (req,res)=> {
    const availablActions = await prisma.availableAction.findMany({});

    res.json({
        availablActions
    })
})

export const actionRouter = router;