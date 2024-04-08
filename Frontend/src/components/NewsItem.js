'use client';
import React, { useState } from 'react';
import Link from 'next/link';

import styles from '../styles/news.module.css';

export default function NewItem(props) {
  const { title, url, text } = props;
  const MAX_WORD = 50;
  const description = (text.split(' ').slice(0, MAX_WORD)).join(' ') + ' ...';

  return (
    <li className={styles.newsItem}>
        <Link href={url} target="_blank">
            <h2 className={styles.title}>{title}</h2>
        </Link>
        <p className={styles.description}>{description}</p>
    </li>
  )
}
