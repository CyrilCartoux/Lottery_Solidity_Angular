export class EthUtils {
    /**
     * Converts WEI to ETH
     * @param a_value number in WEI
     * @returns number in ETH
     */
    public static fromWeiToEth(a_value: number):number {
        return a_value/1e18;
    }
    /**
     * Converts ETH to WEI
     * @param a_value number in ETH
     * @returns number in WEI
     */
    public static fromEthToWei(a_value: number):number {
        return a_value*1e18;
    }
}