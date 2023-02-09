const BN = require('bn.js');
const { ethers,network } = require("hardhat");

describe("", function () {

  const USDC_WHALE = '0xf9211FfBD6f741771393205c1c3F6D7d28B90F03';

  const BORROW_AMOUNT = 1000000; //6位小数，代表1个USDC
  const BORROW_TOKEN_ADDR = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; //USDC

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

      const usdcERC20 = await ethers.getContractAt("IERC20", BORROW_TOKEN_ADDR);

      const usdcWhaleSigner = await ethers.getSigner(USDC_WHALE);

      //先把USDC_WHAL USDC转给测试合约，因为测试合约归还贷款的时候，需要 大约 3% * BORROW_AMOUNT 的USDC Token作为手续费
      await usdcERC20.connect(usdcWhaleSigner).transfer(testUniswapV2FlashSwap.address, 10000000);
      console.log("testUniswapV2FlashSwap.address usdc bal [%s]", await usdcERC20.balanceOf(testUniswapV2FlashSwap.address));

      // 执行flash swap 贷款
      const tx = await testUniswapV2FlashSwap.connect(usdcWhaleSigner).testFlashSwap(usdcERC20.address, BORROW_AMOUNT);
      const receipt = await tx.wait();
      console.log(`Transaction was mined in block ${receipt.blockNumber}`);
    });
  });
});
