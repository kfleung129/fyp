'use client';
import React, { useState } from 'react';
import Link from 'next/link';

import styles from '../styles/news.module.css';

export default function NewItem(props) {
  const { title, url, text, label, score, date } = props;
  const MAX_WORD = 50;
  const description = (text.split(' ').slice(0, MAX_WORD)).join(' ') + ' ...';
  const colorClass = `${styles.label} ${label === 'positive' ? styles.positive : (label === 'negative' ? styles.negative : 'neutral')}`;

  return (
    <li className={styles.newsItem} key={title}>
        <div className={styles.newsHeader}>
          <Link href={url} target="_blank">
            <h2 className={styles.title}>{title}</h2>
          </Link>
          <div className={`${styles.sentiment} ${colorClass}`}>
            <div className={colorClass}>
              {label ?? 'N/A'} {score?.toFixed(4)}
            </div>
          </div>
        </div>
        <p className={styles.description}>{description}</p>
        <p className={styles.date}>{date}</p>
    </li>
  )
}
