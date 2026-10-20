import { cacheLife } from 'next/cache';

export default async function CurrentYear() {
  'use cache';
  cacheLife('days');
  return <span>{new Date().getFullYear()}</span>;
}
