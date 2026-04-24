import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ORIS & ASH — Rare Fragrances";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 60,
            fontSize: 14,
            letterSpacing: "0.3em",
            color: "#8B6F47",
            textTransform: "uppercase",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          EST. 2025
        </div>

        <div
          style={{
            fontSize: 110,
            letterSpacing: "0.15em",
            color: "#F5F1EA",
            fontFamily: "Georgia, serif",
            marginBottom: 30,
          }}
        >
          ORIS & ASH
        </div>

        <div
          style={{
            width: 80,
            height: 1,
            background: "#8B6F47",
            marginBottom: 30,
          }}
        />

        <div
          style={{
            fontSize: 22,
            color: "#F5F1EA",
            opacity: 0.6,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          Rare fragrances, sourced and authenticated.
        </div>
      </div>
    ),
    { ...size },
  );
}
