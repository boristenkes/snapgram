'use client'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { switchAccountPrivate } from '@/lib/actions/user.actions'
import toast from '@/lib/toast'

export default function PrivateAccountSwitch({
	userId,
	defaultIsPrivate
}: {
	userId: string
	defaultIsPrivate: boolean
}) {
	const togglePrivate = async (isPrivate: boolean) => {
		const response = await switchAccountPrivate(userId, isPrivate)

		toast(response.message, {
			type: response.success ? 'success' : 'error'
		})
	}

	return (
		<div className='flex items-center space-x-2 py-2'>
			<Switch
				id='private-account'
				defaultChecked={defaultIsPrivate}
				onCheckedChange={checked => togglePrivate(checked)}
			/>
			<Label htmlFor='private-account'>Private account</Label>
		</div>
	)
}
