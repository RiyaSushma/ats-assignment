import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import * as nodeCron from 'node-cron';

@Injectable()
export class TelegramService {

    private readonly bot:any;
    private readonly logger = new Logger(TelegramService.name);
    private userPreferences: Map<number, { location?: string, time?: string, cronJob?: nodeCron.ScheduledTask }> = new Map();

    constructor() {
        const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
        this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
        console.log("telegram: ", TELEGRAM_TOKEN);
        this.bot.onText(/\/start/, (msg: any) => this.sendStartMessage(msg.chat.id));
        this.bot.on("message", this.onReceiveMessage);      
        this.bot.on("location", this.onReceiveLocation);

        // Handle callback queries
        this.bot.on('callback_query', this.onCallbackQuery);
    }

    private sendStartMessage(chatId: number) {
        const message = 'Welcome! Please choose an option:';
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Start', callback_data: 'start' }],
                    [{ text: 'Subscribe', callback_data: 'subscribe' }],
                    [{ text: 'Unsubscribe', callback_data: 'unsubscribe' }]
                ]
            }
        };
        this.bot.sendMessage(chatId, message, options);
    }

    private onCallbackQuery = async (query: TelegramBot.CallbackQuery) => {
        const chatId = query.message.chat.id;
        const data = query.data;

        switch (data) {
            case 'start':
                await this.sendStartMessage(chatId);
                break;
            case 'subscribe':
                this.handleSubscribe(chatId);
                break;
            case 'unsubscribe':
                this.handleUnsubscribe(chatId);
                break;
            default:
                this.bot.sendMessage(chatId, 'Unknown option selected.');
        }

        // Acknowledge the callback query
        this.bot.answerCallbackQuery(query.id);
    }

    private async handleSubscribe(chatId: number) {
        this.bot.sendMessage(chatId, 'Congratulations 🥳🎊!! you have subscribed to daily weather updates 🌈 ⛅. Have a great day ✨');
        this.bot.sendMessage(chatId, `Enter the location to get weather updates 🌍`, {
            reply_markup: {
                one_time_keyboard: true,
                keyboard: [
                    [{
                        text: "Share Location📍",
                        request_location: true
                    }],
                    [{
                        text: "Enter Location manually📍"
                    }]
                ]
            }
        });
        this.userPreferences.set(chatId, { location: 'awaiting_location' });
        this.logger.log(`User subscribed: ${chatId}`);
    }

    private async handleUnsubscribe(chatId: number) {
        this.bot.sendMessage(chatId, 'Aww! You\'re unsubscribed for now 😔. Send /subscribe to get daily weather updates. ☀️🌧️. Have a great day ✨');
        this.userPreferences.delete(chatId); // Remove user preferences
        this.logger.log(`User unsubscribed: ${chatId}`);
    }

    private onReceiveMessage = async (msg: TelegramBot.Message) => {
        const chatId = msg.chat.id;
        const text = msg.text.toLowerCase();

        if (this.userPreferences.get(chatId)?.location === 'awaiting_location') {
            this.userPreferences.set(chatId, { ...this.userPreferences.get(chatId), location: text });
            this.bot.sendMessage(chatId, `Location set to ${text}. You will now receive daily weather updates for this location. 🌦️`);
            this.userPreferences.get(chatId).time = 'awaiting_time';

            this.bot.sendMessage(chatId, `Enter the time to get weather updates ⏰🌍`, {
                reply_markup: {
                    one_time_keyboard: true,
                    keyboard: [
                        [{
                            text: "Enter Time⏰"
                        }]
                    ]
                }
            });
        } else if (this.userPreferences.get(chatId)?.time === 'awaiting_time') {
            if (text.match(/^\d{2}:\d{2}$/)) { 
                this.scheduleWeatherUpdates(chatId, text);
                this.bot.sendMessage(chatId, `Weather updates will be sent daily at ${text}. 🌦️`);
                await this.sendWeatherUpdate(chatId);
            } else {
                this.bot.sendMessage(chatId, 'Please enter a valid time in HH:MM format.');
            }
        } else if (text === 'enter location manually📍') {
            this.bot.sendMessage(chatId, 'Please enter the location you want to receive weather updates for 📍⏳');
            this.userPreferences.set(chatId, { ...this.userPreferences.get(chatId), location: 'awaiting_location' });
        } else if (text === 'enter scheduled time⏰') {
            this.bot.sendMessage(chatId, 'Please enter the time you want to receive weather updates on ⏰');
            this.userPreferences.set(chatId, { ...this.userPreferences.get(chatId), time: 'awaiting_time' });
        } else {
            this.bot.sendMessage(chatId, 'Welcome Yūjin ✨ !! For daily updates send /subscribe to get daily weather updates. Have a great day 🌻');
        }
    };

    private onReceiveLocation = async(msg: TelegramBot.Message) => {
        const chatId = msg.chat.id;
        const locationStr = String(msg.location);

        if(locationStr) {
            const currentPreference = this.userPreferences.get(chatId) || {};
            this.userPreferences.set(chatId, { ...currentPreference, location: locationStr });
            this.bot.sendMessage(chatId,' We received Location! Please wait for a moment to get daily weather updates for your area. 🌦️');
        }
    }

    public async sendWeatherUpdate(chatId: number) {
        try {
            const userPreference = this.userPreferences.get(chatId);
            const weatherUpdate = await this.getWeatherData(userPreference.location);
            this.bot.sendMessage(chatId, weatherUpdate);
        } catch (error) {
            this.bot.sendMessage(chatId, 'Failed to get weather update. Please try again later.');
        }
    }

    public async getWeatherData(location: string): Promise<string> {
        try {
            const WEATHER_API = process.env.WEATHER_API_KEY;
            console.log("location and key is: ", location, WEATHER_API);

            const response = await axios.get(`http://api.weatherapi.com/v1/current.json`, {
                params: {
                    key: WEATHER_API,
                    q: location,
                    aqi: 'no'
                }
            });

            const weatherData = response.data;
            return `Current weather in ${location} 📍: ${weatherData.current.condition.text}, ${weatherData.current.temp_c}°C`;

        } catch(error) {
            this.logger.error(`Failed to fetch weather data: ${error.message}`);
            throw new Error('Could not fetch weather data');
        }
    }

    private scheduleWeatherUpdates(chatId: number, time: string) {
        if(this.userPreferences.has(chatId)) {
            const userJob = this.userPreferences.get(chatId).cronJob;
            if(userJob) userJob.stop();
        }

        const [hourStr, minuteStr] = time.split(':');
        const hour = parseInt(hourStr, 10);
        const minutes = parseInt(minuteStr, 10);

        console.log("time is: ", time);
        const cronExpression = `${minutes} ${hour} * * *`;
        console.log(`Cron Expression: ${cronExpression}`);

        const job = nodeCron.schedule(`${cronExpression}`, () => {
            this.sendWeatherUpdate(chatId);
        }, { scheduled: true });

        this.userPreferences.set(chatId, { ...this.userPreferences.get(chatId), cronJob: job });
    }
}
