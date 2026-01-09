import axios from "axios";
import * as cheerio from 'cheerio'

export interface Items {
    id: number,
    name: string,
    cost: number,
    link: string
}

export const getLatestCost = async (url: string) => {
    try {
        const arrayUG: string[] = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36']
        const getRandomUG = () => arrayUG[Math.floor(Math.random() * arrayUG.length)]
        
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': getRandomUG()!,
                'Accept': 'text/html',
                'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
                'Referer': 'https://www.google.com/'
            }
        })
        if (!data) {
            throw new Error
        }

        const $ = cheerio.load(data)
        let items: Items[] = []

        $('.card').each((i, el) => {
            const itemName: any = $(el).find('.title').attr('title')?.trim()
            const itemCost: any = $(el).find('.price').text().trim()
            const itemLink = $(el).find('.title').attr('href');
    
            const cleanCost = parseFloat(itemCost.replace('$', ''))
            const link  = 'https://webscraper.io' + itemLink
            items.push({
                id: i + 1,
                name: itemName,
                cost: cleanCost,
                link: link
            })
        })
        return items
    } catch (error: any) {
        console.error(error.message);
    }
}