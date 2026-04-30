"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleRun = async () => {
    alert("Run Analysis clicked");

    if (!file) {
      alert("Please upload a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("API response:", data);
      alert("Check console for response");
    } catch (err) {
      console.error(err);
      alert("Error calling API");
    }
  };

  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>AMD FinOps Cloud Savings Tool</h1>

      <div style={{ marginTop: "20px" }}>
        <p><strong>AWS Analysis (v1)</strong></p>

        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <br /><br />

        <button
          onClick={handleRun}
          style={{
            padding: "12px 24px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          TEST RUN ANALYSIS
        </button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Results</h2>
        <p>No data yet</p>
      </div>
    </main>
  );
}