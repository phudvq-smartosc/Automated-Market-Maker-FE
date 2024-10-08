/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      display: ["Pally", '"Comic Sans MS"', "sans-serif"],
      body: ["Pally", '"Comic Mono"', "sans-serif"],
    },
    primary: {
      50: "#fff1f2",
      100: "#ffe4e6",
      200: "#fecdd3",
      300: "#fda4af",
      400: "#fb7185",
      500: "#f43f5e",
      600: "#e11d48",
      700: "#be123c",
      800: "#9f1239",
      900: "#881337",
    },
    secondary: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
    },

    extend: {
      maxHeight: {
        100: "25rem", // Custom value, e.g., 400px
        120: "30rem", // Another custom value, e.g., 480px
        150: "37.5rem", // Another custom value, e.g., 480px
        200: "50rem", // Another custom value, e.g., 480px
      },
      maxWidth: {
        100: "25rem", // Custom value, e.g., 400px
        120: "30rem", // Another custom value, e.g., 480px
        150: "37.5rem", // Another custom value, e.g., 480px
        200: "50rem", // Another custom value, e.g., 480px
      },
      width: {
        100: "25rem", // Custom value, e.g., 400px
        120: "30rem", // Another custom value, e.g., 480px
        150: "37.5rem", // Another custom value, e.g., 480px
        200: "50rem", // Another custom value, e.g., 480px
      },
    },
  },
  plugins: [daisyui],
};
