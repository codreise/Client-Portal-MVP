const API_URL = import.meta.env.VITE_API_URL;

export function getToken() {
  return localStorage.getItem('token');
}
export function setToken(token) {
  token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
}

async function request(path, { method = 'GET', body, auth = false, useCredentials = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  // Debug logs (тимчасово — видалити/приглушити в проді)
  console.groupCollapsed && console.groupCollapsed(`[API] ${method} ${path}`);
  console.log('[API] URL     ->', `${API_URL}${path}`);
  console.log('[API] Options ->', { method, auth, useCredentials });
  console.log('[API] Headers ->', headers);
  if (body) console.log('[API] Body    ->', body);

  const fetchOpts = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };
  if (useCredentials) fetchOpts.credentials = 'include';

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, fetchOpts);
  } catch (networkErr) {
    console.error('[API] Network error:', networkErr);
    console.groupEnd && console.groupEnd();
    throw new Error(networkErr.message || 'Network error');
  }

  // Лог сирого тіла відповіді (clone щоб не "з'їсти" стрім)
  let rawText = '';
  try {
    rawText = await res.clone().text();
  } catch (e) {
    rawText = '';
  }
  console.log('[API] Status  ->', res.status);
  console.log('[API] Raw body->', rawText);

  if (!res.ok) {
    // Спробуємо парсити JSON помилку, але без падіння якщо не JSON
    let err = {};
    try {
      err = await res.json();
    } catch (e) {
      err = { error: rawText || `HTTP ${res.status}` };
    }
    console.error('[API] Error ->', err);
    console.groupEnd && console.groupEnd();
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  // Нема контенту
  if (res.status === 204) {
    console.groupEnd && console.groupEnd();
    return null;
  }

  // Повернемо розпарсений JSON, або null якщо тіло пусте / некоректне
  try {
    const json = await res.json();
    console.log('[API] JSON ->', json);
    console.groupEnd && console.groupEnd();
    return json;
  } catch (e) {
    console.warn('[API] Failed to parse JSON response', e);
    console.groupEnd && console.groupEnd();
    return null;
  }
}

export const api = {
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  me: () => request('/me', { auth: true }),

  // projects
  listProjects: (opts = {}) => request('/projects', { auth: true, ...opts }),
  createProject: (data, opts = {}) => request('/projects', { method: 'POST', body: data, auth: true, ...opts }),
  updateProject: (id, data, opts = {}) => request(`/projects/${id}`, { method: 'PUT', body: data, auth: true, ...opts }),
  deleteProject: (id, opts = {}) => request(`/projects/${id}`, { method: 'DELETE', auth: true, ...opts }),
};