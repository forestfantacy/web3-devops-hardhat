
const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers,network } = require("hardhat");

describe("", function () {

  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const DAI_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';
  const RECEIVER = '0x8C8D7C46219D9205f056f28fee5950aD564d7465';

  describe("testxxx", function () {
    it("testcase: check DAI_WHALE and RECEIVER of DAI", async function () {
        //根据地址获取 IERC20合约
        const daiToken = await ethers.getContractAt("IERC20",DAI);

        console.log("symbol:",await daiToken.symbol());
        console.log("balanceWhale:",await daiToken.balanceOf(DAI_WHALE));
        console.log("balanceReceiver:",await daiToken.balanceOf(RECEIVER));
    });
  });
});
