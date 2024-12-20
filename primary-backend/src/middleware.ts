import { Request, Response, NextFunction } from "express";
import { JWT_PASSWORD } from "./config";
import jwt from "jsonwebtoken";



export function authMiddleware(req:Request, res:Response, next:NextFunction) {
    const token = req.headers.authorization as unknown as string;

    try{
        const payload = jwt.verify(token, JWT_PASSWORD);
        //@ts-ignore
        req.id = payload.id;
        next();
    } catch(e) {
        res.status(403).json({
            msg: "you are not logged in"
        })
    }
}