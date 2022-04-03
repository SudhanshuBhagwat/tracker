import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html style={{ WebkitTapHighlightColor: "transparent" }}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
