import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';  
import Deposit from './deposit.js';
import path from 'path';  
import { fileURLToPath } from 'url';  
import TelegramBot from 'node-telegram-bot-api'; 
import cors from 'cors';  

dotenv.config(); 


const app = express();
const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());


app.use(bodyParser.json());


const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });


function sendTelegramAlert(message) {
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message)
        .then(() => console.log("Telegram alert sent"))
        .catch((error) => console.error("Error sending Telegram alert:", error));
}


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });


app.post('/deposits', async (req, res) => {
    try {
        const deposit = new Deposit({
            blockNumber: req.body.blockNumber,
            blockTimestamp: new Date(),
            from: req.body.from,
            to: req.body.to,
            value: req.body.value,
            hash: req.body.hash
        });


        await deposit.save();


        const message = `
New deposit added:
- Block Number: ${deposit.blockNumber}
- From: ${deposit.from}
- To: ${deposit.to}
- Value: ${deposit.value} ETH
- Transaction Hash: ${deposit.hash}
        `;
        sendTelegramAlert(message); 


        res.status(201).json({ message: 'Deposit added successfully!', deposit });
    } catch (error) {
        console.error("Error adding deposit:", error);
        res.status(500).json({ error: 'Error adding deposit' });
    }
});


app.get('/deposits', async (req, res) => {
    try {
        const deposits = await Deposit.find(); 
        res.json(deposits);
    } catch (error) {
        console.error("Error fetching deposits:", error);
        res.status(500).json({ error: 'Error fetching deposits' });
    }
});


app.get('/deposits/:hash', async (req, res) => {
    try {
        const deposit = await Deposit.findOne({ hash: req.params.hash }); 
        if (!deposit) {
            return res.status(404).json({ error: 'Deposit not found' });
        }
        res.json(deposit);
    } catch (error) {
        console.error("Error fetching deposit:", error);
        res.status(500).json({ error: 'Error fetching deposit' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
