'use client'

import { useMediaQuery } from '@/hooks'

type MediaQueryContentProps = {
	query: string
	children: React.ReactNode
}

export default function MediaQueryContent({
	query,
	children
}: MediaQueryContentProps) {
	const isMatch = useMediaQuery(query)

	return isMatch && children
}
