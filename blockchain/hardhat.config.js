// hardhat.config.js
require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
      hardhat: {
      chainId: 1337,         // ◀─ force the in‑process node to run at 1337
 },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,        // <-- only localhost uses 1337
    },
  },
};
