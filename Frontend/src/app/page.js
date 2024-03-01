'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import * as tf from '@tensorflow/tfjs';
import yahooFinance from 'yahoo-finance2';

export default function Home() {
  const [prediction, setPrediction] = useState("");
  
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
    try {
      const test = await fetch("https://www.google.com", {
        "headers": {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        "mode": 'no-cors',
      });
      console.log(test)
      const a = await test.text()
      console.log(a)
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code className={styles.code}>src/app/page.js</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.grid}>

        <a
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className={styles.customButton1} onClick={loadModel}>
            Run Model
          </button>
          <p>Load LSTM model to get prediction</p>
          <p id="prediction">Prediction: {prediction}</p>
        </a>
        
      </div>
    </main>
  )
}
