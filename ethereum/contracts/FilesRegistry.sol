pragma solidity ^0.4.23;

import "./AttestorsRegistry.sol";

contract FilesRegistry {

    address public admin;

    address public attestorRegistryAddress;
    
    // time when the file has been pushed/verified to be in IPFS
    mapping (bytes32 => uint256) public hashesTimeVerified;

    constructor() public {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier validAddress(address _address) {
        require(_address != address(0x0));
        _;
    }

    modifier isAttestor(address _sender) {
        AttestorsRegistry attestorRegistryInstance = AttestorsRegistry(attestorRegistryAddress);
        require(attestorRegistryInstance.isAttestor(_sender), "Not an attestor");
        _;
    }

    function setAdmin(address _address) onlyAdmin validAddress(_address) public returns (bool) {
        admin = _address;
        return true;
    }

    function setAttestorRegistryAddress(address _address) onlyAdmin validAddress(_address) public returns (bool) {
        attestorRegistryAddress = _address;
        return true;
    }

    function attestFile(bytes32 _hash) isAttestor(msg.sender) public returns (bool) {
        hashesTimeVerified[_hash] = block.timestamp;
        return true;
    }

    function removeFile(bytes32 _hash) isAttestor(msg.sender) public returns (bool) {
        hashesTimeVerified[_hash] = block.timestamp;
        return true;
    }

    function isFileStored(bytes32 _hash) public view returns (bool) {
        return hashesTimeVerified[_hash] > 0;
    }

    function fileLastVerifiedTime(bytes32 _hash) public view returns (uint256) {
        return hashesTimeVerified[_hash];
    }

}