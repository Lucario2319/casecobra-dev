import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReviewColumn } from './ReviewColumn'

const PHONES = [
	'/testimonials/1.jpg',
	'/testimonials/2.jpg',
	'/testimonials/3.jpg',
	'/testimonials/4.jpg',
	'/testimonials/5.jpg',
	'/testimonials/6.jpg',
]
  
function splitArray<T>(array: Array<T>, numParts: number) {
	const result: Array<Array<T>> = []

	for (let i = 0; i < array.length; i++) {
		const index = i % numParts
		if (!result[index]) {
			// if no indexth inner array, create it (basically index = col num)
			result[index] = []
		}
		result[index].push(array[i])
	}

	return result
}
  
// contains all ReviewColumns in a grid
export function ReviewGrid() {
	const containerRef = useRef<HTMLDivElement | null>(null) // initialized as null and then later set as div
	const isInView = useInView(containerRef, { once: true, amount: 0.4 })
	// once tells to start animation only the first time user sees it
	// amount is percentage (0.4 => 40%) of component that is on screen when animation should start
	const columns = splitArray(PHONES, 3)
	const column1 = columns[0]
	const column2 = columns[1]
	const column3 = splitArray(columns[2], 2) // 2d array, so used flat() inside reviews

	return (
		<div
			ref={containerRef}
			// will act as container for entire review grid
			// we want to display animation only when grid visible on screen, so ref used for that
			// alongside with framer-motion (useInView hook) 

			className='relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3'>
			{isInView ? (
				<>
					{/* if we only have one column, we show this one and hide others, hence all 3 */}
					{/* otherwise, if large screen, other columns also visible and we show 1st col content only */}
					<ReviewColumn
						reviews={[...column1, ...column3.flat(), ...column2]}
						reviewClassName={(reviewIndex) =>
							cn({
								'md:hidden': reviewIndex >= column1.length + column3[0].length,
								'lg:hidden': reviewIndex >= column1.length,
							})
						}
						msPerPixel={10}
					/>
					<ReviewColumn
						reviews={[...column2, ...column3[1]]}
						className='hidden md:block'
						reviewClassName={(reviewIndex) =>
							reviewIndex >= column2.length ? 'lg:hidden' : ''
						}
						msPerPixel={15}
					/>
					<ReviewColumn
						reviews={column3.flat()}
						className='hidden md:block'
						msPerPixel={10}
					/>
				</>
			) : null}
			{/* these divs used for a nice fade due to gradient */}
			<div className='pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100' />
			<div className='pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100' />
		</div>
	)
}