import XLSX from 'xlsx';

let pricingData = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const buffer = Buffer.concat(buffers);
  const workbook = XLSX.read(buffer);

  let data = [];

  workbook.SheetNames.forEach(name => {
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[name], {header:1});

    for (let i = 2; i < sheet.length; i++) {
      try {
        const amd = sheet[i][0];
        const intel = sheet[i][1];
        const priceAMD = sheet[i][6];
        const priceIntel = sheet[i][7];

        if (!amd || !intel) continue;

        data.push({
          amd,
          intel,
          priceAMD,
          priceIntel
        });
      } catch {}
    }
  });

  pricingData = data;
  global.pricingData = data;

  res.json({ count: data.length });
}
