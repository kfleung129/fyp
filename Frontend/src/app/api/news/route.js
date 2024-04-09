const googleSearchUrl = 'https://www.google.com/search'

export async function GET(request) {
	let headers = {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
		'Accept': 'text/html; charset=UTF-8',
		'Accept-Language': 'en-US,en;q=0.5',
		'Accept-Encoding': 'gzip, deflate',
		'Connection': 'keep-alive',
		'Cache-Control': 'private, max-age=0',
		'Set-Cookie': 'CONSENT=PENDING+944'
	}
	let cookies = {
		'AEC': 'Ae3NU9NQU2mqLz-7wrJXwMEAaaRFg80VzW_-fAc7ByMmTS5AuM4AeDHSwA',
		'SOCS': 'CAISHwgCEhJnd3NfMjAyNDAzMjctMF9SQzEaBXpoLVRXIAEaBgiArJ2wBg',
	}
	const params = request.nextUrl.searchParams;
	const q = params.get('q')
	const num = params.get('num');
	const from_date = params.get('from_date');
	const to_date = params.get('to_date');
	const tbs = `cdr:1,cd_min:${from_date},cd_max:${to_date}`;
	const hl = 'en';
	const lr = 'lang_en';
	const start = 0;
	const tbm = 'nws';
	const param = `?q=${q}&tbs=${tbs}&tbm=${tbm}&start=${start}&num=${num}&hl=${hl}&lr=${lr}`;
	const res = await fetch(googleSearchUrl + param, { headers: headers, cookies: cookies, cache: 'no-cache' });
	const text = await res.text();

	return new Response(text);
}