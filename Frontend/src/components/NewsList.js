'use client';
import React, { useState } from 'react';
import NewsItem from '@/components/NewsItem';
import Loader from '@/components/Loader';

import styles from '../styles/news.module.css';

export default function NewsList(props) {
  const { newsData, isLoading, isSentimentLoading } = props;

  let newsDataList = newsData.map(item => (
    <NewsItem 
      title={item.title}
      url={item.url}
      description={item.description}
      label={item.label}
      score={item.score}
      date={item.date}
      isSentimentLoading={isSentimentLoading}
    />
  ));

  return (
    isLoading ? 
    <Loader isLoading={isLoading} /> :
    <ul className={styles.newsList}>
        {newsDataList}
    </ul>
  )
}
