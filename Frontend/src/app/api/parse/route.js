import { NextResponse } from 'next/server'
import { parse } from 'node-html-parser';

export async function GET(request) {
    const params = request.nextUrl.searchParams;
    let q = params.get('q');
    let num = params.get('num');
    let from_date = params.get('from_date');
	  let to_date = params.get('to_date');
    
    const searchParams = {
      q: q,
      num: num,
      from_date: from_date,
      to_date: to_date
    }
    const res = await fetch('http://localhost:3000/api/news' + '?' + new URLSearchParams(searchParams), { cache: 'no-cache' });
    let text = await res.text();
    let root = parse(text);
    let searchResultList = root.querySelectorAll('.\\\\\\\"Gx5Zad');
    let newsList = [];
    
    for(let i = 0; i < searchResultList.length; i++) {
      let title = searchResultList[i].querySelector('.\\\\\\\"BNeawe');
      let description = searchResultList[i].querySelector('.\\\\\\\"BNeawe.s3v9rd.AP7Wnd');
      let linkObject = searchResultList[i].getElementsByTagName('a')[0];
      let href = linkObject._attrs['href'];
      let index = href.indexOf('url=');
      
      if(index > 0) {
        let url = href.substring(index + 4).toString().split('&')[0];
        let newsObj = {
          title: title ? title.text : null,
          url: url,
          description: description
        }
        newsList.push(newsObj);
      }
    }
	  return NextResponse.json(newsList)
}