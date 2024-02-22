import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
export declare class AuthService {
    private readonly authRepo;
    private readonly bot;
    private logger;
    constructor(authRepo: Repository<Auth>);
    onReceiveMessage: (msg: any) => Promise<any>;
    sendMessageToUser: (id: string, message: string, replyMarkup?: any) => void;
    start(msg: any): Promise<void>;
    freetrial(msg: any): Promise<void>;
    activeUsers(): Promise<Auth[]>;
    isActiveMessage(message: string): Promise<void>;
    IsRegistered(userId: string): Promise<boolean>;
    findOne(id: string): Promise<Auth>;
}
