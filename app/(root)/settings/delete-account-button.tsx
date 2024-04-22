'use client'

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import toast from '@/lib/toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Loader from '@/components/loader'
import { deleteUser } from '@/lib/actions/user.actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signOut } from 'next-auth/react'

export default function DeleteAccountButton({
	currentUserId,
	currentUserUsername
}: {
	currentUserId: string
	currentUserUsername: string
}) {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [confirmMessage, setConfirmMessage] = useState('')

	const handleDelete = async () => {
		setLoading(true)

		const response = await deleteUser({ _id: currentUserId })

		if (response.success) {
			toast(response.message)
			await signOut({ callbackUrl: '/register' })
		} else {
			toast(response.message, { type: 'error' })
		}

		setLoading(false)
		setOpen(false)
	}

	return (
		<AlertDialog
			open={open}
			onOpenChange={setOpen}
		>
			<AlertDialogTrigger asChild>
				<Button variant='destructive'>Delete your account</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permamently delete your data
						from our servers
					</AlertDialogDescription>

					<Label className='pt-2'>
						Write <strong>{currentUserUsername}</strong> to confirm
					</Label>
					<Input
						type='text'
						value={confirmMessage}
						onChange={e => setConfirmMessage(e.target.value)}
					/>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

					<Button
						variant='destructive'
						onClick={handleDelete}
						disabled={loading || confirmMessage !== currentUserUsername}
					>
						{loading && <Loader className='mr-2' />}{' '}
						{loading ? 'Deleting...' : 'Delete'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
