import { NextResponse } from "next/server";

const data = {
    "AAPL": "APPLE INC",
    "GOOGL": "ALPHABET INC",
    "AMZN": "AMAZON.COM INC",
    "MSFT": "MICROSOFT CORPORATION",
    "TSLA": "TESLA INC",
    "META": "META PLATFORMS INC",
    "NVDA": "NVIDIA CORPORATION",
    "INTC": "INTEL CORPORATION",
    "AMD": "ADVANCED MICRO DEVICES INC",
    "NFLX": "NETFLIX INC",
    "DIS": "THE WALT DISNEY COMPANY",
    "BA": "BOEING COMPANY",
    "V": "VISA INC",
    "PYPL": "PAYPAL HOLDINGS INC",
    "WMT": "WALMART INC",
    "JNJ": "JOHNSON & JOHNSON",
    "PG": "PROCTER & GAMBLE CO",
    "KO": "COCA-COLA COMPANY",
    "MCD": "MCDONALD'S CORPORATION",
    "CVX": "CHEVRON CORPORATION",
    "XOM": "EXXON MOBIL CORPORATION"
};

export async function GET(request: Request) {
    // const query = request.query.q?.toLowerCase();
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.toLowerCase();
    // console.log(query)

    if (!query) {
        return NextResponse.json(
            { msg: "Query parameter 'q' is required" },
            { status: 400 }
        )
    }

    const filteredSuggestions = Object.entries(data)
        .filter(([symbol, name]) =>
            symbol.toLowerCase().includes(query) || name.toLowerCase().includes(query)
        )
        .map(([symbol, name]) => ({ symbol, name }));


    // console.log(filteredSuggestions)
    
    return NextResponse.json(
        { msg: "ok", filteredSuggestions },
        { status: 200 }
    )

}
