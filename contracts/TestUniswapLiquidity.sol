// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.6.6;

import './interfaces/IUniswapV2Router.sol';
import './interfaces/IUniswapV2Factory.sol';
import "hardhat/console.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IERC20.sol';

contract TestUniswapLiquidity{

    address private constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private constant ROUTERV2 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    event Log(string message, uint256 val);

    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external{
        IERC20 tokenA = IERC20(_tokenA);
        IERC20 tokenB = IERC20(_tokenB);

        tokenA.transferFrom(msg.sender, address(this), _amountA);
        tokenB.transferFrom(msg.sender, address(this), _amountB);
        console.log("TestUniswapLiquidity  _tokenA balanceOf",tokenA.balanceOf(address(this)));
        console.log("TestUniswapLiquidity  _tokenB balanceOf",tokenB.balanceOf(address(this)));

        tokenA.approve(ROUTERV2, _amountA);
        tokenB.approve(ROUTERV2, _amountB);

        (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router(ROUTERV2).addLiquidity(
            _tokenA,
            _tokenB,
            _amountA,
            _amountB,
            1,
            1,
            address(this),
            block.timestamp
        );
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);
        uint256 addLiquidity = IERC20(pair).balanceOf(address(this));
        console.log("addLiquidity:%s of %s",addLiquidity,pair);

        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
        emit Log("liquidity", liquidity);
    }

    function removeLiquidity(address _tokenA, address _tokenB
    ) external{

        //交易对
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);

        //流动性代币
        uint256 liquidity = IERC20(pair).balanceOf(address(this));

        //授权routerv2合约转移
        IERC20(pair).approve(ROUTERV2, liquidity);

        (uint256 amountA, uint256 amountB) = IUniswapV2Router(ROUTERV2).removeLiquidity(
            _tokenA,
            _tokenB,
            liquidity,
            1,
            1,
            address(this),
            block.timestamp
        );
        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
    }

    // 调用者没有payload回调
    receive() external payable {

    }

    // 调用者带有payload时回调
    fallback() external payable{

    }
}