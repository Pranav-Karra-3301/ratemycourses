// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ReputationToken is ERC20, AccessControl {
    bytes32 public constant REWARDER_ROLE = keccak256("REWARDER_ROLE");
    uint256 public constant REVIEW_REWARD = 10 ether;
    uint256 public constant HELPFUL_VOTE_REWARD = 1 ether;
    uint256 public constant SPAM_PENALTY = 5 ether;

    constructor(address admin) ERC20("RateMyCourses Reputation", "RMCREP") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /// @notice Mint reputation to a user after a useful action.
    function reward(address user, uint256 amount) external onlyRole(REWARDER_ROLE) {
        _mint(user, amount);
    }

    /// @notice Burn reputation from a user as an anti-spam penalty.
    function penalize(address user, uint256 amount) external onlyRole(REWARDER_ROLE) {
        uint256 balance = balanceOf(user);
        _burn(user, amount > balance ? balance : amount);
    }
}
