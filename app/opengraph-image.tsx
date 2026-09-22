import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Clearledger — Know where your money is going";
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
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#f7f9fc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: "#2452eb",
            }}
          />
          <div style={{ fontSize: 36, fontWeight: 700, color: "#12192b" }}>Clearledger</div>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 64,
            fontWeight: 700,
            color: "#12192b",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Know where your money is going.
        </div>
        <div style={{ marginTop: 24, fontSize: 28, color: "#5b6478", maxWidth: 780 }}>
          Personal finance, without the spreadsheet.
        </div>
      </div>
    ),
    { ...size },
  );
}
