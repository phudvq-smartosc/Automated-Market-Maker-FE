export const DEFAULT_USER_ACCOUNT = "0x";
export const DEFAULT_USER_BALANCE = 0;
export const DEFAULT_RESERVE = 0;
export const DEFAULT_AMOUNT = 0;

export const DEFAULT_TOKEN_SYMBOL = "TKN"
export const DEFAULT_TOKEN_NAME = "Token"
export const DEFAULT_TOKEN_ADDRESS = "0x"
export const DEFAULT_TOKEN_BALANCE = "0"
export const DEFAULT_TOKEN_IMG_PATH = ""
export const DEFAULT_TOKEN_AMOUNT = "0"

export const DEFAULT_ALERT_DESC = "ALERT"
export const DEFAULT_ALERT_DURATION = 3000
export const ALERT_INFO = "info"
export const ALERT_ERROR = "error"
export const ALERT_WARNING = "warning"

export const DEFAULT_SHARE_PERCENT = 0

export const DEFAULT_PRICE = 0
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const DEFAULT_PAIR_SYMBOL="TKN/TKN"

export const DEFAULT_TOKEN_INTERFACE = {
  name: DEFAULT_TOKEN_NAME,
  symbol: DEFAULT_TOKEN_SYMBOL,
  img: DEFAULT_TOKEN_IMG_PATH,
  address: DEFAULT_TOKEN_ADDRESS,
  balance: DEFAULT_TOKEN_BALANCE
}
export const DEFAULT_TOKEN_PAIR = {
  tokenPairInfo: [
    {
      tokenInterface: {
        name: DEFAULT_TOKEN_NAME,
        symbol: DEFAULT_TOKEN_SYMBOL,
        img: DEFAULT_TOKEN_IMG_PATH,
        address: DEFAULT_TOKEN_ADDRESS,
        balance: DEFAULT_TOKEN_BALANCE,
      },
      amount: DEFAULT_TOKEN_AMOUNT,
    },
    {
      tokenInterface: {
        name: DEFAULT_TOKEN_NAME,
        symbol: DEFAULT_TOKEN_SYMBOL,
        img: DEFAULT_TOKEN_IMG_PATH,
        address: DEFAULT_TOKEN_ADDRESS,
        balance: DEFAULT_TOKEN_BALANCE,
      },
      amount: DEFAULT_TOKEN_AMOUNT,
    },
  ],
};