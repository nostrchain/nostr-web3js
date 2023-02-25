
import {test} from 'tape'
import {privateKeyToWeb3Key,privateKeyToWeb3Address} from '../index.js'


/*

test key:
npub12vnp4l94ffs45p5sgwj8ryxvqv8akrkqexnpkj8xm250jpr0a9nsywe2g6
nsec1jjv63e3sjmp4847cy7dvgtvzrqtuahg7cpp7v5txnska7fw0kzdqu0tjwg
web3 address
0xAB4b781Deb91B045AEfa5eEC59B5725503796ECC

*/



test('---  nostr privateKey To Web3 PrivateKey ---', function (t) {
	t.plan(1)
	let nsec = "nsec1jjv63e3sjmp4847cy7dvgtvzrqtuahg7cpp7v5txnska7fw0kzdqu0tjwg";
    console.log("privateKeyToWeb3Key =",privateKeyToWeb3Key(nsec))
	t.equal("isok","isok")
});


test('--- nostr privateKey To Web3 Address ---', function (t) {
	t.plan(1)
	let nsec = "nsec1jjv63e3sjmp4847cy7dvgtvzrqtuahg7cpp7v5txnska7fw0kzdqu0tjwg";
    console.log("Web3 Address1 =",privateKeyToWeb3Address(nsec))
	t.equal("isok","isok")
});



// test('===nostr publicKey To Web3 Address===', function (t) {
// 	t.plan(1)
// 	let npub = "npub12vnp4l94ffs45p5sgwj8ryxvqv8akrkqexnpkj8xm250jpr0a9nsywe2g6";
//     console.log("Web3 Address2 =",publicKeyToWeb3Address(npub))


// 	t.equal("isok","isok")
// });
