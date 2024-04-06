'use client';
import React, { useState } from 'react';
import styles from '../styles/graph.module.css';
import Loader from '@/components/Loader';
import { LineChart, XAxis, YAxis, Tooltip, Line, Legend } from 'recharts';

export default function GraphDisplay(props) {
  const displayContent = props.displayContent;
  const stockCode = displayContent?.stockCode;
  const displayList = displayContent?.displayList;
  const isLoading = props.isLoading;
  const WIDTH = 1400;
  const HEIGHT = WIDTH * (9 / 16);
  const SHOW_ANIMATION = false;
  const SHOW_DOT = false;
  const TICK_SIZE = 6;
  const TICK_MARGIN = 12
  const X_INTERVAL = 10;
  const X_PADDING = 40;
  const Y_DOMAIN = ['auto', 'auto'];
  const TITLE = `${stockCode} Recommendation`;
  const TITLE_SIZE = 24;
  const TITLE_COLOR = '#7f56d9';
  const TITLE_WEIGHT = 'bold';
  const DECIMAL_PLACE = 3;
  const FORMAT_STRING = {
    'open': 'Opening price',
    'adjclose': 'Adjusted closing price',
    'predict': 'Predicted closing price'
  }
  const CustomTooltip = ({ active, payload, label }) => {
    let labelList = payload.map(item => (
      <p style={{ color: item.stroke }}>{`${FORMAT_STRING[item.dataKey]} : ${item.value.toFixed(DECIMAL_PLACE)}`}</p>
    ));

    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#878787', padding: '1em', opacity: 0.8, borderRadius: 20 }} >
          <h3>{label}</h3>
          {labelList}
        </div>
      );
    }
  
    return null;
  };

  return (
    <div style={{ background: '#2c2e3a', width: '100vw', height: '90vh' }} className={styles.screen}>
        <Loader isLoading={isLoading} />
        {
        (!displayList || isLoading)  ? null :
        <LineChart 
            width={WIDTH} 
            height={HEIGHT}
            aspect={16 / 9}
            data={displayList}
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
            <XAxis padding={{left: X_PADDING, right: X_PADDING}} dataKey='date' interval={X_INTERVAL} tickMargin={TICK_MARGIN} tickSize={TICK_SIZE} />
            <YAxis tickMargin={TICK_MARGIN} domain={Y_DOMAIN} tickSize={TICK_SIZE} />
            <Tooltip content={<CustomTooltip />}  />
            <Line isAnimationActive={SHOW_ANIMATION} type='monotone' dataKey='adjclose' stroke={'#953ef7'} dot={SHOW_DOT} />
            <Line isAnimationActive={SHOW_ANIMATION} type='monotone' dataKey='predict' stroke={'#39e75f'} dot={SHOW_DOT} />
        </LineChart>
        }
    </div>
  )
}
