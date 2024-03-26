'use client';
import React, { useState } from 'react';
import styles from '../styles/button.module.css';

export default function SubmitButton(props) {
  const text = props.text;
  const handler = props.handler;
  const stockCode = props.stockCode;
  const lock = props.lock;

  return (
    <button disabled={lock} className={styles.submitButton} onClick={() => handler(stockCode)}>{text}</button>
  )
}
