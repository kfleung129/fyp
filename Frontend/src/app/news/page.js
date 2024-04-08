'use client';
import React, { useState, useEffect } from 'react';
import NewsList from '@/components/NewsList';
import StockSelect from '@/components/StockSelect';
import SubmitButton from '@/components/SubmitButton';
import { preprocessedText } from '@/util/util';
import { IoReloadCircle } from "react-icons/io5";
import { pipeline, env } from "@xenova/transformers";

import styles from '@/styles/news.module.css';

// Skip local model check
env.allowLocalModels = false;

export default function Home() {
  const [newspaper, setNewspaper] = useState([]);
  const [stockCode, setStockCode] = useState('AAPL');
  const [stockOptions, setStockOptions] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isSentimentLoading, setSentimentLoading] = useState(false);

  useEffect(() => {
    loadStockOptions();
    getStockNews(stockCode);

  }, []);

  async function loadStockOptions() {
    const res = await fetch('/api/stocks');
    let stockList = await res.json();
    // sort by labels
    stockList = stockList.sort((a, b) => a.value.localeCompare(b.value));
    const stockOptions = stockList.map(stock => (
      <option value={stock.value}>
        {stock.label}
      </option>
    ));
    setStockOptions(stockOptions);
  }

  async function selectStock (stockCode) {
    // Update different stock's available dates
    setStockCode(stockCode);
    await getStockNews(stockCode);
  }

  async function getStockNews(stockCode) {
    setLoading(true);
    setSentimentLoading(true);
    setNewspaper([]);
    let res = await fetch(`/api/retrieve?q=${stockCode}&num=10`);
    let newsData = await res.json();
    setNewspaper(newsData);
    setSentimentLoading(false);
    setLoading(false);
  }

  async function getSentimentScore() {
    
    // Sentiment analysis
    setSentimentLoading(true);
    let newsData = newspaper;
    let MIN_WORDS = 30;
    let MAX_WORDS = 2000;
    let sentimentPipe = await pipeline('sentiment-analysis', 'Xenova/distilroberta-finetuned-financial-news-sentiment-analysis');

    for(let i = 0; i < newsData.length; i++) {
      let text = newsData[i].text;
      text = preprocessedText(text);
      let wordCount = text.split(' ').length;
      if(wordCount > MAX_WORDS || MIN_WORDS > wordCount) {
        console.log(wordCount);
        console.log(`${newsData[i].title} Skipped`)
        continue;
      }
      try {
        let sentimentResult = await sentimentPipe(text);
        newsData[i].label = sentimentResult[0].label;
        newsData[i].score = sentimentResult[0].score;

      } catch(error) {
        console.error(error);
      }
    }
    console.log('[Done]')
    setSentimentLoading(false);
    setNewspaper(newsData);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1>Stock Market News</h1>
          <div className={styles.reloadButton} onClick={() => getStockNews(stockCode)}>
            <IoReloadCircle size={35} />
          </div>
        </div>
        <NewsList newsData={newspaper} isLoading={isLoading} />
      </div>
      <div className={styles.input}>
        <StockSelect isLoading={isSentimentLoading} stockOptions={stockOptions} stockCode={stockCode} selectStock={selectStock} />
        <SubmitButton text='Get sentiment' handler={async () => await getSentimentScore()} stockCode={stockCode} lock={isSentimentLoading} />
      </div>
    </div>
  )
}
