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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_entity_1 = require("./entities/auth.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const date_fns_1 = require("date-fns");
const TelegramBot = require('node-telegram-bot-api');
const token = '7051786916:AAGzzO9gsCz4wybeWQ_KMjdyXiudavvI1Ls';
let AuthService = AuthService_1 = class AuthService {
    constructor(authRepo) {
        this.authRepo = authRepo;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.onReceiveMessage = async (msg) => {
            const id = msg.from.id;
            const messageText = msg.text;
            const commandActions = {
                '/start': this.start,
                '/freetrial': this.freetrial,
            };
            let command = messageText.split(' ')[0];
            let actionFunction = commandActions[command];
            if (actionFunction) {
                actionFunction.call(this, msg);
            }
            else {
                this.bot.sendMessage(id, 'wrong message');
            }
            return msg;
        };
        this.sendMessageToUser = (id, message, replyMarkup) => {
            this.bot.sendMessage(id, message, replyMarkup);
        };
        this.bot = new TelegramBot(token, { polling: true });
        this.bot.on("message", this.onReceiveMessage);
    }
    async start(msg) {
        const id = msg.from.id;
        const username = msg.from.username || 'betabotuser';
        const IsRegistered = await this.IsRegistered(id);
        console.log(IsRegistered);
        if (!IsRegistered) {
            const user = this.authRepo.create({
                telegram_id: id,
                name: username
            });
            await this.authRepo.save(user);
            this.sendMessageToUser(id, `🚀🌈 Welcome @${username} to Solbetabot, where we give you updates on whale movement on Solana Blockchain.🌈🚀\n \n🎁 Surprises await you every day, and your 3 days trial! Click /freetrial to enjoy your 3 days free trial!\n\n💥 Sharing is the key to happiness! Tell your friends and enter a chance to win Bonk and Fronk.`);
        }
        else {
            console.log("66666");
        }
    }
    async freetrial(msg) {
        const id = msg.from.id;
        const currentDate = new Date();
        const user = await this.findOne(id);
        if (!user.Isactive) {
            const ft = (0, date_fns_1.addDays)(currentDate, 3);
            user.Isactive = ft;
            await this.authRepo.save(user);
            this.sendMessageToUser(id, 'Your free trial have started');
        }
        else {
            this.sendMessageToUser(id, 'You have already used your free trial');
        }
    }
    async activeUsers() {
        const currentDate = new Date();
        return await this.authRepo.find({
            where: { Isactive: (0, typeorm_2.MoreThan)(currentDate) },
            select: ['telegram_id']
        });
    }
    async isActiveMessage(message) {
        const activeUsers = await this.activeUsers();
        activeUsers.forEach(async (user) => {
            this.sendMessageToUser(user.telegram_id, message);
        });
    }
    async IsRegistered(userId) {
        const user = await this.findOne(userId);
        if (user) {
            return true;
        }
        else {
            return false;
        }
    }
    async findOne(id) {
        return await this.authRepo.findOne({
            where: { telegram_id: id }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.Auth)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map