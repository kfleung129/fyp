'use client';
import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import StockSelect from '@/components/StockSelect';
import SubmitButton from '@/components/SubmitButton';
import GraphDisplay from '@/components/GraphDisplay';
import StockDatePicker from '@/components/StockDatePicker';
import { transform, inverse_transform } from '@/util/util';

import styles from '@/styles/market.module.css';

export default function Market(props) {
  const [stockCode, setStockCode] = useState('AAPL');
  const [stockOptions, setStockOptions] = useState([]);
  const [startDate, setStartDate] = useState(new Date('2024-01-02')); // By default start date is one month before the end date
  const [endDate, setEndDate] = useState(new Date());
  const [displayContent, setDisplayContent] = useState(null);
  const [buttonLock, setButtonLock] = useState(false);
  const [stockAvailableDates, setStockAvailableDates] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // inititate default stock code recommendation
    loadStockOptions();
    getStockRecommendation(stockCode);

  }, []);
  
  function lock() {
    setButtonLock(true);
  }

  function unlock() {
    setButtonLock(false);
  }
  
  async function getStockRecommendation(stockCode) {
    lock();
    setLoading(true);
    // let newsList = await getStockNews(stockCode);
    // for(let i = 0; i < newsList.length; i++) {
    //   let sentimentPipeline = await pipeline('sentiment-analysis', 'Xenova/distilroberta-finetuned-financial-news-sentiment-analysis');
    //   let sentiment = await sentimentPipeline(newsList[i]);
    //   console.log(sentiment)
    // }
    let historicalData = await getHistoricalData(stockCode);
    let predictedStockPrice = await getLSTMPrediction(historicalData);
    const startDateStr = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
    const startItem = historicalData.find(item => item.date == startDateStr);
    // non-trading day is selected
    if (!startItem) {
        console.error('Date unavailable')
        return;
    }
    const startIndex = historicalData.indexOf(startItem);
    for(let i = startIndex; i < historicalData.length; i++) {
        historicalData[i]['predict'] = predictedStockPrice[i - startIndex];
    }
    setLoading(false);
    setDisplayContent({ stockCode: stockCode, displayList: historicalData.slice(startIndex, historicalData.length) });
    unlock();
  }

  async function getLSTMPrediction(historicalData) {
    // Set prediction status is "Loading..."
    const model = await tf.loadLayersModel(`http://localhost:3000/model/${stockCode}/model.json`)
    const dayBefore = 60;
    const startDateStr = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
    let openPriceList = historicalData.map(item => item.open);
    let normalizedPriceList = transform(openPriceList);
    let min = Math.min(...openPriceList);
    let max = Math.max(...openPriceList);
    const listLength = openPriceList.length;
    const startItem = historicalData.find(item => item.date == startDateStr);
    // non-trading day is selected
    if (!startItem) {
      console.error('Date unavailable')
      return;
    }
    const startIndex = historicalData.indexOf(startItem);
    const dayDiff = listLength - startIndex
    let X_test = []
    let result = '';

    for(let i = 0; i < dayDiff; i++) {
      let row = normalizedPriceList.slice(startIndex - dayBefore + i, startIndex + i);
      X_test.push(row);
    }
    X_test = tf.tensor(X_test);
    X_test = tf.reshape(X_test, [dayDiff, dayBefore, 1]);
    result = model.predict(X_test).dataSync();
    result = [...result];

    let predictedStockPrice = inverse_transform(result, min, max);
    return predictedStockPrice;
  }

  async function getHistoricalData(stockCode) {
    lock();
    let period1 = parseInt((startDate.getTime() - 7948800000) / 1000);
    let period2 = parseInt(endDate.getTime() / 1000);
    let res = await fetch(`/api/historical?q=${stockCode}&period1=${period1}&period2=${period2}`);
    let historicalData = await res.json();
    let availableDates = historicalData.map(item => item.date);
    setStockAvailableDates(availableDates);
    unlock();
    return historicalData;
  }

  async function selectStock (stockCode) {
    // Update different stock's available dates
    await getHistoricalData(stockCode);
    setStockCode(stockCode);
  }

  async function loadStockOptions() {
    const res = await fetch('/api/stocks');
    let stockList = await res.json();
    // sort by labels
    stockList = stockList.sort((a, b) => a.value.localeCompare(b.value));
    const stockOptions = stockList.map(stock => (
      <option value={stock.value} key={stock.value}>
        {stock.label}
      </option>
    ));
    setStockOptions(stockOptions);
  }

  return (
    <div className={styles.main}>
        <GraphDisplay displayContent={displayContent} stockCode={stockCode} isLoading={isLoading} />
        <div className='input'>
          <StockSelect stockOptions={stockOptions} stockCode={stockCode} selectStock={selectStock} />
          <StockDatePicker date={startDate} setDate={setStartDate} includeDates={stockAvailableDates} maxDate={null} />
          <span>-</span>
          <StockDatePicker date={endDate} setDate={setEndDate} includeDates={stockAvailableDates} maxDate={new Date()} />
          <SubmitButton text="Get Recommedation" handler={getStockRecommendation} stockCode={stockCode} lock={buttonLock} />
        </div>
    </div>
  )
}
