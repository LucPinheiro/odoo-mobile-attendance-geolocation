

// URL del servidor RPC de producción (valor por defecto)
export const DEFAULT_RPC_URL = 'https://gestion.probotec.es/jsonrpc';




// Variable mutable para la URL actual (se puede cambiar en runtime)
export let RPC_URL = DEFAULT_RPC_URL;

export function setRpcUrl(url: string) {
  RPC_URL = url;
}

export function resetRpcUrl() {
  RPC_URL = DEFAULT_RPC_URL;
}


// Nombre de la base de datos en Odoo
export const DB = 'gestion.probotec';
