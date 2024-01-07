import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast as originalToast } from 'react-hot-toast'

export function cn(...args: ClassValue[]) {
	return twMerge(clsx(args))
}

export function isBase64(imageData: string) {
	const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/
	return base64Regex.test(imageData)
}

export function currentTime() {
	const d = new Date()
	const hrs = leadingZeros(d.getHours())
	const mins = leadingZeros(d.getMinutes())
	const secs = leadingZeros(d.getSeconds())
	return `${hrs}:${mins}:${secs}:`
}

export function leadingZeros(n: number) {
	return n < 10 ? `0${n}` : n.toString()
}

const MAX_IMAGE_FILE_SIZE = 2 * 1024 * 1024 // 2 MB
const ACCEPTABLE_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp'
]

type ValidateImageOptions = {
	maxSize?: number
	acceptableTypes?: string[]
}

export function validateImage(
	image: File,
	{
		maxSize = MAX_IMAGE_FILE_SIZE,
		acceptableTypes = ACCEPTABLE_IMAGE_TYPES
	}: ValidateImageOptions = {}
) {
	const errors = []

	if (!acceptableTypes.includes(image.type))
		errors.push('Only .jpeg, .jpg, .png and .webp images are allowed.')

	if (image?.size > maxSize)
		errors.push('Please choose an image smaller than 2MB')

	if (!errors.length) return { success: true, errors }

	return { success: false, errors }
}
