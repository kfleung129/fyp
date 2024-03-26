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

// Skip local model check
env.allowLocalModels = false;


export default function Home() {
  const [prediction, setPrediction] = useState('');
  const [menuPressed, setMenuPressed] = useState(false);
  const [stockCode, setStockCode] = useState('AAPL');
  const [stockOptions, setStockOptions] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1))); // By default start date is one month before the end date
  const [endDate, setEndDate] = useState(new Date());
  const [historicalDataList, setHistoricalDataList] = useState(null);
  const [buttonLock, setButtonLock] = useState(false);
  
  let sentimentPipeline = null;

  useEffect(() => {
    loadStockOptions();
  }, []);

  function lock() {
    setButtonLock(true);
  }

  function unlock() {
    setButtonLock(false);
  }

  async function loadModel() {
    // Set prediction status is "Loading..."
    setPrediction("Loading ...");
    const model = await tf.loadLayersModel("http://localhost:3000/model/AAPL/model.json")
    // console.log("Model loaded.")
    let arr = [];
    // Temporary to make a test dataset input of 30 x 60 matrix of data
    for(let i = 0; i < 30; i++) {
      let tmp = [];
      for(let k = 0; k < 60; k++) {
        tmp.push(60);
      }
      arr.push(tmp);
    }
    let b = tf.tensor(arr);
    b = tf.reshape(b, [30, 60, 1]);
    let result = model.predict(b);
    // Set prediction result
    setPrediction(result.dataSync()[0])
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
    // let newsList = await getStockNews(stockCode);
    // for(let i = 0; i < newsList.length; i++) {
    //   let sentimentPipeline = await pipeline('sentiment-analysis', 'Xenova/distilroberta-finetuned-financial-news-sentiment-analysis');
    //   let sentiment = await sentimentPipeline(newsList[i]);
    //   console.log(sentiment)
    // }
    let period1 = parseInt(startDate.getTime() / 1000);
    let period2 = parseInt(endDate.getTime() / 1000);
    let res = await fetch(`/api/historical?q=${stockCode}&period1=${period1}&period2=${period2}`);
    let historicalData = await res.json();
    setHistoricalDataList(historicalData);

    unlock();
  }

  function onPressMenu () {
    setMenuPressed(!menuPressed);
  }

  function selectStock (stockCode) {
    setStockCode(stockCode);
    console.log(stockCode);
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
    // className={styles.main}
    <div>
      <Head>
        <meta property="og:title" content="My page title" key="title" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavigationBar onPressMenu={onPressMenu} menuPressed={menuPressed} />
      <main>
        <div className="display">
          <GraphDisplay historicalDataList={historicalDataList} stockCode={stockCode} />
          <div className='input'>
            <StockSelect stockOptions={stockOptions} stockCode={stockCode} selectStock={selectStock} />
            <StockDatePicker date={startDate} setDate={setStartDate} maxDate={null} />
            <span>-</span>
            <StockDatePicker date={endDate} setDate={setEndDate} maxDate={new Date()} />
            <SubmitButton text="Get Recommedation" handler={getStockRecommendation} stockCode={stockCode} lock={buttonLock}/>
          </div>
        </div>
      </main>
    </div>
  )
}
