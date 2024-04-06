'use client';
import React, { useState, useEffect, use } from 'react';
import Head from 'next/head';
import "react-datepicker/dist/react-datepicker.css";

import * as tf from '@tensorflow/tfjs';
import StockSelect from '@/components/StockSelect';
import NavigationBar from '@/components/NavigationBar';
import SubmitButton from '@/components/SubmitButton';
import GraphDisplay from '@/components/GraphDisplay';
import StockDatePicker from '@/components/StockDatePicker';
import { pipeline, env } from "@xenova/transformers";
import { getHistoricalPrices } from 'yahoo-stock-prices';

// Skip local model check
env.allowLocalModels = false;


export default function Home() {
  const [prediction, setPrediction] = useState('');
  const [menuPressed, setMenuPressed] = useState(false);
  const [stockCode, setStockCode] = useState('AAPL');
  const [stockOptions, setStockOptions] = useState([]);
  const [startDate, setStartDate] = useState(new Date('2024-01-02')); // By default start date is one month before the end date
  const [endDate, setEndDate] = useState(new Date());
  const [displayContent, setDisplayContent] = useState(null);
  const [buttonLock, setButtonLock] = useState(false);
  const [stockAvailableDates, setStockAvailableDates] = useState(null);
  const [isLoading, setLoading] = useState(false);
  
  let sentimentPipeline = null;

  useEffect(() => {
    loadStockOptions();
    getHistoricalData(stockCode);

  }, []);

  function lock() {
    setButtonLock(true);
  }

  function unlock() {
    setButtonLock(false);
  }

  function transform(priceList) {
    let min = Math.min(...priceList);
    let max = Math.max(...priceList);
    let normalizedList = [];
    for(let i = 0; i < priceList.length; i++) {
      normalizedList.push((priceList[i] - min) / (max - min));
    }
    return normalizedList;
  }

  function inverse_transform(priceList, min, max) {
    let inversedList = [];
    for(let i = 0; i < priceList.length; i++) {
      inversedList.push(priceList[i] * (max - min) + min);
    }
    return inversedList;
  }

  async function getLSTMPrediction(historicalData) {
    // Set prediction status is "Loading..."
    setPrediction("Loading ...");
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

  // async function loadPipeline() {
  //   let sentimentPipeline = await pipeline('sentiment-analysis', 'Xenova/distilroberta-finetuned-financial-news-sentiment-analysis');
  //   setPipeline(sentimentPipeline);
  //   console.log('[PIPELINE LOADED]')
  // }

  async function getStockNews(stockCode) {
    let res = await fetch(`/api/retrieve?q=${stockCode}`);
    let newsList = await res.json();
    return newsList;
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
    setDisplayContent({ stockCode: stockCode, displayList: historicalData });
    unlock();
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

  function onPressMenu () {
    setMenuPressed(!menuPressed);
  }

  async function selectStock (stockCode) {
    // Update different stock's available dates
    await getHistoricalData(stockCode);
    setStockCode(stockCode);
  }

  async function loadStockOptions() {
    const res = await fetch('/api/stocks');
    const stockList = await res.json();
    const stockOptions = stockList.map(stock => (
      <option value={stock.value}>
        {stock.label}
      </option>
    ));
    setStockOptions(stockOptions);
  }

  return (
    <div>
      <Head>
        <meta property="og:title" content="My page title" key="title" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavigationBar onPressMenu={onPressMenu} menuPressed={menuPressed} />
      <main>
        <div className="display">
          <GraphDisplay displayContent={displayContent} stockCode={stockCode} isLoading={isLoading} />
          <div className='input'>
            <StockSelect stockOptions={stockOptions} stockCode={stockCode} selectStock={selectStock} />
            <StockDatePicker date={startDate} setDate={setStartDate} includeDates={stockAvailableDates} maxDate={null} />
            <span>-</span>
            <StockDatePicker date={endDate} setDate={setEndDate} includeDates={stockAvailableDates} maxDate={new Date()} />
            <SubmitButton text="Get Recommedation" handler={getStockRecommendation} stockCode={stockCode} lock={buttonLock}/>
          </div>
        </div>
      </main>
    </div>
  )
}
