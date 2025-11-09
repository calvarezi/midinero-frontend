export const formatCurrency = (value, currency = "COP", showSymbol = true) => {
  if (value === null || value === undefined || isNaN(value)) return "0";
  
  try {
    const formatted = new Intl.NumberFormat("es-CO", {
      style: showSymbol ? "currency" : "decimal",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(value));
    
    return showSymbol ? formatted : formatted.replace(/[^\d,.-]/g, "").trim();
  } catch {
    return String(value);
  }
};

export const formatDate = (date, format = "short") => {
  if (!date) return "-";
  
  try {
    const dateObj = new Date(date);
    
    if (format === "short") {
      return dateObj.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }
    
    if (format === "long") {
      return dateObj.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        weekday: "long",
      });
    }
    
    if (format === "time") {
      return dateObj.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    
    return dateObj.toLocaleDateString("es-CO");
  } catch {
    return date;
  }
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return "0%";
  return `${Number(value).toFixed(decimals)}%`;
};

export const truncateText = (text, maxLength = 60) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const formatCompactNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "0";
  return new Intl.NumberFormat("es-CO", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatRelativeTime = (date) => {
  if (!date) return "-";
  
  try {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Hace unos segundos";
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? "s" : ""}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? "s" : ""}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays !== 1 ? "s" : ""}`;
    
    return formatDate(date);
  } catch {
    return date;
  }
};