import * as tf from '@tensorflow/tfjs';
import { lemmatizer } from "lemmatizer";
import { pipeline, env } from "@xenova/transformers";

// Skip local model check
env.allowLocalModels = false;

export function dateToGoogleFormatString(date) {
  if(!date) return null;
  const year = date.getFullYear();
  const month =  date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${month}/${day}/${year}`;
  return dateStr;
}

export function transform(priceList) {
    let min = Math.min(...priceList);
    let max = Math.max(...priceList);
    let normalizedList = [];
    for(let i = 0; i < priceList.length; i++) {
      normalizedList.push((priceList[i] - min) / (max - min));
    }
    return normalizedList;
}

export function inverseTransform(priceList, min, max) {
    let inversedList = [];
    for(let i = 0; i < priceList.length; i++) {
      inversedList.push(priceList[i] * (max - min) + min);
    }
    return inversedList;
}

export function preprocessedText(text) {
  const stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']
  let tokenizedWords = text.split(' ');
  tokenizedWords = tokenizedWords.map(word => word.replace(/[!@#\$%^&*()-+?_=,<>\"\']/g, ''));
  let lemmatizedWords = tokenizedWords.map(word => lemmatizer(word).toLowerCase());
  let preprocessedWords = lemmatizedWords.map(word => (word in stopwords ? '' : word));
  let resText = preprocessedWords.join(' ');
  return resText;
}

export async function getLSTMPrediction(stockCode, historicalData, startDate) {
  // Set prediction status is "Loading..."
  const model = await tf.loadLayersModel(`/model/${stockCode}/model.json`)
  const dayBefore = 60;
  const startDateStr = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
  let openPriceList = historicalData.map(item => item.open);
  let normalizedPriceList = transform(openPriceList);
  let min = Math.min(...openPriceList);
  let max = Math.max(...openPriceList);
  const listLength = openPriceList.length;
  const startItem = historicalData.find(item => item.date == startDateStr);
  // non-trading day is selected
  if (!startItem) {
    console.error('Date unavailable')
    return;
  }
  const startIndex = historicalData.indexOf(startItem);
  const dayDiff = listLength - startIndex
  let X_test = []
  let result = '';

  for(let i = 0; i < dayDiff; i++) {
    let row = normalizedPriceList.slice(startIndex - dayBefore + i, startIndex + i);
    X_test.push(row);
  }
  X_test = tf.tensor(X_test);
  X_test = tf.reshape(X_test, [dayDiff, dayBefore, 1]);
  result = model.predict(X_test).dataSync();
  result = [...result];

  let predictedStockPrice = inverseTransform(result, min, max);
  return predictedStockPrice;
}

export async function getSentimentResult(newsText, pipe = null) {
  // Sentiment analysis
  let MIN_WORDS = 30;
  let MAX_WORDS = 2000;
  let sentimentPipe = pipe ?? await pipeline('sentiment-analysis', 'Xenova/distilroberta-finetuned-financial-news-sentiment-analysis');
  
  try {
    let text = newsText;
    let wordCount = text.split(' ').length;
    if(wordCount > MAX_WORDS || MIN_WORDS > wordCount) return null;
    text = preprocessedText(text);
    const sentimentResult = await sentimentPipe(text);
    return sentimentResult;

  } catch(error) {
    return null;
  }
}

export async function getAggregatedSentimentScore(newsData) {
  if(!newsData) return null;
  let count = 0;
  let totalScore = 0;
  let sentimentPipe = await pipeline('sentiment-analysis', 'Xenova/distilroberta-finetuned-financial-news-sentiment-analysis');

  for(let i = 0; i < newsData.length; i++) {
    let text = newsData[i].text;
    let sentimentResult = await getSentimentResult(text, sentimentPipe);
    if (!sentimentResult || !sentimentResult[0]) continue;
    let { label, score } = sentimentResult[0];
    if (label === 'neutral') continue;
    console.log(score);
    count++;
    totalScore += (label === 'positive' ? score : -score);
  }
  console.log(count);
  console.log(totalScore);
  return (totalScore / count);
}

// fetching method
export async function fetchStockNews(stockCode, from_date, to_date, num=10) {
  try {
    let res = await fetch(`/api/retrieve?q=${stockCode}&num=${num}&from_date=${dateToGoogleFormatString(from_date)}&to_date=${dateToGoogleFormatString(to_date)}`);
    console.log(res.url);
    let newsData = await res.json();
    console.log('Done')
    return newsData;

  } catch(error) {
    console.error(error);
    return null;
  }
}

export async function fetchStockOptions() {
  const res = await fetch('/api/stocks');
  let stockList = await res.json();
  return stockList;
}

export async function fetchHistoricalData(stockCode, startDate, endDate) {
  let period1 = parseInt((startDate.getTime() - 7948800000) / 1000);
  let period2 = parseInt(endDate.getTime() / 1000);
  let res = await fetch(`/api/historical?q=${stockCode}&period1=${period1}&period2=${period2}`);
  let historicalData = await res.json();
  return historicalData;
}