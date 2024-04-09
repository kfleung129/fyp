'use client';
import React, { useState } from 'react';
import styles from '../styles/loader.module.css';

export default function Loader(props) {
  const { isLoading, size, borderSize } = props;

  return (
    <div className={styles.wrapper} >
      <div style={{ width: size, borderWidth: borderSize }} className={isLoading ? styles.loader : ""}></div>
    </div>
  )
}
