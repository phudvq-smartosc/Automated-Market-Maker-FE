import { TokenInterface } from "./token";

export interface TokenPair {
    tokenPairInfo: TokenAmountInfo[];
}
export interface TokenAmountInfo {
    tokenInterface: TokenInterface,
    amount: string,
}
