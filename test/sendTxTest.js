const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers,network } = require("hardhat");

describe("", function () {

  const DAI_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const RECEIVE_ADDR = '0x8C8D7C46219D9205f056f28fee5950aD564d7465';

  beforeEach(async () => {
  })

  describe("testxxx", function () {

    it("testcase: DAI_WHALE send 100 eth to RECEIVE", async function () {
      
      const provider = ethers.getDefaultProvider();
      // const provider = ethers.getDefaultProvider("goerli");
      console.log("network",provider.network.name);

      //冒充DAI_WHALE，
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [DAI_WHALE]
      })

      const [owner, addr1 , addr2] = await ethers.getSigners();

      console.log("own:%s,addr1:%s,addr2:%s",owner,addr1,addr2);
 
      //获取私钥
      let whaleSigner = await ethers.getSigner(DAI_WHALE);
      let receiveSigner = await ethers.getSigner(RECEIVE_ADDR);

      //余额
      console.log("1 whale.getBalance", ethers.utils.formatEther(await whaleSigner.getBalance()));
      console.log("1 recei.getBalance", ethers.utils.formatEther(await provider.getBalance(RECEIVE_ADDR)));

      //冒充转账
      const tx = await whaleSigner.sendTransaction({
        to: RECEIVE_ADDR,
        value: ethers.utils.parseUnits("1000", "ether"),
      });
      //查余额
      console.log("2 whale.getBalance", ethers.utils.formatEther(await whaleSigner.getBalance()));
      console.log("2 recei.getBalance", ethers.utils.formatEther(await provider.getBalance(RECEIVE_ADDR)));

    //   let daiToken = await ethers.getContractAt("IERC20",DAI);

    //   console.log("DAI_WHALE beforeTransBal",await daiToken.balanceOf(DAI_WHALE));
    //   console.log("RECEIVE_ADDR beforeTransBal",await provider.getBalance(RECEIVE_ADDR));
    //   daiToken.connect(whale).transfer(RECEIVE_ADDR,ethers.utils.parseUnits("10", "ether"));
    //   console.log("DAI_WHALE afterTransBal",await daiToken.balanceOf(DAI_WHALE));
    //   console.log("RECEIVE_ADDR afterTransBal",await provider.getBalance(RECEIVE_ADDR));
    });
  });
});
