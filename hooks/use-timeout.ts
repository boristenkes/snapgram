'use client'

import { useCallback, useEffect, useRef } from 'react'

type TimeoutControls = {
	reset: () => void
	clear: () => void
}

export default function useTimeout(
	callback: () => void,
	delay: number
): TimeoutControls {
	const callbackRef = useRef<() => void>(callback)
	const timeoutRef = useRef<NodeJS.Timeout | undefined>()

	useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	const set = useCallback(() => {
		timeoutRef.current = setTimeout(() => {
			callbackRef.current()
		}, delay)
	}, [delay])

	const clear = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}
	}, [])

	useEffect(() => {
		set()
		return clear
	}, [delay, set, clear])

	const reset = useCallback(() => {
		clear()
		set()
	}, [clear, set])

	return { reset, clear }
}
