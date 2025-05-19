"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger/swagger.json"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const migrate_1 = require("./utils/migrate");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/api', routes_1.default);
const PORT = process.env.PORT || 3000;
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(async () => {
    console.log('MongoDB connected');
    await (0, migrate_1.migrate)();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch(err => console.error('DB connection error:', err));
