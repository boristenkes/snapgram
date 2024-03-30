'use client'

import { useMediaQuery } from '@/hooks'

type DesktopContentProps = {
	size?: number
	children: React.ReactNode
}

export default function DesktopContent({
	size = 1024,
	children
}: DesktopContentProps) {
	const isDesktop = useMediaQuery(`(min-width: ${size}px)`)

	return isDesktop && children
}
