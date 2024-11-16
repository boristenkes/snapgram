'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { Button, ButtonProps } from './ui/button'

type CopyButtonProps = ButtonProps & { text: string }

export default function CopyButton({ text, ...props }: CopyButtonProps) {
	const [copied, setCopied] = useState(false)

	const copy = async () => {
		await navigator.clipboard.writeText(text)
		setCopied(true)

		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Button
			onClick={copy}
			size='icon'
			variant='secondary'
			aria-label='Copy'
			{...props}
		>
			{copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
		</Button>
	)
}
