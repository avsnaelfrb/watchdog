import express, { json, type Request, type Response } from 'express'
import { getLatestCost } from './scraper.js'
import { saveDatabase } from './storage.js'
import { sendMessage } from './bot.js'

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
        const latestCost = await getLatestCost(base_url)

        if (latestCost && latestCost?.length > 0) {
            saveDatabase(latestCost)

            await sendMessage(`Berhasil Scrape! \nTotal item: ${latestCost.length} \nData telah disimpan ke database.`);
        } else {
            await sendMessage("Scraping selesai tapi tidak ada data ditemukan.");
        }
    } catch (error: any) {
        console.error(error.message);
        await sendMessage(`Error pada WatchDog: ${error.message}`);
    }
}

await runWatchDog()

app.listen(port, () => {
    console.log(`app run in http://localhost:${port}`);
})