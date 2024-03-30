import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function deepFreeze(value: Record<any, any> | any[]) {
	const isArray = Array.isArray(value)

	const propNames = isArray ? value : Object.keys(value)

	for (const name of propNames) {
		const val = isArray ? name : value[name]

		if ((val && typeof val === 'object') || typeof val === 'function') {
			deepFreeze(val)
		}
	}

	return Object.freeze(value)
}

export function removeDuplicates(array: any[], id?: string | number) {
	if (typeof array[0] !== 'object') {
		return Array.from(new Set([...array]))
	}

	if (!id) throw new Error('id is required when array contains objects')

	return array.filter(
		(item, index, self) => index === self.findIndex(t => t[id] === item[id])
	)
}

export const delay = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms))

export const bytesToMegabytes = (bytes: number) => bytes / (1024 * 1024)

export const megabytesToBytes = (mb: number) => mb * (1024 * 1024)

export const id = () => Math.random().toString(36).slice(2)
