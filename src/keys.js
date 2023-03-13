
import {nip19, generatePrivateKey, getPublicKey} from 'nostr-tools'
import {ethers,utils} from "ethers"
import sha3 from "js-sha3"
import privateKeyToAddress from 'ethereum-private-key-to-address'
import hexToArrayBuffer from 'hex-to-array-buffer'

// import publicKeyToAddress from 'ethereum-public-key-to-address'

// import privateKeyToPublicKey from 'ethereum-private-key-to-public-key'


/**
 * nostr privateKey To Web3 PrivateKey
 * @param {*} nsecKey 
 * @returns 
 */
export const privateKeyToWeb3Key = function(nsecKey){
    let {type, data} = nip19.decode(nsecKey)
    if(type != 'nsec'){
        throw "The header character is not equal to nsec";
    }
    return data; 
}

/**
 * nostr privateKey To Web3 Address
 * @param {*} nsecKey 
 */
export const privateKeyToWeb3Address = function(nsecKey){
    let privateKey = privateKeyToWeb3Key(nsecKey)
    return utils.getAddress( privateKeyToAddress(privateKey) )
}

/**
 * nostr publicKeyKey To bytes32
 */
export const publicKeyToBytes = function(npubKey){
    let {type, data} = nip19.decode(npubKey)
    if(type != 'npub'){
        throw "The header character is not equal to nsec";
    }
    console.log("publicKeyToBytes=",data)
    data = Buffer.from(hexToArrayBuffer(data))

    return data; 
}


