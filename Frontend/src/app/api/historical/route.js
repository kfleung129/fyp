import { NextResponse } from 'next/server'

export async function GET(request) {
    const params = request.nextUrl.searchParams;
    let q = params.get('q')
    let period1 = params.get('period1');
    let period2 = params.get('period2');
    if(!q) return null;
    const BASE_URL = `https://query2.finance.yahoo.com/v8/finance/chart/${q}`;
    const searchParams = {
        period1: period1,
        period2: period2,
        interval: '1d',
        includePrePost: 'False',
        events: 'div%2Csplits%2CcapitalGains'
    }
    const res = await fetch(BASE_URL + '?' + new URLSearchParams(searchParams), { cache: 'no-cache' });
    const resObj = await res.json();
    if(resObj.error) {
        return resObj.error.code;
    }
    let timestampList = resObj?.chart?.result[0]?.timestamp;
    let indicators = resObj?.chart?.result[0]?.indicators;
    let adjustedCloseList = indicators?.adjclose[0]?.adjclose;
    let quote = indicators?.quote[0];
    // Append adjusted close price list to quote object
    quote.timestamp = timestampList;
    quote.adjclose = adjustedCloseList;
    // Combine all into single historical data list
    let listLength = timestampList.length;
    let historicalDataList = []

    for(let i = 0; i < listLength; i++) {
        let historicalDataObj = {};
        let date = new Date(quote?.timestamp[i] * 1000);
        let dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        historicalDataObj.date = dateStr;
        historicalDataObj.close = quote?.close[i];
        historicalDataObj.open = quote?.open[i];
        historicalDataObj.low = quote?.low[i];
        historicalDataObj.volume = quote?.volume[i];
        historicalDataObj.adjclose = quote?.adjclose[i];
        historicalDataList.push(historicalDataObj);
    }

	return NextResponse.json(historicalDataList);
}