
const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers,network } = require("hardhat");

describe("", function () {

  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const DAI_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';
  const RECEIVER = '0x8C8D7C46219D9205f056f28fee5950aD564d7465';

  describe("testxxx", function () {

    it("testcase: DAI_WHALE send DAI to RECEIVE", async function () {

        //冒充DAI
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [DAI]
        })
    
        //冒充DAI_WHALE
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [DAI_WHALE]
            })
        const daiWhileSigner= await ethers.getSigner(DAI_WHALE);

        //IERC20 接口
        const abi = [
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",
            "function transfer(address to, uint amount) returns (bool)",
            "function transferFrom(address from, address to, uint value) external returns (bool)",
            "function allowance(address owner, address spender) external view returns (uint)",
            "function approve(address spender, uint value) external returns (bool)",
            "event Transfer(address indexed from, address indexed to, uint amount)"
        ];

        const provider = ethers.getDefaultProvider();
        //当前测试用例的执行账户
        const [owner] = await ethers.getSigners();

        // Read-Write; By connecting to a Signer, allows:
        // - Everything from Read-Only (except as Signer, not anonymous)
        // - Sending transactions for non-constant functions
        //根据地址/abi/冒充拥有者 获取DAI合约 
        const erc20_rw = new ethers.Contract(DAI, abi, await ethers.getSigner(DAI));
        
        console.log("before transform balanceWhale   :",await erc20_rw.balanceOf(DAI_WHALE));
        console.log("before transform balanceReceiver:",await erc20_rw.balanceOf(RECEIVER));

        // 直接转账 转出账户：调用者WHALE    目标账户：RECEIVER
        await erc20_rw.connect(daiWhileSigner).transfer( RECEIVER, 200 );

        // 安全转账：调用者账户DAI_WHALE：授权1000 转出账户：DAI_WHALE  授权账户：owner  RECEIVER   
        //_approve(WHALE , owner , amount);
        await erc20_rw.connect(daiWhileSigner).approve(owner.address,1000);
        // 调用者账户owner：安全转账100 转出账户：DAI_WHALE    目标账户：RECEIVER 
        await erc20_rw.connect(owner).transferFrom( DAI_WHALE, RECEIVER, 100 );

        console.log("after  transform balanceWhale   :",await erc20_rw.balanceOf(DAI_WHALE));
        console.log("after  transform balanceReceiver:",await erc20_rw.balanceOf(RECEIVER));
    });
  });
});
