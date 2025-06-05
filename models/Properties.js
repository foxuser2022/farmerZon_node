const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertiesSchema = new Schema({
    propertyTitle: { type: String, required: true },
    propertyType: { type: String, required: true },
    bhkType: { type: String, required: true },
    budgetMin: { type: String, required: true },
    budgetMax: { type: String, required: true },
    saleType: { type: String, required: true },
    constructionStatus: { type: String, required: true },
    builtUpArea: { type: String, required: true },
    amenities: [{ type: String, required: true }],
    propertyAge: { type: String, required: true },
    facing: { type: String, required: true },
    images: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Properties', PropertiesSchema, 'Properties');