'use client';
import React, { useState } from 'react';
import styles from '../styles/button.module.css';

export default function SubmitButton(props) {
  const { text, handler, stockCode, lock } = props;

  return (
    <button 
      disabled={lock} 
      className={styles.submitButton} 
      onClick={async () => await handler(stockCode)}
    >
      {text}
    </button>
  )
}
