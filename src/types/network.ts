import { Contract, ethers } from "ethers";

export interface Network {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  coins: any[]; // You might want to define a more specific type here
  chainID: number | null;
  router: Contract | null;
  factory: Contract | null;
  weth: string | null;
}
