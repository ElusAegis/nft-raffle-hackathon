/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-waffle');
require('hardhat-dependency-compiler');

module.exports = {
  solidity: "0.8.0",
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545/',
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80']
    }
  },
  dependencyCompiler: {
    paths: [
    ],
  }
};
