"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weatherController_1 = require("../controllers/weatherController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get('/weather', [
    (0, express_validator_1.query)('city').isString().notEmpty()
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    (0, weatherController_1.getWeather)(req, res);
});
exports.default = router;
