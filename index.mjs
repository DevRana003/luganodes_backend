
import { AlchemyProvider, formatEther } from 'ethers';
import dotenv from 'dotenv';
import winston from 'winston';
import mongoose from 'mongoose';
import Deposit from './deposit.js'; 

dotenv.config(); 


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ],
});


const beaconDepositContractAddress = "0x00000000219ab540356cBB839Cbe05303d7705Fa";


const provider = new AlchemyProvider("mainnet", process.env.ALCHEMY_API_KEY || process.env.ALCHEMY_API_URL);


mongoose.connect(process.env.MONGODB_URI).then(() => {
    logger.info("Connected to MongoDB");
}).catch((error) => {
    logger.error("Error connecting to MongoDB", error);
    process.exit(1); 
});


async function trackDeposits() {
    logger.info(`Tracking deposits to contract: ${beaconDepositContractAddress}`);
    
    provider.on("block", async (blockNumber) => {
        try {
            const block = await provider.getBlock(blockNumber);
            
            for (const txHash of block.transactions) {
                const tx = await provider.getTransaction(txHash);

                if (tx.to && tx.to.toLowerCase() === beaconDepositContractAddress.toLowerCase()) {
                    const depositInfo = {
                        blockNumber: tx.blockNumber,
                        blockTimestamp: new Date(block.timestamp * 1000), 
                        from: tx.from,
                        to: tx.to,
                        value: formatEther(tx.value), 
                        hash: tx.hash
                    };

                    logger.info(`New deposit detected in transaction: ${tx.hash}`, depositInfo);

                    try {

                        const newDeposit = new Deposit(depositInfo);
                        await newDeposit.save(); 

                        logger.info(`Deposit saved to MongoDB: ${tx.hash}`);
                    } catch (saveError) {
                        logger.error("Error saving deposit to MongoDB:", saveError);
                    }
                }
            }
        } catch (error) {
            logger.error("Error fetching block transactions:", error);
        }
    });
}


trackDeposits().catch((error) => {
    logger.error("Error tracking deposits:", error);
    process.exit(1);
});

logger.info("Server started, monitoring for deposits...");
