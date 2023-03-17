


import secp from 'secp256k1'
//const createKeccakHash = require('keccak')
import keccak from 'keccak'
import {Buffer} from 'buffer'

const {publicKeyCreate,publicKeyConvert} = secp;



function toChecksumAddress(address, chainId = null) {
    if (typeof address !== 'string') {
        return ''
    }

    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        throw new Error(
            `Given address "${address}" is not a valid Ethereum address.`
        )
    }

    const stripAddress = stripHexPrefix(address).toLowerCase()
    const prefix = chainId != null ? chainId.toString() + '0x' : ''
    const keccakHash = keccak('keccak256')
        .update(prefix + stripAddress)
        .digest('hex')
    let checksumAddress = '0x'

    for (let i = 0; i < stripAddress.length; i++) {
        checksumAddress +=
            parseInt(keccakHash[i], 16) >= 8
                ? stripAddress[i].toUpperCase()
                : stripAddress[i]
    }

    return checksumAddress
}

function checkAddressChecksum(address, chainId = null) {
    const stripAddress = stripHexPrefix(address).toLowerCase()
    const prefix = chainId != null ? chainId.toString() + '0x' : ''
    const keccakHash = keccak('keccak256')
        .update(prefix + stripAddress)
        .digest('hex')

    for (let i = 0; i < stripAddress.length; i++) {
        let output =
            parseInt(keccakHash[i], 16) >= 8
                ? stripAddress[i].toUpperCase()
                : stripAddress[i]
        if (stripHexPrefix(address)[i] !== output) {
            return false
        }
    }
    return true
}

function stripHexPrefix(value) {
    return value.slice(0, 2) === '0x' ? value.slice(2) : value
}



function publicKeyToAddress(publicKey) {
    if (!Buffer.isBuffer(publicKey)) {
        if (typeof publicKey !== 'string') {
            throw new Error('Expected Buffer or string as argument')
        }

        publicKey = publicKey.slice(0, 2) === '0x' ? publicKey.slice(2) : publicKey
        publicKey = Buffer.from(publicKey, 'hex')
    }

    publicKey = Buffer.from(publicKeyConvert(publicKey, false)).slice(1)
    const hash = keccak('keccak256').update(publicKey).digest()
    return toChecksumAddress(hash.slice(-20).toString('hex'))
}






function privateKeyToPublicKey(privateKey) {
    if (!Buffer.isBuffer(privateKey)) {
        if (typeof privateKey !== 'string') {
            throw new Error('Expected Buffer or string as argument')
        }

        privateKey = privateKey.slice(0, 2) === '0x' ? privateKey.slice(2) : privateKey
        privateKey = Buffer.from(privateKey, 'hex')
    }

    return Buffer.from(publicKeyCreate(privateKey, false))
}




export function privateKeyToAddress(privateKey) {
    if (!Buffer.isBuffer(privateKey)) {
        if (typeof privateKey !== 'string') {
            throw new Error('Expected Buffer or string as argument')
        }

        privateKey = privateKey.slice(0, 2) === '0x' ? privateKey.slice(2) : privateKey
        privateKey = Buffer.from(privateKey, 'hex')
    }

    return publicKeyToAddress(privateKeyToPublicKey(privateKey))
}

// module.exports = privateKeyToAddress




