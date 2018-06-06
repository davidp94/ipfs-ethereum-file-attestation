pragma solidity ^0.4.23;

contract AttestorsRegistry {

    address public admin;
    
    mapping (address => bool) public attestors;

    constructor() public {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(admin == msg.sender);
        _;
    }

    function addAttestor(address _address) onlyAdmin public returns (bool) {
        attestors[_address] = true;
        return true;
    }

    function removeAttestor(address _address) onlyAdmin public returns (bool) {
        attestors[_address] = false;
        return true;
    }

    function isAttestor(address _address) public  view returns (bool) {
        return attestors[_address];
    }

}