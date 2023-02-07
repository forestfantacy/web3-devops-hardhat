const BN = require('bn.js');
const { ethers,network } = require("hardhat");

describe("", function () {

  const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const USDC_WHALE = '0xf9211FfBD6f741771393205c1c3F6D7d28B90F03';

  const FUND_AMOUNT = 1000000; //贷款资金
  const BORROW_AMOUNT = 2000000; //贷款代币

  describe("testxxx", function () {

    it("testcase: 3 path", async function () {

      //冒充DAI_WHALE
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [USDC_WHALE]
        })

      const TestUniswapV2FlashSwap = await ethers.getContractFactory("TestUniswapV2FlashSwap");
      const testUniswapV2FlashSwap = await TestUniswapV2FlashSwap.deploy();
      await testUniswapV2FlashSwap.deployed();

      const abi = [
          "function balanceOf(address owner) view returns (uint256)",
          "function transfer(address to, uint amount) returns (bool)"
      ];

      const tokenUSDC = new ethers.Contract(USDC, abi, await ethers.getSigner(USDC));
      const usdcWhaleSigner= await ethers.getSigner(USDC_WHALE);

      //向USDC_WHALE转1个ether,用于支付交易手续费

      //把USDC_WHAL TOKEN转给测试合约
      const bal = await tokenUSDC.balanceOf(USDC_WHALE);
      console.log("usdc whale balance:%s, fund:%s", bal, FUND_AMOUNT);
      await tokenUSDC.connect(usdcWhaleSigner).transfer(testUniswapV2FlashSwap.address, FUND_AMOUNT);
      console.log("to testUniswapV2FlashSwap %s token", FUND_AMOUNT);
      // 执行flash swap
      const tx = await testUniswapV2FlashSwap.connect(usdcWhaleSigner).testFlashSwap(tokenUSDC.address, BORROW_AMOUNT);
      const receipt = await tx.wait();
      console.log(`Transaction was mined in block ${receipt.blockNumber}`);
    });
  });
});
