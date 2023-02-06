// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.6.6;

import '@uniswap/v2-periphery/contracts/interfaces/IERC20.sol';
import './interfaces/IUniswapV2Router.sol';
import "hardhat/console.sol";

contract TestUniswap{

    address private constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _to
    ) external {
        
        //从调用者账号转移到当前合约
        IERC20 tokenIn = IERC20(_tokenIn);
        console.log("before tokenIn balanceOf",tokenIn.balanceOf(address(this)));
        tokenIn.transferFrom(msg.sender, address(this), _amountIn);
        console.log("after  tokenIn balanceOf",tokenIn.balanceOf(address(this)));

        // 授权uniswap routerv2 合约能够转出调用者账号的token，后续 routerv2 将使用 transfer(someone,ammount) 转出
        tokenIn.approve(UNISWAP_V2_ROUTER, _amountIn);

        address[] memory path;
        path = new address[](3);
        path[0] = _tokenIn;
        path[1] = WETH;
        path[2] = _tokenOut;

        console.log("_amountIn:[%s],_amountOutMin:[%s],_to:[%s]", _amountIn, _amountOutMin, _to);
        // 调用主网routerv2合约进行交易
        IUniswapV2Router(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
            _amountIn,
            1,
            path,
            _to,
            block.timestamp
        );
    }
}


