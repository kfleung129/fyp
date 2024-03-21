'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/navigation.module.css';
import MenuItem from './MenuItem';

export default function NavigationBar(props) {
  const menuPressed = props.menuPressed
  const onPressMenu = props.onPressMenu;
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
        <h2>Gademic</h2>
      </header>
      <ul>
        <MenuItem name='Home' width={menuWidth} />
        <MenuItem name='Market' width={menuWidth} />
        <MenuItem name='Perferences' width={menuWidth} />
        <MenuItem name='Contact' width={menuWidth} />
      </ul>
    </nav>
  )
}
