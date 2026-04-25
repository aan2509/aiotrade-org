import type { TickerItem } from "@/components/landing/types";

export const fallbackTickerItems: TickerItem[] = [
  { symbol: "BTC/USD", price: "0.00", change: "0.00%", positive: true, name: "Bitcoin", rank: 1 },
  { symbol: "ETH/USD", price: "0.00", change: "0.00%", positive: true, name: "Ethereum", rank: 2 },
  { symbol: "XRP/USD", price: "0.00", change: "0.00%", positive: true, name: "XRP", rank: 3 },
  { symbol: "BNB/USD", price: "0.00", change: "0.00%", positive: true, name: "BNB", rank: 4 },
  { symbol: "SOL/USD", price: "0.00", change: "0.00%", positive: true, name: "Solana", rank: 5 },
  { symbol: "DOGE/USD", price: "0.00", change: "0.00%", positive: true, name: "Dogecoin", rank: 6 },
  { symbol: "ADA/USD", price: "0.00", change: "0.00%", positive: true, name: "Cardano", rank: 7 },
  { symbol: "TRX/USD", price: "0.00", change: "0.00%", positive: true, name: "TRON", rank: 8 },
  { symbol: "LINK/USD", price: "0.00", change: "0.00%", positive: true, name: "Chainlink", rank: 9 },
  { symbol: "AVAX/USD", price: "0.00", change: "0.00%", positive: true, name: "Avalanche", rank: 10 },
] as const;

export function formatTickerSymbol(symbol: string) {
  return `${symbol}/USD`;
}

export function formatTickerPrice(price: number) {
  if (price >= 1000) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  if (price >= 1) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price);
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(price);
}

export function formatTickerChange(changePercent: number) {
  const sign = changePercent > 0 ? "+" : "";
  return `${sign}${changePercent.toFixed(2)}%`;
}

export function getTickerInitials(symbol: string) {
  return symbol.split("/")[0].slice(0, 3);
}
