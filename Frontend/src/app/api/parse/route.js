import { NextResponse } from 'next/server'
import { parse } from 'node-html-parser';

export async function GET(request) {
    const params = request.nextUrl.searchParams;
    let q = params.get('q')
    const searchParams = {
        q: q
    }
	const res = await fetch('http://localhost:3000/api/news' + '?' + new URLSearchParams(searchParams), { cache: 'no-cache' });
    let text = await res.text();
    let root = parse(text);
    let searchResultList = root.querySelectorAll('.\\\\\\\"Gx5Zad');
    let newsList = [];
    for(let i = 0; i < searchResultList.length; i++) {
      let title = searchResultList[i].querySelector('.\\\\\\\"BNeawe');
      let linkObject = searchResultList[i].getElementsByTagName('a')[0];
      let href = linkObject._attrs['href'];
      let index = href.indexOf('url=');
      
      if(index > 0) {
        let url = href.substring(index + 4).toString().split('&')[0];
        let newsObj = {
            title: title ? title.text : null,
            url: url
        }
        newsList.push(newsObj);
      }
    }
	return NextResponse.json(newsList)
}