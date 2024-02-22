import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
// import { FarmService } from 'src/farm/farm.service';
import { Auth } from './entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { addDays } from 'date-fns';

const TelegramBot = require('node-telegram-bot-api');
// import * as TelegramBot from 'node-telegram-bot-api'
const token = '7051786916:AAGzzO9gsCz4wybeWQ_KMjdyXiudavvI1Ls';

@Injectable()
export class AuthService {
  private readonly bot: any;
  private logger = new Logger(AuthService.name)
  constructor(
    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,
  ) {
    this.bot = new TelegramBot(token, { polling: true });

    this.bot.on("message", this.onReceiveMessage);

  }

  onReceiveMessage = async (msg: any) => {
    const id = msg.from.id
    // this.logger.debug(msg)
    const messageText = msg.text;

    const commandActions: { [key: string]: (userId: string, message?: string) => void } = {
      '/start': this.start,
      '/freetrial': this.freetrial,
    };

    let command = messageText.split(' ')[0];
    // console.log(command)
    // if (command === setpinMessage){
    //   command = '/setnow'
    // }
    let actionFunction = commandActions[command];
    if (actionFunction) {
      // console.log(command)
      // const message = messageText.slice(command.length).trim();
      actionFunction.call(this, msg);
    }
    else {
      this.bot.sendMessage(id, 'wrong message')
    }

    return msg
  }

  sendMessageToUser = (id: string, message: string, replyMarkup?: any) => {
    this.bot.sendMessage(id, message, replyMarkup)
  }

  async start(msg: any) {
    const id = msg.from.id
    const username = msg.from.username || 'betabotuser'
    const IsRegistered = await this.IsRegistered(id)
    console.log(IsRegistered)
    if (!IsRegistered) {
      const user = this.authRepo.create({
        telegram_id: id,
        name: username
      })
      await this.authRepo.save(user)
      this.sendMessageToUser(id, 
      `🚀🌈 Welcome @${username} to Solbetabot, where we give you updates on whale movement on Solana Blockchain.🌈🚀\n \n🎁 Surprises await you every day, and your 3 days trial! Click /freetrial to enjoy your 3 days free trial!\n\n💥 Sharing is the key to happiness! Tell your friends and enter a chance to win Bonk and Fronk.`);
    } else {
      console.log("66666")
    }
  }

  async freetrial(msg: any) {
    const id = msg.from.id
    const currentDate = new Date();
    const user = await this.findOne(id)

    if (!user.Isactive){
    const ft = addDays(currentDate, 3);
    user.Isactive = ft;

    await this.authRepo.save(user);
    this.sendMessageToUser(id, 'Your free trial have started');
    } else {
    this.sendMessageToUser(id, 'You have already used your free trial');
    }
  }

  async activeUsers() {
    const currentDate = new Date();
    return await this.authRepo.find({
      where: { Isactive: MoreThan(currentDate) },
      select: ['telegram_id']
    })
  }

  async isActiveMessage(message: string) {
    const activeUsers = await this.activeUsers();
    
      activeUsers.forEach(async user => {
        this.sendMessageToUser(user.telegram_id, message);
      });

  }



  async IsRegistered(userId: string) {
    // Check if user is registered
    const user = await this.findOne(userId)
    if (user) {
      return true
    } else {
      return false
    }
  }


  async findOne(id: string) {
    return await this.authRepo.findOne({
      where: { telegram_id: id }
    })
  }
}
