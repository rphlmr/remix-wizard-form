import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.4",
        display: "flex",
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Remix Form Wizard</h1>
      <nav>
        <Link to="/wizard" className="button">
          Start Form Wizard
        </Link>
      </nav>
    </div>
  );
}
