
import {nip19, generatePrivateKey, getPublicKey} from 'nostr-tools'
import { strict as assert } from 'node:assert';
import {ethers,utils} from "ethers"
import sha3 from "js-sha3"

import privateKeyToAddress from 'ethereum-private-key-to-address'
import publicKeyToAddress from 'ethereum-public-key-to-address'

import privateKeyToPublicKey from 'ethereum-private-key-to-public-key'
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
 * nostr publicKey To Web3 Address
 * @param {*} npubKey 
 * @returns 
 */
export const publicKeyToWeb3Address = function(npubKey){
    let {type, data} = nip19.decode(npubKey)
    if(type != 'npub'){
        throw "The header character is not equal to npub";
    }
    
    console.log("data=",data)
    let data2  = privateKeyToWeb3Key("nsec1jjv63e3sjmp4847cy7dvgtvzrqtuahg7cpp7v5txnska7fw0kzdqu0tjwg")
    console.log("data2=",data2)
    console.log("data3=",data)
    //
    //
    let privateKey = Buffer.from(data, 'hex')
    console.log("privateKey=",privateKey, privateKey.length)

    let pubk = privateKeyToPublicKey(data2)
    console.log("pubk=",pubk,pubk.length)
    console.log("pubk=",pubk.toString() )

    return publicKeyToAddress(pubk)

    // //data = "613578e3005eb433967844f85b138ada964e344bdd9b51921563ee4289f70b3e"

    // console.log("data=",data) // 0xAB4b781Deb91B045AEfa5eEC59B5725503796ECC

    // console.log("2=",privateKeyToAddress(data))
    let sk1 = generatePrivateKey()
    let pk1 = getPublicKey(sk1)


    // const my_wallet = new ethers.Wallet(data)
    // const public_key = my_wallet.publicKey

    // console.log("public_key=",public_key)
    // printPublicKey(public_key)

    // // First step: remove the first two bits of the public key 04, if it contains 0x is to remove the four bits, and then re-add 0x construction
    // let new_key = "0x" + data.substring(4)
    // // second step: the results of the above into bytesLike (can not miss)
    // let new_bytes = utils.arrayify(new_key)
    //  //Third step, keccak_256,get a hash of length 64
    // new_key = sha3.keccak_256(new_bytes)
    // //step 4, take the last 40 bits of the above result, you get the all lowercase address.
    // let result = "0x" + new_key.substring(24)
    //  // Finally, convert the address to a checked address
    // result = utils.getAddress(result)

    // console.log("")
    // console.log(result)


    // //console.log("my_wallet.address = ",my_wallet.address)

    // //console.log("nip19 =", type, data, type === 'nsec')
    // return result
}





