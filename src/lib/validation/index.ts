import * as z from "zod"

export const signupValidation=z.object({
    name:z.string().min(2,{message:"Name must be at least 2 characters"}).max(50),
    username:z.string().min(2,{message:"Name must be at least 2 characters"}).max(50),
    email:z.string().email({message:"Must be a valid email"}),
    password:z.string().min(8,{message:"Password must be at least 8 characters"}),
})

export const signinValidation=z.object({
    email:z.string().email({message:"Must be a valid email"}),
    password:z.string().min(8,{message:"Password must be at least 8 characters"}),
})