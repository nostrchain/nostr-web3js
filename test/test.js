const test = require('tape');
const {privateKeyToWeb3Key} = require('../')


test('===nostr privateKey To Web3 PrivateKey===', function (t) {
	t.plan(1)

    console.log("privateKeyToWeb3Key =",privateKeyToWeb3Key("AADFB"))
	t.equal("isok","isok")
});