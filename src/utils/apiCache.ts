/**
 * Простая система кэширования для API запросов
 * Кэширует данные в памяти приложения
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live в миллисекундах
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Получить данные из кэша
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Проверяем, не истекло ли время жизни кэша
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Сохранить данные в кэш
   * @param key - ключ кэша
   * @param data - данные для кэширования
   * @param ttl - время жизни в миллисекундах (по умолчанию 10 минут)
   */
  set<T>(key: string, data: T, ttl: number = 10 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Очистить весь кэш
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Удалить конкретный ключ из кэша
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Получить размер кэша
   */
  size(): number {
    return this.cache.size;
  }
}

export const apiCache = new APICache();
