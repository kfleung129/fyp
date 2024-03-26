import { NextResponse } from 'next/server'

const googleSearchUrl = 'https://www.google.com/search'

export async function GET(request) {
	let headers = {
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		'Accept-Language': 'en-US,en;q=0.5',
		'Accept-Encoding': 'gzip, deflate',
		'Connection': 'keep-alive',
		'Cache-Control': 'private, max-age=0',
	}
	const params = request.nextUrl.searchParams;
	const q = params.get('q')
	//const num = params.get('num')
	const num = 3;
	const hl = params.get('hl')
	const start = params.get('start')
	const from_date = params.get('from_date')
	const to_date = params.get('to_date')
	const googleSearchParams = {
		q: q,
		num: num,
		hl: 'en',
		lr: 'lang_en',
		start: start,
		from_date: from_date,
		to_date: to_date,
		tbm: 'nws'
	}
	const res = await fetch(googleSearchUrl + '?' + new URLSearchParams(googleSearchParams), { headers: headers, cache: 'no-cache' })
	const text = await res.text()
	return NextResponse.json(text)
}