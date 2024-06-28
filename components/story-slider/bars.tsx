'use client'

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Progress } from '../ui/progress'

type Props = {
	amountOfBars: number
	currentIndex: number
	setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
	paused?: boolean
	className?: string
}

const intervalDuration = 3000

const StoryBars = ({
	amountOfBars,
	currentIndex,
	setCurrentIndex,
	paused,
	className
}: Props) => {
	const [activeBarValue, setActiveBarValue] = useState(0)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)
	const router = useRouter()

	useEffect(() => {
		const updateProgress = () => {
			setActiveBarValue(prevValue => {
				if (paused) return prevValue

				if (prevValue < 100) {
					return prevValue + 1
				} else {
					if (currentIndex < amountOfBars - 1) {
						setCurrentIndex(currentIndex + 1)
					} else {
						if (intervalRef.current) {
							clearInterval(intervalRef.current)
							router.replace('/')
						}
					}
					return 100
				}
			})
		}

		if (!paused) {
			intervalRef.current = setInterval(updateProgress, intervalDuration / 100)
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [paused, currentIndex, amountOfBars, setCurrentIndex])

	useEffect(() => {
		setActiveBarValue(0)
	}, [currentIndex])

	return (
		<div className={cn('flex items-center gap-1 mb-2', className)}>
			{Array.from({ length: amountOfBars }, (_, idx) => (
				<Progress
					key={idx}
					value={
						idx < currentIndex ? 100 : idx === currentIndex ? activeBarValue : 0
					}
				/>
			))}
		</div>
	)
}

export default StoryBars
