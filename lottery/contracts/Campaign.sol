// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.9;

contract Campaign {

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        // keeps track of the "yes" vote
        uint approvalCount;
        // people who have provided approval for the request
        mapping(address=>bool) approvals;
    }

    uint numRequest;
    // requests created by the manager
    // Request[] public requests;
    mapping (uint=>Request) requests;
    // address of the Campaign creator
    address public manager;
    // minimumContribution to be considerer a contributor or validator , set in the constructor
    uint minimumContribution;
    // approvers who contributed to the campaign
    mapping(address=>bool) public approvers;

    modifier OnlyManager() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum) {
        manager = msg.sender;
        minimumContribution = minimum;
    }
    // Contribute to a Campaign
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
    }
    // Manager can create a spending request
    function createRequest(string memory description, uint value, address recipient) public OnlyManager {
       Request storage r = requests[numRequest++];
       r.description = description;
       r.value = value;
       r.recipient= recipient;
       r.complete = false;
       r.approvalCount=0;
    }
    // scalled by each contributor to approve a spending request
    function approveRequest(uint requestId) public {
        Request storage request = requests[requestId];
        
        // we need to make sure that the person is an approver 
        require(approvers[msg.sender]);
        // we need to make sure that the person has not already approved it ! 
        require(!request.approvals[msg.sender]);
        // mark that this person just voted for this request
        request.approvals[msg.sender]=true;
        // add one to approvalCount
        request.approvalCount++;
        // update the approvals mapping in request struct
        request.approvals[msg.sender] = true;
        // tell that msg.sender address has voted
        approvers[msg.sender] = true;
    }
    
}