import { useState, useEffect } from "react";
import "./app.css";

export default function App() {
  const [red, SetRed] = useState(0);
  const [green, SetGreen] = useState(0);
  const [blue, Setblue] = useState(0);

  const [history, setHistory] = useState([]);
  const [gradient2, setGradient2] = useState("#000000");
  const [isGradient, setIsGradient] = useState(false);

  // --- Calculations ---
  const rgb = `rgb(${red}, ${green}, ${blue})`;

  const hex = `#${Number(red).toString(16).padStart(2, "0")}${Number(green)
    .toString(16)
    .padStart(2, "0")}${Number(blue)
    .toString(16)
    .padStart(2, "0")}`.toUpperCase();

  // 1. HSL Conversion Logic
  const getHSL = () => {
    let r = red / 255,
      g = green / 255,
      b = blue / 255;
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
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
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%)`;
  };

  // 2. CMYK Conversion Logic
  const getCMYK = () => {
    let r = red / 255,
      g = green / 255,
      b = blue / 255;
    let k = 1 - Math.max(r, g, b);
    let c = (1 - r - k) / (1 - k) || 0;
    let m = (1 - g - k) / (1 - k) || 0;
    let y = (1 - b - k) / (1 - k) || 0;
    return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(
      y * 100
    )}%, ${Math.round(k * 100)}%)`;
  };

  useEffect(() => {
    if (!history.includes(hex)) {
      setHistory((prev) => [hex, ...prev.slice(0, 9)]);
    }
  }, [hex]);

  const copy = (v) => {
    navigator.clipboard.writeText(v);
    alert("Copied " + v);
  };

  const pickColor = async () => {
    if (!window.EyeDropper) {
      alert("EyeDropper not supported in this browser");
      return;
    }
    const eye = new window.EyeDropper();
    const res = await eye.open();
    const picked = res.sRGBHex;

    SetRed(parseInt(picked.slice(1, 3), 16));
    SetGreen(parseInt(picked.slice(3, 5), 16));
    Setblue(parseInt(picked.slice(5, 7), 16));
  };

  const exportPalette = () => {
    const data = history.join("\n");
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette.txt";
    a.click();
  };

  return (
    <div className="app">
      <h1 style={{ textAlign: "center" }}>🎨 Color & Gradient Studio</h1>

      <div
        className="preview"
        style={{
          background: isGradient
            ? `linear-gradient(45deg, ${hex}, ${gradient2})`
            : hex,
        }}
      ></div>

      <div className="sliders">
        <label>Red {red}</label>
        <input
          type="range"
          min="0"
          max="255"
          value={red}
          onChange={(e) => SetRed(e.target.value)}
        />

        <label>Green {green} </label>
        <input
          type="range"
          min="0"
          max="255"
          value={green}
          onChange={(e) => SetGreen(e.target.value)}
        />

        <label>Blue {blue}</label>
        <input
          type="range"
          min="0"
          max="255"
          value={blue}
          onChange={(e) => Setblue(e.target.value)}
        />
      </div>

      <div className="values">
        <p>
          <strong>HEX:</strong> {hex}{" "}
          <button onClick={() => copy(hex)}>Copy</button>
        </p>
        <p>
          <strong>RGB:</strong> {rgb}{" "}
          <button onClick={() => copy(rgb)}>Copy</button>
        </p>
        <p>
          <strong>HSL:</strong> {getHSL()}{" "}
          <button onClick={() => copy(getHSL())}>Copy</button>
        </p>
        <p>
          <strong>CMYK:</strong> {getCMYK()}{" "}
          <button onClick={() => copy(getCMYK())}>Copy</button>
        </p>
      </div>

      <div className="tools">
        <button onClick={pickColor}>Eye-Dropper</button>
        <button onClick={() => setIsGradient(!isGradient)}>
          Toggle Gradient
        </button>
        {isGradient && (
          <input
            type="color"
            value={gradient2}
            onChange={(e) => setGradient2(e.target.value)}
          />
        )}
        <button onClick={exportPalette}>Export Palette</button>
      </div>

      <h3>Color History</h3>
      <div className="history">
        {history.map((c) => (
          <div
            key={c}
            className="colorBox"
            style={{ background: c }}
            onClick={() => {
              SetRed(parseInt(c.slice(1, 3), 16));
              SetGreen(parseInt(c.slice(3, 5), 16));
              Setblue(parseInt(c.slice(5, 7), 16));
            }}
          ></div>
        ))}
      </div>
      <footer className="footer">
        © {new Date().getFullYear()} Harsh Solanki. All Rights Reserved.
      </footer>
    </div>
  );
}
