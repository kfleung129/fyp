'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/navigation.module.css';

export default function MenuItem(props) {
  const name = props.name;
  const width = props.width;

  return (
    <li className={styles.menuitem}>
        <Image
          src={`/${name.toLowerCase()}.svg`}
          alt="Logo"
          width={width}
          height={width}
          priority
        />
        <span>{name}</span>
    </li>
  )
}
