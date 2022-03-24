// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.9;
 
contract Lottery {
    address payable public manager;
    address payable[] public players;
    address public previousWinner;

    // Events
    event PlayerAdded(address _address);

    // Only owner can call 
    modifier onlyOwner() {
        require(isOwner());
        _;
    }
    // Only owner cannot call
    modifier notOwner() {
        require(!isOwner());
        _;
    }
    
    function isOwner() public view returns (bool) {
        return msg.sender == manager;
    }

    constructor() {
        manager = payable(msg.sender);
    }

    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }
    
    // we don't want the manager to participate
    function enter() public notOwner payable {
        // participants need to pay 1ether
        require(msg.value > 0.01 ether);
        // add the player 
        players.push(payable(msg.sender));
        emit PlayerAdded(msg.sender);
    }
    // pick a winner from all the players and empties players array
    function pickWinner() public onlyOwner {
        uint index = random();
        previousWinner = players[index];

        payable(players[index]).transfer(address(this).balance);
        players = new address payable[](0);
    }
    // Generate a random number and returns it
    function random() private view returns (uint){
        uint randNonce=0;
        uint randomNumberGenerated = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender,randNonce,block.difficulty))) % players.length;
        return randomNumberGenerated;
    }
    function transfer() public onlyOwner {
        // send the owner of the contract all of the eth
        manager.transfer(address(this).balance);
        // reset the players array
        players = new address payable[](0);
    }
    
}