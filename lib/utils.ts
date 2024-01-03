import clsx, { ClassValue } from 'clsx'
import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...args: ClassValue[]) {
	return twMerge(clsx(args))
}
