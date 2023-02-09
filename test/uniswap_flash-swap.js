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
      console.log('11111');
      //先把WETH转给测试合约，为兑换USDC做准备，因为要用有WETH，才能借USDC
      // const wethERC20 = await ethers.getContractAt("IERC20", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
      // await wethERC20.transfer(testUniswapV2FlashSwap.address, ethers.utils.parseEther('10'));
      //兑换和调用合约需要支付手续费
      // const [owner, addr1 , addr2] = await ethers.getSigners();
      // await owner.sendTransaction({
      //   to: testUniswapV2FlashSwap.address,
      //   value: ethers.utils.parseEther('3')
      // });
      console.log('22222');

      const usdcERC20 = await ethers.getContractAt("IERC20", BORROW_TOKEN_ADDR);
      // const tokenUSDC = new ethers.Contract(USDC, abi, await ethers.getSigner(USDC));

      const usdcWhaleSigner = await ethers.getSigner(USDC_WHALE);

      //先把USDC_WHAL USDC转给测试合约，
      // console.log("usdc whale balance:%s", await usdcERC20.balanceOf(USDC_WHALE));
      // await usdcERC20.connect(usdcWhaleSigner).transfer(testUniswapV2FlashSwap.address, BORROW_AMOUNT);
      // await usdcERC20.transfer(testUniswapV2FlashSwap.address, ethers.utils.parseEther('10'));
      console.log('3333');
      // 执行flash swap 贷款
      const tx = await testUniswapV2FlashSwap.connect(usdcWhaleSigner).testFlashSwap(usdcERC20.address, BORROW_AMOUNT);
      const receipt = await tx.wait();
      console.log(`Transaction was mined in block ${receipt.blockNumber}`);
    });
  });
});
