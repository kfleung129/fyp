'use client';
import React, { useState } from 'react';
import styles from '../styles/loader.module.css';

export default function SubmitButton(props) {
  const isLoading = props.isLoading;

  return (
    isLoading ? <div className={isLoading ? styles.loader : ""}></div> : null
  )
}
