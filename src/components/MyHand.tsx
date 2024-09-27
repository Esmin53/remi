import { Card } from "@/lib/cards"
import CardFront from "./CardFront"
import { cn, getCards } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { ChevronUp, LucideArrowUp } from "lucide-react"
import ReactDOM from "react-dom";

interface HandProps {

    selectedCards: Card[]
    selectCard: (card: Card) => void
    cards: Card[]
}

const MyHand = ({selectedCards, selectCard, cards}: HandProps) => {
    const [moveCardsUp, setMoveCardsUp] = useState(false)
    const divRef = useRef<HTMLDivElement | null>(null); 
    const [intersectionHeight, setIntersectionHeight] = useState<{transform: string, transition: string}>({transform: "", transition: ""});

    const handleCheckIntersection = () => {
        if (divRef.current) {
          const rect = divRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
    
          if (rect.bottom > viewportHeight) {
            const intersectingPixels = rect.bottom - viewportHeight;
            const translateYValue = (intersectingPixels + 6).toFixed(1); // Calculate the value
    
            // Set inline style with translateY
            setIntersectionHeight({ transform: `translateY(-${translateYValue}px)`, transition: 'transform 0.15s' });
            setMoveCardsUp(prev => true);
          } else {
            setIntersectionHeight({ transform: 'translateY(0)', transition: 'transform 0.15s' });
            setMoveCardsUp(prev => false);
          }
        }
    };

    const chevronElement = (
        <div className="fixed bottom-2 right-2 z-50 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-lightblue/50 cursor-pointer flex items-center justify-center" 
            onClick={handleCheckIntersection}>
            <ChevronUp className={`w-5 h-5 sm:w-7 sm:h-7 ${!moveCardsUp ? "rotate-0" : "rotate-180"} duration-100`} />
        </div>
    );
    
    return (
        <div className={cn("w-full flex items-start justify-center absolute -bottom-7  sm:-bottom-16 md:-bottom-32 lg:-bottom-36")}>
            <div className="relative w-fit">

            <div className="w-fit h-fit flex justify-center flex-shrink-0 ml-5 sm:ml-10 md:ml-16 lg:ml-20 duration-150 "
            style={intersectionHeight}
            ref={divRef}>
            {cards.length && cards?.map((item, index) => <div key={item.id} className={cn("hover:-my-4 duration-100")} onClick={() =>  selectCard(item)}>
                <CardFront card={item} 
                className={selectedCards.find((sc) => item.id === sc.id ) ? "border-red-500 -my-2 sm:-my-4 shadow-red-glow" : null}/>
            </div>)}
            </div>
            </div>

            {ReactDOM.createPortal(chevronElement, document.body)}
        </div>
    )
}

export default MyHand