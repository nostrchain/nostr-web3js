# nostr-web3js
nostr drive block link to library
nostr private key signature access to blockchain, public key convert to wallet address
website: https://nostrchain.xyz/

Transfer of funds
```
transferToNpub("nsec1jjv63e3sjmp4847cy7dvgtvzrqtuahg7cpp7v5txnska7fw0kzdqu0tjwg","npub1srwq095thr5n8jvtnuqjg6d8ru4f2lhf74qwfqhwv22r7t2fpgksc5dc94",
            String(100)).then((transactionHash) =>{  
    console.log("Send ok transactionHash=",transactionHash);
}).catch((err) =>{
    console.log("Send fail",err);
})
```

Search for funds
```
getBankBalance("npub1srwq095thr5n8jvtnuqjg6d8ru4f2lhf74qwfqhwv22r7t2fpgksc5dc94").then(([allBalance,bankBalance,walletBalance,addr]) =>{
    console.log("getBankBalance ok",allBalance,bankBalance,walletBalance,addr);
}).catch((err) =>{
    console.log("getBankBalance fail",err);
})
```

For more features, please refer to: https://github.com/nostrchain/nostr-wallet

