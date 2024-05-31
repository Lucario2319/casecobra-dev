import { useEffect, useRef, useState } from "react"
import { Review } from "./Review"
import { cn } from "@/lib/utils"

interface ReviewColumnProps {
    reviews: string[] //images here but reusable in other projects as a review
    className?: string 
    reviewClassName?: (reviewIndex: number) => string // either stacks columns left-right or up-down(on small device)
    msPerPixel?: number
  }

// shows a single review column consisting of around 2 or more Review
export function ReviewColumn({
    reviews,
    className,
    reviewClassName,
    msPerPixel = 0,
  } : ReviewColumnProps) {
    const columnRef = useRef<HTMLDivElement | null>(null)
    const [columnHeight, setColumnHeight] = useState(0)
    const duration = `${columnHeight * msPerPixel}ms` // duration depends on how high the column is
  
    useEffect(() => {
      if (!columnRef.current) return

      // if user resizes window, we need to resize column height as well
      const resizeObserver = new window.ResizeObserver(() => {
        setColumnHeight(columnRef.current?.offsetHeight ?? 0)
        // this will be defined as if condition used before but typescript issues so had to create a 0 value as well
      })
  
      // links observer to our column div with the columnRef we made earlier
      resizeObserver.observe(columnRef.current)
  
      // to prevent memory leaks
      return () => {
        resizeObserver.disconnect()
      }
    }, [])
  
    return (
      <div
        ref={columnRef}
        className={cn('animate-marquee space-y-8 py-4', className)}
        style={{ '--marquee-duration': duration } as React.CSSProperties}>
        {/* reviews is an array of string/reviews, we concat it to double it and then map each review */}
        {reviews.concat(reviews).map((imgSrc, reviewIndex) => (
          <Review
            key={reviewIndex}
            className={reviewClassName?.(reviewIndex % reviews.length)}
            imgSrc={imgSrc}
          />
        ))}
      </div>
    )
  }
  