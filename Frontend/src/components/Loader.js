'use client';
import React, { useState } from 'react';
import styles from '../styles/loader.module.css';

export default function Loader(props) {
  const { isLoading } = props;

  return (
    <div className={styles.wrapper} >
      <div className={isLoading ? styles.loader : ""}></div>
    </div>
  )
}
