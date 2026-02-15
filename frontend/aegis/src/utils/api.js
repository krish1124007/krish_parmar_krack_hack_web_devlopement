export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem('accessToken');
    const headers = options.headers ? { ...options.headers } : {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { ...options, headers };
    return fetch(url, opts);
}

export default apiFetch;
