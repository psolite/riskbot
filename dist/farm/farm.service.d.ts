import { AuthService } from 'src/auth/auth.service';
import { Wallet } from 'src/auth/entities/wallet.entity';
import { Repository } from 'typeorm';
export declare class FarmService {
    private readonly authService;
    private readonly walletRepo;
    constructor(authService: AuthService, walletRepo: Repository<Wallet>);
    sleep(ms: number): Promise<unknown>;
    getTransaction(address: any, numTx: any): Promise<void>;
}
