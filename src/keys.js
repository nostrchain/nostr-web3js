//import * as secp256k1 from '@noble/secp256k1'
const {secp256k1} = require('@noble/secp256k1');

/**
 * 
 * @param {*} nsecKey 
 * @returns 
 */
const privateKeyToWeb3Key = function(nsecKey){


    //return "eth"+nsecKey;

    return secp256k1.utils.bytesToHex(secp256k1.utils.randomPrivateKey());
}

/**
 * 
 * @param {*} npubKey 
 * @returns 
 */
const publicKeyToWeb3Address = function(npubKey){


    return "ethp"+npubKey;
}



module.exports = {
	privateKeyToWeb3Key,
    publicKeyToWeb3Address
}
