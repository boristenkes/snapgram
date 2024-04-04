'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useFormStatus } from 'react-dom'
import { forwardRef } from 'react'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string
	description?: string
	errors?: string | string[] | undefined
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
}

const TextareaElement = forwardRef<
	HTMLTextAreaElement,
	TextareaProps & { pending?: boolean }
>(
	(
		{ label, className, errors, name, disabled, pending, description, ...rest },
		ref
	) => (
		<div className={cn('relative', !label && className)}>
			<textarea
				className={cn(
					'block bg-neutral-600 p-3 rounded-lg w-full disabled:brightness-50 no-scrollbar',
					{
						'border border-semantic-danger': errors?.length
					}
				)}
				id={label}
				name={name || label}
				autoComplete='off'
				disabled={disabled || pending}
				ref={ref}
				{...rest}
			/>
			{description?.length && (
				<p className='text-neutral-500 text-sm mb-2'>{description}</p>
			)}
			{!!errors?.length && (
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
)

const Errors = ({ errors }: { errors: string | string[] | undefined }) => {
	return (
		!!errors?.length &&
		(typeof errors === 'string' ? (
			<p className='text-semantic-danger'>{errors}</p>
		) : (
			<ul className='text-semantic-danger'>
				{errors.map((error, i) => (
					<li key={i}>{error}</li>
				))}
			</ul>
		))
	)
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			label,
			description,
			name,
			errors = [],
			labelProps,
			disabled,
			className,
			...rest
		},
		ref
	) => {
		const { pending } = useFormStatus()

		if (!label)
			return (
				<>
					<TextareaElement
						label={label}
						className={className}
						errors={errors}
						name={name}
						disabled={disabled}
						pending={pending}
						description={description}
						ref={ref}
						{...rest}
					/>
					<Errors errors={errors} />
				</>
			)

		return (
			<>
				<div className={cn('grid gap-3', label && className)}>
					<label
						htmlFor={label}
						className='capitalize w-fit'
						{...labelProps}
					>
						{label}
					</label>

					<TextareaElement
						label={label}
						className={className}
						errors={errors}
						name={name}
						disabled={disabled}
						pending={pending}
						description={description}
						ref={ref}
						{...rest}
					/>
				</div>
				<Errors errors={errors} />
			</>
		)
	}
)
Textarea.displayName = 'Textarea'

export default Textarea
