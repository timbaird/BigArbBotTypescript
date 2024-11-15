interface IPriceData {
    direction: string,
    token0Amt: number,
    token0AmtWei: bigint,
    token1AmtWei: bigint,
    price: number
}

export default IPriceData;