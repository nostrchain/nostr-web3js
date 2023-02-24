import * as secp256k1 from '@noble/secp256k1'
//import * as secp256k1 from '@noble/secp256k1'
//import { secp256k1 } from '@noble/secp256k1';

/**
 * 
 * @param {*} nsecKey 
 * @returns 
 */
const privateKeyToWeb3Key = function(nsecKey){

    console.log(secp256k1);



    return "eth"+nsecKey;

    //return secp256k1.utils.bytesToHex(secp256k1.utils.randomPrivateKey());
}

/**
 * 
 * @param {*} npubKey 
 * @returns 
 */
const publicKeyToWeb3Address = function(npubKey){


    
}

export default {
	privateKeyToWeb3Key,
    publicKeyToWeb3Address
}
