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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const solanaweb3 = require("@solana/web3.js");
const auth_service_1 = require("../auth/auth.service");
const wallet_entity_1 = require("../auth/entities/wallet.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const soladdress = 'DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M';
const endpoint = 'https://nd-019-391-107.p2pify.com/4db48db6fe0a5bae57af2158c24262dc';
const solConnection = new solanaweb3.Connection(endpoint);
const tokenfilePath = path.join(__dirname, '..', '..', 'jupToken', 'jup.token.json');
const tokenfileContent = fs.readFileSync(tokenfilePath, 'utf8');
const tokenMeta = JSON.parse(tokenfileContent);
let FarmService = class FarmService {
    constructor(authService, walletRepo) {
        this.authService = authService;
        this.walletRepo = walletRepo;
        this.getTransaction(soladdress, 1);
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async getTransaction(address, numTx) {
        try {
            const pubKey = new solanaweb3.PublicKey(address);
            let transactionList = await solConnection.getSignaturesForAddress(pubKey, { limit: numTx }, 'finalized');
            let signatureList = transactionList.map(transaction => transaction.signature);
            let transactionDetails = await solConnection.getParsedTransactions(signatureList, { maxSupportedTransactionVersion: 0 });
            transactionDetails.forEach(async (details) => {
                try {
                    let interr = details.transaction.message.instructions;
                    const checkAccountLength = await interr.find(inter => inter.accounts.length === 15);
                    if (interr) {
                        console.log(signatureList);
                        if (interr.length === 3) {
                            console.log('in');
                            const matchedToken = await interr.find(inter => inter.accounts.length === 13);
                            let selltoken = matchedToken.accounts[2].toString();
                            let associatedToken = matchedToken.accounts[6].toString();
                            let buytoken = matchedToken.accounts[3].toString();
                            let walletAddress = matchedToken.accounts[1].toString();
                            const mintPublicKey = new solanaweb3.PublicKey(selltoken);
                            const mintassociatedToken = new solanaweb3.PublicKey(associatedToken);
                            const mintInfo = await solConnection.getParsedAccountInfo(mintPublicKey);
                            const decimals = mintInfo.value.data.parsed.info.decimals;
                            const balanceInfo = await solConnection.getTokenAccountBalance(mintassociatedToken);
                            const mainbalance = await balanceInfo.value.amount / Math.pow(10, decimals);
                            const tSymbol = await tokenMeta.find(token => token.address === selltoken) || 'undefined';
                            const bytokenSymbol = await tokenMeta.find(token => token.address === buytoken) || 'undefined';
                            if ((selltoken == 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' && mainbalance >= 1000) || (selltoken == 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' && mainbalance >= 1000) || (selltoken == 'So11111111111111111111111111111111111111112' && mainbalance >= 10)) {
                                const walletCheck = await this.walletRepo.findOne({
                                    where: { wallet: walletAddress }
                                });
                                if (walletCheck) {
                                    await this.sleep(5000);
                                    console.log(interr.length, "Trying again");
                                    this.getTransaction(soladdress, 1);
                                }
                                else {
                                    const wallet = this.walletRepo.create({
                                        wallet: walletAddress
                                    });
                                    await this.walletRepo.save(wallet);
                                    await this.sleep(5000);
                                    const farmProduct = `SolBeta Bot\n\n💵 ${tSymbol.symbol}: ${mainbalance}\n🪙 Swapping to:  ${bytokenSymbol.symbol}\n📑 Contract Address: ${buytoken}\n`;
                                    await this.authService.isActiveMessage(farmProduct);
                                    await this.sleep(150000);
                                }
                            }
                            else {
                                await this.sleep(5000);
                                console.log(interr.length, "Trying again");
                                this.getTransaction(soladdress, 1);
                            }
                        }
                        else if (checkAccountLength) {
                            console.log('in');
                            let selltoken = checkAccountLength.accounts[2].toString();
                            let associatedToken = checkAccountLength.accounts[5].toString();
                            let buytoken = checkAccountLength.accounts[3].toString();
                            let walletAddress = checkAccountLength.accounts[1].toString();
                            const mintPublicKey = new solanaweb3.PublicKey(selltoken);
                            const mintassociatedToken = new solanaweb3.PublicKey(associatedToken);
                            const mintInfo = await solConnection.getParsedAccountInfo(mintPublicKey);
                            const decimals = mintInfo.value.data.parsed.info.decimals;
                            const balanceInfo = await solConnection.getTokenAccountBalance(mintassociatedToken);
                            let mainbalance = balanceInfo.value.amount / Math.pow(10, decimals);
                            const tSymbol = tokenMeta.find(token => token.address === selltoken);
                            const bytokenSymbol = tokenMeta.find(token => token.address === buytoken);
                            if ((selltoken == 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' && mainbalance >= 1000) || (selltoken == 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' && mainbalance >= 1000) || (selltoken == 'So11111111111111111111111111111111111111112' && mainbalance >= 10)) {
                                const walletCheck = await this.walletRepo.findOne({
                                    where: { wallet: walletAddress }
                                });
                                if (walletCheck) {
                                    await this.sleep(5000);
                                    console.log(interr.length, "Trying again");
                                    this.getTransaction(soladdress, 1);
                                }
                                else {
                                    const wallet = this.walletRepo.create({
                                        wallet: walletAddress
                                    });
                                    await this.walletRepo.save(wallet);
                                    await this.sleep(5000);
                                    const farmProduct = `SolBeta Bot\n\n💵 ${tSymbol.symbol}: ${mainbalance}\n🪙 Swapping to:  ${bytokenSymbol.symbol}\n📑 Contract Address: ${buytoken}\n`;
                                    await this.authService.isActiveMessage(farmProduct);
                                    await this.sleep(100000);
                                }
                            }
                            else {
                                await this.sleep(50000);
                                console.log(interr.length, "Trying again");
                                this.getTransaction(soladdress, 1);
                            }
                        }
                        else {
                            await this.sleep(5000);
                            console.log(interr.length, "Trying again1");
                            this.getTransaction(soladdress, 1);
                        }
                    }
                    await this.sleep(5000);
                    console.log(interr.length, "Trying again2");
                    this.getTransaction(soladdress, 1);
                }
                catch (error) {
                    await this.sleep(100000);
                    console.log(error);
                    this.getTransaction(soladdress, 1);
                }
            });
        }
        catch (error) {
            console.error("Error fetching:", error);
            await this.sleep(300000);
            this.getTransaction(soladdress, 1);
        }
    }
};
exports.FarmService = FarmService;
exports.FarmService = FarmService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(wallet_entity_1.Wallet)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        typeorm_1.Repository])
], FarmService);
//# sourceMappingURL=farm.service.js.map