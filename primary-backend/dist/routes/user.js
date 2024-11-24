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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const db_1 = require("../db");
const types_1 = require("../types");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const parseData = types_1.SignupSchema.safeParse(body);
    if (!parseData.success) {
        res.status(411).json({
            msg: "Incorrect Input"
        });
        return;
    }
    const userExits = yield db_1.prisma.user.findFirst({
        where: {
            email: (_a = parseData.data) === null || _a === void 0 ? void 0 : _a.username
        }
    });
    if (userExits) {
        res.status(403).json({
            msg: "user already exits"
        });
        return;
    }
    const user = yield db_1.prisma.user.create({
        data: {
            email: parseData.data.username,
            password: parseData.data.password,
            name: parseData.data.name,
        }
    });
    res.status(200).json({
        msg: "Signup successful",
    });
}));
router.post("/signin", (req, res) => {
});
router.get("/user", middleware_1.authMiddleware, (req, res) => {
});
exports.userRouter = router;
