import { fallbackTickerItems, formatTickerChange, formatTickerPrice, formatTickerSymbol } from "@/lib/market";

type CmcListingsResponse = {
  data?: Array<{
    id: number;
    name: string;
    symbol: string;
    cmc_rank: number;
    quote?: {
      USD?: {
        price?: number;
        percent_change_24h?: number;
      };
    };
  }>;
};

type CmcInfoResponse = {
  data?: Record<
    string,
    {
      id: number;
      logo?: string;
    }
  >;
};

const CMC_API_BASE_URL = "https://pro-api.coinmarketcap.com/v1";

export async function GET() {
  const apiKey = process.env.CMC_API_KEY ?? process.env.COINMARKETCAP_API_KEY;

  if (!apiKey) {
    return Response.json({ items: fallbackTickerItems, source: "fallback-missing-key" });
  }

  try {
    const listingsResponse = await fetch(
      `${CMC_API_BASE_URL}/cryptocurrency/listings/latest?start=1&limit=10&convert=USD&sort=market_cap`,
      {
        headers: {
          Accept: "application/json",
          "X-CMC_PRO_API_KEY": apiKey,
        },
        next: { revalidate: 300 },
      },
    );

    if (!listingsResponse.ok) {
      throw new Error(`CMC listings request failed with status ${listingsResponse.status}`);
    }

    const listingsPayload = (await listingsResponse.json()) as CmcListingsResponse;
    const listings = listingsPayload.data ?? [];

    if (!listings.length) {
      throw new Error("CMC listings returned no data");
    }

    const ids = listings.map((entry) => entry.id).join(",");
    let infoMap: CmcInfoResponse["data"] = {};

    try {
      const infoResponse = await fetch(
        `${CMC_API_BASE_URL}/cryptocurrency/info?id=${encodeURIComponent(ids)}`,
        {
          headers: {
            Accept: "application/json",
            "X-CMC_PRO_API_KEY": apiKey,
          },
          next: { revalidate: 3600 },
        },
      );

      if (infoResponse.ok) {
        const infoPayload = (await infoResponse.json()) as CmcInfoResponse;
        infoMap = infoPayload.data ?? {};
      }
    } catch {
      infoMap = {};
    }

    const items = listings.map((entry) => {
      const usdQuote = entry.quote?.USD;
      const price = Number(usdQuote?.price ?? 0);
      const changePercent = Number(usdQuote?.percent_change_24h ?? 0);
      const logoUrl = infoMap?.[String(entry.id)]?.logo;

      return {
        symbol: formatTickerSymbol(entry.symbol),
        price: formatTickerPrice(price),
        change: formatTickerChange(changePercent),
        positive: changePercent >= 0,
        logoUrl,
        name: entry.name,
        rank: entry.cmc_rank,
      };
    });

    return Response.json({ items, source: "coinmarketcap" });
  } catch {
    return Response.json({ items: fallbackTickerItems, source: "fallback-error" });
  }
}
