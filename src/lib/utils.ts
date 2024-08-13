import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CARDS, Card } from "./cards";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function shuffle() {
  const array: number[] = CARDS.map((item) => item.id);
  
  for(let i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array
}

export function getCards(cardIds: number[]) {
  let cards = cardIds.map(id => CARDS.find(obj => obj.id === id));

  return cards as Card[]
}

export function toPusherKey(key: string) {
  
  return key.replace(/:/g, '__')
}


export const allUniqueSymbols = (cards: Card[]) => {
  const symbols = new Set();

  return cards.every(card => {
      if (symbols.has(card.symbol)) {
          return false; 
      }
      symbols.add(card.symbol);
      return true; 
  });
};

export function areCardsSequential(cards: Card[]) {

  const sortedCards = cards.slice().sort((a, b) => parseInt(a.value) - parseInt(b.value));

  console.log("Sorted cards -> ", sortedCards);

  for (let i = 1; i < sortedCards.length; i++) {
      if (parseInt(sortedCards[i].value) !== parseInt(sortedCards[i - 1].value) + 1) {
          return false; 
      }
  }

  return true; 
}