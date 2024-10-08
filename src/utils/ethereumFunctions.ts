import { Contract, ethers } from "ethers";
import * as chains from "./chains";

import ROUTER from "../build/ZuniswapV2Router.sol/ZuniswapV2Router.json";
import LIBRARY from "../build/ZuniswapV2Library.sol/ZuniswapV2Library.json";
import PAIR from "../build/ZuniswapV2Pair.sol/ZuniswapV2Pair.json";
import ERC20 from "../build/ERC20.sol/ERC20.json";
import FACTORY from "../build/ZuniswapV2Factory.sol/ZuniswapV2Factory.json";
import { DEFAULT_USER_BALANCE } from "./defaultValue";

export function getProvider(): ethers.providers.Web3Provider {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  console.log("provider", provider)
  return provider;
}
export function getWallet(provider: ethers.providers.Web3Provider) {
  const wallet = new ethers.Wallet(import.meta.env.VITE_LOCAL_PRIVATE_KEY, provider);
  return wallet
}
export const connectWallet = async () => {
  const accounts = await window.ethereum!.request({ method: 'eth_requestAccounts' });
  alert(`Connect Wallet Accounts ${accounts}`)
}
export async function getSigners(provider: ethers.providers.Web3Provider) {
  return provider.getSigner();
}
export async function getNetwork(
  provider: ethers.providers.Web3Provider,
): Promise<number> {
  const network = await provider.getNetwork();
  return network.chainId;
}
export async function checkNetwork(provider: ethers.providers.Web3Provider) {
  const chainId = await getNetwork(provider);
  if (chains.networks.includes(chainId)) {
    return true;
  }
  return false;
}
export async function getAccount() {
  try {
    console.log("Into GetAccount function")
    const accounts = (await window.ethereum!.request({
      method: "eth_requestAccounts",
    })) as string[] | undefined;

    if (accounts && accounts.length > 0) {
      const defaultAccount = import.meta.env.VITE_USER_ADDRESS;
      if (defaultAccount in accounts) {
        return defaultAccount
      }
      return accounts[0];
    } else {
      alert("No account found");
      return null;
    }
  } catch (error) {
    // alert(`Reject to get account as ${error}`);
    console.log("Error", error)
    return null;
  }
}
export function getFactory(address: string, signer: ethers.Signer) {
  return new Contract(address, FACTORY.abi, signer);
}
export function getRouter(address: string, signer: ethers.Signer) {
  return new Contract(address, ROUTER.abi, signer);
}
export function getLibrary(address: string, signer: ethers.Signer) {
  return new Contract(address, LIBRARY.abi, signer);
}
export function getPair(address: string, signer: ethers.Signer) {
  return new Contract(address, PAIR.abi, signer);
}
export function getERC20(address: string, signer: ethers.Signer) {
  return new Contract(address, ERC20.abi, signer);
}
export async function getDecimals(tokenERC20: Contract): Promise<number> {
  try {
    const decimals: number = await tokenERC20.decimals();
    return decimals;
  } catch (error) {
    console.log("Get Decimal Error", error)
    return 0;
  }
}
export function doesTokenExist(address: string, signer: ethers.Signer) {
  try {
    return new Contract(address, ERC20.abi, signer);
  } catch {
    alert(`Token doesn't exist ${address}`);
    return false;
  }
}

//NOTE: For swap preview price
//This function returns the conversion rate between two token addresses
//    `address1` - An Ethereum address of the token to swaped from (either a token or AUT)
//    `address2` - An Ethereum address of the token to swaped to (either a token or AUT)
//    `amountIn` - Amount of the token at address 1 to be swaped from
//    `routerContract` - The router contract to carry out this swap
export async function getAmountOut(
  addressToken1: string,
  addressToken2: string,
  amountIn: string,
  routerContract: Contract,
) {
  try {
    if (!isValidAddress(addressToken1) || !isValidAddress(addressToken2)) {
      return 0;
    }

    const values_out = await routerContract.callStatic.getAmountsOut(
      ethers.utils.parseEther(amountIn),
      [addressToken1, addressToken2],
    );

    const amount_out = ethers.utils.formatEther(values_out[1]);
    return Number(amount_out);
  } catch (error) {
    console.log("Error", error)
    return 0;
  }
}
export async function swapTokens(
  routerContract: Contract,

  addressToken1: string,
  addressToken2: string,

  addressAccount: string,

  amount: string,

  signer: ethers.Signer,
) {
  const tokens: string[] = [addressToken1, addressToken2];

  const token1Contract = new Contract(addressToken1, ERC20.abi, signer);

  const tokenDecimals: number = await getDecimals(token1Contract);
  console.log("Token Decimal", tokenDecimals)
  const amountIn = ethers.utils.parseUnits(amount, tokenDecimals);
  console.log("amount In", amountIn)

  const amountOut = await routerContract.getAmountsOut(amountIn, tokens);
  await token1Contract.approve(routerContract.address, amountIn);
  await routerContract.swapExactTokensForTokens(
    amountIn,
    amountOut[1],
    tokens,
    addressAccount
  );
  console.log("Done Swapping")
}

// This function calls the pair contract to fetch the reserves stored in a the liquidity pool between the token of address1 and the token
// of address2. Some extra logic was needed to make sure that the results were returned in the correct order, as
// `pair.getReserves()` would always return the reserves in the same order regardless of which order the addresses were.
//    `address1` - An Ethereum address of the token to trade from (either a ERC20 token or AUT)
//    `address2` - An Ethereum address of the token to trade to (either a ERC20 token or AUT)
//    `pair` - The pair contract for the two tokens
export async function fetchReserves(
  addressToken1: string,
  addressToken2: string,
  pairContract: Contract,
  signer: ethers.Signer,
) {

  try {

    // Get decimals for each coin
    const coin1 = new Contract(addressToken1, ERC20.abi, signer);
    const coin2 = new Contract(addressToken2, ERC20.abi, signer);

    const coin1Decimals = await getDecimals(coin1);
    const coin2Decimals = await getDecimals(coin2);

    // Get reserves
    const reservesRaw = await pairContract.callStatic.getReserves();

    // Put the results in the right order
    const results = [
      (await pairContract.token0()) === addressToken1 ? reservesRaw[0] : reservesRaw[1],
      (await pairContract.token1()) === addressToken2 ? reservesRaw[1] : reservesRaw[0],
    ];

    // Scale each to the right decimal place
    return [
      (results[0] * 10 ** (-coin1Decimals)),
      (results[1] * 10 ** (-coin2Decimals))
    ]
  } catch (err) {
    console.log("error!");
    console.log(err);
    return [0, 0];
  }

}
// This function returns an object with 2 fields: `balance` which container's the account's balance in the particular token,
// and `symbol` which is the abbreviation of the token name. To work correctly it must be provided with 4 arguments:
//    `accountAddress` - An Ethereum address of the current user's account
//    `address` - An Ethereum address of the token to check for (either a token or AUT)
//    `provider` - The current provider
//    `signer` - The current signer

type BalanceAndSymbolReturn = {
  balance: number
  symbol: string,
}
export async function getBalanceAndSymbol(
  accountAddress: string,
  address: string,
  signer: ethers.Signer,
) {
  try {
    const token = new Contract(address, ERC20.abi, signer);
    console.log("Token", token)
    const tokenDecimals = await getDecimals(token);
    const balanceRaw = await token.balanceOf(accountAddress);
    const symbol = await token.symbol();

    const result: BalanceAndSymbolReturn = { balance: balanceRaw * 10 ** (-tokenDecimals), symbol: symbol }
    return result;

  } catch {
    alert('The getBalanceAndSymbol function had an error!');
    return false;
  }
}

export async function isERC20Token(address: string, signer: ethers.Signer) {
  try {
    if (!ethers.utils.isAddress(address)) {
      return false;
    }
    const contract = new Contract(address, ERC20.abi, signer);

    const totalSupply = await contract.totalSupply();

    return totalSupply !== undefined && totalSupply.gt(0);
  } catch {
    alert(`Token doesn't exist ${address}`);
    return false;
  }
}
export function isValidAddress(address: string) {
  if (!ethers.utils.isAddress(address)) {
    return false;
  }
  return true;

}
export async function getBalance(
  accountAddress: string,
  tokenAddress: string,
  signer: ethers.Signer,
): Promise<number> {

  try {
    const token = new Contract(tokenAddress, ERC20.abi, signer);

    const tokenDecimals = await getDecimals(token);
    
    const balanceRaw = await token.balanceOf(accountAddress);

    const balanceString = (balanceRaw * 10 ** (-tokenDecimals));

    return balanceString;

  } catch (error) {

    alert('EthereumFunction: getBalance had an error!');
    console.log("Error", error)
    return DEFAULT_USER_BALANCE;
  }
}
export async function getSymbol(
  address: string,
  signer: ethers.Signer,
) {
  try {
    const token = new Contract(address, ERC20.abi, signer);
    const symbol = await token.symbol();

    return {
      symbol: symbol,
    };

  } catch (error) {
    alert(`The getSymbol function had an error! ${error}`);
    console.log(error)
    return false;
  }
}
export async function getLatestBlock(provider: ethers.providers.Web3Provider) {
  const latestBlock = await provider.getBlock("latest");
  alert(`Latest Block ${latestBlock.number}`);
}

export async function getPairByTokensAddress(address1: string, address2: string, factory: Contract): Promise<boolean> {
  const pairAddress: string = await factory.pairs(address1, address2);
  if (pairAddress !== '0x0000000000000000000000000000000000000000') {
    return true;
  }
  return false;
  // const pair = new Contract(pairAddress, PAIR.abi, signer);
  // if 
}
// This function returns the reserves stored in a the liquidity pool between the token of address1 and the token
// of address2, as well as the liquidity tokens owned by accountAddress for that pair.
//    `address1` - An Ethereum address of the token to trade from (either a token or AUT)
//    `address2` - An Ethereum address of the token to trade to (either a token or AUT)
//    `factory` - The current factory
//    `signer` - The current signer
export async function getReserves(
  address1: string,
  address2: string,
  factory: Contract,
  signer: ethers.Signer,
  accountAddress: string,
) {
  // console.log("Address 1:", address1);
  // console.log("Address 2:", address2);
  // console.log("Factory Contract Address:", factory.address); // Assuming factory has an address property
  // console.log("Address 1:", signer);
  // console.log("Address 2:", accountAddress);

  try {
    const pairAddress: string = await factory.pairs(address1, address2);
    const pair = new Contract(pairAddress, PAIR.abi, signer);

    if (pairAddress !== '0x0000000000000000000000000000000000000000') {

      const reservesRaw = await fetchReserves(address1, address2, pair, signer);
      const liquidityTokens_BN: ethers.BigNumber = await pair.balanceOf(accountAddress);
      const liquidityTokens: number = Number(ethers.utils.formatEther(liquidityTokens_BN));

      return {
        token0: Number(reservesRaw[0].toPrecision(6)),
        token1: Number(reservesRaw[1].toPrecision(6)),
        liquidityTokens,
      };
    } else {
      // alert("no reserves yet");
      return { token0: 0, token1: 0, liquidityTokens: 0 };
    }
  } catch (err) {
    alert("error!");
    console.log(err);
    return { token0: 0, token1: 0, liquidityTokens: 0 };
  }
}

export async function getAmountIn(
  addressToken1: string,
  addressToken2: string,
  amountOut: string,
  routerContract: Contract): Promise<number> {
  try {
    if (!isValidAddress(addressToken1) || !isValidAddress(addressToken2)) {
      return 0;
    }

    const values_in = await routerContract.callStatic.getAmountsIn(
      ethers.utils.parseEther(amountOut),
      [addressToken1, addressToken2],
    );

    const amount_in = ethers.utils.formatEther(values_in[0]);

    return Number(amount_in);
    
  } catch (error) {
    console.log("Error", error)
    return 0;
  }
}
export async function AddLiquidity(
  addressToken1: string,
  addressToken2: string,
  amount1Desired: string,
  amount2Desired: string,
  amount1min: string,
  amount2min: string,
  routerContract: Contract,
  account: string,
  signer: ethers.Signer
) {
  try {
    const token1 = new Contract(addressToken1, ERC20.abi, signer);
    const token2 = new Contract(addressToken2, ERC20.abi, signer);

    const token1Decimals = await getDecimals(token1);
    const token2Decimals = await getDecimals(token2);

    const amountIn1Desired = ethers.utils.parseUnits(amount1Desired, token1Decimals);
    const amountIn2Desired = ethers.utils.parseUnits(amount2Desired, token2Decimals);

    const amountIn1Min = ethers.utils.parseUnits(amount1min, token1Decimals);
    const amountIn2Min = ethers.utils.parseUnits(amount2min, token2Decimals);

    await token1.approve(routerContract.address, amountIn1Desired);
    await token2.approve(routerContract.address, amountIn2Desired);
    console.log([
      addressToken1,
      addressToken2,
      amountIn1Desired,
      amountIn2Desired,
      amountIn1Min,
      amountIn2Min,
      account,
    ]);
    routerContract.addLiquidity(
      addressToken1,
      addressToken2,
      amountIn1Desired,
      amountIn2Desired,
      amountIn1Min,
      amountIn2Min,
      account
    )
  } catch (error) {
    console.log("Error in Add Liquidity function: ", error)
  }
}
export async function BurnLiquidity(
  addressToken1: string,
  addressToken2: string,
  liquidityAmount: string,
  amount1min: string,
  amount2min: string,
  routerContract: Contract,
  account: string,
  signer: ethers.Signer,
  factory: Contract
) {
  try {
    const token1 = new Contract(addressToken1, ERC20.abi, signer);
    const token2 = new Contract(addressToken2, ERC20.abi, signer);

    const token1Decimals = await getDecimals(token1);
    const token2Decimals = await getDecimals(token2);
    const Getliquidity = (liquidityAmount: number)=>{
      if (liquidityAmount < 0.001){
        return ethers.BigNumber.from(liquidityAmount*10**18);
      }
      return ethers.utils.parseUnits(String(liquidityAmount), 18);
    }
    const liquidity = Getliquidity(Number(liquidityAmount));
    console.log('liquidity', liquidity);

    const amount1Min = ethers.utils.parseUnits(String(amount1min), token1Decimals);
    const amount2Min = ethers.utils.parseUnits(String(amount2min), token2Decimals);
  
    const pairAddress = await factory.pairs(addressToken1, addressToken2);
    const pair = new Contract(pairAddress, PAIR.abi, signer);

    await pair.approve(routerContract.address, liquidity);

    console.log([
      addressToken1,
      addressToken2,
      Number(liquidity),
      Number(amount1Min),
      Number(amount2Min),
      account,
    ]);
    
    const removeLiquidityTx = await routerContract.removeLiquidity(
      addressToken1,
      addressToken2,
      liquidity,
      amount1Min,
      amount2Min,
      account
    )
    await removeLiquidityTx.wait(); // Wait for the removeLiquidity transaction to be confirmed

  } catch (error) {
    console.log("Error in Add Liquidity function: ", error)
  }
}
export async function quoteRemoveLiquidity(
  address1: string,
  address2: string,
  liquidity: string,
  factory: Contract,
  signer: ethers.Signer
): Promise<[string, string, string]> {
  const pairAddress = await factory.pairs(address1, address2);
  console.log("pair address", pairAddress);
  const pair = new Contract(pairAddress, PAIR.abi, signer) as Pair;

  const reservesRaw = await fetchReserves(address1, address2, pair, signer); // Should return reserves formatted as ethers
  const reserveA = reservesRaw[0];
  const reserveB = reservesRaw[1];


  const _totalSupply = await pair.totalSupply();
  const totalSupply = Number(ethers.utils.formatEther(_totalSupply));

  const Aout = (Number(reserveA) * Number(liquidity)) / totalSupply;
  const Bout = (Number(reserveB) * Number(liquidity)) / totalSupply;

  return [liquidity, (Aout.toString()), (Bout.toString())];
}
export async function PriceVsDollar(tokenAddress: string, factory: Contract, signer: ethers.Signer) {
  //aka fetch reserver
  for (const i in import.meta.env) {
    if (tokenAddress == import.meta.env[i]) {
      const usdtAddress = import.meta.env.VITE_USDT;

      const pairAddress: string = await factory.pairs(usdtAddress, tokenAddress);
      if (pairAddress === '0x0000000000000000000000000000000000000000') {
        alert("Pair doesn't exist");
      }
      const pairContract = getPair(pairAddress, signer)

      // Log reserves and other useful information
      console.log("Token Address:", tokenAddress);
      console.log("USDT Address:", usdtAddress);
      console.log("Pair Address:", pairAddress);
      const reserve = await fetchReserves(tokenAddress, usdtAddress, pairContract, signer);
      console.log("Reserve ", reserve)
    }
  }
}

export async function quoteMintLiquidity(
  address1: string,
  address2: string,
  amountA: number,
  amountB: number,
  factory: Contract,
  signer: ethers.Signer
): Promise<number> {
  const MINIMUM_LIQUIDITY = 1000;
  let _reserveA = 0;
  let _reserveB = 0;
  let totalSupply = 0;

  [_reserveA, _reserveB, totalSupply] = await factory.pairs(address1, address2).then(async (pairAddress) => {
    if (pairAddress !== '0x0000000000000000000000000000000000000000') {
      const pair = new Contract(pairAddress, PAIR.abi, signer);

      const reservesRaw = await fetchReserves(address1, address2, pair, signer); // Returns the reserves already formatted as ethers
      const reserveA = reservesRaw[0];
      const reserveB = reservesRaw[1];

      const _totalSupply = await pair.totalSupply();
      totalSupply = Number(ethers.utils.formatEther(_totalSupply));
      return [reserveA, reserveB, totalSupply];
    } else {
      return [0, 0, 0];
    }
  });

  const token1 = new Contract(address1, ERC20.abi, signer);
  const token2 = new Contract(address2, ERC20.abi, signer);

  // Need to do all this decimals work to account for 0 decimal numbers
  const token1Decimals = await getDecimals(token1);
  const token2Decimals = await getDecimals(token2);

  const valueA = amountA * (10 ** token1Decimals);
  const valueB = amountB * (10 ** token2Decimals);

  const reserveA = _reserveA * (10 ** token1Decimals);
  const reserveB = _reserveB * (10 ** token2Decimals);

  if (totalSupply === 0) {
    return Math.sqrt((valueA * valueB) - MINIMUM_LIQUIDITY) * 10 ** (-18);
  }

  return Math.min(valueA * totalSupply / reserveA, valueB * totalSupply / reserveB);
}
const quote = (amount1: number, reserve1: number, reserve2: number) => {
  const amount2 = amount1 * (reserve2 / reserve1);
  return amount2;
};

export async function quoteAddLiquidity(
  address1: string,
  address2: string,
  amountADesired: number,
  amountBDesired: number,
  factory: Contract,
  signer: ethers.Signer
): Promise<[number, number, string]> {

  const pairAddress = await factory.getPair(address1, address2);
  const pair = new Contract(pairAddress, PAIR.abi, signer);

  const reservesRaw = await fetchReserves(address1, address2, pair, signer); // Returns the reserves already formatted as ethers
  const reserveA = reservesRaw[0];
  const reserveB = reservesRaw[1];

  if (reserveA === 0 && reserveB === 0) {
    const amountOut = await quoteMintLiquidity(
      address1,
      address2,
      amountADesired,
      amountBDesired,
      factory,
      signer
    );
    return [
      amountADesired,
      amountBDesired,
      amountOut.toPrecision(8),
    ];
  } else {
    const amountBOptimal = quote(amountADesired, reserveA, reserveB);
    if (amountBOptimal <= amountBDesired) {
      const amountOut = await quoteMintLiquidity(
        address1,
        address2,
        amountADesired,
        amountBOptimal,
        factory,
        signer
      );
      return [
        amountADesired,
        amountBOptimal,
        amountOut.toPrecision(8),
      ];
    } else {
      const amountAOptimal = quote(amountBDesired, reserveB, reserveA);
      const amountOut = await quoteMintLiquidity(
        address1,
        address2,
        amountAOptimal,
        amountBDesired,
        factory,
        signer
      );
      return [
        amountAOptimal,
        amountBDesired,
        amountOut.toPrecision(8),
      ];
    }
  }
}
