// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * Deploy on Base Mainnet via Remix (remix.ethereum.org):
 * 1. Paste this file, compile with Solidity 0.8.19
 * 2. Deploy with Injected Provider (MetaMask on Base)
 * 3. Copy deployed address to NEXT_PUBLIC_SCORE_CONTRACT_ADDRESS in .env.local
 *
 * Note: scores are self-reported (client-side game). Basic sanity checks are
 * applied, but on-chain verification is not possible without a trusted oracle.
 */
contract BaccaratLeaderboard {
    struct Score {
        uint256 finalChips;
        uint256 handsPlayed;
        uint256 wins;
        uint256 timestamp;
    }

    uint256 constant MAX_CHIPS = 1_000_000;

    mapping(address => Score) public scores;
    address[] private _players;

    event ScoreRecorded(
        address indexed player,
        uint256 finalChips,
        uint256 handsPlayed,
        uint256 wins
    );

    function recordScore(
        uint256 finalChips,
        uint256 handsPlayed,
        uint256 wins
    ) external {
        require(handsPlayed >= 1, "Must play at least 1 hand");
        require(wins <= handsPlayed, "Wins cannot exceed hands played");
        require(finalChips <= MAX_CHIPS, "Chips value out of range");

        if (scores[msg.sender].timestamp == 0) {
            _players.push(msg.sender);
        }

        // Only store if this is a strictly better score or first entry
        if (scores[msg.sender].timestamp == 0 || finalChips > scores[msg.sender].finalChips) {
            scores[msg.sender] = Score(finalChips, handsPlayed, wins, block.timestamp);
            emit ScoreRecorded(msg.sender, finalChips, handsPlayed, wins);
        }
    }

    function getPlayers() external view returns (address[] memory) {
        return _players;
    }

    function getPlayerCount() external view returns (uint256) {
        return _players.length;
    }
}
