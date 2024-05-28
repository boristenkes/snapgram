'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Modal({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(true)
	const router = useRouter()
	const pathname = usePathname()

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) router.back()
	}

	useEffect(() => {
		if (!pathname.includes('/post/details/')) setOpen(false)
	}, [pathname])

	return (
		<Dialog
			open={open}
			onOpenChange={handleOpenChange}
		>
			<DialogContent>{children}</DialogContent>
		</Dialog>
	)
}
