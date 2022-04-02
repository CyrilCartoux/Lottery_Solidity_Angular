// SPDX-License-Identifier: MIT
import './Campaign.sol';
 
pragma solidity ^0.8.9;

// Contract factory to create Campaigns 
contract CampaignFactory {
    
    address public manager;
    address[] public deployedCampaigns;
    uint campaignId;
    mapping(uint=>Campaign) public campaigns;
    mapping(uint=>address) public campaignsOwners;

    constructor() {
        manager = msg.sender;
    }

    // Creates a new campaign
    function createCampaign(string memory lib, uint minimum) public {
        Campaign newCampaign = new Campaign(lib, minimum, msg.sender);
        campaigns[campaignId] = newCampaign;
        campaignsOwners[campaignId] = msg.sender;
        campaignId++;
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
    
}