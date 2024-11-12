import React from 'react';

const RummyRules = () => {
  return (
    <div className="flex-1 py-4 sm:p-6 max-w-7xl mx-auto w-full">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4">How to Play Rummy</h2>

      <section className="mb-2 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Objective</h3>
        <p className='text-sm sm:text-base'>The objective of Rummy is to form valid combinations with your cards by creating &quot;melds,&quot; which are either <strong>sets</strong> (three or four of the same rank in different suits) or <strong>runs</strong> (three or more consecutive cards in the same suit). The first player to meld all their cards wins the game!</p>
      </section>

      <section className="mb-2 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Game Setup</h3>
        <ul className="list-disc ml-6 space-y-2 text-sm sm:text-base">
          <li><strong>Players:</strong> Rummy is played with 2-4 players.</li>
          <li><strong>Deck:</strong> Rummy uses two standard 52-card decks</li>
          <li><strong>Deal:</strong> Each player is dealt a hand of 14 cards. The remaining cards form the <strong>draw pile</strong> with the top card placed face-up as the <strong>discard pile</strong>.</li>
        </ul>
      </section>

      <section className="mb-2 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Gameplay</h3>
        <ul className="list-disc ml-6 space-y-2 text-sm sm:text-base">
          <li><strong>Turns:</strong> Players take turns clockwise. On your turn, you:
            <ol className="list-decimal ml-6 mt-2 space-y-1">
              <li><strong>Draw:</strong> Draw one card from either the draw pile or the discard pile.</li>
              <li><strong>Meld:</strong> If possible, lay down any valid melds (sets or runs) on the table.</li>
              <li><strong>Discard:</strong> End your turn by discarding a card to the discard pile.</li>
            </ol>
          </li>
          <li><strong>Melds:</strong> A meld can be either a:
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Set:</strong> A group of three or four cards of the same rank (e.g., 7♠, 7♦, 7♣).</li>
              <li><strong>Run:</strong> A sequence of three or more consecutive cards in the same suit (e.g., 4♠, 5♠, 6♠).</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-2 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Winning the Game</h3>
        <ul className="list-disc ml-6 space-y-2 text-sm sm:text-base">
          <li><strong>Going Out:</strong> To win, meld all your cards except one, which you discard at the end of your turn.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Tips</h3>
        <ul className="list-disc ml-6 space-y-2 text-sm sm:text-base">
          <li><strong>Hold onto your cards:</strong> Keep cards until you&apos;re ready to meld to avoid revealing your hand.</li>
          <li><strong>Watch your opponent:</strong> Pay attention to cards they pick or discard to anticipate their strategy.</li>
          <li><strong>Discard wisely:</strong> Avoid discarding cards that could complete a meld for your opponent.</li>
        </ul>
      </section>
    </div>
  );
};

export default RummyRules;
