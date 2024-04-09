import { NextResponse } from 'next/server'

export async function GET(request) {
    const stockList = [
        { value: 'AAPL', label: 'Apple' },
        { value: 'NVDA', label: 'Nvidia' },
        { value: 'MSFT', label: 'Microsoft' },
        { value: 'TSLA', label: 'Tesla' },
        { value: 'AMZN', label: 'Amazon' },
        { value: 'GOOG', label: 'Alphabet Inc Class C' },
        { value: 'GOOGL', label: 'Alphabet Inc Class A' },
        { value: 'META', label: 'Meta' },
        { value: 'TSM', label: 'TSM' },
        { value: 'JPM', label: 'J.P. Morgan' },
        { value: 'AMD', label: 'AMD' },
        { value: 'NFLX', label: 'Netflix' }
    ]
	return NextResponse.json(stockList)
}