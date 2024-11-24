"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = exports.SigninSchema = exports.SignupSchema = void 0;
const zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(3),
    name: zod_1.z.string().min(4)
});
exports.SigninSchema = zod_1.z.object({
    username: zod_1.z.string().email().min(1),
    password: zod_1.z.string().min(3)
});
exports.TaskSchema = zod_1.z.object({
    availableTriggerId: zod_1.z.string(),
    triggerMetadata: zod_1.z.any().optional(),
    action: zod_1.z.array(zod_1.z.object({
        availablActionId: zod_1.z.string(),
        actionMetadata: zod_1.z.any().optional()
    }))
});
