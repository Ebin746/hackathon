// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PaymentForwarder {
    event PaymentForwarded(address indexed sender, address indexed recipient, uint256 amount);

    /// @notice Forwards exactly the ETH sent to the recipient.
    /// @param recipient The address that will receive the ETH.
    /// @param amount The amount of ETH to forward (must equal msg.value).
    function forwardFunds(address recipient, uint256 amount) external payable {
        require(msg.value == amount, "Sent ETH must equal specified amount");
       
        payable(recipient).transfer(amount);
        emit PaymentForwarded(msg.sender, recipient, amount);
    }
    // Accept ETH sent directly to the contract.
    receive() external payable {}
}
