import { NextResponse } from 'next/server'
import { parse } from 'node-html-parser';

export async function GET(request) {
    const params = request.nextUrl.searchParams;
    let q = params.get('q');
    let num = params.get('num') ? params.get('num') : 5;
    const from_date = params.get('from_date') ?? '1/2/2024';
	const to_date = params.get('to_date') ?? '1/2/2024';

    if(!q) {
        return NextResponse.json('Failed');
    }
    const searchParams = {
        q: q,
        num: num,
        from_date: from_date,
        to_date: to_date
    }

    const res = await fetch('http://localhost:3000/api/parse' + '?' + new URLSearchParams(searchParams), { cache: 'no-cache' });
    const newsList = await res.json();

    let textList = [];
    for(let i = 0; i < newsList.length; i++) {
        let url = newsList[i].url;
        const newsResponse = await fetch(url);
        const text = await newsResponse.text();
        let root = parse(text);
        let paragraphList = root.getElementsByTagName('p');
        let paragraph = '';
        for(let k = 0; k < paragraphList.length; k++) {
            paragraph += paragraphList[k].text + ' ';
        }
        paragraph = paragraph.trim();
        textList.push({
            text: paragraph,
            ...newsList[i]
        });
    }
	return NextResponse.json(textList);
}