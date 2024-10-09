// export const formatBalance = (balance: string) => {
//     if (balance && Number(balance) != 0)
//         return parseFloat(balance).toPrecision(4);
//     else return "0.0";
// };
// export const formatAmount = (amount: string) => {
//     if (! amount || amount === "0") {
//       return "";
//     }   
//     const validInput = /^(\d+|\d+\.\d*)?$/;
//     if (validInput.test(amount)) {
//       return amount
//     }
//     return "0"
//   }
// export const formatReserve = (reserve: string) => {
//     if (reserve && Number(reserve) != 0) return parseFloat(reserve).toPrecision(4).toString();
//     else return "0.0";
// };

// export const formatTradeVolume = (reserve: string) => {
//     if (reserve && Number(reserve) != 0) return parseFloat(reserve).toPrecision(4).toString();
//     else return "0.0";
// };
// export const formatTotalSupply = (reserve: string) => {
//   if (reserve && Number(reserve) != 0) return parseFloat(reserve).toPrecision(5).toString();
//   else return "0.0";
// };
// export const formatPercent = (value: string | number, decimals: number = 2): string => {
//   const numValue = typeof value === 'string' ? parseFloat(value) : value;

//   if (isNaN(numValue) || numValue === 0) {
//     return "0.0%"; // Return 0% if the value is NaN or 0
//   }

//   // Format the number as a percentage
//   return `${(numValue * 100).toFixed(decimals)}%`;
// };
// export function formatAddress(address: string): string {
//   // Remove any leading/trailing whitespace
//   address = address.trim();

//   // Ensure the address starts with '0x'
//   if (!address.startsWith('0x')) {
//       address = '0x' + address;
//   }

//   // Remove any characters that are not hex digits
//   address = address.replace(/[^0-9a-fA-F]/g, '');

//   // Shorten the address to the first 4 and last 4 characters, with a dot in the middle
//   if (address.length > 42) {
//       address = address.substring(0, 42);
//   }

//   const start = address.substring(0, 6); // e.g., "0x1234"
//   const end = address.substring(address.length - 4); // e.g., "abcd"
  
//   return `${start}...${end}`;
// }

export const formatBalance = (balance: string) => {
  if (balance && Number(balance) !== 0) {
      return parseFloat(balance).toPrecision(4).replace(/\.0+$/, "");
  }
  return "0";
};

export const formatAmount = (amount: string) => {
  if (!amount || amount === "0") {
      return "0";
  }
  const validInput = /^(\d+|\d+\.\d*)?$/;
  if (validInput.test(amount)) {
      return parseFloat(amount).toPrecision(11).replace(/\.0+$/, "");
  }
  return "0";
};

export const formatReserve = (reserve: string) => {
  if (isNaN(Number(reserve))) {
    return "0";
  }
  if (reserve && Number(reserve) !== 0) {
      return parseFloat(reserve).toPrecision(4).replace(/\.0+$/, "");
  }
  return "0";
};

export const formatTradeVolume = (reserve: string) => {
  if (reserve && Number(reserve) !== 0) {
      return parseFloat(reserve).toPrecision(4).replace(/\.0+$/, "");
  }
  return "0";
};

export const formatTotalSupply = (reserve: string) => {
  if (reserve && Number(reserve) !== 0) {
      return parseFloat(reserve).toPrecision(5).replace(/\.0+$/, "");
  }
  return "0";
};

export const formatPrice = (reserve: string) => {
  if (reserve && Number(reserve) !== 0) {
      return parseFloat(reserve).toPrecision(4).replace(/\.0+$/, "");
  }
  return "0";
};

export const formatPercent = (value: string | number, decimals: number = 2): string => {
  if (value === "Infinity") {
    return"0%";
  }
  if (isNaN(Number(value))) {
    return "0%";
  }
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue) || numValue === 0) {
      return "0.0%"; // Return 0% if the value is NaN or 0
  }
  if (numValue >= 1) {
    return "100%"
  }
  // Format the number as a percentage and remove trailing zeros
  return `${(numValue * 100).toPrecision(6).replace(/\.0+$/, "")}%`;
};

export function formatAddress(address: string): string {
  // Remove any leading/trailing whitespace
  if (!address) return "0x"
  address = address.trim();

  // Ensure the address starts with '0x'
  if (!address.startsWith('0x')) {
      address = '0x' + address;
  }

  // Remove any characters that are not hex digits
  address = address.replace(/[^0-9a-fA-F]/g, '');

  // Shorten the address to the first 4 and last 4 characters, with a dot in the middle
  if (address.length > 42) {
      address = address.substring(0, 42);
  }

  const start = address.substring(0, 6); // e.g., "0x1234"
  const end = address.substring(address.length - 4); // e.g., "abcd"
  
  return `${start}...${end}`;
}
