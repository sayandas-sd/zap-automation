import { z } from "zod";


export const SignupSchema = z.object({
    username: z.string().email(),
    password: z.string().min(3),
    name: z.string().min(4)
})


export const SigninSchema = z.object({
    username: z.string().email().min(1),
    password: z.string().min(3)
})

export const TaskSchema = z.object({
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(), 
    action: z.array(z.object({
        availablActionId: z.string(),
        actionMetadata: z.any().optional()
    }))
})