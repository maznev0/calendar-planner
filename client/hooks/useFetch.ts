import { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-native";

type FetchFunction<P, T> = (params?: P) => Promise<T>;

interface UsefetchResult<T> {
  data: T | null;
  isLoading: boolean;
}

const useFetch = <T, P>(
  fetchFunction: FetchFunction<P, T>,
  params?: P
): UsefetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const stringParams = params ? new URLSearchParams(params).toString() : "";

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetchFunction(params);
        setData(response);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fetchFunction, stringParams]);

  return { data, isLoading };
};

export default useFetch;
