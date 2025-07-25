import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    loginAs: Joi.string().valid('seller', 'buyer').required(),
}); 