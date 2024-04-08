import { lemmatizer } from "lemmatizer";

export function transform(priceList) {
    let min = Math.min(...priceList);
    let max = Math.max(...priceList);
    let normalizedList = [];
    for(let i = 0; i < priceList.length; i++) {
      normalizedList.push((priceList[i] - min) / (max - min));
    }
    return normalizedList;
}

export function inverse_transform(priceList, min, max) {
    let inversedList = [];
    for(let i = 0; i < priceList.length; i++) {
      inversedList.push(priceList[i] * (max - min) + min);
    }
    return inversedList;
}

export function preprocessedText(text) {
  const stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']
  const special_characters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '?', '_', '=', ',', '<', '>', '\"'];
  const tokenizedWords = text.split(' ');
  const lemmatizedWords = tokenizedWords.map(word => lemmatizer(word));
  let preprocessedWords = lemmatizedWords.map(word => (word in stopwords ? '' : word));
  preprocessedWords = preprocessedWords.map(word => (word in special_characters ? '' : word));
  let resText = preprocessedWords.join(' ');
  return resText;
}

// def get_preprocessed_text(text):
//     text = str(text)
//     stop_words = set(stopwords.words("english"))
//     special_characters = "!@#$%^&*()-+?_=,<>\""
//     lemmatizer = WordNetLemmatizer()
//     tokenized_words = word_tokenize(text.lower())
//     lemmatized_words = [lemmatizer.lemmatize(word) for word in tokenized_words]
//     lemmatized_words = [word for word in lemmatized_words if word in words]
//     preprocessed_words = [word for word in lemmatized_words if word not in stop_words]
//     preprocessed_words = [word for word in lemmatized_words if word not in special_characters]
//     preprocessed_text = " ".join(preprocessed_words)
//     return preprocessed_text