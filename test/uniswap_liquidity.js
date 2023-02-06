const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const BN = require('bn.js');
const { ethers,network } = require("hardhat");
const { ChainId, Fetcher, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const chainId = ChainId.MAINNET

describe("", function () {

  const mainnet_UniswapV2Router02_Address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const DAI_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';

  const WETH_WHALE = '0xed1840223484483c0cb050e6fc344d1ebf0778a9';


  const AMOUNT_18 = ethers.utils.parseUnits("1", "ether");//
  // const AMOUNT_18 = new BN(10).pow(new BN(18)).mul(new BN(1000000));//
  const AMOUNT_OUT_IN = 1;
  const TO = "0xa894026777645913E829fB2AE3dCd6252ee13e01";

  describe("testxxx", function () {

    it("testcase: 3 path", async function () {
      const provider = ethers.getDefaultProvider();
      const TestUniswapLiquidity = await ethers.getContractFactory("TestUniswapLiquidity");
      const testUniswapLiquidity = await TestUniswapLiquidity.deploy();
      await testUniswapLiquidity.deployed();

      const [owner, otherAccount] = await ethers.getSigners();
      const CALLER = owner;

      const TOKEN_A_AMOUNT = AMOUNT_18;
      const TOKEN_B_AMOUNT = AMOUNT_18;

      //WETH_WHALE
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [WETH_WHALE]
        })

      //冒充DAI_WHALE
      await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE]
      })


      // await network.provider.request({
      //   method: "hardhat_impersonateAccount",
      //   params: [mainnet_UniswapV2Router02_Address]
      //   })

      const wethWhileSigner= await ethers.getSigner(WETH_WHALE);
      const daiWhileSigner= await ethers.getSigner(DAI_WHALE);


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
      const tokenWETH = new ethers.Contract(WETH, abi, await ethers.getSigner(WETH));
      const tokenDAI = new ethers.Contract(DAI, abi, await ethers.getSigner(DAI));

      console.log("====== 000 ======");
      //给WETH巨鲸账号转ether用于支付交易手续费

      await daiWhileSigner.sendTransaction({
        // to: wethWhileSigner.address,
        // to: '0x8C8D7C46219D9205f056f28fee5950aD564d7465',
        to: '0xed1840223484483c0cb050e6fc344d1ebf0778a9',
        value: ethers.utils.parseUnits("1000", "ether"),
      });

      console.log("TOKEN_A_WHALE:[%s] [%s]",WETH_WHALE,await provider.getBalance(WETH_WHALE));
      console.log("TOKEN_B_WHALE:[%s] [%s]",DAI_WHALE,await provider.getBalance(DAI_WHALE));

      // // 先把巨鲸账号中的AB转给CALLER
      // await tokenDAI.connect(daiWhileSigner).transfer('0x8C8D7C46219D9205f056f28fee5950aD564d7465', 100);

      // console.log("====== 111 ======");
      // await tokenWETH.connect(wethWhileSigner).transfer('0x8C8D7C46219D9205f056f28fee5950aD564d7465', 100);

      // console.log("====== 222 ======");
      // // CALLER 授权测试合约转移
      // await tokenWETH.connect(CALLER).approve(testUniswapLiquidity.address, 100);
      // await tokenDAI.connect(CALLER).approve(testUniswapLiquidity.address, 100);
      // console.log("====== 333 ======");
      // let tx = await testUniswapLiquidity.connect(CALLER).addLiquidity(
      //   tokenWETH.address,
      //   tokenDAI.address,
      //   100,
      //   100
      // );
      // console.log("====== add liquidity ======");
      // for(const log of tx.logs){
      //   console.log(`${log.args.messge} ${log.args.val}`);
      // }

      // tx = await testUniswapLiquidity.connect(CALLER).removeLiquidity(
      //   tokenWETH.address,
      //   tokenDAI.address
      // );

      // console.log("====== remove liquidity ======");
      // for(const log of tx.logs){
      //   console.log(`${log.args.messge} ${log.args.val}`);
      // }




    });
  });
});
