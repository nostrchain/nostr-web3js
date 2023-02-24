//const test = require('tape');
//const {privateKeyToWeb3Key} = require('../')
import {test} from 'tape'
import {privateKeyToWeb3Key} from '../index.js'


test('===nostr privateKey To Web3 PrivateKey===', function (t) {
	t.plan(1)

    console.log("privateKeyToWeb3Key =",privateKeyToWeb3Key("AAA"))
	t.equal("isok","isok")
});