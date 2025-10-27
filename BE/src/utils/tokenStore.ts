const tokenStore = new Set<string>();

export const addToken = (token: string) => tokenStore.add(token);
export const removeToken = (token: string) => tokenStore.delete(token);
export const isTokenValid = (token: string) => tokenStore.has(token);
