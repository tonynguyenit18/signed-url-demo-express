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
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const PORT = 8000;
// I create configs here for demo, in real project you should get those information from environment variable
const configs = {
    bucketName: "tony-signed-url-demo",
    accessKey: "AKIAXHBAM3HU4CRBTDHZ",
    secretKey: "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",
};
app.get("/signed-url-upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName = "demo-image", extension = "png", mediaType = "image", } = req.query;
    const s3 = new s3_1.default({
        credentials: {
            accessKeyId: configs.accessKey,
            secretAccessKey: configs.secretKey,
        },
    });
    const params = {
        Bucket: configs.bucketName,
        Key: `${fileName}.${extension}`,
        Expires: 300,
        ContentType: `${mediaType}/${extension}`,
    };
    const url = yield s3.getSignedUrlPromise("putObject", params);
    res.json({ uploadUrl: url });
}));
app.get("/signed-url-access", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key } = req.query;
    const s3 = new s3_1.default({
        credentials: {
            accessKeyId: configs.accessKey,
            secretAccessKey: configs.secretKey,
        },
    });
    const params = {
        Bucket: configs.bucketName,
        Key: key,
        Expires: 3600, //s - 1 hour
    };
    const url = yield s3.getSignedUrlPromise("getObject", params);
    res.json({ uploadUrl: url });
}));
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
});
//# sourceMappingURL=app.js.map