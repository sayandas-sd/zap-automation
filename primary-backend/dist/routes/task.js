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
exports.taskRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.post("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    //@ts-ignore
    const id = req.id;
    const parseData = types_1.TaskSchema.safeParse(body);
    if (!parseData.success) {
        res.status(411).json({
            msg: "Incorrect Input"
        });
        return;
    }
    const allTaskId = yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const task = yield db_1.prisma.task.create({
            data: {
                userId: parseInt(id),
                triggerId: "",
                action: {
                    create: parseData.data.action.map((r, index) => ({
                        actionId: r.availableActionId,
                        sortingOrder: index,
                        metadata: r.actionMetadata
                    }))
                }
            }
        });
        const trigger = yield tx.trigger.create({
            data: {
                triggerId: parseData.data.availableTriggerId,
                TaskId: task.id
            }
        });
        yield tx.task.update({
            where: {
                id: task.id
            },
            data: {
                triggerId: trigger.id
            }
        });
        return task.id;
    }));
    res.status(200).json({
        allTaskId
    });
}));
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const task = yield db_1.prisma.task.findMany({
        where: {
            userId: id
        },
        include: {
            action: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });
    res.json({
        task
    });
}));
router.get("/:taskId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const taskId = req.params.taskId;
    const task = yield db_1.prisma.task.findMany({
        where: {
            id: taskId,
            userId: id,
        },
        include: {
            action: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });
    res.json({
        task
    });
}));
exports.taskRouter = router;
