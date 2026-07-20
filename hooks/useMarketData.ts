import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePairsData() {
  const { data, error, isLoading, mutate } = useSWR('/api/market/pairs', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 5000, // Refresh every 5 seconds for real-time feel
  });

  return {
    pairs: data?.data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useNewsData() {
  const { data, error, isLoading, mutate } = useSWR('/api/market/news', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // News updates less frequently
  });

  return {
    news: data?.data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useEarningsData() {
  const { data, error, isLoading, mutate } = useSWR('/api/market/earnings', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 60000, // Earnings updates infrequently
  });

  return {
    earnings: data?.data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useCommoditiesData() {
  const { data, error, isLoading, mutate } = useSWR('/api/market/commodities', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 15000, // Commodities update regularly
  });

  return {
    commodities: data?.data || [],
    isLoading,
    error,
    mutate,
  };
}
