// Configuración dinámica de API usando variables de entorno
export const getApiConfig = () => {
  // Usar la variable de entorno VITE_API_URL si está disponible
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';
  
  // Construir la URL del WebSocket basada en la URL del API
  const wsUrl = apiUrl.replace('/api/v1', '').replace('http://', 'ws://').replace('https://', 'wss://');
  
  return {
    apiUrl,
    wsUrl
  };
};

// Configuración exportada
export const API_CONFIG = getApiConfig();

// URL base de la API
export const API_URL = API_CONFIG.apiUrl;

// URL del WebSocket
export const WS_URL = API_CONFIG.wsUrl;

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Configuración de timeout
export const REQUEST_TIMEOUT = 30000; // 30 segundos

console.log('🔧 API Configuration:', API_CONFIG);