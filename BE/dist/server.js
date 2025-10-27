"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const db_1 = __importDefault(require("./database/db"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, db_1.default)();
app.use(express_1.default.json());
// middleware -> add startTime to request
app.use((req, res, next) => {
    req.startTime = Date.now();
    next();
});
app.use('/api/auth', auth_routes_1.default);
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello. TypeScript with express');
// });
// // post route -> new user -> name,email -> req.body
// //  -> /user/:id -> Request <{},{},{},{}>
// app.post('/user', (req: Request<{}, {}, IUser>, res: Response) => {
//   const { username, createdAt } = req.body;
//   res.json({
//     message: `user created ${username}-${createdAt}`,
//   });
// });
// // user based on id
// app.get('/user/:id', (req: Request<{ id: string }>, res: Response) => {
//   const { id } = req.params;
//   res.json({
//     userId: id,
//   });
// });
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
});
