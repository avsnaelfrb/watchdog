import fs from 'fs'
import type { Items } from './scraper.js';

export const compareCount = (oldData: Items[], newData: Items[]): any => {
    let alerts : string[] = []
    
    try {
        newData.forEach(newItem => {
            const oldItem = oldData.find(item => item.link === newItem.link)
    
            if (!oldItem) {
                alerts.push(`Ada item terbaru: \n Name: ${newItem.name} \n Harga: ${newItem.cost} \n`)
            } else if (newItem.cost < oldItem.cost) {
                const totalDiskon = oldItem.cost - newItem.cost
                alerts.push(`Diskon pada ${newItem.name}: \n Diskon sebesar: ${totalDiskon} \n Harga lama: ${oldItem.cost} => ${newItem.cost} \n`)
            } else if (newItem.cost > oldItem.cost) {
                alerts.push(`\nHarga "${newItem.name}" naik ke:\n${newItem.cost}`)
            }
        });
        return alerts
    } catch (error) {
        return []
    }
}