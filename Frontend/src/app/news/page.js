'use client';
import React, { useState, useEffect } from 'react';
import NewsList from '@/components/NewsList';
import StockSelect from '@/components/StockSelect';
import SubmitButton from '@/components/SubmitButton';
import { getSentimentResult, fetchStockNews, fetchStockOptions } from '@/util/util';
import { IoReloadCircle } from "react-icons/io5";

import styles from '@/styles/news.module.css';

export default function Home() {
  const [newspaper, setNewspaper] = useState([]);
  const [stockCode, setStockCode] = useState('AAPL');
  const [stockOptions, setStockOptions] = useState(null);
  const [numOfNews, setNumOfNews] = useState(10);
  const [isLoading, setLoading] = useState(true);
  const [isSentimentLoading, setSentimentLoading] = useState(false);

  useEffect(() => {
    loadStockOptions();
    getStockNews(stockCode);

  }, []);

  async function loadStockOptions() {
    let stockList = await fetchStockOptions();
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
    let today = new Date();
    let newsData = await fetchStockNews(stockCode, today, today, numOfNews);
    setNewspaper(newsData);
    setSentimentLoading(false);
    setLoading(false);
  }

  async function getSentimentScore() {
    // Sentiment analysis
    setSentimentLoading(true);
    let newsData = newspaper;

    for(let i = 0; i < newsData.length; i++) {
      let text = newsData[i].text;
      let sentimentResult = await getSentimentResult(text);
      if (!sentimentResult || !sentimentResult[0]) continue;
      newsData[i].label = sentimentResult[0].label;
      newsData[i].score = sentimentResult[0].score;
    }
    console.log('[Done]');
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
        <NewsList newsData={newspaper} isLoading={isLoading} isSentimentLoading={isSentimentLoading} />
      </div>
      <div className={styles.input}>
        <StockSelect isLoading={isSentimentLoading} stockOptions={stockOptions} stockCode={stockCode} selectStock={selectStock} />
        <div className={styles.rangeSlider}>
          <span>Number of news: {numOfNews}</span>
          <input type="range" min="1" max="20" value={numOfNews} onChange={(e) => setNumOfNews(e.target.value)}></input>
        </div>
        <SubmitButton text='Get sentiment' handler={async () => await getSentimentScore()} stockCode={stockCode} lock={isSentimentLoading} />
      </div>
    </div>
  )
}
