import {nip19,getPublicKey,generatePrivateKey} from 'nostr-tools'
import {privateKeyToWeb3Key,privateKeyToWeb3Address,publicKeyToBytes} from './keys.js'
import {NpubBankABI} from './abi.js'
import {ethers} from "ethers"
import {INFURA_ID,JSON_RPC_PROVIDER,NPUB_BANK_CONTRACT} from './cfg.js'
import hexToArrayBuffer from 'hex-to-array-buffer'
import {Buffer} from 'buffer'

//import { randomBytes } from 'crypto'

const provider = new ethers.providers.JsonRpcProvider( JSON_RPC_PROVIDER );


/**
 * Generate your own public key and wallet address, and bind it to the blockchain contract to facilitate the transfer of funds. 
 * @param {*} nsecKey 
 * @returns 
 */
export const  npubBindAddress = async (nsecKey) => {
    return new Promise(async function (resolve, reject) {
        try{
            let web3PrivateKey = privateKeyToWeb3Key(nsecKey);
            let web3Address = privateKeyToWeb3Address(nsecKey);
            const wallet = new ethers.Wallet(web3PrivateKey, provider)
            const contract = new ethers.Contract(NPUB_BANK_CONTRACT, NpubBankABI, wallet)
            let npubByte = Buffer.from(hexToArrayBuffer(getPublicKey(privateKeyToWeb3Key(nsecKey)))) ;
            // let eByte = randomBytes(32);
            // let sByte = randomBytes(32);       
            let eByte = Buffer.from(hexToArrayBuffer('7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e'));
            let sByte = Buffer.from(hexToArrayBuffer('7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e'));             
            let tx = await contract.npubBindAddress(npubByte,eByte,sByte);
            await tx.wait();
            //console.log(tx)
            if(tx.hash.length > 0){
                return resolve()
            }
        }catch(err){
            return reject(err)
        }
        return reject()
    });
}


/**
 * Sending funds to the user's wallet address
 * @param {*} nsecKey 
 * @param {*} address 
 * @param {*} num 
 */
export const transferToAddress = async (nsecKey,address,amount) =>{
    return new Promise(async function (resolve, reject) {
        try{
            let web3PrivateKey = privateKeyToWeb3Key(nsecKey);
            let from_addr = privateKeyToWeb3Address(nsecKey);
            let to_addr = ethers.utils.getAddress(address);
            const tx = {
                to: to_addr,
                value: ethers.utils.parseEther(String(amount)),
            }
            const wallet = new ethers.Wallet(web3PrivateKey, provider);
            let tt = await wallet.sendTransaction(tx);
            if(tt.hash.length > 0){
                return resolve()
            }
        }catch(err){
            return reject(err)
        }
        return reject()
    });

}

/**
 * Send funds to the user's Nostr public key address
 * If the user has already bound the public key address, it will be sent directly to the wallet address
 * @param {*} nsecKey 
 * @param {*} npub 
 * @param {*} amount 
 */
export const transferToNpub = async (nsecKey,npub,amount) =>{
    return new Promise(async function (resolve, reject) {
        try{
            let web3PrivateKey = privateKeyToWeb3Key(nsecKey);
            const wallet = new ethers.Wallet(web3PrivateKey, provider)
            const contract = new ethers.Contract(NPUB_BANK_CONTRACT, NpubBankABI, wallet)
            const npubByte32 = publicKeyToBytes(npub);
            console.log("npubByte32=",npubByte32)
            let to_addr = await contract.npubToAddress(npubByte32);
            console.log("to_addr good =",to_addr)
            if(to_addr == "0x0000000000000000000000000000000000000000"){
                let amountWei = ethers.utils.parseEther(String(amount));
                let overrides = {
                    from: privateKeyToWeb3Address(nsecKey),
                    value: ethers.utils.parseEther(String(amount)),
                };
                let tx = await contract.sendToNpub(npubByte32,overrides);
                let tt = await tx.wait();
                console.log("tt =",tt);
                if(tt.transactionHash.length > 0){
                    return resolve()
                }
            }else{
                const tx = {
                    to: to_addr,
                    value: ethers.utils.parseEther(String(amount)),
                }
                let tt = await wallet.sendTransaction(tx);
                console.log("tt =",tt);
                if(tt.hash.length > 0){
                    return resolve()
                }
            }

        }catch(err){
            return reject(err)
        }
        return reject()
    });

}

/**
 * Returns total user funds (both in the contract, and in the wallet address)
 * @param {*} nsecKey 
 */
export const getBankBalance = async (npub) =>{
    return new Promise(async function (resolve, reject) {
        try{
            let allBalance = ethers.BigNumber.from("0");
            let bankBalance = ethers.BigNumber.from("0");
            let walletBalance = ethers.BigNumber.from("0");
            const npubByte32 = publicKeyToBytes(npub);
            const contract = new ethers.Contract(NPUB_BANK_CONTRACT, NpubBankABI, provider)
            bankBalance = await contract.npubBalance(npubByte32);
            allBalance = allBalance.add(bankBalance)
            let to_addr = await contract.npubToAddress(npubByte32);
            if(to_addr == "0x0000000000000000000000000000000000000000"){
            }else{
                walletBalance = await provider.getBalance(to_addr);
                allBalance = allBalance.add(walletBalance)
            }
            return resolve([ethers.utils.formatUnits(allBalance,18),
                    ethers.utils.formatUnits(bankBalance,18),
                    ethers.utils.formatUnits(walletBalance,18)])
        }catch(err){
            return reject(err)
        }
        return reject()
    });


}

/**
 * Remove all temporary funds from the contract bank to the wallet address
 * @param {*} nsecKey 
 */
export const withdrawalToWallet = async (nsecKey) =>{
    return new Promise(async function (resolve, reject) {
        try{
            let npub = nip19.npubEncode( getPublicKey(privateKeyToWeb3Key(nsecKey)) );
            let selfBalance = await provider.getBalance(privateKeyToWeb3Address(nsecKey));  
            selfBalance = ethers.utils.formatUnits(selfBalance,18);
            if(Number(selfBalance) == 0){
                // Additional coin codes required ..
                return reject("Balance is empty, please get some through the tap URL first.")
            }
            let web3PrivateKey = privateKeyToWeb3Key(nsecKey);
            const wallet = new ethers.Wallet(web3PrivateKey, provider)
            const contract = new ethers.Contract(NPUB_BANK_CONTRACT, NpubBankABI, wallet)
            const npubByte32 = publicKeyToBytes(npub);
            let to_addr = await contract.npubToAddress(npubByte32);
            if(to_addr == "0x0000000000000000000000000000000000000000"){
                await npubBindAddress(nsecKey)
            }
            let [allBalance,bankBalance,walletBalance] = await getBankBalance(npub)
            if(Number(bankBalance) <= 0){
                return resolve("No funds in the contract bank")
            }
            let tx = await contract.withdrawalToWallet(npubByte32,privateKeyToWeb3Address(nsecKey));
            await tx.wait();
            if(tx.hash.length > 0){
                return resolve("ok")
            }
        }catch(err){
            return reject(err)
        }
        return reject()
    });
}







