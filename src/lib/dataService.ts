import { PUBLIC_API_TOKEN } from "$env/static/public";


export const universisGet = async (endpoint: string) => {

    const url = `https://universis-api.it.auth.gr/api/${endpoint}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${PUBLIC_API_TOKEN}`,
      },
    });
    const data = await response.json();
    return data;
    
  };

