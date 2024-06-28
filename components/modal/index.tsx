'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
	children: React.ReactNode
	className?: string
}

export default function Modal({ children, className }: Props) {
	const [open, setOpen] = useState(true)
	const router = useRouter()
	const pathname = usePathname()

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) router.back()
	}

	useEffect(() => {
		if (
			!pathname.includes('/post/details/') &&
			!pathname.includes('/story/view/')
		)
			setOpen(false)
	}, [pathname])

	return (
		<Dialog
			open={open}
			onOpenChange={handleOpenChange}
		>
			<DialogContent className={className}>{children}</DialogContent>
		</Dialog>
	)
}
