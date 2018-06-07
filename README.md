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
