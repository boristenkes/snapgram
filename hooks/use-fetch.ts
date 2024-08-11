'use client'

import { useEffect, useState } from 'react'

export default function useFetch(
	url: string | URL | Request,
	options: ResponseInit | undefined
) {
	const [data, setData] = useState(null)
	const [error, setError] = useState(null)
	const [pending, setPending] = useState(true)

	useEffect(() => {
		let controller = new AbortController()

		const fetchData = async () => {
			try {
				setPending(true)

				const response = await fetch(url, {
					...options,
					signal: controller.signal
				})

				setData(await response.json())
				setError(null)
			} catch (error) {
				setError(error)
				setData(null)
			} finally {
				setPending(false)
			}
		}

		fetchData()

		return () => controller.abort()
	}, [url, options])

	return { data, error, pending }
}

// 'use client'

// import { useEffect, useState } from 'react'

// type UseFetch = {
// 	data: unknown
// 	isLoading: boolean
// 	error: Error | null
// }

// export const useFetch = (
// 	endpoint: string,
// 	options?: ResponseInit
// ): UseFetch => {
// 	const [data, setData] = useState()
// 	const [isLoading, setIsLoading] = useState(true)
// 	const [error, setError] = useState(null)

// 	useEffect(() => {
// 		let abortController = new AbortController()

// 		const fetchData = async () => {
// 			try {
// 				const response = await fetch(endpoint, {
// 					...options,
// 					signal: abortController.signal
// 				})
// 				const newData = await response.json()
// 				setData(newData)
// 				setError(null)
// 			} catch (error) {
// 				if (error.name === 'AbortError') {
// 					setError(error)
// 				}
// 			} finally {
// 				setIsLoading(false)
// 			}
// 		}

// 		fetchData()

// 		return () => {
// 			abortController.abort()
// 		}
// 	}, [endpoint, options])

// 	return { data, isLoading, error }
// }
