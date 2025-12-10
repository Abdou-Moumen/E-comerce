// utils/categoryColorUtils.js

// Dynamic color generation function
export const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  const s = 65 + (hash % 20); // Saturation between 65% and 85%
  const l = 45 + (hash % 20); // Lightness between 45% and 65%

  return `hsl(${h}, ${s}%, ${l}%)`;
};

// Function to determine if a color is dark
export const isColorDark = (color) => {
  const rgb = color.match(/\d+/g);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness < 128;
};

// Memoized category colors
const categoryColors = {};

export const getCategoryColor = (category) => {
  if (!categoryColors[category]) {
    categoryColors[category] = generateColor(category);
  }
  return categoryColors[category];
};

export const base64ToFile = (base64, filename, filetype) => {
  // Check if the base64 string starts with a data URL prefix
  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

  try {
    const byteString = atob(base64Data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], filename, { type: filetype });
  } catch (error) {
    console.error("Error decoding base64 string:", error);
    return null;
  }
};
