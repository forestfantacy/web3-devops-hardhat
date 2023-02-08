const { ethers,network } = require("hardhat");

describe("Lock", function () {
  describe("Swap", function () {
    it("Test flash loan swap", async function () {
      const [owner] = await ethers.getSigners();
      const AmountToSwap = ethers.utils.parseEther('10');
  
      const FlashLoanSwap = await ethers.getContractFactory("FlashLoanSwap");
      const flashLoanSwap = await FlashLoanSwap.deploy();

      //@uniswap/v2-periphery/contracts/interfaces/IWETH.sol
      const weth = await ethers.getContractAt("IWETH", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
      
      const flashLoanSwapSigner= await ethers.getSigner(flashLoanSwap.address);
      console.log("0 flashLoanSwapSigner.getBalance:",ethers.utils.formatEther(await flashLoanSwapSigner.getBalance()));
      // etherjs api： 转10个以太付gas
      await owner.sendTransaction({
        to: flashLoanSwap.address,
        value: AmountToSwap
      });
      console.log("1 flashLoanSwapSigner.getBalance:",ethers.utils.formatEther(await flashLoanSwapSigner.getBalance()));

      //发给flashLoanSwap N个WETH Token
      // 1：先发给调用者owner  N个WETH
      await weth.deposit({
        value: AmountToSwap
      });
      // 2.当前账户owner 给测试合约 转N个WETH
      await weth.transfer(flashLoanSwap.address, AmountToSwap);
      const wethERC20 = await ethers.getContractAt("IERC20", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
      const balanceBeforeSwap = await wethERC20.balanceOf(flashLoanSwap.address);

      // 测试逻辑
      await flashLoanSwap.testFlashSwap(AmountToSwap);
      const balanceAfterSwap = await wethERC20.balanceOf(flashLoanSwap.address);
      console.log("Making WETH -> USDT -> LINK -> WETH flashloan swap");
      console.log("Amount of WETH loan: ", AmountToSwap);
      console.log("Amount of WETH before swap: ", balanceBeforeSwap);
      console.log("Amount of WETH after swap: ", balanceAfterSwap);
      console.log("Amount before swap - amount after swap: ", balanceBeforeSwap.sub(balanceAfterSwap));
    });
  });
});
