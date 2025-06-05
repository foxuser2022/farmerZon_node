const fs = require('fs');
const path = require('path');
const { propertySchema } = require('../validations/property.validation');
const Property = require('../models/Properties');

const addProperty = async (req, res) => {
    try {
        const { error } = propertySchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const uploadPath = path.join(__dirname, '..', 'uploads', 'properties');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        const images = req.files || [];
        const imagePaths = images.map(file => `/uploads/properties/${file.filename}`);

        const property = new Property({
            ...req.body,
            images: imagePaths
        });

        const savedProperty = await property.save();

        return res.status(201).json({
            message: 'Property added successfully',
            data: savedProperty
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getProperties = async (req, res) => {
    try {
        const properties = await Property.find({});

        return res.status(201).json({
            message: 'Properties is successfully fetched.',
            properties
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    addProperty,
    getProperties
}