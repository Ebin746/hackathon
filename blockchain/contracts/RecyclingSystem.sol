// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RecyclingSystem {
    address public company;  // Fixed company account

    struct Item {
        address user;
        address middleman;
        uint256 price; 
        bool verified;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount;

    event ItemAdded(uint256 itemId, address indexed user, uint256 price);
    event ItemVerified(uint256 itemId, address indexed middleman, uint256 userReward, uint256 middlemanReward);

    modifier onlyCompany() {
        require(msg.sender == company, "Only company can perform this action");
        _;
    }

    constructor() {
        company = msg.sender;  // Deployer's account as the company
    }

    function addItem(uint256 price) external {
        itemCount++;
        items[itemCount] = Item(msg.sender, address(0), price, false);
        emit ItemAdded(itemCount, msg.sender, price);
    }

    function verifyItem(uint256 itemId, address middleman) external onlyCompany {
        Item storage item = items[itemId];
        require(!item.verified, "Item already verified");

        uint256 userReward = (item.price * 80) / 100; // 80% to user
        uint256 middlemanReward = (item.price * 20) / 100; // 20% to middleman

        require(address(this).balance >= item.price, "Insufficient contract balance");

        payable(item.user).transfer(userReward);
        payable(middleman).transfer(middlemanReward);

        item.middleman = middleman;
        item.verified = true;

        emit ItemVerified(itemId, middleman, userReward, middlemanReward);
    }

    function deposit() external payable onlyCompany {} // Company deposits ETH to the contract
}