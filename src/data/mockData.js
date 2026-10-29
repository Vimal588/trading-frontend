export const coins = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", color: "#f7931a", volume: 26640606963, marketCap: 1325080209740, change24h: -3.03802, price: 67163.12 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "#8a92b2", volume: 15028519549, marketCap: 425881534065, change24h: -3.40887, price: 3539.74 },
  { id: "tether", name: "Tether", symbol: "USDT", color: "#26a17b", volume: 45670914886, marketCap: 112461838288, change24h: 0.02398, price: 0.998928 },
  { id: "bnb", name: "BNB", symbol: "BNB", color: "#f0b90b", volume: 2357559203, marketCap: 94457088904, change24h: -4.73089, price: 612.64 },
  { id: "solana", name: "Solana", symbol: "SOL", color: "#14f195", volume: 2263412348, marketCap: 71502805492, change24h: -2.82132, price: 154.81 },
  { id: "lido-staked-ether", name: "Lido Staked Ether", symbol: "STETH", color: "#00a3ff", volume: 91695017, marketCap: 33646696864, change24h: -3.66483, price: 3536.46 },
  { id: "usdc", name: "USDC", symbol: "USDC", color: "#2775ca", volume: 6723900805, marketCap: 32082750100, change24h: -0.18707, price: 0.999691 },
  { id: "xrp", name: "XRP", symbol: "XRP", color: "#25292e", volume: 1165297063, marketCap: 27028932404, change24h: -1.76187, price: 0.486478 },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", color: "#c2a633", volume: 958778655, marketCap: 20566494030, change24h: -2.08377, price: 0.141966 },
  { id: "cardano", name: "Cardano", symbol: "ADA", color: "#0033ad", volume: 512332211, marketCap: 15200340000, change24h: 1.24501, price: 0.4321 },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", color: "#e84142", volume: 402213456, marketCap: 12980220000, change24h: -5.12233, price: 31.44 },
  { id: "tron", name: "TRON", symbol: "TRX", color: "#ff060a", volume: 355098211, marketCap: 11020430000, change24h: 0.63321, price: 0.1198 },
];

function genSeries(base, points, volatility) {
  const out = [];
  let val = base;
  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.52) * volatility;
    out.push({ time: i, price: Math.max(val, base * 0.7) });
  }
  return out;
}

export const chartRanges = {
  "1D": {
    labels: ["11:00","13:00","15:00","17:00","19:00","21:00","23:00","01:00","03:00","05:00","07:00","09:00"],
    data: genSeries(70500, 48, 260),
  },
  "1W": {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    data: genSeries(68500, 42, 520),
  },
  "1M": {
    labels: ["W1","W2","W3","W4"],
    data: genSeries(64000, 30, 900),
  },
};

export const portfolios = ["Main Portfolio", "Long Term Holds", "DeFi Bag"];

export const portfolioAssets = [
  { coin: "Bitcoin", symbol: "BTC", color: "#f7931a", price: 67163.12, unit: 0.42, change: -2104.3, changePct: -3.03802, value: 28208.51 },
  { coin: "Ethereum", symbol: "ETH", color: "#8a92b2", price: 3539.74, unit: 3.1, change: -124.5, changePct: -3.40887, value: 10973.19 },
  { coin: "Solana", symbol: "SOL", color: "#14f195", price: 154.81, unit: 18.2, change: -44.8, changePct: -2.82132, value: 2817.54 },
  { coin: "Tether", symbol: "USDT", color: "#26a17b", price: 0.998928, unit: 5200, change: 1.24, changePct: 0.02398, value: 5194.42 },
  { coin: "Cardano", symbol: "ADA", color: "#0033ad", price: 0.4321, unit: 4200, change: 53.4, changePct: 1.24501, value: 1814.82 },
];

export const activityHistory = [
  { id: 1, datetime: "11-06-2024 16:02", pair: "BTC/USDT", buy: 68120.4, sell: 67980.1, type: "SELL", pl: -140.3, value: 6798.01 },
  { id: 2, datetime: "11-06-2024 14:41", pair: "ETH/USDT", buy: 3480.2, sell: 3612.9, type: "SELL", pl: 132.7, value: 3612.9 },
  { id: 3, datetime: "10-06-2024 22:15", pair: "SOL/USDT", buy: 148.1, sell: null, type: "BUY", pl: 0, value: 1481.0 },
  { id: 4, datetime: "10-06-2024 09:03", pair: "BNB/USDT", buy: 601.3, sell: 612.64, type: "SELL", pl: 113.4, value: 6126.4 },
  { id: 5, datetime: "09-06-2024 19:47", pair: "DOGE/USDT", buy: 0.1362, sell: null, type: "BUY", pl: 0, value: 1362.0 },
  { id: 6, datetime: "08-06-2024 11:22", pair: "XRP/USDT", buy: 0.5021, sell: 0.4864, type: "SELL", pl: -78.5, value: 972.8 },
];

export const watchlist = [
  coins[0], coins[1], coins[4], coins[7], coins[9],
];

export const wallet = {
  address: "#FAVIJY4",
  balance: 7309.85,
  bank: "Yes Bank ••••1652",
};

export const walletHistory = [
  { id: 1, type: "BUY", coin: "bitcoin", label: "BUY bitcoin", date: "11-06-2024 16:02", amount: -1000, positive: false },
  { id: 2, type: "DEPOSIT", coin: null, label: "Wallet Top Up (Razorpay)", date: "11-06-2024 10:12", amount: 2500, positive: true },
  { id: 3, type: "BUY", coin: "ethereum", label: "BUY ethereum", date: "10-06-2024 22:15", amount: -750, positive: false },
  { id: 4, type: "BUY", coin: "tether", label: "BUY tether", date: "09-06-2024 19:47", amount: -1362, positive: false },
  { id: 5, type: "WITHDRAW", coin: null, label: "Withdrawal to Yes Bank", date: "07-06-2024 08:30", amount: -500, positive: false },
  { id: 6, type: "DEPOSIT", coin: null, label: "Wallet Top Up (Stripe)", date: "05-06-2024 13:55", amount: 4000, positive: true },
];

export const profile = {
  email: "arjun.mehta@example.com",
  fullName: "Arjun Mehta",
  dob: "14 Mar 1996",
  nationality: "Indian",
  address: "221 MG Road, Apt 4B",
  city: "Lucknow",
  postcode: "226001",
  country: "India",
  mobile: "+91 98XXX XX210",
  twoFactor: true,
  accountStatus: "Pending",
};
