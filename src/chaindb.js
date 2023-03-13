import {privateKeyToWeb3Key,privateKeyToWeb3Address} from './keys.js'
import {NpubBankABI} from './abi.js'
import {ethers} from "ethers"
import hex from "hex"
//var hex = require('hex');
import convertHex from 'convert-hex' 

// test lib 
//import {ethers as eth}  from "hardhat"
import { randomBytes } from 'crypto'

const INFURA_ID = '9000';
const provider = new ethers.providers.JsonRpcProvider("http://192.168.18.101:8545");

//Public key banking contract address, fixed parameters, do not change
//Contract open source, give up control, sufficient security

const NPUB_BANK_CONTRACT = "0x9A44ffcA4913046232afEbF509ed06fe0e90d2CD";  



export const npubBindAddress = function(nsecKey){

    console.log("npubBindAddress nsecKey=",nsecKey)
    let web3PrivateKey = privateKeyToWeb3Key(nsecKey)
    let web3Address = privateKeyToWeb3Address(nsecKey)

    console.log("web3PrivateKey=",web3PrivateKey)
    console.log("web3Address=",web3Address)


    let anydebug = async () =>{
        // let blockNumber = await provider.getBlockNumber(); 
        // console.log("blockNumber =", blockNumber);
    
        // let balance = await provider.getBalance("0x4f6e5488220336Aa9449D6879568A0397180514A");
        // console.log("balance =", balance.toString() );
    
        // let gasPrice = await provider.getGasPrice();
        // console.log("gasPrice =", gasPrice.toString() );
    
        
        const wallet = new ethers.Wallet(web3PrivateKey, provider)
        const contract = new ethers.Contract(NPUB_BANK_CONTRACT, NpubBankABI, wallet)

        // let test1 = await contract.test1();
        // console.log("test1 =", test1.toString() );

        let npubByte = randomBytes(32);
        let eByte = randomBytes(32);
        let sByte = randomBytes(32);

        //npubByte = npubByte.toString('hex')
        console.log(  hex(npubByte));
        //console.log("convertHex",  convertHex.bytesToHex(npubByte));
        

        let tx = await contract.npubBindAddress(npubByte,eByte,sByte);
        await tx.wait();
        console.log("tx .wait hash =", tx.hash );

        
        let addr = await contract.npubToAddress(npubByte);
        console.log("npubToAddress =", addr );

        let _addressToNpub = await contract.addressToNpub(addr);
        console.log("addressToNpub =", _addressToNpub );


        let id = await contract.addressToID(addr);
        console.log("addressToID =", id );

        let _npubToID = await contract.npubToID(npubByte);
        console.log("npubToID =", _npubToID );

        let _idToAddress = await contract.idToNpub(_npubToID);
        console.log("idToAddress =", _idToAddress );

        let npuba = await contract.idToAddress(_npubToID);
        console.log("idToNpub =", npuba );


        let bal = await contract.npubBalance(npubByte);
        console.log("npubBalance =", bal );

    
      }
    
      anydebug();

    
}

export const transferToAddress = function(nsecKey){




}


export const transferToNpub = function(npub){




}