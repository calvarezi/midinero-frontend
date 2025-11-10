export const designSystem = {
  // Espaciado consistente
  spacing: {
    xs: "space-y-2",
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-12",
  },

  // Colores de botones
  buttons: {
    primary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2.5 rounded-lg transition-colors",
    danger: "bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors",
    icon: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
  },

  // Cards consistentes
  cards: {
    base: "bg-white rounded-lg shadow-sm border border-gray-200 p-6",
    hover: "bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-shadow hover:shadow-md",
    elevated: "bg-white rounded-lg shadow-md border border-gray-200 p-6",
  },

  // Tipografía
  typography: {
    h1: "text-3xl font-bold text-gray-800",
    h2: "text-2xl font-semibold text-gray-800",
    h3: "text-xl font-semibold text-gray-800",
    body: "text-base text-gray-700",
    small: "text-sm text-gray-600",
    tiny: "text-xs text-gray-500",
  },

  // Inputs
  inputs: {
    base: "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all",
    error: "w-full border border-red-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none",
    disabled: "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-500 bg-gray-50 cursor-not-allowed",
  },

  // Estados de progreso
  progress: {
    healthy: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      bar: "bg-green-500",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      bar: "bg-yellow-500",
    },
    danger: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      bar: "bg-red-500",
    },
  },
};
