import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const MaxWidthWrapper = ({
    className, 
    children
}: {
    className?: string
    children: ReactNode
}) => {
    return (
    <div 
        // combines our default classes that will always be applied with those passed in className in param
        className={cn(
            "h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
             className
        )}>
        {children}
    </div>)
}

export default MaxWidthWrapper