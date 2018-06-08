# ipfs-ethereum-file-attestation
attest that a file exists in ipfs (via a smart contract)

## get started



## what you would need to attest that a file is in ipfs, in your contract

In your contract.
```
import "FilesRegistry.sol";

address public fileRegistryAddress = "0xca35b7d915458ef540ade6068dfe2f44e8fa733c"; // TO BE MODIFIED WITH YOUR FilesRegistry

function uploadAndWin(bytes32 _hash) public returns (bool) {
    FilesRegistry fr = FilesRegistry(fileRegistryAddress);
    require(fr.isFileStored(_hash), "File is not stored");
    // do something
    address(msg.sender).transfer(0.1 ether);
    return true;
}

```

## demo

Install two nodes

two IPFS nodes:
One trusted
One that would be the data creator

Install IPFS on both of the nodes.
https://gist.github.com/davidp94/fc89a4217b35a3bac4f9d0974abbd4b8

And Install node and npm on the trusted node.
https://gist.github.com/davidp94/2675e2ed9ec2ba30e90349f945609166


`ipfs init` on both of the machines.
`ipfs config edit` on both of the machines ( you might need to `export EDITOR=nano` before )
change all occurences of `127.0.0.1` to `0.0.0.0`

then run the daemon
`ipfs daemon` in background

grab the `multiaddress` of both of your nodes by doing
`ipfs id`

the outputs of both would you like
```
{
	"ID": "QmZNjgtdsomethingsAyf6zQ78Heaq142Sq8D",
	"PublicKey": "CAASdidiwidwwdwdwdwd=",
	"Addresses": [
		"/ip6/::1/tcp/4001/ipfs/QmZNjgtdsomethingsAyf6zQ78Heaq142Sq8D",
		"/ip4/127.0.0.1/tcp/4001/ipfs/QmZNjgtdsomethingsAyf6zQ78Heaq142Sq8D",
		"/ip4/10.8.120.21/tcp/4001/ipfs/QmZNjgtdsomethingsAyf6zQ78Heaq142Sq8D",
		"/ip4/51.123.123.123/tcp/4001/ipfs/QmZNjgtdsomethingsAyf6zQ78Heaq142Sq8D"
	],
	"AgentVersion": "go-ipfs/0.4.15/",
	"ProtocolVersion": "ipfs/0.1.0"
}
```


You should grab the one with the remote IP if available.
> 		"/ip4/51.123.123.123/tcp/4001/ipfs/QmZNjgtdsomethingsAyf6zQ78Heaq142Sq8D"

and on both of the nodes you should add the other IPFS id by doing
`ipfs bootstrap add "/ip4/51.123.123.123/tcp/4001/ipfs/QmZNjgtdsomethingsAyf6zQ78Heaq142Sq8D"`


You can restart the daemons.

Both of the IPFS node would have direct connections.

### Attestor Installation

Clone the repo for the attestor.
```
git clone https://github.com/davidp94/ipfs-ethereum-file-attestation.git

```

Install the npm dependencies
```
npm install
```

Go to the server folder

```
cd server
```

Set the env vars for the attestor server to run.

```
export IPFS_HOST=localhost # change with your trusted ipfs daemon
export IPFS_PORT=5001 # change it
export IPFS_PROTOCOL='http'

export WEB3_HTTP_URL='http://127.0.0.1:7545/' # your ethereum JSON RPC endpoint that includes your attestor account
export FILE_REGISTRY_SENDER='0xde6C7Ed3fAf727F0f99220D4855c03969DC415E7' # the unlocked account in your WEB3 endpoint
```

Run the server (or use pm2)

```
node .
```

Your attestor is available in port 4242 http://localhost:4242

In order to attest that a ipfs hash exists

First, the slave add a file he wants to attest by running `ipfs add myfile`

He will get the qmhash `QmT31BLSFK5C24i3WwRETg4BXHkJ6LZgwnBgfcq9s7mrkn`

He can then hit the attestor `http://localhost:4242/verify/QmT31BLSFK5C24i3WwRETg4BXHkJ6LZgwnBgfcq9s7mrkn` or `http://localhost:4242/verify/0x45c51ffe2b66870268e179349e800fe3d87d06100f667b5d4356e16b64b5394f`

The attestor would download and pin the file. And send a tx on the chain.


### video
[![Attestation](https://www.youtube.com/upload_thumbnail?v=k_cPuCSwTdk&t=hqdefault&ts=1528452552925)](https://www.youtube.com/watch?v=k_cPuCSwTdk)
