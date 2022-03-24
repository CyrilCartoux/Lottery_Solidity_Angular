pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

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

    function Lottery() public {
        manager = msg.sender;
    }

    function getPlayers() public view returns(address[]) {
        return players;
    }
    
    // we don't want the manager to participate
    function enter() public notOwner payable {
        // participants need to pay 1ether
        require(msg.value > 0.01 ether);
        // add the player 
        players.push(msg.sender);
    }
    // pick a winner from all the players and empties players array
    function pickWinner() public onlyOwner returns(address)  {
        uint index = random();
        address winner = players[index];

        players[index].transfer(this.balance);
        players = new address[](0);

        return winner;
    }

    function transfer() public onlyOwner {
        manager.transfer(this.balance);
    }
    // Generate a random number and returns it
    function random() private view returns (uint){
        uint randNonce=0;
        uint randomNumberGenerated = uint(keccak256(now, msg.sender,randNonce,block.difficulty)) % players.length;
        return randomNumberGenerated;
    }
    
}