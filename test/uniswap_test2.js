const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const BN = require('bn.js');
const { ethers,network } = require("hardhat");
const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const chainId = ChainId.MAINNET

describe("", function () {

  const mainnet_UniswapV2Router02_Address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const DAI_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';
  const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

  const AMOUNT_IN = new BN(10).pow(new BN(18)).mul(new BN(1000000));//
  const AMOUNT_OUT_IN = 1;
  const TO = "0xa894026777645913E829fB2AE3dCd6252ee13e01";

  describe("testxxx", function () {

    it("testcase: 3 path", async function () {

      const TestUniswap = await ethers.getContractFactory("TestUniswap");
      const testUniswap = await TestUniswap.deploy();
      await testUniswap.deployed();

      //冒充DAI_WHALE
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [DAI_WHALE]
        })
      const daiWhileSigner= await ethers.getSigner(DAI_WHALE);

      // console.log("0000",testUniswap);

      const tokenIn = await ethers.getContractAt("IERC20",DAI);
      const tokenOut = await ethers.getContractAt("IERC20",WBTC);

      console.log("11111");


      await tokenIn.connect(daiWhileSigner).approve(testUniswap.address, 10000);
      console.log("22222");
      const value2 = ethers.utils.parseUnits("2", "ether");
      const amountIn22 = ethers.utils.parseUnits("0.02", "ether");

      await testUniswap.connect(daiWhileSigner).swap(
        tokenIn.address,
        tokenOut.address,
        10,
        1,
        TO
        // ,
        // {
        //   from: DAI_WHALE
        // }
        );
        //视频里加from Error: Contract with a Signer cannot override from (operation="overrides.from", code=UNSUPPORTED_OPERATION, version=contracts/5.7.0)
        //去掉from    Error: VM Exception while processing transaction: reverted with reason string 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT'
      console.log("out", await tokenOut.balanceOf(TO));

    });
  });
});
