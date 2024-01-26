'use client'

import { useEffect, useState } from 'react'
import useTimeout from './use-timeout'
import useUpdateEffect from './use-update-effect'

// export default function useDebounce(
// 	callback: () => void,
// 	delay: number,
// 	dependencies: React.DependencyList
// ) {
// 	const { reset, clear } = useTimeout(callback, delay)
// 	useEffect(reset, [...dependencies, reset])
// 	useEffect(clear, [])
// }

export default function useDebounce<T>(value: T, delay: number = 500) {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)
	const [isPending, setIsPending] = useState(false)

	useUpdateEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value)
			setIsPending(false)
		}, delay)

		return () => {
			clearTimeout(timer)
			setIsPending(true)
		}
	}, [value, delay])

	return { debouncedValue, isPending }
}
