const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const BN = require('bn.js');
const { ethers,network } = require("hardhat");
const { ChainId, Fetcher, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const chainId = ChainId.MAINNET

describe("", function () {

  const mainnet_UniswapV2Router02_Address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const DAI_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';

  const USDC_WHALE = '0x1B7BAa734C00298b9429b518D621753Bb0f6efF2';
  const TOKEN_BORROW_USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const DECIMALS = 6;
  const FUND_AMOUNT = 1000000; //贷款资金
  const BORROW_AMOUNT = 2000000; //贷款代币

  const AMOUNT_18 = ethers.utils.parseUnits("1", "ether");//
  // const AMOUNT_18 = new BN(10).pow(new BN(18)).mul(new BN(1000000));//
  const AMOUNT_OUT_IN = 1;
  const TO = "0xa894026777645913E829fB2AE3dCd6252ee13e01";

  describe("testxxx", function () {

    it("testcase: 3 path", async function () {

      //冒充DAI_WHALE
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [USDC_WHALE]
        })

      const provider = ethers.getDefaultProvider();
      const TestUniswapV2FlashSwap = await ethers.getContractFactory("TestUniswapV2FlashSwap");
      const testUniswapV2FlashSwap = await TestUniswapV2FlashSwap.deploy();
      await testUniswapV2FlashSwap.deployed();

      const [owner, otherAccount] = await ethers.getSigners();

      const abi = [
          "function balanceOf(address owner) view returns (uint256)",
          "function decimals() view returns (uint8)",
          "function symbol() view returns (string)",
          "function transfer(address to, uint amount) returns (bool)",
          "function transferFrom(address from, address to, uint value) external returns (bool)",
          "function allowance(address owner, address spender) external view returns (uint)",
          "function approve(address spender, uint value) external returns (bool)",
          "event Transfer(address indexed from, address indexed to, uint amount)"
      ];
      const tokenUSDCSigner = await ethers.getSigner(TOKEN_BORROW_USDC);
      const tokenUSDC = new ethers.Contract(TOKEN_BORROW_USDC, abi, tokenUSDCSigner);

      //向USDC_WHALE转1个ether,用于支付交易手续费

      //把USDC_WHAL TOKEN转给测试合约
      const bal = await tokenUSDC.balanceOf(USDC_WHALE);
      console.log("usdc whale balance:%s, fund:%s", bal, FUND_AMOUNT);
      await tokenUSDC.connect(tokenUSDCSigner).transfer(testUniswapV2FlashSwap.address, FUND_AMOUNT);

      // 执行flash swap
      const tx = await testUniswapV2FlashSwap.connect(USDC_WHALE).testFlashSwap(tokenUSDCSigner.address, BORROW_AMOUNT);

    });
  });
});
