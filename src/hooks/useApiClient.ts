import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

interface ApiClientOptions {
  baseUrl?: string;
}

const useApiClient = ({ baseUrl = '' }: ApiClientOptions = {}) => {
  // Independent loading states
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const get = async <T>(url: string): Promise<AxiosResponse<T> | null> => {
    setLoadingGet(true);
    try {
      return await axios.get<T>(`${baseUrl}${url}`);
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoadingGet(false);
    }
  };

  const post = async <T>(
    url: string,
    payload: any,
  ): Promise<AxiosResponse<T> | null> => {
    setLoadingPost(true);
    try {
      return await axios.post<T>(`${baseUrl}${url}`, payload);
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoadingPost(false);
    }
  };

  // Return methods and their respective loading states
  return {
    get,
    loadingGet,
    post,
    loadingPost,
    error,
  };
};

export default useApiClient;
