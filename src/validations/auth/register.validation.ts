import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    Phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    registerAs: Joi.string().valid('seller', 'buyer').default('buyer').required(),
    password: Joi.string().min(6).required(),
    cpassword: Joi.string().min(6).required(),
});


