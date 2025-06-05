const Joi = require('joi');

const propertySchema = Joi.object({
    propertyTitle: Joi.string().required(),
    propertyType: Joi.string().required(),
    bhkType: Joi.string().required(),
    budgetMin: Joi.string().required(),
    budgetMax: Joi.string().required(),
    saleType: Joi.string().required(),
    constructionStatus: Joi.string().required(),
    builtUpArea: Joi.string().required(),
    amenities: Joi.array().items(Joi.string()).required(),
    propertyAge: Joi.string().required(),
    facing: Joi.string().required()
});

module.exports = { propertySchema };
