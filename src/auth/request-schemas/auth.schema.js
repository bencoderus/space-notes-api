import { object, string } from "yup";

export const registerSchema = object().shape({
    name: string().required(),
    email: string().required().email(),
    password: string().required().min(8)
});

export const loginSchema = object().shape({
    email: string().required().email(),
    password: string().required().min(8)
});

export const forgotPasswordSchema = object().shape({
    email: string().required().email(),
    redirectTo: string().required()
});

export const resetPasswordSchema = object().shape({
    password: string().required().min(8)
});