const {time,loadFixture,} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers,network } = require("hardhat");
const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

describe("", function () {
  const chainId = ChainId.MAINNET
  const mainnet_UniswapV2Router02_Address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const DAI_WHALE = '0xF977814e90dA44bFA03b6295A0616a897441aceC';
  const to = "0xa894026777645913E829fB2AE3dCd6252ee13e01";

  describe("testxxx", function () {

    it("testcase: DAI_WHALE send DAI to RECEIVE", async function () {

        //冒充DAI
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [DAI]
        })
        const daiToken = await ethers.getContractAt("IERC20",DAI);

        //冒充DAI_WHALE
        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [DAI_WHALE]
          })
        const daiWhileSigner= await ethers.getSigner(DAI_WHALE);

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [mainnet_UniswapV2Router02_Address]
            })
        const uniswapV2Router02Signer= await ethers.getSigner(mainnet_UniswapV2Router02_Address);

        //根据网络和地址获取DAI
        const provider = ethers.getDefaultProvider();
        const dai = await Fetcher.fetchTokenData(chainId, DAI, provider);
        //从sdk 直接取出主网的weth信息
        const weth = WETH[chainId];
        console.log("weth name:",weth.name,'addr:',weth.address);
       
        //定义交易对 用dai 换 weth
        const pair = await Fetcher.fetchPairData(dai, weth);
        console.log("pair liquidityToken:",pair.liquidityToken);

        //定义交易路径，这里的路径只有1个pair  输入eth，输出dai
        const route = new Route([pair],weth);

        // The mid price, in the context of Uniswap, is the price that reflects the ratio of reserves in one or more pairs. 
        // There are three ways we can think about this price. Perhaps most simply, 
        // it defines the relative value of one token in terms of the other. 
        // It also represents the price at which you could theoretically trade an infinitesimal amount (ε) of one token for the other. Finally, it can be interpreted as the current market-clearing or fair value price of the assets.
        console.log('route.midPrice',route.midPrice.toSignificant(6));

        //定义交易，输入1个ether
        const trade = new Trade(route, new TokenAmount(weth, "100000000000000000"), TradeType.EXACT_INPUT);
        //平均交易价格  the execution price of a trade, as the ratio of assets sent/received.The execution price represents the average DAI/WETH price for this trade.
        console.log('executionPrice',trade.executionPrice.toSignificant(6));
        //当前交易完成后的交易价格
        console.log('nextMidPrice',trade.nextMidPrice.toSignificant(6));
        //万分之五滑点
        const slippageTolerance = new Percent('50', '10000');
        //计算当前滑点下的换出的DAI最小值
        const minimumAmountOut = Math.floor(trade.minimumAmountOut(slippageTolerance).toExact());
        console.log("5/1000 slippageTolerance,minimumAmountOut:",minimumAmountOut);


        const minimumAmountOut2 = ethers.BigNumber.from(trade.minimumAmountOut(slippageTolerance).raw.toString());
        const amountOutMinHex = minimumAmountOut2.toHexString();
        console.log("minimumAmountOut2:",minimumAmountOut2,"amountOutMinHex",amountOutMinHex);

        const value22 = ethers.BigNumber.from(trade.inputAmount.raw.toString());
        const value22Hex = value22.toHexString();
        console.log("value22:",value22,"value22Hex",value22Hex);

        // const signer = new ethers.Wallet("PRIVATE_KEY");
        // const account = signer.connect(provider);

        //构造交易所router2合约
        const abi = [        
          "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)"
        ];
 
        const uniwap = new ethers.Contract(
          mainnet_UniswapV2Router02_Address,
          abi,
          daiWhileSigner
        );
 
        // eth =》 dai
        const path = [weth.address, dai.address];

        const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
        const value = ethers.utils.parseUnits("100", "ether");
        console.log("");
        console.log("swapExactETHForTokens: amountOutMin[%s],path[%s],to[%s],deadline[%s],value[%s]",minimumAmountOut,path,to,deadline,value);
        console.log("");
        console.log("before swap balanceWhale   :",await provider.getBalance(DAI_WHALE));
        console.log("before swap balanceReceiver:",await daiToken.balanceOf(to));
        const tx = await uniwap.swapExactETHForTokens(
          minimumAmountOut,
          path,
          to,
          deadline,
          { value }
        );
        console.log("after  swap balanceReceiver:",await daiToken.balanceOf(to));
        console.log("after  swap balanceWhale   :",await provider.getBalance(DAI_WHALE));
        const receipt = await tx.wait();
        console.log(`Transaction was mined in block ${receipt.blockNumber}`);
    });
  });
});
