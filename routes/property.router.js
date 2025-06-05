const express = require('express');
const { addProperty, getProperties } = require('../controllers/property.controller');
const upload = require('../functions/multerUpload');

const router = express.Router();

router.post('/', upload.array('images', 30), addProperty);
router.get('/', getProperties);

module.exports = router;
