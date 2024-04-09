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
    let searchResultList = root.querySelectorAll('.SoaBEf');
    let newsList = [];
    
    for(let i = 0; i < searchResultList.length; i++) {
      let title = searchResultList[i].querySelector('.n0jPhd.ynAwRc.MBeuO.nDgy9d');
      let description = searchResultList[i].querySelector('.GI74Re.nDgy9d');
      let linkObject = searchResultList[i].querySelector('.WlydOe');
      let date = searchResultList[i].querySelector('.OSrXXb.rbYSKb.LfVVr');
      let url = linkObject._attrs['href'];

      let newsObj = {
        title: title ? title.text : null,
        description: description ? description.text : null,
        date: date ? date.text : null,
        url: url,
      }
      newsList.push(newsObj);
    }
	  return NextResponse.json(newsList);
}