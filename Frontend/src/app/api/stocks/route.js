import { NextResponse } from 'next/server'

export async function GET(request) {
    const stockList = [
        { value: 'AAPL', label: 'Apple' },
        { value: 'NVDA', label: 'Nvidia' },
        { value: 'MSFT', label: 'Microsoft' },
        { value: 'TSLA', label: 'Tesla' }
    ]
	return NextResponse.json(stockList)
}