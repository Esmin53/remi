import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CARDS } from "./cards";

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
  let cards = CARDS.filter(obj => cardIds.includes(obj.id))

  return cards
}