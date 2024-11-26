import { Router } from "express";
import { authMiddleware } from "../middleware";

import { prisma } from "../db";
import { SigninSchema, SignupSchema } from "../types";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import bcrypt from "bcrypt";

const router = Router();

router.post("/signup", async (req,res) => {
    const body = req.body;
    const parseData = SignupSchema.safeParse(body);
    
    if(!parseData.success) {
        res.status(411).json({
            msg: "Incorrect Input"
        })
        return;
    }
    try{
        const userExits = await prisma.user.findFirst({
            where: {
                email: parseData.data.username
            }
        })

        if(userExits) {
            res.status(403).json({
                msg: "user already exits"
            })
            return;
        }

        //hash password
        const salt = 10;
        const hashPass = await bcrypt.hash(parseData.data.password, salt);

        await prisma.user.create({
            data: {
                email: parseData.data.username,
                password: hashPass,
                name: parseData.data.name,
            }
        })

       

        res.status(200).json({
            msg: "Signup successful and Please verify your account ",
        })

    } catch(e) {
        res.status(500).json({
            msg: "server error"
        })
    }
}) 

router.post("/signin", async (req,res) => {

    const body = req.body;
    const parseData = SigninSchema.safeParse(body);


    if(!parseData.success) {
        res.status(411).json({
            msg: "Incorrect Input"
        })
        return;
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: parseData.data.username,
            }
        })

        if(!user) {
            res.status(403).json({
                msg: "Incorrect credentials"
            })
            return;
        }
        
        const passwordMatch = bcrypt.compare(parseData.data.password, user.password)

        if (!passwordMatch) {
            res.status(403).json({
                msg: "Incorrect credentials"
            });
        }

        const token = jwt.sign({
            id: user.id
        }, JWT_PASSWORD);

        res.json({
            token
        })

    } catch(e) {
        res.status(500).json({
            msg: "server error"
        })
    }

}) 

router.get("/", authMiddleware, async (req,res) => {
    //@ts-ignore
    const id = req.id;
    const user = await prisma.user.findFirst({
        where: {
           id
        },
        select: {
            name: true,
            email: true
        }
    })

    res.json({
        user
    })

}) 




export const userRouter = router;