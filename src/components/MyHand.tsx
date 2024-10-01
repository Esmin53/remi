import { Card } from "@/lib/cards";
import CardFront from "./CardFront";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ArrowUpFromLine, ChevronUp, Merge, RefreshCcw, SquareArrowUp } from "lucide-react";
import ReactDOM from "react-dom";

interface HandProps {
  selectedCards: Card[];
  selectCard: (card: Card) => void;
  cards: Card[];
  deck: string
  discardCard: () => void
  swapCards: () => void
  meldCards: () => void
}

const MyHand = ({ selectedCards, selectCard, cards, discardCard, swapCards, meldCards, deck  }: HandProps) => {
  const [moveCardsUp, setMoveCardsUp] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [intersectionHeight, setIntersectionHeight] = useState<{ transform: string; transition: string }>({
    transform: "translateY(0px)",
    transition: "transform 0.15s",
  });

  const extractedValue = parseFloat(intersectionHeight.transform.split('(')[1]?.split('px')[0]) || 0;

  const handleCheckIntersection = () => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.bottom > viewportHeight) {
        const intersectingPixels = rect.bottom - viewportHeight;
        const translateYValue = (intersectingPixels - (rect.height * 0.8)).toFixed(1);  


        setIntersectionHeight({ transform: `translateY(-${translateYValue}px)`, transition: 'transform 0.15s' });
        setMoveCardsUp(true);
      } else {
        setIntersectionHeight({ transform: 'translateY(0)', transition: 'transform 0.15s' });
        setMoveCardsUp(false);
      }
    }
  };

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;


      if (rect.bottom > viewportHeight) {
        const intersectingPixels = rect.bottom - viewportHeight;
        const translateYValue = (intersectingPixels - (rect.height * 0.85)).toFixed(1);
        setIntersectionHeight({ transform: `translateY(-${translateYValue}px)`, transition: 'transform 0.15s' });
        setMoveCardsUp(true);
      }
    }
  }, []);

  const chevronElement = (
    <div className="fixed bottom-2 right-2 z-50 w-8 h-8 md:h-10 md:w-10 rounded-full bg-lightblue/50 cursor-pointer flex items-center justify-center"
      onClick={handleCheckIntersection}>
      <ChevronUp className={`w-5 h-5 sm:w-7 sm:h-7 ${moveCardsUp || extractedValue !== 0 ? "rotate-180" : "rotate-0"} duration-100`} />
    </div>
  );

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIntersectionHeight({ transform: `translateY(-${value}px)`, transition: 'transform 0.15s' });
  };

  const sliderElement = (
    <input
      type="range"
      min="0"
      max="300" 
      onChange={handleSlider}
      className="fixed bottom-20 -right-4 md:bottom-24 md:-right-3 z-50 w-20 -rotate-90 cursor-pointer"
    />
  );

  return ( 
    <div className={cn("w-full flex items-start justify-center absolute -bottom-7 sm:-bottom-16 md:-bottom-32 lg:-bottom-36")}>
      <div className="relative w-fit">
        <div className="w-fit h-fit flex justify-center flex-shrink-0 ml-5 sm:ml-10 md:ml-16 lg:ml-20 duration-150"
          style={intersectionHeight}
          ref={divRef}>
            {selectedCards.length === 1 ? <div className="absolute w-7 sm:w-9 md:w-10 h-7 sm:h-9 md:h-10 flex items-center justify-center cursor-pointer
             rounded-full -top-12 bg-lightblue/50 shadow text-gray-800 z-[40]" onClick={discardCard}>
          <ArrowUpFromLine className="w-5 h-5 sm:w-7 sm:h-7 md:h-8 md:w-8"/>
          </div> : null}
            {selectedCards.length === 2 ? <div className="absolute w-7 sm:w-9 md:w-10 h-7 sm:h-9 md:h-10 flex items-center justify-center cursor-pointer
             rounded-full -top-12 bg-lightblue/50 shadow text-gray-800 z-[40]" onClick={swapCards}>
          <RefreshCcw className="w-5 h-5 sm:w-7 sm:h-7 md:h-8 md:w-8"/>
          </div> : null}
            {selectedCards.length > 2 ? <div className="absolute w-7 sm:w-9 md:w-10 h-7 sm:h-9 md:h-10 flex items-center justify-center cursor-pointer
             rounded-full -top-12 bg-lightblue/50 shadow text-gray-800 z-[40]" onClick={meldCards}>
              <Merge className="w-5 h-5 sm:w-7 sm:h-7 md:h-8 md:w-8" />
          </div> : null}
          {cards.map((item) => (
            <div key={item.id} className={cn("hover:-my-4 duration-100")} onClick={() => selectCard(item)}>
              <CardFront card={item} deck={deck}
                className={selectedCards.find((sc) => item.id === sc.id) ? "border-red-500 -my-2 sm:-my-4 shadow-red-glow" : null} />
            </div>
          ))}
        </div>
      </div>

      {ReactDOM.createPortal(chevronElement, document.body)}
      {ReactDOM.createPortal(sliderElement, document.body)}
    </div>
  );
};

export default MyHand;
