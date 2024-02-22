import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FetchService {
    private tokenUrl = 'https://token.jup.ag/all';
    private saveDirectory = '/jupToken'; // Directory to save the file

    constructor() {
        console.log("Fetching and saving file...");
        this.fetchAndSaveFile();
        setInterval(() => {
            this.fetchAndSaveFile(); 
        }, 60 * 60 * 1000);
    }

    async fetchAndSaveFile(): Promise<void> {
        await this.report(this.tokenUrl)
    }

    private async report(url: string) {
        try {
            // Fetch the file content from the URL
            const response = await axios.get(url);

            // Save the file in the specified directory
            const fileName = `jup.token.json`; // Specify the file name
            const savePath = path.join(__dirname, '..', '..', this.saveDirectory, fileName);
            fs.writeFileSync(savePath, JSON.stringify(response.data, null, 2), 'utf8');
            console.log('File saved successfully:', savePath);
        } catch (error) {
            console.error('Error fetching or saving file:', error);
        }
    }
}



