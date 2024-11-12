interface IQuoteExactInputSingleParams {
    tokenIn: string,
    tokenOut: string,
    amountIn: bigint,
    fee: string,
    sqrtPriceLimitX96: string
}

export default IQuoteExactInputSingleParams;