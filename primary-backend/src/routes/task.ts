import { Router } from "express";
import { authMiddleware } from "../middleware";

const router = Router();

router.post("/", authMiddleware, (req,res) => {
    
})

router.get("/", authMiddleware, (req,res) => {

})

router.get("/:taskId", authMiddleware, (req,res) => {

})

export const taskRouter = router;
