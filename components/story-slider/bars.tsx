'use client'

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Progress } from '../ui/progress'

type Props = {
	amountOfBars: number
	index: number
	paused: boolean
	authorId: string
	className?: string
}

const intervalDuration = 3000

const StoryBars = ({
	amountOfBars,
	index,
	paused,
	authorId,
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
					if (index < amountOfBars - 1) {
						router.push(
							`/story/view/${authorId}?index=${index + 1}&paused=true`,
							{
								scroll: false
							}
						)
					} else {
						if (intervalRef.current) {
							clearInterval(intervalRef.current)
							router.replace('/', { scroll: false })
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
	}, [paused, index, amountOfBars])

	useEffect(() => {
		setActiveBarValue(0)
	}, [index])

	return (
		<div className={cn('flex items-center gap-1 mb-2', className)}>
			{Array.from({ length: amountOfBars }, (_, idx) => (
				<Progress
					key={idx}
					value={idx < index ? 100 : idx === index ? activeBarValue : 0}
				/>
			))}
		</div>
	)
}

export default StoryBars
