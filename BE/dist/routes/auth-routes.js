"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth-controller");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.registerUser);
// router.post('/login', loginUser);
// router.post('/change-password', authMiddleware, changePassword);
exports.default = router;
