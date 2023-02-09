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

    function testFlashSwap(address borrowToken, uint amount) external {

        // 构造借出交易对 USDC-WETH
        address pair = IUniswapV2Factory(FACTORY).getPair(borrowToken, WETH);
        // 当前池中必须有交易对
        require(pair != address(0), "!pair");

        // 构建token0、token1 
        address token0 = IUniswapV2Pair(pair).token0(); //USDC
        address token1 = IUniswapV2Pair(pair).token1(); //WETH

        // 构建换出token数量   
        uint amount0Out = borrowToken == token0 ? amount : 0; //_amount
        uint amount1Out = borrowToken == token1 ? amount : 0; //0

        console.log("pair [%s], token0 [%s] token1 [%s]", pair, token0, token1);
        console.log("amount0Out [%s] amount1Out [%s]", amount0Out, amount1Out);
        
        //不为空则触发闪电贷流程
        bytes memory data = abi.encode(borrowToken, amount);

        /**
         * 交易对借出指定数量USDC放到当前合约地址
         * @param _sender 交易对
         * @param _amount0  _amount
         * @param _amount1  0  有可能同时为空或者同时有值吗？
         * @param _data 
         */
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
        // IUniswapV2Pair(pair).swap(1000 * 1000000, 0, address(this), data); // 借1000个USDC并发给当前合约
        // IUniswapV2Pair(pair).swap(1000000, 1000000, address(this), data); //amount0Out amount1Out 都有值是啥意思？
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
        // 确认回调发起者是当前合约地址
        require(_sender == address(this), "!sender");

        (address borrowToken, uint amount) = abi.decode(_data, (address, uint));

        console.log("cur contract [%s] has borrow [%s] USDC", address(this), IERC20(borrowToken).balanceOf(address(this)));

        // 3%
        uint fee = (amount * 3 / 997) + 1;
        // 归还金额加上手续费
        uint amountToRepay = amount + fee;

        console.log("amount [%s] fee[%s] ", amount, fee);
        emit Log("borrow amount", amount);
        emit Log("_amount0", _amount0);
        emit Log("_amount1", _amount1);
        emit Log("fee", fee);
        emit Log("amount to repay", amountToRepay);

        // 当前合约把 USDC 还给交易对
        IERC20(borrowToken).transfer(pair, amountToRepay);

        // 如果不还怎么检查并报错 UniswapV2: INSUFFICIENT_INPUT_AMOUNT
    }
        // 调用者没有payload回调
    receive() external payable {

    }

    // 调用者带有payload时回调
    fallback() external payable{

    }

}