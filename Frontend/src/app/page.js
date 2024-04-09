'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/home.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.intro} >
          <h1>StockRem</h1>
          <p>
            At StockRem, we provide advanced stock recommendation services to help you make informed investment decisions.
          </p>
          <p>
            Our team of expert analysts utilize cutting-edge algorithms and extensive market research to identify potential investment opportunities.
          </p>
          <p>
            Whether you're a seasoned investor or just starting out, our stock recommendations can assist you in achieving your financial goals.
          </p>
        </div>
        <Image
            width={560 * 1.3}
            height={374 * 1.3}
            src='/homepage.png'
        />
      </div>
      <div className={styles.tryButton}>
        <Link href='/market'>Try it!</Link>
      </div>
    </div>
  );
}
