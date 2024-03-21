'use client';
import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
// import styles from './page.module.css';
import * as tf from '@tensorflow/tfjs';
import googleFinance from 'google-finance';
import NavigationBar from '@/components/NavigationBar';

export default function Home() {
  const [prediction, setPrediction] = useState("");
  const [menuPressed, setMenuPressed] = useState(false);
  
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

  function onPressMenu () {
    setMenuPressed(!menuPressed);
  }

  return (
    // className={styles.main}
    <div>
      <Head>
        <meta property="og:title" content="My page title" key="title" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main>
        <NavigationBar onPressMenu={onPressMenu} menuPressed={menuPressed}/>
      </main>
    </div>
  )
}
