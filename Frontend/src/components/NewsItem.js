'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Loader from './Loader';

import styles from '@/styles/news.module.css';

export default function NewItem(props) {
  const { title, url, description, label, score, date, isSentimentLoading } = props;
  const colorClass = `${styles.label} ${label === 'positive' ? styles.positive : (label === 'negative' ? styles.negative : 'neutral')}`;
  const sentimentResult = `${label ?? 'N/A'} ${score ? score.toFixed(4) : ''}`;

  return (
    <li className={styles.newsItem} key={title}>
        <div className={styles.newsHeader}>
          <Link href={url} target="_blank">
            <h2 className={styles.title}>{title}</h2>
          </Link>
          <div className={`${styles.sentiment} ${colorClass}`}>
            <div className={colorClass}>
              {
                isSentimentLoading ?
                <Loader isLoading={isSentimentLoading} size={20} borderSize={4} /> :
                <>{sentimentResult}</>
              }
            </div>
          </div>
        </div>
        <p className={styles.description}>{description}</p>
        <p className={styles.date}>{date}</p>
    </li>
  )
}
