import 'dotenv/config'
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!)
const chat_id = process.env.CHAT_ID!


export const sendMessage = async (message: string, retries = 3) => {
    for (let i = 0; i < retries; i++) {        
        try {
            await bot.telegram.sendMessage(chat_id, message)
            return 
        } catch (error: any) {
            if (i === retries - 1) console.error("Gagal total setelah 3 kali mencoba.");
            else console.log(`Koneksi gagal, mencoba lagi... (${i + 1})`);

            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

const startBot = async () => {
    try {
        console.log('Memulai bot telegram...');
        await bot.launch()
        console.log('Bot berhasil tersambung...');
    } catch (error: any) {
        console.error('gagal memulai bot');
    }
}

startBot()
// bot.start((ctx) => {
//     ctx.reply('Welcom to my bot')
// bot.help((ctx) =>
// })
//     ctx.reply("For any help or assistance, reach out to us <your-email.com>")
//   );

// bot.on('message', (ctx) => {
//     ctx.chat.id
// })


// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));



