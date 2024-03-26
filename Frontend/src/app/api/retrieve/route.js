import { NextResponse } from 'next/server'
import { parse } from 'node-html-parser';

export async function GET(request) {
    const params = request.nextUrl.searchParams;
    let q = params.get('q')
    const searchParams = {
        q: q
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
        textList.push(paragraph);
    }
	return NextResponse.json(textList)
}