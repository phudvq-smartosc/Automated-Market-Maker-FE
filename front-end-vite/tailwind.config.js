/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      display: ["Pally", '"Comic Sans MS"', "sans-serif"],
      body: ["Pally", '"Comic Mono"', "sans-serif"],
    },
    colors: {
      "component-color": "#F7F7F7",
      "background-color": "#EDF6FF",
      white: "#FFFFFF",
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
  plugins: [
    daisyui,
  ],
};
