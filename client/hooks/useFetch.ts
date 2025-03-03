import { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-native";

type FetchFunction<T> = () => Promise<T>;

const useFetch = <T>(fetchFunction: FetchFunction<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetchFunction();
        setData(response);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [fetchFunction]);

  return { data, isLoading };
};

export default useFetch;
