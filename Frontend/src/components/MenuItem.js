'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import styles from '../styles/navigation.module.css';
import { FaHome, FaStar } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { GrContact } from "react-icons/gr";

const iconsMap = {
  'Home': FaHome,
  'Market': AiOutlineStock,
  'Perferences': FaStar,
  'Contact': GrContact,
}

export default function MenuItem(props) {
  const { name, width, href } = props;
  const Item = iconsMap[name];
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <Link href={href}>
      <li className={`${styles.menuitem} ${selected ? styles.selected : null}`}>
          <div className={styles.logoWrapper}>
            <Item size={width} />
          </div>
          <span>{name}</span>
      </li>
    </Link>
  )
}
