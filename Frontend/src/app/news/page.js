'use client';
import React, { useState, useEffect } from 'react';
import NewsList from '@/components/NewsList';
import StockSelect from '@/components/StockSelect';
import { IoReloadCircle } from "react-icons/io5";

import styles from '@/styles/news.module.css';

export default function Home() {
  const [newspaper, setNewspaper] = useState([]);
  const [stockCode, setStockCode] = useState('AAPL');
  const [stockOptions, setStockOptions] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    loadStockOptions();
    getStockNews(stockCode);

  }, []);

  async function selectStock (stockCode) {
    // Update different stock's available dates
    setStockCode(stockCode);
    await getStockNews(stockCode);
  }

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

  async function getStockNews(stockCode) {
    setLoading(true);
    let res = await fetch(`/api/retrieve?q=${stockCode}&num=10`);
    let newsData = await res.json();
    console.log(newsData)
    setNewspaper(newsData);
    setLoading(false);
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
      <StockSelect stockOptions={stockOptions} stockCode={stockCode} selectStock={selectStock} />
    </div>
  )
}
