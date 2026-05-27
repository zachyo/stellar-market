'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface FilterState {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sortBy?: string;
}

export function useURLStateManager(initialState: FilterState = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const urlState: FilterState = {};
    
    if (searchParams.get('category')) {
      urlState.category = searchParams.get('category')!;
    }
    if (searchParams.get('minPrice')) {
      urlState.minPrice = parseInt(searchParams.get('minPrice')!);
    }
    if (searchParams.get('maxPrice')) {
      urlState.maxPrice = parseInt(searchParams.get('maxPrice')!);
    }
    if (searchParams.get('minRating')) {
      urlState.minRating = parseInt(searchParams.get('minRating')!);
    }
    if (searchParams.get('search')) {
      urlState.search = searchParams.get('search')!;
    }
    if (searchParams.get('sortBy')) {
      urlState.sortBy = searchParams.get('sortBy')!;
    }
    
    return { ...initialState, ...urlState };
  });

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const newURL = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.replace(newURL, { scroll: false });
  }, [pathname, router]);

  // Update filters and URL
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  }, [filters, updateURL]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(initialState);
    updateURL(initialState);
  }, [initialState, updateURL]);

  // Reset specific filter
  const resetFilter = useCallback((key: keyof FilterState) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[key];
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  }, [filters, updateURL]);

  return {
    filters,
    updateFilters,
    clearFilters,
    resetFilter,
  };
}

// Hook for managing pagination state in URL
export function usePaginationState(defaultPage = 1, defaultLimit = 10) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const page = parseInt(searchParams.get('page') || defaultPage.toString());
  const limit = parseInt(searchParams.get('limit') || defaultLimit.toString());
  
  const updatePagination = useCallback((newPage: number, newLimit?: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    if (newLimit) {
      params.set('limit', newLimit.toString());
    }
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);
  
  return {
    page,
    limit,
    updatePagination,
  };
}