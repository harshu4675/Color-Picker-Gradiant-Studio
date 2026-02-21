import { useState, useEffect, useCallback, useRef } from "react";
import "./app.css";

// Color name database (simplified)
const colorNames = {
  "#FF0000": "Red",
  "#00FF00": "Lime",
  "#0000FF": "Blue",
  "#FFFF00": "Yellow",
  "#FF00FF": "Magenta",
  "#00FFFF": "Cyan",
  "#FFA500": "Orange",
  "#800080": "Purple",
  "#FFC0CB": "Pink",
  "#A52A2A": "Brown",
  "#808080": "Gray",
  "#000000": "Black",
  "#FFFFFF": "White",
  "#FFD700": "Gold",
  "#C0C0C0": "Silver",
  "#000080": "Navy",
  "#008080": "Teal",
  "#800000": "Maroon",
  "#808000": "Olive",
  "#FF6347": "Tomato",
  "#4169E1": "Royal Blue",
  "#32CD32": "Lime Green",
  "#FF69B4": "Hot Pink",
  "#8B4513": "Saddle Brown",
  "#2E8B57": "Sea Green",
  "#6A5ACD": "Slate Blue",
  "#FF4500": "Orange Red",
  "#DA70D6": "Orchid",
  "#EEE8AA": "Pale Goldenrod",
  "#98FB98": "Pale Green",
  "#AFEEEE": "Pale Turquoise",
  "#DB7093": "Pale Violet Red",
  "#FFEFD5": "Papaya Whip",
  "#FFDAB9": "Peach Puff",
  "#CD853F": "Peru",
  "#DDA0DD": "Plum",
  "#B0E0E6": "Powder Blue",
  "#BC8F8F": "Rosy Brown",
  "#4169E1": "Royal Blue",
  "#8B4513": "Saddle Brown",
  "#FA8072": "Salmon",
  "#F4A460": "Sandy Brown",
  "#2E8B57": "Sea Green",
  "#FFF5EE": "Seashell",
  "#A0522D": "Sienna",
  "#87CEEB": "Sky Blue",
  "#6A5ACD": "Slate Blue",
  "#708090": "Slate Gray",
  "#FFFAFA": "Snow",
  "#00FF7F": "Spring Green",
  "#4682B4": "Steel Blue",
  "#D2B48C": "Tan",
  "#D8BFD8": "Thistle",
  "#FF6347": "Tomato",
  "#40E0D0": "Turquoise",
  "#EE82EE": "Violet",
  "#F5DEB3": "Wheat",
  "#F5F5F5": "White Smoke",
  "#9ACD32": "Yellow Green",
};

// Preset Palettes
const presetPalettes = {
  sunset: ["#FF6B6B", "#FEC89A", "#FFD93D", "#6BCB77", "#4D96FF"],
  ocean: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#03045E"],
  forest: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"],
  candy: ["#FF85A1", "#FBB1BD", "#F9D5E5", "#EEAC99", "#E06377"],
  neon: ["#FF00FF", "#00FFFF", "#FF00AA", "#AAFF00", "#00AAFF"],
  pastel: ["#FFB5E8", "#FF9CEE", "#B28DFF", "#85E3FF", "#BFFCC6"],
  earth: ["#8B4513", "#A0522D", "#CD853F", "#DEB887", "#F5DEB3"],
  vintage: ["#2C3E50", "#E74C3C", "#ECF0F1", "#3498DB", "#2980B9"],
  monochrome: ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"],
  rainbow: ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#8B00FF"],
};

export default function App() {
  // Basic Color State
  const [red, setRed] = useState(128);
  const [green, setGreen] = useState(90);
  const [blue, setBlue] = useState(213);
  const [alpha, setAlpha] = useState(1);

  // UI State
  const [activeTab, setActiveTab] = useState("picker");
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // History & Favorites
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("colorFavorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Gradient State
  const [isGradient, setIsGradient] = useState(false);
  const [gradientType, setGradientType] = useState("linear");
  const [gradientAngle, setGradientAngle] = useState(45);
  const [gradientStops, setGradientStops] = useState([
    { color: "#805AD5", position: 0 },
    { color: "#FF6B6B", position: 100 },
  ]);

  // Saved Palettes
  const [savedPalettes, setSavedPalettes] = useState(() => {
    const saved = localStorage.getItem("savedPalettes");
    return saved ? JSON.parse(saved) : [];
  });
  const [paletteName, setPaletteName] = useState("");
  const [currentPalette, setCurrentPalette] = useState([]);

  // Contrast Checker
  const [contrastBg, setContrastBg] = useState("#FFFFFF");
  const [contrastText, setContrastText] = useState("#000000");

  // Color Blindness
  const [colorBlindMode, setColorBlindMode] = useState("normal");

  // Image Color Extraction
  const [extractedColors, setExtractedColors] = useState([]);
  const imageInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Mixer
  const [mixColor1, setMixColor1] = useState("#FF0000");
  const [mixColor2, setMixColor2] = useState("#0000FF");
  const [mixRatio, setMixRatio] = useState(50);

  // Animation Preview
  const [animationType, setAnimationType] = useState("pulse");
  const [isAnimating, setIsAnimating] = useState(false);

  // CSS Generator
  const [cssProperty, setCssProperty] = useState("background");

  // Hex Input
  const [hexInput, setHexInput] = useState("");

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // === Calculations ===
  const rgb = `rgb(${red}, ${green}, ${blue})`;
  const rgba = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

  const hex = `#${Number(red).toString(16).padStart(2, "0")}${Number(green)
    .toString(16)
    .padStart(
      2,
      "0",
    )}${Number(blue).toString(16).padStart(2, "0")}`.toUpperCase();

  const hexa = `${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")}`.toUpperCase();

  // Luminance for text color
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const textColor =
    getLuminance(red, green, blue) > 0.179 ? "#000000" : "#FFFFFF";

  // HSL Conversion
  const getHSL = useCallback(() => {
    let r = red / 255,
      g = green / 255,
      b = blue / 255;
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      string: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      hsla: `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${alpha})`,
    };
  }, [red, green, blue, alpha]);

  // HSV/HSB Conversion
  const getHSV = useCallback(() => {
    let r = red / 255,
      g = green / 255,
      b = blue / 255;
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s,
      v = max;
    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          break;
      }
      h /= 6;
    }
    return `hsv(${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%)`;
  }, [red, green, blue]);

  // CMYK Conversion
  const getCMYK = useCallback(() => {
    let r = red / 255,
      g = green / 255,
      b = blue / 255;
    let k = 1 - Math.max(r, g, b);
    let c = (1 - r - k) / (1 - k) || 0;
    let m = (1 - g - k) / (1 - k) || 0;
    let y = (1 - b - k) / (1 - k) || 0;
    return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
  }, [red, green, blue]);

  // LAB Conversion
  const getLAB = useCallback(() => {
    let r = red / 255,
      g = green / 255,
      b = blue / 255;

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

    return `lab(${Math.round(116 * y - 16)}, ${Math.round(500 * (x - y))}, ${Math.round(200 * (y - z))})`;
  }, [red, green, blue]);

  // Get closest color name
  const getColorName = useCallback(() => {
    let closestName = "Custom Color";
    let minDistance = Infinity;

    Object.entries(colorNames).forEach(([hexVal, name]) => {
      const r2 = parseInt(hexVal.slice(1, 3), 16);
      const g2 = parseInt(hexVal.slice(3, 5), 16);
      const b2 = parseInt(hexVal.slice(5, 7), 16);

      const distance = Math.sqrt(
        Math.pow(red - r2, 2) +
          Math.pow(green - g2, 2) +
          Math.pow(blue - b2, 2),
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestName = name;
      }
    });

    return closestName;
  }, [red, green, blue]);

  // Generate gradient CSS
  const getGradientCSS = useCallback(() => {
    const stops = gradientStops
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      return `linear-gradient(${gradientAngle}deg, ${stops})`;
    } else if (gradientType === "radial") {
      return `radial-gradient(circle, ${stops})`;
    } else {
      return `conic-gradient(from ${gradientAngle}deg, ${stops})`;
    }
  }, [gradientType, gradientAngle, gradientStops]);

  // Color Harmony Functions
  const getComplementary = () => {
    return `#${(255 - red).toString(16).padStart(2, "0")}${(255 - green)
      .toString(16)
      .padStart(
        2,
        "0",
      )}${(255 - blue).toString(16).padStart(2, "0")}`.toUpperCase();
  };

  const getAnalogous = () => {
    const hsl = getHSL();
    return [
      `hsl(${(hsl.h - 30 + 360) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      `hsl(${(hsl.h + 30) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    ];
  };

  const getTriadic = () => {
    const hsl = getHSL();
    return [
      `hsl(${(hsl.h + 120) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      `hsl(${(hsl.h + 240) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    ];
  };

  const getSplitComplementary = () => {
    const hsl = getHSL();
    return [
      `hsl(${(hsl.h + 150) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      `hsl(${(hsl.h + 210) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    ];
  };

  const getTetradic = () => {
    const hsl = getHSL();
    return [
      `hsl(${(hsl.h + 90) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      `hsl(${(hsl.h + 270) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    ];
  };

  const getShades = () => {
    return [0.2, 0.4, 0.6, 0.8, 1].map(
      (factor) =>
        `rgb(${Math.round(red * factor)}, ${Math.round(green * factor)}, ${Math.round(blue * factor)})`,
    );
  };

  const getTints = () => {
    return [1, 0.8, 0.6, 0.4, 0.2].map((factor) => {
      const r = Math.round(red + (255 - red) * (1 - factor));
      const g = Math.round(green + (255 - green) * (1 - factor));
      const b = Math.round(blue + (255 - blue) * (1 - factor));
      return `rgb(${r}, ${g}, ${b})`;
    });
  };

  // Color Blindness Simulation
  const simulateColorBlindness = useCallback(
    (type) => {
      const matrices = {
        protanopia: [
          [0.567, 0.433, 0],
          [0.558, 0.442, 0],
          [0, 0.242, 0.758],
        ],
        deuteranopia: [
          [0.625, 0.375, 0],
          [0.7, 0.3, 0],
          [0, 0.3, 0.7],
        ],
        tritanopia: [
          [0.95, 0.05, 0],
          [0, 0.433, 0.567],
          [0, 0.475, 0.525],
        ],
        achromatopsia: [
          [0.299, 0.587, 0.114],
          [0.299, 0.587, 0.114],
          [0.299, 0.587, 0.114],
        ],
      };

      if (type === "normal" || !matrices[type]) {
        return hex;
      }

      const matrix = matrices[type];
      const newR = Math.round(
        matrix[0][0] * red + matrix[0][1] * green + matrix[0][2] * blue,
      );
      const newG = Math.round(
        matrix[1][0] * red + matrix[1][1] * green + matrix[1][2] * blue,
      );
      const newB = Math.round(
        matrix[2][0] * red + matrix[2][1] * green + matrix[2][2] * blue,
      );

      return `#${Math.min(255, newR).toString(16).padStart(2, "0")}${Math.min(
        255,
        newG,
      )
        .toString(16)
        .padStart(
          2,
          "0",
        )}${Math.min(255, newB).toString(16).padStart(2, "0")}`.toUpperCase();
    },
    [red, green, blue, hex],
  );

  // Contrast Ratio Calculator
  const calculateContrastRatio = useCallback((color1, color2) => {
    const getLum = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const [rs, gs, bs] = [r, g, b].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
      );
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLum(color1);
    const l2 = getLum(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
  }, []);

  const getWCAGRating = (ratio) => {
    if (ratio >= 7) return { rating: "AAA", color: "#22C55E" };
    if (ratio >= 4.5) return { rating: "AA", color: "#EAB308" };
    if (ratio >= 3) return { rating: "AA Large", color: "#F97316" };
    return { rating: "Fail", color: "#EF4444" };
  };

  // Mix two colors
  const getMixedColor = useCallback(() => {
    const r1 = parseInt(mixColor1.slice(1, 3), 16);
    const g1 = parseInt(mixColor1.slice(3, 5), 16);
    const b1 = parseInt(mixColor1.slice(5, 7), 16);

    const r2 = parseInt(mixColor2.slice(1, 3), 16);
    const g2 = parseInt(mixColor2.slice(3, 5), 16);
    const b2 = parseInt(mixColor2.slice(5, 7), 16);

    const ratio = mixRatio / 100;
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
      .toString(16)
      .padStart(2, "0")}`.toUpperCase();
  }, [mixColor1, mixColor2, mixRatio]);

  // Generate CSS Code
  const generateCSSCode = useCallback(() => {
    const color = isGradient ? getGradientCSS() : hex;

    const cssTemplates = {
      background: `background: ${color};`,
      "background-color": `background-color: ${hex};`,
      color: `color: ${hex};`,
      "border-color": `border: 2px solid ${hex};`,
      "box-shadow": `box-shadow: 0 4px 20px ${rgba.replace("1)", "0.4)")};`,
      "text-shadow": `text-shadow: 2px 2px 4px ${rgba.replace("1)", "0.5)")};`,
      gradient: `background: ${getGradientCSS()};`,
      filter: `filter: drop-shadow(0 4px 8px ${rgba.replace("1)", "0.4)")});`,
      outline: `outline: 3px solid ${hex};`,
      "accent-color": `accent-color: ${hex};`,
      "caret-color": `caret-color: ${hex};`,
      "::selection": `::selection {\n  background: ${hex};\n  color: ${textColor};\n}`,
      scrollbar: `::-webkit-scrollbar-thumb {\n  background: ${hex};\n}`,
      button: `.button {\n  background: ${hex};\n  color: ${textColor};\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  cursor: pointer;\n}\n.button:hover {\n  background: ${getShades()[3]};\n}`,
    };

    return cssTemplates[cssProperty] || cssTemplates.background;
  }, [hex, rgba, isGradient, getGradientCSS, cssProperty, textColor]);

  // Extract colors from image
  const extractColorsFromImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = {};

        for (let i = 0; i < imageData.data.length; i += 4) {
          const r = Math.round(imageData.data[i] / 32) * 32;
          const g = Math.round(imageData.data[i + 1] / 32) * 32;
          const b = Math.round(imageData.data[i + 2] / 32) * 32;
          const hex = `#${r.toString(16).padStart(2, "0")}${g
            .toString(16)
            .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();

          colors[hex] = (colors[hex] || 0) + 1;
        }

        const sortedColors = Object.entries(colors)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([hex]) => hex);

        setExtractedColors(sortedColors);
        showToast("Colors extracted!", "success");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Effects
  useEffect(() => {
    if (!history.includes(hex)) {
      setHistory((prev) => [hex, ...prev.slice(0, 19)]);
      setHistoryIndex(-1);
    }
  }, [hex]);

  useEffect(() => {
    localStorage.setItem("colorFavorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("savedPalettes", JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  useEffect(() => {
    setGradientStops((prev) => [
      { color: hex, position: prev[0].position },
      ...prev.slice(1),
    ]);
  }, [hex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "c":
            if (!window.getSelection().toString()) {
              e.preventDefault();
              copy(hex);
            }
            break;
          case "z":
            e.preventDefault();
            undo();
            break;
          case "y":
            e.preventDefault();
            redo();
            break;
          case "s":
            e.preventDefault();
            addToFavorites();
            break;
          case "r":
            e.preventDefault();
            randomColor();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hex, history, historyIndex]);

  // Utility Functions
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      2500,
    );
  };

  const copy = (v) => {
    navigator.clipboard.writeText(v);
    showToast(`Copied: ${v}`, "success");
  };

  const setFromHex = (hexColor) => {
    if (!/^#[0-9A-F]{6}$/i.test(hexColor)) return;
    setRed(parseInt(hexColor.slice(1, 3), 16));
    setGreen(parseInt(hexColor.slice(3, 5), 16));
    setBlue(parseInt(hexColor.slice(5, 7), 16));
  };

  const pickColor = async () => {
    if (!window.EyeDropper) {
      showToast("EyeDropper not supported!", "error");
      return;
    }
    try {
      const eye = new window.EyeDropper();
      const res = await eye.open();
      setFromHex(res.sRGBHex);
      showToast("Color picked!", "success");
    } catch (e) {
      console.log("Cancelled");
    }
  };

  const randomColor = () => {
    setRed(Math.floor(Math.random() * 256));
    setGreen(Math.floor(Math.random() * 256));
    setBlue(Math.floor(Math.random() * 256));
    showToast("Random color generated!", "success");
  };

  const undo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setFromHex(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFromHex(history[newIndex]);
    }
  };

  const addToFavorites = () => {
    if (!favorites.includes(hex)) {
      setFavorites((prev) => [hex, ...prev.slice(0, 29)]);
      showToast("Added to favorites!", "success");
    } else {
      showToast("Already in favorites!", "info");
    }
  };

  const removeFromFavorites = (color) => {
    setFavorites((prev) => prev.filter((c) => c !== color));
    showToast("Removed from favorites!", "success");
  };

  const addToPalette = () => {
    if (currentPalette.length < 10 && !currentPalette.includes(hex)) {
      setCurrentPalette((prev) => [...prev, hex]);
    }
  };

  const savePalette = () => {
    if (currentPalette.length > 0 && paletteName.trim()) {
      setSavedPalettes((prev) => [
        { name: paletteName, colors: currentPalette, id: Date.now() },
        ...prev,
      ]);
      setCurrentPalette([]);
      setPaletteName("");
      showToast("Palette saved!", "success");
    }
  };

  const deletePalette = (id) => {
    setSavedPalettes((prev) => prev.filter((p) => p.id !== id));
    showToast("Palette deleted!", "success");
  };

  const addGradientStop = () => {
    if (gradientStops.length < 5) {
      setGradientStops((prev) => [
        ...prev,
        { color: hex, position: Math.min(...prev.map((s) => s.position)) + 50 },
      ]);
    }
  };

  const removeGradientStop = (index) => {
    if (gradientStops.length > 2) {
      setGradientStops((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateGradientStop = (index, field, value) => {
    setGradientStops((prev) =>
      prev.map((stop, i) => (i === index ? { ...stop, [field]: value } : stop)),
    );
  };

  const exportPalette = (format = "txt") => {
    let data;
    let filename;
    let type;

    if (format === "txt") {
      data = history.join("\n");
      filename = "palette.txt";
      type = "text/plain";
    } else if (format === "json") {
      data = JSON.stringify(
        { colors: history, favorites, savedPalettes },
        null,
        2,
      );
      filename = "colors.json";
      type = "application/json";
    } else if (format === "css") {
      data = `:root {\n${history.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n")}\n}`;
      filename = "colors.css";
      type = "text/css";
    } else if (format === "scss") {
      data = history.map((c, i) => `$color-${i + 1}: ${c};`).join("\n");
      filename = "colors.scss";
      type = "text/plain";
    }

    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported as ${format.toUpperCase()}!`, "success");
  };

  const handleHexInput = (e) => {
    let value = e.target.value.toUpperCase();
    if (!value.startsWith("#")) value = "#" + value;
    setHexInput(value);

    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setFromHex(value);
    }
  };

  const shareColor = async () => {
    const shareData = {
      title: "Color Studio",
      text: `Check out this color: ${hex}`,
      url: `${window.location.origin}?color=${hex.slice(1)}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Shared successfully!", "success");
      } catch (e) {
        copy(shareData.url);
      }
    } else {
      copy(shareData.url);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Check URL for shared color
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedColor = params.get("color");
    if (sharedColor && /^[0-9A-F]{6}$/i.test(sharedColor)) {
      setFromHex(`#${sharedColor}`);
    }
  }, []);

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      {/* Toast Notification */}
      <div className={`toast ${toast.show ? "show" : ""} ${toast.type}`}>
        <span className="toast-icon">
          {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
        </span>
        {toast.message}
      </div>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🎨</span>
          <div className="logo-text">
            <h1>Color Studio</h1>
            <span className="logo-subtitle">Pro Edition</span>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            {isFullscreen ? "🔲" : "🔲"}
          </button>
          <button className="icon-btn" onClick={shareColor} title="Share">
            📤
          </button>
          <button
            className="icon-btn"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* Quick Actions Bar */}
      <div className="quick-bar">
        <div className="hex-input-group">
          <span>#</span>
          <input
            type="text"
            value={hexInput || hex.slice(1)}
            onChange={handleHexInput}
            placeholder="Enter HEX"
            maxLength={7}
          />
        </div>
        <div className="quick-actions-mini">
          <button onClick={pickColor} title="Eye Dropper (Ctrl+E)">
            💧
          </button>
          <button onClick={randomColor} title="Random (Ctrl+R)">
            🎲
          </button>
          <button onClick={addToFavorites} title="Favorite (Ctrl+S)">
            {favorites.includes(hex) ? "❤️" : "🤍"}
          </button>
          <button
            onClick={undo}
            disabled={historyIndex >= history.length - 1}
            title="Undo (Ctrl+Z)"
          >
            ↩️
          </button>
          <button
            onClick={redo}
            disabled={historyIndex <= 0}
            title="Redo (Ctrl+Y)"
          >
            ↪️
          </button>
          <button onClick={() => copy(hex)} title="Copy (Ctrl+C)">
            📋
          </button>
        </div>
      </div>

      {/* Main Preview */}
      <div className="preview-container">
        <div
          className={`preview ${isAnimating ? `animate-${animationType}` : ""}`}
          style={{
            background: isGradient ? getGradientCSS() : hex,
            color: textColor,
          }}
        >
          <div className="preview-content">
            <span className="color-name">{getColorName()}</span>
            <span className="preview-hex">{hex}</span>
            <span className="preview-rgb">{rgb}</span>
          </div>
          <div className="preview-actions">
            <button onClick={() => setIsAnimating(!isAnimating)}>
              {isAnimating ? "⏸️ Stop" : "▶️ Animate"}
            </button>
            <select
              value={animationType}
              onChange={(e) => setAnimationType(e.target.value)}
            >
              <option value="pulse">Pulse</option>
              <option value="shake">Shake</option>
              <option value="glow">Glow</option>
              <option value="rotate">Rotate</option>
              <option value="bounce">Bounce</option>
            </select>
          </div>
        </div>

        {/* Color Blindness Preview */}
        <div className="colorblind-strip">
          <span className="strip-label">Color Blindness Preview:</span>
          <div className="strip-colors">
            {[
              "normal",
              "protanopia",
              "deuteranopia",
              "tritanopia",
              "achromatopsia",
            ].map((type) => (
              <div
                key={type}
                className={`strip-color ${colorBlindMode === type ? "active" : ""}`}
                style={{ background: simulateColorBlindness(type) }}
                onClick={() => setColorBlindMode(type)}
                title={type.charAt(0).toUpperCase() + type.slice(1)}
              >
                <span>{type.slice(0, 3).toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="tabs">
        {[
          { id: "picker", icon: "🎯", label: "Picker" },
          { id: "values", icon: "📋", label: "Values" },
          { id: "harmony", icon: "🌈", label: "Harmony" },
          { id: "gradient", icon: "🎨", label: "Gradient" },
          { id: "tools", icon: "🛠️", label: "Tools" },
          { id: "palettes", icon: "🎭", label: "Palettes" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <main className="tab-content">
        {/* PICKER TAB */}
        {activeTab === "picker" && (
          <div className="picker-section">
            <div className="sliders">
              {[
                { label: "Red", value: red, setter: setRed, class: "red" },
                {
                  label: "Green",
                  value: green,
                  setter: setGreen,
                  class: "green",
                },
                { label: "Blue", value: blue, setter: setBlue, class: "blue" },
                {
                  label: "Alpha",
                  value: alpha,
                  setter: setAlpha,
                  class: "alpha",
                  max: 1,
                  step: 0.01,
                },
              ].map((slider) => (
                <div key={slider.label} className="slider-group">
                  <div className="slider-header">
                    <label>{slider.label}</label>
                    <input
                      type="number"
                      min="0"
                      max={slider.max || 255}
                      step={slider.step || 1}
                      value={slider.value}
                      onChange={(e) =>
                        slider.setter(
                          Math.min(
                            slider.max || 255,
                            Math.max(0, Number(e.target.value)),
                          ),
                        )
                      }
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={slider.max || 255}
                    step={slider.step || 1}
                    value={slider.value}
                    className={`slider ${slider.class}`}
                    onChange={(e) => slider.setter(Number(e.target.value))}
                  />
                </div>
              ))}
            </div>

            {/* Color Wheel Alternative */}
            <div className="color-wheel-section">
              <h3>Quick Colors</h3>
              <div className="quick-colors">
                {Object.entries(colorNames)
                  .slice(0, 20)
                  .map(([hexVal, name]) => (
                    <div
                      key={hexVal}
                      className="quick-color"
                      style={{ background: hexVal }}
                      onClick={() => setFromHex(hexVal)}
                      title={name}
                    />
                  ))}
              </div>
            </div>

            {/* HSL Sliders */}
            <div className="hsl-section">
              <h3>HSL Adjustment</h3>
              <div className="hsl-display">
                <span>H: {getHSL().h}°</span>
                <span>S: {getHSL().s}%</span>
                <span>L: {getHSL().l}%</span>
              </div>
            </div>
          </div>
        )}

        {/* VALUES TAB */}
        {activeTab === "values" && (
          <div className="values-section">
            <div className="values-grid">
              {[
                { label: "HEX", value: hex },
                { label: "HEX + Alpha", value: hexa },
                { label: "RGB", value: rgb },
                { label: "RGBA", value: rgba },
                { label: "HSL", value: getHSL().string },
                { label: "HSLA", value: getHSL().hsla },
                { label: "HSV/HSB", value: getHSV() },
                { label: "CMYK", value: getCMYK() },
                { label: "LAB", value: getLAB() },
              ].map((item) => (
                <div
                  key={item.label}
                  className="value-card"
                  onClick={() => copy(item.value)}
                >
                  <div className="value-label">{item.label}</div>
                  <div className="value-text">{item.value}</div>
                  <div className="copy-hint">Click to copy</div>
                </div>
              ))}
            </div>

            {/* CSS Code Generator */}
            <div className="css-generator">
              <h3>CSS Code Generator</h3>
              <div className="css-options">
                {[
                  "background",
                  "color",
                  "border-color",
                  "box-shadow",
                  "text-shadow",
                  "button",
                  "::selection",
                ].map((prop) => (
                  <button
                    key={prop}
                    className={`css-option ${cssProperty === prop ? "active" : ""}`}
                    onClick={() => setCssProperty(prop)}
                  >
                    {prop}
                  </button>
                ))}
              </div>
              <pre className="css-code">
                <code>{generateCSSCode()}</code>
                <button
                  className="copy-code-btn"
                  onClick={() => copy(generateCSSCode())}
                >
                  📋 Copy
                </button>
              </pre>
            </div>
          </div>
        )}

        {/* HARMONY TAB */}
        {activeTab === "harmony" && (
          <div className="harmony-section">
            {[
              { title: "Complementary", colors: [hex, getComplementary()] },
              {
                title: "Analogous",
                colors: [getAnalogous()[0], hex, getAnalogous()[1]],
              },
              { title: "Triadic", colors: [hex, ...getTriadic()] },
              {
                title: "Split Complementary",
                colors: [hex, ...getSplitComplementary()],
              },
              { title: "Tetradic (Square)", colors: [hex, ...getTetradic()] },
              { title: "Shades", colors: getShades() },
              { title: "Tints", colors: getTints() },
            ].map((harmony) => (
              <div key={harmony.title} className="harmony-group">
                <h3>{harmony.title}</h3>
                <div className="harmony-colors">
                  {harmony.colors.map((color, i) => (
                    <div
                      key={i}
                      className="harmony-color"
                      style={{ background: color }}
                      onClick={() => {
                        if (color.startsWith("#")) setFromHex(color);
                        else copy(color);
                      }}
                    >
                      <span>{color.length > 20 ? "..." : color}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GRADIENT TAB */}
        {activeTab === "gradient" && (
          <div className="gradient-section">
            <div
              className="gradient-preview"
              style={{ background: getGradientCSS() }}
            >
              <button
                className="copy-gradient-btn"
                onClick={() => copy(getGradientCSS())}
              >
                📋 Copy CSS
              </button>
            </div>

            <div className="gradient-controls">
              <div className="control-group">
                <label>Type</label>
                <div className="button-group">
                  {["linear", "radial", "conic"].map((type) => (
                    <button
                      key={type}
                      className={gradientType === type ? "active" : ""}
                      onClick={() => setGradientType(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {gradientType !== "radial" && (
                <div className="control-group">
                  <label>Angle: {gradientAngle}°</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={gradientAngle}
                    onChange={(e) => setGradientAngle(Number(e.target.value))}
                  />
                </div>
              )}

              <div className="gradient-stops">
                <div className="stops-header">
                  <h4>Color Stops</h4>
                  <button
                    onClick={addGradientStop}
                    disabled={gradientStops.length >= 5}
                  >
                    + Add Stop
                  </button>
                </div>
                {gradientStops.map((stop, index) => (
                  <div key={index} className="gradient-stop">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) =>
                        updateGradientStop(
                          index,
                          "color",
                          e.target.value.toUpperCase(),
                        )
                      }
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={(e) =>
                        updateGradientStop(
                          index,
                          "position",
                          Number(e.target.value),
                        )
                      }
                    />
                    <span>{stop.position}%</span>
                    {gradientStops.length > 2 && (
                      <button
                        className="remove-stop"
                        onClick={() => removeGradientStop(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="toggle-gradient-btn"
                onClick={() => setIsGradient(!isGradient)}
              >
                {isGradient ? "🔲 Use Solid Color" : "🌈 Use Gradient"} in
                Preview
              </button>
            </div>

            <div className="gradient-code">
              <h4>CSS Code</h4>
              <pre>
                <code>background: {getGradientCSS()};</code>
              </pre>
            </div>
          </div>
        )}

        {/* TOOLS TAB */}
        {activeTab === "tools" && (
          <div className="tools-section">
            {/* Contrast Checker */}
            <div className="tool-card">
              <h3>♿ Contrast Checker (WCAG)</h3>
              <div className="contrast-checker">
                <div className="contrast-inputs">
                  <div className="contrast-input">
                    <label>Background</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={contrastBg}
                        onChange={(e) =>
                          setContrastBg(e.target.value.toUpperCase())
                        }
                      />
                      <span>{contrastBg}</span>
                    </div>
                    <button onClick={() => setContrastBg(hex)}>
                      Use Current
                    </button>
                  </div>
                  <div className="contrast-input">
                    <label>Text</label>
                    <div className="color-input-wrapper">
                      <input
                        type="color"
                        value={contrastText}
                        onChange={(e) =>
                          setContrastText(e.target.value.toUpperCase())
                        }
                      />
                      <span>{contrastText}</span>
                    </div>
                    <button onClick={() => setContrastText(hex)}>
                      Use Current
                    </button>
                  </div>
                </div>
                <div
                  className="contrast-preview"
                  style={{ background: contrastBg, color: contrastText }}
                >
                  <p className="contrast-large">Large Text (18px+)</p>
                  <p className="contrast-normal">Normal Text (16px)</p>
                  <p className="contrast-small">Small Text (12px)</p>
                </div>
                <div className="contrast-result">
                  <div className="contrast-ratio">
                    <span>Ratio:</span>
                    <strong>
                      {calculateContrastRatio(contrastBg, contrastText)}:1
                    </strong>
                  </div>
                  <div
                    className="wcag-badge"
                    style={{
                      background: getWCAGRating(
                        calculateContrastRatio(contrastBg, contrastText),
                      ).color,
                    }}
                  >
                    {
                      getWCAGRating(
                        calculateContrastRatio(contrastBg, contrastText),
                      ).rating
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Color Mixer */}
            <div className="tool-card">
              <h3>🎨 Color Mixer</h3>
              <div className="color-mixer">
                <div className="mixer-inputs">
                  <div className="mixer-color">
                    <input
                      type="color"
                      value={mixColor1}
                      onChange={(e) =>
                        setMixColor1(e.target.value.toUpperCase())
                      }
                    />
                    <span>{mixColor1}</span>
                  </div>
                  <div className="mixer-slider">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={mixRatio}
                      onChange={(e) => setMixRatio(Number(e.target.value))}
                    />
                    <span>{mixRatio}%</span>
                  </div>
                  <div className="mixer-color">
                    <input
                      type="color"
                      value={mixColor2}
                      onChange={(e) =>
                        setMixColor2(e.target.value.toUpperCase())
                      }
                    />
                    <span>{mixColor2}</span>
                  </div>
                </div>
                <div className="mixer-result">
                  <div
                    className="mixed-color"
                    style={{ background: getMixedColor() }}
                    onClick={() => setFromHex(getMixedColor())}
                  >
                    <span>{getMixedColor()}</span>
                  </div>
                  <button onClick={() => setFromHex(getMixedColor())}>
                    Use This Color
                  </button>
                </div>
              </div>
            </div>

            {/* Image Color Extractor */}
            <div className="tool-card">
              <h3>🖼️ Image Color Extractor</h3>
              <div className="image-extractor">
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={extractColorsFromImage}
                  style={{ display: "none" }}
                />
                <button onClick={() => imageInputRef.current?.click()}>
                  📁 Choose Image
                </button>
                <canvas ref={canvasRef} style={{ display: "none" }} />
                {extractedColors.length > 0 && (
                  <div className="extracted-colors">
                    {extractedColors.map((color, i) => (
                      <div
                        key={i}
                        className="extracted-color"
                        style={{ background: color }}
                        onClick={() => setFromHex(color)}
                        title={color}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Export Options */}
            <div className="tool-card">
              <h3>📥 Export Colors</h3>
              <div className="export-options">
                {["txt", "json", "css", "scss"].map((format) => (
                  <button key={format} onClick={() => exportPalette(format)}>
                    Export as .{format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PALETTES TAB */}
        {activeTab === "palettes" && (
          <div className="palettes-section">
            {/* Palette Builder */}
            <div className="palette-builder">
              <h3>🎨 Create Palette</h3>
              <div className="current-palette">
                {currentPalette.map((color, i) => (
                  <div
                    key={i}
                    className="palette-color"
                    style={{ background: color }}
                    onClick={() =>
                      setCurrentPalette((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      )
                    }
                  >
                    <span>✕</span>
                  </div>
                ))}
                {currentPalette.length < 10 && (
                  <button className="add-to-palette" onClick={addToPalette}>
                    + Add Current
                  </button>
                )}
              </div>
              {currentPalette.length > 0 && (
                <div className="save-palette">
                  <input
                    type="text"
                    placeholder="Palette name..."
                    value={paletteName}
                    onChange={(e) => setPaletteName(e.target.value)}
                  />
                  <button onClick={savePalette}>💾 Save Palette</button>
                </div>
              )}
            </div>

            {/* Preset Palettes */}
            <div className="preset-palettes">
              <h3>✨ Preset Palettes</h3>
              <div className="presets-grid">
                {Object.entries(presetPalettes).map(([name, colors]) => (
                  <div key={name} className="preset-palette">
                    <h4>{name.charAt(0).toUpperCase() + name.slice(1)}</h4>
                    <div className="preset-colors">
                      {colors.map((color, i) => (
                        <div
                          key={i}
                          className="preset-color"
                          style={{ background: color }}
                          onClick={() => setFromHex(color)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Palettes */}
            <div className="saved-palettes">
              <h3>💾 Saved Palettes ({savedPalettes.length})</h3>
              {savedPalettes.length === 0 ? (
                <p className="no-palettes">
                  No saved palettes yet. Create one above!
                </p>
              ) : (
                <div className="saved-palettes-list">
                  {savedPalettes.map((palette) => (
                    <div key={palette.id} className="saved-palette">
                      <div className="palette-header">
                        <h4>{palette.name}</h4>
                        <button onClick={() => deletePalette(palette.id)}>
                          🗑️
                        </button>
                      </div>
                      <div className="palette-colors">
                        {palette.colors.map((color, i) => (
                          <div
                            key={i}
                            className="saved-color"
                            style={{ background: color }}
                            onClick={() => setFromHex(color)}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Favorites */}
            <div className="favorites-section">
              <h3>❤️ Favorites ({favorites.length})</h3>
              <div className="favorites-grid">
                {favorites.map((color) => (
                  <div
                    key={color}
                    className="favorite-color"
                    style={{ background: color }}
                    onClick={() => setFromHex(color)}
                  >
                    <span className="favorite-hex">{color}</span>
                    <button
                      className="remove-favorite"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavorites(color);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {favorites.length === 0 && (
                  <p className="no-favorites">Click ❤️ to add favorites!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* History Bar */}
      <div className="history-bar">
        <div className="history-header">
          <h3>🕐 Recent Colors</h3>
          <button onClick={() => setHistory([])}>Clear</button>
        </div>
        <div className="history-colors">
          {history.slice(0, 15).map((color, i) => (
            <div
              key={`${color}-${i}`}
              className={`history-color ${historyIndex === i ? "active" : ""}`}
              style={{ background: color }}
              onClick={() => setFromHex(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts Modal Trigger */}
      <button
        className="shortcuts-btn"
        onClick={() =>
          showToast(
            "Ctrl+C: Copy | Ctrl+Z: Undo | Ctrl+R: Random | Ctrl+S: Favorite",
            "info",
          )
        }
      >
        ⌨️
      </button>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>
            Made with 💜 by <strong>Harsh Solanki</strong>
          </p>
          <div className="footer-links">
            <span>Color Studio Pro</span>
            <span>•</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
