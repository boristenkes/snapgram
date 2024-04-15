'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

export default function Modal({ children }: { children: React.ReactNode }) {
	const router = useRouter()

	const handleOpenChange = (open: boolean) => {
		if (!open) router.back()
	}

	return (
		<Dialog
			defaultOpen
			onOpenChange={handleOpenChange}
		>
			<DialogContent>{children}</DialogContent>
		</Dialog>
	)
}
