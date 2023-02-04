require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.6.6",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/daoLoBqDaOiWXzDNfkCmn2GWHhB89bfS",
        allowUnlimitedContractSize: true,
        blockNumber: 16512274
      }
    }
    // ,
    // goerli: {
    //   url: "https://goerli.infura.io/v3/16f406927d514ea8b30dfe403d249dcb"
    // }
  }
};
