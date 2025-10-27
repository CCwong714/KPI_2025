"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, role } = req.body;
        const username = req.body.username.trim();
        if (!username || !password || !role) {
            res.status(400).json({
                success: false,
                message: 'All fields are required!',
            });
            return;
        }
        if (role !== 'user' && role !== 'admin') {
            res.status(400).json({
                success: false,
                message: 'Invalid role! Must be user or admin.',
            });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long.',
            });
            return;
        }
        const checkExistingUser = yield User_1.User.findOne({ username });
        if (checkExistingUser) {
            res.status(400).json({
                success: false,
                message: 'Username already exists!',
            });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newlyCreatedUser = new User_1.User({
            username,
            password: hashedPassword,
            role,
        });
        yield newlyCreatedUser.save();
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
        });
    }
    catch (e) {
        console.error('Error in registerUser:', e);
        res.status(500).json({
            success: false,
            message: e instanceof Error
                ? e.message
                : 'Some error occurred! Please try again',
        });
    }
});
exports.registerUser = registerUser;
