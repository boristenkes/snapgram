'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

export default function Modal({ children }: { children: React.ReactNode }) {
	const router = useRouter()

	const handleOpenChange = (open: boolean) => {
		if (!open) router.back()
	}

	return (
		<Dialog
			open
			onOpenChange={handleOpenChange}
		>
			<DialogContent>{children}</DialogContent>
		</Dialog>
	)
}
