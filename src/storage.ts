import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Items } from './scraper.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_PATH = path.join(__dirname, 'data', 'database.json')

export const readDB = (): Items[] => {
    try {
        if (!fs.existsSync(DB_PATH)) return []
        
        const data = fs.readFileSync(DB_PATH, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
} 

export const saveDatabase = (data: Items[]): void => {
    try {
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error: any) {
        console.error("Gagal simpan database:", error.message);
    }
}
