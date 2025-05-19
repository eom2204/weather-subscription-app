"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionController_1 = require("../controllers/subscriptionController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post('/subscribe', [
    (0, express_validator_1.body)('email').isEmail(),
    (0, express_validator_1.body)('city').isString().notEmpty(),
    (0, express_validator_1.body)('frequency').isIn(['hourly', 'daily'])
], (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    (0, subscriptionController_1.subscribe)(req, res);
});
router.get('/confirm/:token', [
    (0, express_validator_1.param)('token').isString().notEmpty()
], subscriptionController_1.confirmSubscription);
router.get('/unsubscribe/:token', [
    (0, express_validator_1.param)('token').isString().notEmpty()
], subscriptionController_1.unsubscribe);
exports.default = router;
