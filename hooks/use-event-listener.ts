'use client'

import { useEffect, useRef } from 'react'

type EventCallback = (event: Event) => void

export default function useEventListener(
	eventType: string,
	callback: EventCallback,
	element: EventTarget | null = window
): void {
	const callbackRef = useRef<EventCallback>(callback)

	useEffect(() => {
		callbackRef.current = callback
	}, [callback])

	useEffect(() => {
		if (element == null) return

		const handler = (e: Event) => callbackRef.current(e)
		element.addEventListener(eventType, handler)

		return () => element.removeEventListener(eventType, handler)
	}, [eventType, element])
}
