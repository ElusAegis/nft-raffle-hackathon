// https://eth-ropsten.alchemyapi.io/v2/7IwaOHs1Gtc_ur3eeuHTIS7iY4nWh_bw

const { network } = require("hardhat");

requestAnimationFrame('@nomiclabs/hardhats-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/7IwaOHs1Gtc_ur3eeuHTIS7iY4nWh_bw',
      account: ['802340fc7681a1eceaab83092e4cf7821d7fe616a5702111ec823d05fc53d298']
    }
  }
}