// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.6.6;

interface IUniswapV2Router {
      function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}