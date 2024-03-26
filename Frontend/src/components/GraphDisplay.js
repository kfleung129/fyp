'use client';
import React, { useState } from 'react';
import styles from '../styles/graph.module.css';
import { LineChart, XAxis, YAxis, Tooltip, Line, Legend } from 'recharts';

export default function GraphDisplay(props) {
  const historicalDataList = props.historicalDataList;
  const stockCode = props.stockCode;
  const WIDTH = 1400;
  const HEIGHT = WIDTH * (9 / 16);
  const STROKE_COLOR = '#7f56d9';
  const SHOW_ANIMATION = false;
  const SHOW_DOT = false;
  const TICK_SIZE = 6;
  const TICK_MARGIN = 12
  const X_INTERVAL = 8;
  const X_PADDING_LEFT = 40;
  const Y_DOMAIN = ['auto', 'auto'];
  const TITLE = `${stockCode} Recommendation`;
  const TITLE_SIZE = 24;
  const TITLE_COLOR = '#7f56d9';
  const TITLE_WEIGHT = 'bold';
  const FORMAT_STRING = {
    'open': 'Opening price',
    'adjclose': 'Adjusted closing price'
  }

  return (
    <div style={{ background: '#2c2e3a', width: '100vw', height: '90vh' }} className={styles.screen}>
        {
        !historicalDataList ? null :
        <LineChart 
            width={WIDTH} 
            height={HEIGHT}
            aspect={16 / 9}
            data={historicalDataList}
            className={styles.chart}
        >
            <text
                x='50%'
                y='3%'
                style={{ fontSize: TITLE_SIZE, fontWeight: TITLE_WEIGHT, fill: TITLE_COLOR }}
                textAnchor='middle'
            >
            {TITLE}
            </text>
            <Legend formatter={(value, entry, index) => (FORMAT_STRING[value])} iconType='diamond' verticalAlign='top' align='right' />
            <XAxis padding={{left: X_PADDING_LEFT}} dataKey='date' interval={X_INTERVAL} tickMargin={TICK_MARGIN} tickSize={TICK_SIZE} />
            <YAxis tickMargin={TICK_MARGIN} domain={Y_DOMAIN} tickSize={TICK_SIZE} />
            <Tooltip formatter={(value, name, props) => [value, FORMAT_STRING[name]]} />
            <Line isAnimationActive={SHOW_ANIMATION} type='monotone' dataKey='adjclose' stroke={STROKE_COLOR} dot={SHOW_DOT} />
            <Line isAnimationActive={SHOW_ANIMATION} type='monotone' dataKey='open' stroke={'red'} dot={SHOW_DOT} />
        </LineChart>
        }
    </div>
  )
}
