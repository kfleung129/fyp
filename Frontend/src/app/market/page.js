'use client';
import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import StockSelect from '@/components/StockSelect';
import SubmitButton from '@/components/SubmitButton';
import GraphDisplay from '@/components/GraphDisplay';
import StockDatePicker from '@/components/StockDatePicker';
import RecommendationPopup from '@/components/RecommendationPopup';
import { transform, inverseTransform, fetchStockOptions, fetchStockNews, fetchHistoricalData, getAggregatedSentimentScore } from '@/util/util';

import styles from '@/styles/market.module.css';

export default function Market(props) {
  const [stockCode, setStockCode] = useState('AAPL');
  const [stockOptions, setStockOptions] = useState(null);
  const [startDate, setStartDate] = useState(new Date('2024-01-02')); // By default start date is one month before the end date
  const [endDate, setEndDate] = useState(new Date());
  const [displayContent, setDisplayContent] = useState(null);
  const [recommendationObject, setRecommendationObject] = useState(null);
  const [buttonLock, setButtonLock] = useState(false);
  const [stockAvailableDates, setStockAvailableDates] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // inititate default stock code recommendation
    loadStockOptions();
    getStockPrediction(stockCode, startDate, endDate);

  }, []);
  
  function lock() {
    setButtonLock(true);
  }

  function unlock() {
    setButtonLock(false);
  }
  
  async function getStockPrediction(stockCode) {
    setLoading(true);

    let historicalData = await getHistoricalData(stockCode, startDate, endDate);
    let predictedStockPrice = await getLSTMPrediction(historicalData, startDate);
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
    const displayContent = { stockCode: stockCode, displayList: historicalData.slice(startIndex, historicalData.length) };
    
    setLoading(false);
    setDisplayContent(displayContent);
  }

  async function getLSTMPrediction(historicalData, startDate) {
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

    let predictedStockPrice = inverseTransform(result, min, max);
    return predictedStockPrice;
  }

  async function getHistoricalData(stockCode, startDate, endDate) {
    lock();
    let historicalData = await fetchHistoricalData(stockCode, startDate, endDate);
    let availableDates = historicalData.map(item => item.date);
    setStockAvailableDates(availableDates);
    unlock();
    return historicalData;
  }

  async function selectStock (stockCode) {
    // Update different stock's available dates
    getStockPrediction(stockCode);
    setStockCode(stockCode);
  }

  async function loadStockOptions() {
    let stockList = await fetchStockOptions();
    // sort by labels
    stockList = stockList.sort((a, b) => a.value.localeCompare(b.value));
    const stockOptions = stockList.map(stock => (
      <option value={stock.value} key={stock.value}>
        {stock.label}
      </option>
    ));
    setStockOptions(stockOptions);
  }

  async function getFutureDayPrediction(stockCode) {
    // Get current day's previous 60 day historical data
    let today = new Date();
    let historicalData = await getHistoricalData(stockCode, today, today);
    let firstDate = historicalData[historicalData.length - 1].date;
    firstDate = new Date(firstDate);
    // Get prediction
    let predictedStockPrice = await getLSTMPrediction(historicalData, firstDate);
    return predictedStockPrice[0];
  }

  async function getTodayRecommendation(stockCode) {
    lock();
    const totalNews = 20;
    let today = new Date();
    let yesterday = new Date(new Date().setDate(today.getDate() - 1));
    let todayNewsData = await fetchStockNews(stockCode, today, today, totalNews);
    let yesterdayNewsData = await fetchStockNews(stockCode, yesterday, yesterday, totalNews);
    let predictedStockPrice = await getFutureDayPrediction(stockCode);
    console.log(todayNewsData);
    console.log(yesterdayNewsData);
    let todayAggregatedSentimentScore = await getAggregatedSentimentScore(todayNewsData);
    let yesterdayAggregatedSentimentScore = await getAggregatedSentimentScore(yesterdayNewsData);
    console.log(todayAggregatedSentimentScore);
    console.log(yesterdayAggregatedSentimentScore);
    let scoreDiff = todayAggregatedSentimentScore - yesterdayAggregatedSentimentScore;
    let movement = scoreDiff > 0 ? 'up' : 'drop';
    
    let recommendationObj = {
      scoreDiff: scoreDiff,
      todayScore: todayAggregatedSentimentScore,
      yesterdayScore: yesterdayAggregatedSentimentScore,
      movement: movement,
      predictedStockPrice: predictedStockPrice
    }
    setRecommendationObject(recommendationObj);
    setShowPopup(true);
    unlock();
  }
  
  return (
    <div className={styles.main}>
        <RecommendationPopup showPopup={showPopup} setShowPopup={setShowPopup} recommendationObject={recommendationObject} />
        <GraphDisplay displayContent={displayContent} stockCode={stockCode} isLoading={isLoading} />
        <div className='input'>
          <StockSelect stockOptions={stockOptions} stockCode={stockCode} selectStock={selectStock} />
          <StockDatePicker date={startDate} setDate={setStartDate} includeDates={stockAvailableDates} maxDate={null} />
          <span>-</span>
          <StockDatePicker date={endDate} setDate={setEndDate} includeDates={stockAvailableDates} maxDate={new Date()} />
          <SubmitButton text="Get Prediction" handler={getStockPrediction} stockCode={stockCode} lock={buttonLock} />
          <SubmitButton text="Get Recommendation" handler={getTodayRecommendation} stockCode={stockCode} lock={buttonLock} />
        </div>
    </div>
  )
}
