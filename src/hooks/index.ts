import { useState, useEffect, useCallback, useRef } from 'react';

// 1. useDebounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 2. useLocalStorage hook
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// 3. usePagination hook
export interface PaginationResult {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  startIndex: number;
  endIndex: number;
}

export function usePagination(totalItems: number, initialPageSize = 10): PaginationResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Keep page in bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalItems, pageSize, currentPage, totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const setPage = useCallback((page: number) => {
    const boundPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(boundPage);
  }, [totalPages]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    currentPage,
    pageSize,
    totalPages,
    nextPage,
    prevPage,
    setPage,
    setPageSize,
    startIndex,
    endIndex,
  };
}

// 4. useFetch hook
export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(fetchFn: () => Promise<T>, dependencies: any[] = []): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchCount = useRef(0);

  const executeFetch = useCallback(() => {
    let isMounted = true;
    const currentFetch = ++fetchCount.current;
    
    setLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        if (isMounted && currentFetch === fetchCount.current) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: any) => {
        if (isMounted && currentFetch === fetchCount.current) {
          setError(err.message || 'An error occurred while fetching data.');
          setData(null);
        }
      })
      .finally(() => {
        if (isMounted && currentFetch === fetchCount.current) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    const cancel = executeFetch();
    return cancel;
  }, [executeFetch]);

  return {
    data,
    loading,
    error,
    refetch: executeFetch,
  };
}
