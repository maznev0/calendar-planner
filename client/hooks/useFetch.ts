import { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-native";

const useFetch = (fetchFunction, params = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = fetchFunction(...params);
      setData(response);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchFunction]);

  return { data, isLoading };
};

export default useFetch;
