type LoginRequest = {
  username: string,
  password: string,
  permission: string,
}
type LoginResponse = {
  user:{
    name: string,
  },
  token: string,
}

export const LoginApi = async({username, password, permission}:LoginRequest) => {
  const response = await fetch("/api/login", {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    method: 'POST',
    body: JSON.stringify({ username, password, permission }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }
  const data:LoginResponse = await response.json();
  return data;
}

export const SingUpApi = async({username, password, permission}:LoginRequest) => {
    const response = await fetch("/api/signup", {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      method: 'POST',
      body: JSON.stringify({ username, password, permission }),
    });
  
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }
    const data:LoginResponse = await response.json();
    return data;
  }