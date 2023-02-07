// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.6.6;

import "hardhat/console.sol";
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IERC20.sol';
import './interfaces/IUniswapV2Factory.sol';

contract TestUniswapV2FlashSwap is IUniswapV2Callee{

    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    address private constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    event Log(string message, uint val);

    function testFlashSwap(address _tokenBorrow, uint _amount) external {

        // 构造借出交易对
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenBorrow, WETH);
        // 当前池中必须有交易对
        require(pair != address(0), "!pair");

        // 得到token0、token1
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();

        // 得到换出token数量
        uint amount0Out = _tokenBorrow == token0 ? _amount : 0;
        uint amount1Out = _tokenBorrow == token1 ? _amount : 0;

        //不为空则触发闪电贷流程
        bytes memory data = abi.encode(_tokenBorrow, _amount);

        // 兑换 10个token，0个eth，把结果发给当前合约
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
    }

    // 回调接口
    function uniswapV2Call(
        address _sender,
        uint _amount0,
        uint _amount1,
        bytes calldata _data
    )external override{
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        address pair = IUniswapV2Factory(FACTORY).getPair(token0, token1);
        require(msg.sender == pair, "!pair");
        require(_sender == address(this), "!sender");

        (address _tokenBorrow, uint amount) = abi.decode(_data, (address, uint));

        uint fee = (amount * 3 / 997) + 1;
        uint amountToRepay = amount + fee;

        emit Log("amount", amount);
        emit Log("_amount0", _amount0);
        emit Log("_amount1", _amount1);
        emit Log("fee", fee);
        emit Log("amount to repay", amountToRepay);

        IERC20(_tokenBorrow).transfer(pair, amountToRepay);
    }
}