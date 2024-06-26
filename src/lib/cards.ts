export interface Card {
  id: number;
  label: string;
  value: string;
  symbol: string;
  image: string;
}

export const CARDS: Card[] = [
  // First set of cards
  { id: 1, label: '2 of Clovers', value: '2', symbol: 'clovers', image: '/png/black/clovers_2_black.png' },
  { id: 2, label: '3 of Clovers', value: '3', symbol: 'clovers', image: '/png/black/clovers_3_black.png' },
  { id: 3, label: '4 of Clovers', value: '4', symbol: 'clovers', image: '/png/black/clovers_4_black.png' },
  { id: 4, label: '5 of Clovers', value: '5', symbol: 'clovers', image: '/png/black/clovers_5_black.png' },
  { id: 5, label: '6 of Clovers', value: '6', symbol: 'clovers', image: '/png/black/clovers_6_black.png' },
  { id: 6, label: '7 of Clovers', value: '7', symbol: 'clovers', image: '/png/black/clovers_7_black.png' },
  { id: 7, label: '8 of Clovers', value: '8', symbol: 'clovers', image: '/png/black/clovers_8_black.png' },
  { id: 8, label: '9 of Clovers', value: '9', symbol: 'clovers', image: '/png/black/clovers_9_black.png' },
  { id: 9, label: '10 of Clovers', value: '10', symbol: 'clovers', image: '/png/black/clovers_10_black.png' },
  { id: 10, label: 'Jack of Clovers', value: 'Jack', symbol: 'clovers', image: '/png/black/clovers_Jack_black.png' },
  { id: 11, label: 'Queen of Clovers', value: 'Queen', symbol: 'clovers', image: '/png/black/clovers_Queen_black.png' },
  { id: 12, label: 'King of Clovers', value: 'King', symbol: 'clovers', image: '/png/black/clovers_King_black.png' },
  { id: 13, label: 'Ace of Clovers', value: 'Ace', symbol: 'clovers', image: '/png/black/clovers_A_black.png' },
  { id: 14, label: '2 of Hearts', value: '2', symbol: 'hearts', image: '/png/black/hearts_2_black.png' },
  { id: 15, label: '3 of Hearts', value: '3', symbol: 'hearts', image: '/png/black/hearts_3_black.png' },
  { id: 16, label: '4 of Hearts', value: '4', symbol: 'hearts', image: '/png/black/hearts_4_black.png' },
  { id: 17, label: '5 of Hearts', value: '5', symbol: 'hearts', image: '/png/black/hearts_5_black.png' },
  { id: 18, label: '6 of Hearts', value: '6', symbol: 'hearts', image: '/png/black/hearts_6_black.png' },
  { id: 19, label: '7 of Hearts', value: '7', symbol: 'hearts', image: '/png/black/hearts_7_black.png' },
  { id: 20, label: '8 of Hearts', value: '8', symbol: 'hearts', image: '/png/black/hearts_8_black.png' },
  { id: 21, label: '9 of Hearts', value: '9', symbol: 'hearts', image: '/png/black/hearts_9_black.png' },
  { id: 22, label: '10 of Hearts', value: '10', symbol: 'hearts', image: '/png/black/hearts_10_black.png' },
  { id: 23, label: 'Jack of Hearts', value: 'Jack', symbol: 'hearts', image: '/png/black/hearts_Jack_black.png' },
  { id: 24, label: 'Queen of Hearts', value: 'Queen', symbol: 'hearts', image: '/png/black/hearts_Queen_black.png' },
  { id: 25, label: 'King of Hearts', value: 'King', symbol: 'hearts', image: '/png/black/hearts_King_black.png' },
  { id: 26, label: 'Ace of Hearts', value: 'Ace', symbol: 'hearts', image: '/png/black/hearts_A_black.png' },
  { id: 27, label: '2 of Tiles', value: '2', symbol: 'tiles', image: '/png/black/tiles_2_black.png' },
  { id: 28, label: '3 of Tiles', value: '3', symbol: 'tiles', image: '/png/black/tiles_3_black.png' },
  { id: 29, label: '4 of Tiles', value: '4', symbol: 'tiles', image: '/png/black/tiles_4_black.png' },
  { id: 30, label: '5 of Tiles', value: '5', symbol: 'tiles', image: '/png/black/tiles_5_black.png' },
  { id: 31, label: '6 of Tiles', value: '6', symbol: 'tiles', image: '/png/black/tiles_6_black.png' },
  { id: 32, label: '7 of Tiles', value: '7', symbol: 'tiles', image: '/png/black/tiles_7_black.png' },
  { id: 33, label: '8 of Tiles', value: '8', symbol: 'tiles', image: '/png/black/tiles_8_black.png' },
  { id: 34, label: '9 of Tiles', value: '9', symbol: 'tiles', image: '/png/black/tiles_9_black.png' },
  { id: 35, label: '10 of Tiles', value: '10', symbol: 'tiles', image: '/png/black/tiles_10_black.png' },
  { id: 36, label: 'Jack of Tiles', value: 'Jack', symbol: 'tiles', image: '/png/black/tiles_Jack_black.png' },
  { id: 37, label: 'Queen of Tiles', value: 'Queen', symbol: 'tiles', image: '/png/black/tiles_Queen_black.png' },
  { id: 38, label: 'King of Tiles', value: 'King', symbol: 'tiles', image: '/png/black/tiles_King_black.png' },
  { id: 39, label: 'Ace of Tiles', value: 'Ace', symbol: 'tiles', image: '/png/black/tiles_A_black.png' },
  { id: 40, label: '2 of Pikes', value: '2', symbol: 'pikes', image: '/png/black/pikes_2_black.png' },
  { id: 41, label: '3 of Pikes', value: '3', symbol: 'pikes', image: '/png/black/pikes_3_black.png' },
  { id: 42, label: '4 of Pikes', value: '4', symbol: 'pikes', image: '/png/black/pikes_4_black.png' },
  { id: 43, label: '5 of Pikes', value: '5', symbol: 'pikes', image: '/png/black/pikes_5_black.png' },
  { id: 44, label: '6 of Pikes', value: '6', symbol: 'pikes', image: '/png/black/pikes_6_black.png' },
  { id: 45, label: '7 of Pikes', value: '7', symbol: 'pikes', image: '/png/black/pikes_7_black.png' },
  { id: 46, label: '8 of Pikes', value: '8', symbol: 'pikes', image: '/png/black/pikes_8_black.png' },
  { id: 47, label: '9 of Pikes', value: '9', symbol: 'pikes', image: '/png/black/pikes_9_black.png' },
  { id: 48, label: '10 of Pikes', value: '10', symbol: 'pikes', image: '/png/black/pikes_10_black.png' },
  { id: 49, label: 'Jack of Pikes', value: 'Jack', symbol: 'pikes', image: '/png/black/pikes_Jack_black.png' },
  { id: 50, label: 'Queen of Pikes', value: 'Queen', symbol: 'pikes', image: '/png/black/pikes_Queen_black.png' },
  { id: 51, label: 'King of Pikes', value: 'King', symbol: 'pikes', image: '/png/black/pikes_King_black.png' },
  { id: 52, label: 'Ace of Pikes', value: 'Ace', symbol: 'pikes', image: '/png/black/pikes_A_black.png' },

  // Second set of cards
  { id: 53, label: '2 of Clovers', value: '2', symbol: 'clovers', image: '/png/black/clovers_2_black.png' },
  { id: 54, label: '3 of Clovers', value: '3', symbol: 'clovers', image: '/png/black/clovers_3_black.png' },
  { id: 55, label: '4 of Clovers', value: '4', symbol: 'clovers', image: '/png/black/clovers_4_black.png' },
  { id: 56, label: '5 of Clovers', value: '5', symbol: 'clovers', image: '/png/black/clovers_5_black.png' },
  { id: 57, label: '6 of Clovers', value: '6', symbol: 'clovers', image: '/png/black/clovers_6_black.png' },
  { id: 58, label: '7 of Clovers', value: '7', symbol: 'clovers', image: '/png/black/clovers_7_black.png' },
  { id: 59, label: '8 of Clovers', value: '8', symbol: 'clovers', image: '/png/black/clovers_8_black.png' },
  { id: 60, label: '9 of Clovers', value: '9', symbol: 'clovers', image: '/png/black/clovers_9_black.png' },
  { id: 61, label: '10 of Clovers', value: '10', symbol: 'clovers', image: '/png/black/clovers_10_black.png' },
  { id: 62, label: 'Jack of Clovers', value: 'Jack', symbol: 'clovers', image: '/png/black/clovers_Jack_black.png' },
  { id: 63, label: 'Queen of Clovers', value: 'Queen', symbol: 'clovers', image: '/png/black/clovers_Queen_black.png' },
  { id: 64, label: 'King of Clovers', value: 'King', symbol: 'clovers', image: '/png/black/clovers_King_black.png' },
  { id: 65, label: 'Ace of Clovers', value: 'Ace', symbol: 'clovers', image: '/png/black/clovers_A_black.png' },
  { id: 66, label: '2 of Hearts', value: '2', symbol: 'hearts', image: '/png/black/hearts_2_black.png' },
  { id: 67, label: '3 of Hearts', value: '3', symbol: 'hearts', image: '/png/black/hearts_3_black.png' },
  { id: 68, label: '4 of Hearts', value: '4', symbol: 'hearts', image: '/png/black/hearts_4_black.png' },
  { id: 69, label: '5 of Hearts', value: '5', symbol: 'hearts', image: '/png/black/hearts_5_black.png' },
  { id: 70, label: '6 of Hearts', value: '6', symbol: 'hearts', image: '/png/black/hearts_6_black.png' },
  { id: 71, label: '7 of Hearts', value: '7', symbol: 'hearts', image: '/png/black/hearts_7_black.png' },
  { id: 72, label: '8 of Hearts', value: '8', symbol: 'hearts', image: '/png/black/hearts_8_black.png' },
  { id: 73, label: '9 of Hearts', value: '9', symbol: 'hearts', image: '/png/black/hearts_9_black.png' },
  { id: 74, label: '10 of Hearts', value: '10', symbol: 'hearts', image: '/png/black/hearts_10_black.png' },
  { id: 75, label: 'Jack of Hearts', value: 'Jack', symbol: 'hearts', image: '/png/black/hearts_Jack_black.png' },
  { id: 76, label: 'Queen of Hearts', value: 'Queen', symbol: 'hearts', image: '/png/black/hearts_Queen_black.png' },
  { id: 77, label: 'King of Hearts', value: 'King', symbol: 'hearts', image: '/png/black/hearts_King_black.png' },
  { id: 78, label: 'Ace of Hearts', value: 'Ace', symbol: 'hearts', image: '/png/black/hearts_A_black.png' },
  { id: 79, label: '2 of Tiles', value: '2', symbol: 'tiles', image: '/png/black/tiles_2_black.png' },
  { id: 80, label: '3 of Tiles', value: '3', symbol: 'tiles', image: '/png/black/tiles_3_black.png' },
  { id: 81, label: '4 of Tiles', value: '4', symbol: 'tiles', image: '/png/black/tiles_4_black.png' },
  { id: 82, label: '5 of Tiles', value: '5', symbol: 'tiles', image: '/png/black/tiles_5_black.png' },
  { id: 83, label: '6 of Tiles', value: '6', symbol: 'tiles', image: '/png/black/tiles_6_black.png' },
  { id: 84, label: '7 of Tiles', value: '7', symbol: 'tiles', image: '/png/black/tiles_7_black.png' },
  { id: 85, label: '8 of Tiles', value: '8', symbol: 'tiles', image: '/png/black/tiles_8_black.png' },
  { id: 86, label: '9 of Tiles', value: '9', symbol: 'tiles', image: '/png/black/tiles_9_black.png' },
  { id: 87, label: '10 of Tiles', value: '10', symbol: 'tiles', image: '/png/black/tiles_10_black.png' },
  { id: 88, label: 'Jack of Tiles', value: 'Jack', symbol: 'tiles', image: '/png/black/tiles_Jack_black.png' },
  { id: 89, label: 'Queen of Tiles', value: 'Queen', symbol: 'tiles', image: '/png/black/tiles_Queen_black.png' },
  { id: 90, label: 'King of Tiles', value: 'King', symbol: 'tiles', image: '/png/black/tiles_King_black.png' },
  { id: 91, label: 'Ace of Tiles', value: 'Ace', symbol: 'tiles', image: '/png/black/tiles_A_black.png' },
  { id: 92, label: '2 of Pikes', value: '2', symbol: 'pikes', image: '/png/black/pikes_2_black.png' },
  { id: 93, label: '3 of Pikes', value: '3', symbol: 'pikes', image: '/png/black/pikes_3_black.png' },
  { id: 94, label: '4 of Pikes', value: '4', symbol: 'pikes', image: '/png/black/pikes_4_black.png' },
  { id: 95, label: '5 of Pikes', value: '5', symbol: 'pikes', image: '/png/black/pikes_5_black.png' },
  { id: 96, label: '6 of Pikes', value: '6', symbol: 'pikes', image: '/png/black/pikes_6_black.png' },
  { id: 97, label: '7 of Pikes', value: '7', symbol: 'pikes', image: '/png/black/pikes_7_black.png' },
  { id: 98, label: '8 of Pikes', value: '8', symbol: 'pikes', image: '/png/black/pikes_8_black.png' },
  { id: 99, label: '9 of Pikes', value: '9', symbol: 'pikes', image: '/png/black/pikes_9_black.png' },
  { id: 100, label: '10 of Pikes', value: '10', symbol: 'pikes', image: '/png/black/pikes_10_black.png' },
  { id: 101, label: 'Jack of Pikes', value: 'Jack', symbol: 'pikes', image: '/png/black/pikes_Jack_black.png' },
  { id: 102, label: 'Queen of Pikes', value: 'Queen', symbol: 'pikes', image: '/png/black/pikes_Queen_black.png' },
  { id: 103, label: 'King of Pikes', value: 'King', symbol: 'pikes', image: '/png/black/pikes_King_black.png' },
  { id: 104, label: 'Ace of Pikes', value: 'Ace', symbol: 'pikes', image: '/png/black/pikes_A_black.png' },
];