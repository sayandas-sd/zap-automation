"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const db_1 = require("../db");
const types_1 = require("../types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parseData = types_1.SignupSchema.safeParse(body);
    if (!parseData.success) {
        res.status(411).json({
            msg: "Incorrect Input"
        });
        return;
    }
    try {
        const userExits = yield db_1.prisma.user.findFirst({
            where: {
                email: parseData.data.username
            }
        });
        if (userExits) {
            res.status(403).json({
                msg: "user already exits"
            });
            return;
        }
        //hash password
        const salt = 10;
        const hashPass = yield bcrypt_1.default.hash(parseData.data.password, salt);
        yield db_1.prisma.user.create({
            data: {
                email: parseData.data.username,
                password: hashPass,
                name: parseData.data.name,
            }
        });
        res.status(200).json({
            msg: "Signup successful and Please verify your account ",
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "server error"
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parseData = types_1.SigninSchema.safeParse(body);
    if (!parseData.success) {
        res.status(411).json({
            msg: "Incorrect Input"
        });
        return;
    }
    try {
        const user = yield db_1.prisma.user.findFirst({
            where: {
                email: parseData.data.username,
            }
        });
        if (!user) {
            res.status(403).json({
                msg: "Incorrect credentials"
            });
            return;
        }
        const passwordMatch = bcrypt_1.default.compare(parseData.data.password, user.password);
        if (!passwordMatch) {
            res.status(403).json({
                msg: "Incorrect credentials"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id
        }, config_1.JWT_PASSWORD);
        res.json({
            token
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "server error"
        });
    }
}));
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const user = yield db_1.prisma.user.findFirst({
        where: {
            id
        },
        select: {
            name: true,
            email: true
        }
    });
    res.json({
        user
    });
}));
exports.userRouter = router;
