import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTelegramLink(params: {
  username: string;
  productName: string;
  sku?: string;
  size?: string;
  color?: string;
  price: string;
  url?: string;
}): string {
  const cleanUsername = params.username.replace('@', '').trim();
  const text = encodeURIComponent(
    `Hello HOME SPORT! ⚽\n\nI want to order:\n• Product: ${params.productName}\n• SKU: ${params.sku || 'N/A'}\n• Size: ${params.size || 'Not selected'}\n• Color: ${params.color || 'Standard'}\n• Price: ${params.price}\n\nIs this still available for delivery? Thank you!\n${params.url || ''}`
  );
  return `https://t.me/${cleanUsername}?text=${text}`;
}

export function generateMessengerLink(pageUsername: string): string {
  const cleanUsername = pageUsername.replace('https://m.me/', '').replace('/', '').trim();
  return `https://m.me/${cleanUsername}`;
}

export function generatePhoneLink(phone: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  return `tel:${cleanPhone}`;
}
