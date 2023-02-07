const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const BN = require('bn.js');
const { ethers,network } = require("hardhat");
const { ChainId, Fetcher, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const chainId = ChainId.MAINNET

describe("", function () {


  const DAI = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const DAI_WHALE = '0xf9211FfBD6f741771393205c1c3F6D7d28B90F03';

  // const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  // const DAI_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';

  const DECIMALS = 6;
  const FUND_AMOUNT = 1000000; //贷款资金
  const BORROW_AMOUNT = 2000000; //贷款代币

  describe("testxxx", function () {

    it("testcase: 3 path", async function () {

      //冒充DAI_WHALE
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [DAI_WHALE]
        })

      const TestUniswapV2FlashSwap = await ethers.getContractFactory("TestUniswapV2FlashSwap");
      const testUniswapV2FlashSwap = await TestUniswapV2FlashSwap.deploy();
      await testUniswapV2FlashSwap.deployed();

      const abi = [
          "function balanceOf(address owner) view returns (uint256)",
          "function transfer(address to, uint amount) returns (bool)",
          "function approve(address spender, uint value) external returns (bool)"
      ];
      // const tokenUSDCSigner = await ethers.getSigner(TOKEN_BORROW_USDC);
      // const tokenUSDC = new ethers.Contract(TOKEN_BORROW_USDC, abi, tokenUSDCSigner);

      const tokenDAI = new ethers.Contract(DAI, abi, await ethers.getSigner(DAI));
      const daiWhileSigner= await ethers.getSigner(DAI_WHALE);

      //向USDC_WHALE转1个ether,用于支付交易手续费

      //把USDC_WHAL TOKEN转给测试合约
      const bal = await tokenDAI.balanceOf(DAI_WHALE);
      console.log("usdc whale balance:%s, fund:%s", bal, FUND_AMOUNT);
      await tokenDAI.connect(daiWhileSigner).transfer(testUniswapV2FlashSwap.address, FUND_AMOUNT);
      console.log("to testUniswapV2FlashSwap %s token", FUND_AMOUNT);
      // 执行flash swap
      const tx = await testUniswapV2FlashSwap.connect(daiWhileSigner).testFlashSwap(tokenDAI.address, BORROW_AMOUNT);

    });
  });
});
