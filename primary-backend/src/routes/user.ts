import { Router } from "express";
import { authMiddleware } from "../middleware";

const router = Router();

router.post("/signup", (req,res) => {
    
}) 
router.post("/signin", (req,res) => {

}) 
router.get("/user", authMiddleware, (req,res) => {

}) 




export const userRouter = router;