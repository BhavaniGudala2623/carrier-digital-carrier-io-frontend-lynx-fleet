export const fetchPublicApi = async <T, R>(path: string, params?: R): Promise<T> => {
  try {
    const response = await fetch(`${process.env.REACT_APP_REST_URL}/public/${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      ...(params && { body: JSON.stringify(params) }),
    });

    if (!response?.ok) {
      throw new Error('Failed to fetch');
    }

    const responseData = await response.json();

    return responseData as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetchPublicApi', error);
    throw error;
  }
};
