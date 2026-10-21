'use client';

import { useState, useEffect } from 'react';

export default function CurrentYear() {
  const [year, setYear] = useState('2026');

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return <span suppressHydrationWarning>{year}</span>;
}

