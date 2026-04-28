export default function handler(req, res) {
  const usage = req.body.usage;
  const pricing = global.pricingData || [];

  let results = [];
  let totalCurrent = 0;
  let totalAMD = 0;

  usage.forEach(row => {
    const match = pricing.find(x => x.intel === row.instance);

    if (!match) {
      results.push({
        instance: row.instance,
        qty: row.qty,
        amd: "N/A",
        current: 0,
        amd_cost: 0,
        savings: 0,
        savings_pct: 0
      });
      return;
    }

    const current = match.priceIntel * 730 * row.qty;
    const amd = match.priceAMD * 730 * row.qty;

    const savings = current - amd;
    const pct = current ? (savings / current) * 100 : 0;

    totalCurrent += current;
    totalAMD += amd;

    results.push({
      instance: row.instance,
      qty: row.qty,
      amd: match.amd,
      current: Math.round(current * 100) / 100,
      amd_cost: Math.round(amd * 100) / 100,
      savings: Math.round(savings * 100) / 100,
      savings_pct: Math.round(pct * 100) / 100
    });
  });

  res.json({
    results,
    total_current: totalCurrent,
    total_amd: totalAMD,
    savings: totalCurrent - totalAMD
  });
}
