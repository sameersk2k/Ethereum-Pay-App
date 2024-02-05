

require('@nomiclabs/hardhat-waffle');

module.exports={
  solidity: '0.8.0',
  networks:{
    sepolia:{
      url:'url of app created in alchemy',
      accounts:['account private key']

    }
  }
}
