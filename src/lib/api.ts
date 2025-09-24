export async function apiFetch<T>(
  endpoint: string,
  token: boolean,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  let headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>)
  };

  if(token) {
	const tk = localStorage.getItem("token");
	headers["Authorization"] = `Bearer ${tk}`;
  }


  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers,	
    ...options,
  })

  if (!res.ok) {
    throw new Error(`Erro na requisição: ${res.status}`)
  }

  return res.json()
}
