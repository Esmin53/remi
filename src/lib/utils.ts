import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CARDS, Card } from "./cards";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BACKGROUNDS = ["bg01.jpg", "bg02.jpg", "bg03.jpg", "bg04.jpg", "bg05.jpg", "bg06.jpg"];
export const AVATARS = ["avatar01.jpg", "avatar02.jpg", "avatar03.jpg", "avatar04.jpg", "avatar05.jpg", "avatar06.jpg", "avatar07.jpg", "avatar08.jpg", "avatar09.jpg"];
export const TABLES = ["red.jpg", "blue.jpg", "green.jpg", "purple.jpg", "dark_blue.jpg"]
export const DECKS = ["white", "black"]

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

  for (let i = 1; i < sortedCards.length; i++) {
      if (parseInt(sortedCards[i].value) !== parseInt(sortedCards[i - 1].value) + 1) {
          return false; 
      }
  }

  return true; 
}



export function canIAddToThisMeld({ cards, selectedCard }: { cards: Card[], selectedCard: Card }) {

    if(allUniqueSymbols([...cards, selectedCard])) {
      if(cards[0].value === selectedCard.value) return [...cards, selectedCard]
    }
    if(cards[0].symbol === selectedCard.symbol) {
      if(areCardsSequential([...cards, selectedCard])) {
        return [...cards, selectedCard].slice().sort((a, b) => parseInt(a.value) - parseInt(b.value));
      } else { 
        return null
      }
    } else {
      return null
    }

}

export function playSound(link: string) {
  const sound = new Audio(`/sounds/${link}`);
  sound.play();
}