import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0e0c0a 0%, #17140f 55%, #0e0c0a 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            border: "1px solid rgba(212,175,55,0.35)",
            margin: 28,
          }}
        />
        <svg width="88" height="88" viewBox="0 0 40 40" fill="none">
          <path d="M20 6 L31 20 L20 34 L9 20 Z" stroke="#d4af37" strokeWidth="1.6" fill="none" />
          <path d="M20 13 L25.5 20 L20 27 L14.5 20 Z" fill="#d4af37" />
        </svg>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 68,
            fontWeight: 600,
            color: "#fdfcf9",
            letterSpacing: 1,
          }}
        >
          Signature&nbsp;<span style={{ color: "#d4af37" }}>Estates</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 26,
            color: "rgba(248,245,238,0.65)",
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Luxury Resorts &amp; Residences in Dubai
        </div>
      </div>
    ),
    { ...size },
  );
}
