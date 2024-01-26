'use client'

import { useState } from 'react'

export default function useArray<T>(defaultValue: T[]) {
	const [array, setArray] = useState(defaultValue)

	const methods = {
		push(element: T) {
			// Add element at the end
			setArray(a => [...a, element])
		},
		pop() {
			// Remove last element
			setArray(a => a.slice(0, -1))
		},
		shift() {
			// Remove first element
			setArray(a => a.slice(1))
		},
		unshift(element: T) {
			// Add element at begining
			setArray(a => [element, ...a])
		},
		filter(callback: (value: T, index: number, array: T[]) => boolean) {
			// Filter elements
			setArray(a => a.filter(callback))
		},
		replace(index: number, element: T) {
			// Replace element at given index with given element
			setArray(a => [...a.slice(0, index), element, ...a.slice(index + 1)])
		},
		update(index: number, element: T) {
			// Add given element at given index
			setArray(a => [...a.slice(0, index), element, ...a.slice(index)])
		},
		remove(index: number) {
			// Remove element from given index
			setArray(a => [...a.slice(0, index), ...a.slice(index + 1)])
		},
		clear() {
			// Empty array
			setArray([])
		}
	}

	return { array, set: setArray, ...methods }
}
