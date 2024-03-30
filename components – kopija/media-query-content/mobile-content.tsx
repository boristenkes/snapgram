'use client'

import { useMediaQuery } from '@/hooks'

type MobileContentProps = {
	size?: number
	children: React.ReactNode
}

export default function MobileContent({
	size = 1024,
	children
}: MobileContentProps) {
	const isMobile = useMediaQuery(`(max-width: ${size}px)`)

	return isMobile && children
}
