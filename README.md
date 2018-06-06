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