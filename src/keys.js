import * as secp256k1 from '@noble/secp256k1'

/**
 * 
 * @param {*} nsecKey 
 * @returns 
 */
export const privateKeyToWeb3Key = function(nsecKey){

    //console.log(secp256k1);



    //return "eth"+nsecKey;

    return secp256k1.utils.bytesToHex(secp256k1.utils.randomPrivateKey());
}

/**
 * 
 * @param {*} npubKey 
 * @returns 
 */
export const publicKeyToWeb3Address = function(npubKey){


    
}

