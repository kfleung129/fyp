'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/navigation.module.css';
import MenuItem from './MenuItem';

export default function NavigationBar(props) {
  const [menuPressed, setMenuPressed] = useState(false);

  function onPressMenu () {
    setMenuPressed(!menuPressed);
  }

  const menuWidth = 30;

  return (
    <nav className={`${styles.menu} ${menuPressed ? styles.opened : styles.hid}`}>
      <header>
        <Image
          src="/logo.svg"
          alt="Logo"
          width={60}
          height={60}
          className={styles.logo}
          onClick={onPressMenu}
          priority
        />
        <h2>StockRem</h2>
      </header>
      <ul>
        <MenuItem name='Home' href='/' width={menuWidth} />
        <MenuItem name='Market' href='/market' width={menuWidth} />
        <MenuItem name='Perferences' href='/perferences' width={menuWidth} />
        <MenuItem name='Contact' href='/contact' width={menuWidth} />
      </ul>
    </nav>
  )
}
