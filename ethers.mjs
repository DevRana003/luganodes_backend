
import { JsonRpcProvider } from 'ethers';


const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/4MPPuDLTihSEUPDFNPQcRYvVy-Hu3GyC");

async function getBlock() {
    try {

        const blockNumber = "latest";
        const block = await provider.getBlock(blockNumber);
        console.log(block);
    } catch (error) {
        console.error("Error fetching block:", error);
    }
}


getBlock();
