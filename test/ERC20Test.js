
const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers,network } = require("hardhat");

describe("", function () {

  const DAI_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const RECEIVER = '0x8C8D7C46219D9205f056f28fee5950aD564d7465';
  let daiSigner

  beforeEach(async () => {

    //冒充DAI
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI]
    })

    //获取私钥
    daiSigner = await ethers.getSigner(DAI);
  })

  describe("testxxx", function () {

    it("testcase: DAI_WHALE send DAI to RECEIVE_ADDR", async function () {
        const daiToken = await ethers.getContractAt("IERC20",DAI);
        const balanceWhale = await daiToken.balanceOf(DAI_WHALE);
        const balanceReceiver = await daiToken.balanceOf(RECEIVER);
        console.log("balanceWhale:",balanceWhale);
        console.log("balanceReceiver:",balanceReceiver);
    });
  });
});
