import { gql } from '@apollo/client';
export const GET_TOKENS = gql`
  query GET_TOKENS {
    tokens {
      decimals
      id
      name
      symbol
      totalLiquidity
      totalSupply
      tradeVolume
      txCount
    }
  }
`;


export const GET_TOKEN_PAIRS = gql`
  query MyQuery {
    zuniswapV2Pairs {
      reserve0
      reserve1
      liquidityProviderCount
      id
      token0Price
      token1Price
      totalSupply
      txCount
      volumeToken0
      volumeToken1
      token0 {
        symbol
        name
        totalSupply
        totalLiquidity
        tradeVolume
        txCount
      }
      token1 {
        name
        symbol
        totalLiquidity
        totalSupply
        tradeVolume
        txCount
      }
    }
    zuniswapV2PairDayDatas {
      totalSupply
      reserve0
      reserve1
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      dailyVolumeToken1
      dailyVolumeToken0
      dailyTxns
    }
  }
`;

export const LP_COUNT = gql`query CountLP {
  mints {
    sender
    pair {
      token0 {
        name
      }
      token1 {
        name
      }
    }
  }
}
`;

export const USER_TRANSACTION_QUERY = gql`
  query UserTransaction {
  zuniswapV2Transactions(where: {}, orderBy: timestamp) {
    id
    burns {
      liquidity
      amount1
      amount0
      pair {
        token0 {
          name
          symbol
        }
        token1 {
          name
          symbol
        }
      }
      sender
      timestamp
      to
      needsComplete
    }
    mints {
      amount0
      amount1
      timestamp
      liquidity
      sender
      pair {
        token0 {
          name
          symbol
        }
        token1 {
          symbol
          name
        }
      }
      to
      id
    }
    swaps {
      sender
      timestamp
      amount0In
      amount1Out
      amount0Out
      amount1In
      pair {
        token1 {
          symbol
          name
        }
        token0 {
          symbol
          name
        }
      }
      from
      to
    }
  }
}
`;


export const TOKENS_QUERY = gql`
query TokenQuery {
  tokens {
    name
    symbol
    id
    decimals
  }
}
`;

export const PAIR_QUERY = gql`
query PairQuery {
  zuniswapV2Pairs {
    id
    token0 {
      name
      id
      symbol
    }
    token1 {
      id
      name
      symbol
    }
  }
}`;

// Define your query with dynamic ID
export const PAIR_HISTORY_QUERY = gql`
  query PairHistory($id: ID!) {
    zuniswapV2Pair(id: $id) {
      id
      swaps {
        amount1Out
        amount1In
        amount0Out
        amount0In
        timestamp
        pair {
          reserve0
          reserve1
        }
      }
      mints {
        amount1
        amount0
        liquidity
        timestamp
        pair {
          reserve0
          reserve1
        }
      }
      burns {
        timestamp
        amount1
        amount0
        pair {
          reserve1
          reserve0
        }
      }
    }
  }
`;
