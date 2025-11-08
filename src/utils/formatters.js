/**
 * Formatea un número a formato de moneda local (COP por defecto).
 * @param {number|string} value - Valor numérico o string convertible a número.
 * @param {string} currency - Moneda ISO (por defecto 'COP').
 * @returns {string} Valor formateado, ej: "1.200.000"
 */
export const formatCurrency = (value, currency = "COP") => {
  if (value === null || value === undefined || isNaN(value)) return "0";
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(Number(value));
  } catch {
    return String(value);
  }
};

/**
 * Formatea una fecha a formato legible.
 * @param {string|Date} date - Fecha ISO o Date object.
 * @returns {string} Ejemplo: "08 nov 2025"
 */
export const formatDate = (date) => {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return date;
  }
};

/**
 * Formatea un número a porcentaje con 1 o 2 decimales.
 * @param {number} value - Valor decimal o entero.
 * @param {number} decimals - Cantidad de decimales (por defecto 1).
 * @returns {string} Ejemplo: "45.5%"
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return "0%";
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Limita la longitud de un texto, útil para vistas de resumen.
 * @param {string} text - Texto a truncar.
 * @param {number} maxLength - Longitud máxima (por defecto 60).
 * @returns {string} Texto truncado con "..." al final.
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

/**
 * Convierte un número a formato abreviado (K, M, B).
 * Ejemplo: 1500 → "1.5K", 2500000 → "2.5M"
 * @param {number} value - Valor numérico.
 * @returns {string} Valor abreviado.
 */
export const formatCompactNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0";
  return new Intl.NumberFormat("es-CO", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};
