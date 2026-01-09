import express, { json, type Request, type Response } from 'express'
import { getLatestCost } from './scraper.js'
import { readDB, saveDatabase } from './storage.js'
import { sendMessage } from './bot.js'
import { compareCount } from './watchdog.js'
import cron from 'node-cron'

const app = express()
const port = 3000

app.use(json())
app.get('/', (req: Request, res: Response) => {
    res.send('hello word')
})

const runWatchDog = async () => {
    const base_url = 'https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops'
    try {
        console.log("Memulai Scraping...");
        const oldData = readDB()
        console.log(`Data lama ditemukan: ${oldData.length} item`);

        const newData = await getLatestCost(base_url)
        console.log(`Data baru dari web: ${newData?.length} item`);
        
        if (newData && newData.length > 0) {
            const reportAlert = compareCount(oldData, newData!)
            console.log(`Jumlah perubahan: ${reportAlert.length}`);

            if (reportAlert.length > 0) {
                const fullMessage = `NOTIFIKASI HARGA:\n\n` + reportAlert.join('\n\n');
                console.log("Pesan terkirim ke Telegram");
                await sendMessage(fullMessage);
            } else {
                console.log('Tidak ada perubahan harga.');
            }
            saveDatabase(newData!)
        }
    } catch (error: any) {
        console.error(error.message);
        await sendMessage(`Error pada WatchDog: ${error.message}`);
    }
}

const task = async () => {
    console.log(`[${new Date().toLocaleTimeString()}] Memulai pengecekan rutin....`);
    await runWatchDog()
}

cron.schedule('*/10 * * * *', task)

app.listen(port, () => {
    console.log(`app run in http://localhost:${port}`);
    console.log("Watchdog Scheduler aktif! Mengecek setiap 30 menit.");

    task()
})