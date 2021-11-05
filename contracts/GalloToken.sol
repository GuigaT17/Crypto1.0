pragma solidity >=0.4.22 <0.9.0;

contract GalloToken {

    string public name = "Gallo Token";
    string public symbol = "CAM";
    string public standard = "Gallo Token v1.0";
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
}