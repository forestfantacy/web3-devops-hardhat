const BN = require('bn.js');
const { ethers,network } = require("hardhat");

describe("", function () {

  const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const USDC_WHALE = '0xf9211FfBD6f741771393205c1c3F6D7d28B90F03';

  const FUND_AMOUNT = 1000000; //6位小数
  const HYPOTHECATED_USDC_AMOUNT = 2000000; 

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

      //先把USDC_WHAL USDC转给测试合约，
      console.log("usdc whale balance:%s, fund:%s", await tokenUSDC.balanceOf(USDC_WHALE), FUND_AMOUNT);
      await tokenUSDC.connect(usdcWhaleSigner).transfer(testUniswapV2FlashSwap.address, FUND_AMOUNT);
      console.log("usdc whale transfer to testUniswapV2FlashSwap %s usdc", FUND_AMOUNT);

      // 执行flash swap 质押
      const tx = await testUniswapV2FlashSwap.connect(usdcWhaleSigner).testFlashSwap(tokenUSDC.address, HYPOTHECATED_USDC_AMOUNT);
      const receipt = await tx.wait();
      console.log(`Transaction was mined in block ${receipt.blockNumber}`);
    });
  });
});
