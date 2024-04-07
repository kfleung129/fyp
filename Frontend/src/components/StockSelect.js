'use client';
import React, { useState } from 'react';
import styles from '../styles/select.module.css';

export default function StockSelect(props) {
  const { stockOptions, stockCode, selectStock } = props;

  return (
    <select className={styles.stockSelect} value={stockCode} onChange={(e) => selectStock(e.target.value)}>
        {stockOptions}
    </select>
  )
}
