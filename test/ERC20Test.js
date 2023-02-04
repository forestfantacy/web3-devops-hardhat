
const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers,network } = require("hardhat");

describe("", function () {

  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const DAI_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';
  const RECEIVER = '0x8C8D7C46219D9205f056f28fee5950aD564d7465';

  let daiToken
  let daiWhileAddr
  let receiveAddr


  beforeEach(async () => {

    //冒充DAI
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI]
    })
    daiToken = await ethers.getContractAt("IERC20",DAI);

    daiWhileSigner= await ethers.getSigner(DAI_WHALE);
    receiveSigner = await ethers.getSigner(RECEIVER);
  })

  describe("testxxx", function () {
    it("testcase: check DAI_WHALE and RECEIVER of DAI", async function () {
        console.log("balanceWhale:",await daiToken.balanceOf(DAI_WHALE));
        console.log("balanceReceiver:",await daiToken.balanceOf(RECEIVER));
    });
    it("testcase: DAI_WHALE send DAI to RECEIVE", async function () {
        daiToken.transferFrom(address(daiWhileSigner.address, receiveAddr.address, 100);
        console.log("after transform balanceWhale:",await daiToken.balanceOf(DAI_WHALE));
        console.log("after transform balanceReceiver:",await daiToken.balanceOf(RECEIVER));
    });
  });
});
