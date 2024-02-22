import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as fs from 'fs'
import * as path from 'path';
import * as solanaweb3 from '@solana/web3.js'
import { AuthService } from 'src/auth/auth.service';
import { Wallet } from 'src/auth/entities/wallet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

const soladdress = 'DCA265Vj8a9CEuX1eb1LWRnDT7uK6q1xMipnNyatn23M';

const endpoint = 'https://nd-019-391-107.p2pify.com/4db48db6fe0a5bae57af2158c24262dc'
const solConnection = new solanaweb3.Connection(endpoint);
const tokenfilePath = path.join(__dirname, '..', '..', 'jupToken', 'jup.token.json');
const tokenfileContent = fs.readFileSync(tokenfilePath, 'utf8');
const tokenMeta = JSON.parse(tokenfileContent);

@Injectable()
export class FarmService {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(Wallet)
        private readonly walletRepo: Repository<Wallet>,
    ) {
        this.getTransaction(soladdress, 1)
    }

    async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getTransaction(address, numTx) {
        try {
            // console.log(tokenMeta)
            const pubKey = new solanaweb3.PublicKey(address);
            let transactionList = await solConnection.getSignaturesForAddress(pubKey, { limit: numTx }, 'finalized');

            let signatureList = transactionList.map(transaction => transaction.signature);


            let transactionDetails = await solConnection.getParsedTransactions(signatureList, { maxSupportedTransactionVersion: 0 },);

            transactionDetails.forEach(async (details) => {

                try {
                    let interr: any = details.transaction.message.instructions
                    const checkAccountLength = await interr.find(inter => inter.accounts.length === 15);
                    if (interr) {
                        console.log(signatureList);
                        // console.log(interr)
                        if (interr.length === 3) {
                            console.log('in')
                            // console.log(signatureList);
                            // let tt = interr[2].accounts[0].toString();
                            const matchedToken = await interr.find(inter => inter.accounts.length === 13);
                            // console.log(interr)
                            let selltoken = matchedToken.accounts[2].toString();
                            let associatedToken = matchedToken.accounts[6].toString();
                            let buytoken = matchedToken.accounts[3].toString();

                            let walletAddress = matchedToken.accounts[1].toString();

                            const mintPublicKey = new solanaweb3.PublicKey(selltoken);
                            const mintassociatedToken = new solanaweb3.PublicKey(associatedToken);

                            // Fetch the mint information to get decimals
                            const mintInfo: any = await solConnection.getParsedAccountInfo(mintPublicKey);
                            const decimals = mintInfo.value.data.parsed.info.decimals;
                            // console.log(mintInfo.value.data)

                            // Fetch the balance
                            const balanceInfo: any = await solConnection.getTokenAccountBalance(mintassociatedToken);
                            const mainbalance = await balanceInfo.value.amount / Math.pow(10, decimals)
                            // console.log(mainbalance);


                            // const allTokens = [...(tokenMeta.official || []), ...(tokenMeta.unOfficial || []), ...(tokenMeta.unNamed || [])];
                            // console.log("fuckkkk88", selltoken)
                            // const tSymbol = tokenMeta.find(token => token.address === token);
                            const tSymbol = await tokenMeta.find(token => token.address === selltoken) || 'undefined';
                            const bytokenSymbol = await tokenMeta.find(token => token.address === buytoken) || 'undefined';
                            // console.log("ttttttttttttttt", tSymbol, bytokenSymbol)
                            if ((selltoken == 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' && mainbalance >= 1000) || (selltoken == 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' && mainbalance >= 1000) || (selltoken == 'So11111111111111111111111111111111111111112' && mainbalance >= 10)) {
                                const walletCheck = await this.walletRepo.findOne({
                                    where: { wallet: walletAddress }
                                })

                                if (walletCheck) {
                                    await this.sleep(5000)
                                    console.log(interr.length, "Trying again")
                                    this.getTransaction(soladdress, 1);
                                } else {
                                    const wallet = this.walletRepo.create({
                                        wallet: walletAddress
                                    })
                                    await this.walletRepo.save(wallet)
                                    await this.sleep(5000)
                                    const farmProduct = `SolBeta Bot\n\n💵 ${tSymbol.symbol}: ${mainbalance}\n🪙 Swapping to:  ${bytokenSymbol.symbol}\n📑 Contract Address: ${buytoken}\n`;
                                    // console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
                                    await this.authService.isActiveMessage(farmProduct)
                                    await this.sleep(150000)
                                }

                            } else {
                                await this.sleep(5000)
                                console.log(interr.length, "Trying again")
                                this.getTransaction(soladdress, 1);
                            }
                        }
                        else if (checkAccountLength) {
                            console.log('in')
                            // console.log(signatureList);
                            // let tt = interr[2].accounts[0].toString();

                            // console.log(interr)
                            let selltoken = checkAccountLength.accounts[2].toString();
                            let associatedToken = checkAccountLength.accounts[5].toString();
                            let buytoken = checkAccountLength.accounts[3].toString();
                            let walletAddress = checkAccountLength.accounts[1].toString();

                            const mintPublicKey = new solanaweb3.PublicKey(selltoken);
                            const mintassociatedToken = new solanaweb3.PublicKey(associatedToken);

                            // Fetch the mint information to get decimals
                            const mintInfo: any = await solConnection.getParsedAccountInfo(mintPublicKey);
                            const decimals = mintInfo.value.data.parsed.info.decimals;
                            // console.log(mintInfo.value.data)

                            // Fetch the balance
                            const balanceInfo: any = await solConnection.getTokenAccountBalance(mintassociatedToken);
                            let mainbalance = balanceInfo.value.amount / Math.pow(10, decimals)
                            // console.log(mainbalance);


                            // const allTokens = [...(tokenMeta.official || []), ...(tokenMeta.unOfficial || []), ...(tokenMeta.unNamed || [])];
                            // console.log("fuckkkk", selltoken)
                            // const tSymbol = tokenMeta.find(token => token.address === token);
                            const tSymbol = tokenMeta.find(token => token.address === selltoken);
                            const bytokenSymbol = tokenMeta.find(token => token.address === buytoken);
                            // console.log("ttttttttttttttt", tSymbol, bytokenSymbol)
                            if ((selltoken == 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' && mainbalance >= 1000) || (selltoken == 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' && mainbalance >= 1000) || (selltoken == 'So11111111111111111111111111111111111111112' && mainbalance >= 10)) {

                                const walletCheck = await this.walletRepo.findOne({
                                    where: { wallet: walletAddress }
                                })
                                if (walletCheck) {
                                    // console.log(walletCheck)
                                    await this.sleep(5000)
                                    console.log(interr.length, "Trying again")
                                    this.getTransaction(soladdress, 1);
                                } else { const wallet = this.walletRepo.create({
                                        wallet: walletAddress
                                    })
                                    await this.walletRepo.save(wallet)
                                    await this.sleep(5000)
                                    const farmProduct = `SolBeta Bot\n\n💵 ${tSymbol.symbol}: ${mainbalance}\n🪙 Swapping to:  ${bytokenSymbol.symbol}\n📑 Contract Address: ${buytoken}\n`
                                    //  `${mainbalance} ${tSymbol.symbol || 'undefined'} (${selltoken}) is swapping to ${bytokenSymbol.symbol || 'undefined'} (${buytoken})`;
                                    // console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
                                    await this.authService.isActiveMessage(farmProduct)
                                    await this.sleep(100000)
                                }
                            } else {
                                await this.sleep(50000)
                                console.log(interr.length, "Trying again")
                                this.getTransaction(soladdress, 1);
                            }
                        } else {
                            await this.sleep(5000)
                            console.log(interr.length, "Trying again1")
                            this.getTransaction(soladdress, 1);
                        }
                    }
                    await this.sleep(5000)
                    console.log(interr.length, "Trying again2")
                    this.getTransaction(soladdress, 1);
                } catch (error) {
                    await this.sleep(100000)
                    console.log(error)
                    this.getTransaction(soladdress, 1);
                }
            })

        } catch (error) {
            console.error("Error fetching:", error);
            await this.sleep(300000)
            this.getTransaction(soladdress, 1);
        }

    }

}
