"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => {
});
router.post("/signin", (req, res) => {
});
router.get("/user", middleware_1.authMiddleware, (req, res) => {
});
exports.userRouter = router;
