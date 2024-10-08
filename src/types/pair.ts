import { TokenInterface } from "./token";

export interface PairInterface {
    id: string,
    combinedSymbol: string,
    token0: TokenInterface,
    token1: TokenInterface,
}