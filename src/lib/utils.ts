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