export default function Home() {
  return (
    <main style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>AMD FinOps Cloud Savings Tool</h1>

      <div style={{ marginTop: "20px" }}>
        <p><strong>AWS Analysis (v1)</strong></p>

        <input type="file" />

        <br /><br />

        <button>Run Analysis</button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Results</h2>
        <p>No data yet</p>
      </div>
    </main>
  );
}