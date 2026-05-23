import { useEffect, useState } from 'react';

/**
 * Кастомный хук для debounce значения
 * Задержка перед обновлением: 300мс (по умолчанию)
 * 
 * @param value - значение для debounce
 * @param delay - задержка в миллисекундах (по умолчанию 300)
 * @returns отложенное значение
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Устанавливаем таймер для обновления debounced значения
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при изменении value или размонтировании
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
