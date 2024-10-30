import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatNaira = (amount: number): string => {
	const formatter = new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN'
	});
	return formatter.format(amount);
};
