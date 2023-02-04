const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers,network } = require("hardhat");

describe("", function () {

  const DAI_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const RECEIVE_ADDR = '0x8C8D7C46219D9205f056f28fee5950aD564d7465';
  let whaleSigner
  let receiveSigner 

  beforeEach(async () => {

    //冒充DAI_WHALE，
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE]
    })

    //获取私钥
    whaleSigner = await ethers.getSigner(DAI_WHALE);

    //无需冒充接收地址，因为不需要私钥，转账后的数据仅改变了forking
    receiveSigner = await ethers.getSigner(RECEIVE_ADDR);
  })

  describe("testxxx", function () {

    it("testcase: DAI_WHALE send 100 eth to RECEIVE", async function () {
      
      const provider = ethers.getDefaultProvider();
      // const provider = ethers.getDefaultProvider("goerli");
      console.log("network",provider.network.name);
      const [owner, addr1 , addr2] = await ethers.getSigners();

      //转账前余额
      console.log("1 whale.getBalance", ethers.utils.formatEther(await whaleSigner.getBalance()));
      console.log("1 recei.getBalance", ethers.utils.formatEther(await receiveSigner.getBalance()));

      //冒充转账
      const tx = await whaleSigner.sendTransaction({
        to: receiveSigner.address,
        value: ethers.utils.parseUnits("1000", "ether"),
      });

      //转账后余额
      console.log("2 whale.getBalance", ethers.utils.formatEther(await whaleSigner.getBalance()));
      console.log("2 recei.getBalance", ethers.utils.formatEther(await receiveSigner.getBalance()));


    
    });

    it("testcase: DAI_WHALE send 100 eth to RECEIVE", async function () {
          //   let daiToken = await ethers.getContractAt("IERC20",DAI);
    });
  });
});
