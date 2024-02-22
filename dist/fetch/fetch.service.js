"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const fs = require("fs");
const path = require("path");
let FetchService = class FetchService {
    constructor() {
        this.tokenUrl = 'https://token.jup.ag/all';
        this.saveDirectory = '/jupToken';
        console.log("Fetching and saving file...");
        this.fetchAndSaveFile();
        setInterval(() => {
            this.fetchAndSaveFile();
        }, 60 * 60 * 1000);
    }
    async fetchAndSaveFile() {
        await this.report(this.tokenUrl);
    }
    async report(url) {
        try {
            const response = await axios_1.default.get(url);
            const fileName = `jup.token.json`;
            const savePath = path.join(__dirname, '..', '..', this.saveDirectory, fileName);
            fs.writeFileSync(savePath, JSON.stringify(response.data, null, 2), 'utf8');
            console.log('File saved successfully:', savePath);
        }
        catch (error) {
            console.error('Error fetching or saving file:', error);
        }
    }
};
exports.FetchService = FetchService;
exports.FetchService = FetchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FetchService);
//# sourceMappingURL=fetch.service.js.map