'use client'

import Image from 'next/image'
import { FormField } from '@/lib/types'
import { LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type InputProps = FormField & {
	textarea?: boolean
	errors?: string[]
	labelProps?: LabelHTMLAttributes<HTMLLabelElement>
}

export default function Input({
	label,
	name,
	textarea,
	errors = [],
	labelProps,
	className,
	...rest
}: InputProps) {
	const InputElement = () => (
		<div className='relative'>
			<input
				className={cn('input', {
					'input--error': errors.length
				})}
				// className={`input${errors.length ? ' input--error' : ''}`}
				id={label}
				name={name || label}
				{...rest}
			/>
			{Boolean(errors.length) && (
				<Image
					src='/assets/icons/error.webp'
					alt='Error'
					width={18}
					height={18}
					className='absolute top-1/2 right-4 -translate-y-1/2'
				/>
			)}
		</div>
	)

	const InputError = () =>
		Boolean(errors?.length) && (
			<ul className='text-semantic-danger'>
				{errors.map((error, i) => (
					<li key={i}>{error}</li>
				))}
			</ul>
		)

	if (!label)
		return (
			<>
				<InputElement />
				<InputError />
			</>
		)

	return (
		<>
			<div className='input_wrapper'>
				<label
					htmlFor={label}
					className='input_label'
					{...labelProps}
				>
					{label}
				</label>

				<InputElement />
			</div>
			<InputError />
		</>
	)
}
