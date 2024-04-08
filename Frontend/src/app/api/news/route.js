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
	const num = params.get('num');
	const from_date = params.get('from_date');
	const to_date = params.get('to_date');
	const tbs = encodeURIComponent(`cdr:1,cd_min:01/02/2024,cd_max:01/02/2024`);
	const hl = 'en';
	const lr = 'lang_en';
	const start = 0;
	const tbm = 'nws';

	const googleSearchParams = {
		q: q,
		num: num,
		hl: hl,
		lr: lr,
		start: start,
		tbm: tbm,
		tbs: tbs
	}
	const res = await fetch(googleSearchUrl + '?' + new URLSearchParams(googleSearchParams), { headers: headers, cache: 'no-cache' });
	const text = await res.text();
	
	return NextResponse.json(text);
}