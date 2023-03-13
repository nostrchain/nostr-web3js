//SPDX-License-Identifier: LGPLv3
pragma solidity ^0.8.0;

contract NpubBank {
  // secp256k1 group order
  uint256 constant public Q =
    0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;

  // parity := public key y-coord parity (27 or 28)
  // px := public key x-coord
  // message := 32-byte message
  // e := schnorr signature challenge
  // s := schnorr signature
  function verify(
    uint8 parity,
    bytes32 px,
    bytes32 message,
    bytes32 e,
    bytes32 s
  ) public pure returns (bool) {
    // ecrecover = (m, v, r, s);
    bytes32 sp = bytes32(Q - mulmod(uint256(s), uint256(px), Q));
    bytes32 ep = bytes32(Q - mulmod(uint256(e), uint256(px), Q));

    require(sp != 0);
    // the ecrecover precompile implementation checks that the `r` and `s`
    // inputs are non-zero (in this case, `px` and `ep`), thus we don't need to
    // check if they're zero.
    address R = ecrecover(sp, parity, px, ep);
    require(R != address(0), "ecrecover failed");
    return e == keccak256(
      abi.encodePacked(R, uint8(parity), px, message)
    );
  }

    // Record the total funds deposited in the contract
    uint256 public bankBalance = 0;
    // User incremental ID , unique user identification
    uint48 public idCount = 0;
    // User wallet public key information and funds
    mapping(uint48 => bytes32)  id2npub;
    mapping(bytes32 => uint48)  npub2id;
    mapping(uint48 => address)  id2address;
    mapping(address => uint48)  address2id;
    mapping(uint48 => uint256)  id2balance;


    // Bind user wallet address, must use signature verification
    function npubBindAddress(bytes32 npub,bytes32 e,bytes32 s) public returns(int32){
        // Signature algorithm under development ...  
        // if(verify false){
        //  return 411;
        // }

        if(address2id[msg.sender] != 0){
            return 300;
        }

        uint48 id = npub2id[npub];

        if(id == 0){
            idCount = idCount + 1;
            npub2id[npub] = idCount;
            id2npub[idCount] = npub;
            id2address[idCount] = msg.sender;
            address2id[msg.sender] = idCount;
        }else{
            if(id2address[id] == address(0) && id2npub[id] == npub){
                id2address[id] = msg.sender;
                address2id[msg.sender] = id;
            }
        }

        return 200;
    }


    function npubToAddress(bytes32 npub) public view returns(address){
        uint48 id = npub2id[npub];
        return id2address[id];
    }

    function addressToNpub(address addr) public view returns(bytes32){
        uint48 id = address2id[addr];
        return id2npub[id];
    }

    function npubBalance(bytes32 npub) public view returns(uint256){
        uint48 id = npub2id[npub];
        return id2balance[id];
    }

    function addressToID(address addr) public view returns(uint48){
        return address2id[addr];
    }

    function npubToID(bytes32 npub) public view returns(uint48){
        return npub2id[npub];
    }

    function idToNpub(uint48 id) public view returns(bytes32){
        return id2npub[id];
    }

    function idToAddress(uint48 id) public view returns(address){
        return id2address[id];
    }


    function sendToNpub(bytes32 npub) payable public returns(int32){
        uint48 id = npub2id[npub];
        if(id == 0){
            idCount = idCount + 1;
            id2npub[idCount] = npub;
            npub2id[npub] = idCount;
            id = idCount;
        }
        id2balance[id] += msg.value;
        bankBalance += msg.value;
        return 200;
    }    

    // Remove all the funds on the public key
    function withdrawalToWallet(bytes32 npub,address payable to)payable public returns(int32){
        // Signature algorithm under development ...  
        // if(verify false){
        //  return 411;
        // }

        uint48 id = npub2id[npub];
        if(id == 0){
            return 412;
        }
        if(id2balance[id] > 0){
            if((id2address[id] == msg.sender) && (id2address[id] == to) ){
                if(id2balance[id] > 0){
                    bankBalance -= id2balance[id];
                    //address(this).transfer(msg.sender,id2balance[id]);
                    to.transfer(id2balance[id]);
                    id2balance[id] = 0;
                }
            }
        }

        return 200;
    }

    function test1() public view returns(int64){

        return 9999;
    }



}