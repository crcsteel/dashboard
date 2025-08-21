// ---- Helper ----
function zeroToNull(val) {
  return val === 0 ? null : val;
}

// ---- GI ----
async function fetchGIAndCost() {
  try {
    const res = await fetch(API_URL_PRODUCT);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const giData = json.table.rows.map(row => ({
      month: row.c[0]?.v || '',
      GI: toNumber(row.c[1]?.v),
      CostY1: toNumber(row.c[2]?.v),
      CostY2: toNumber(row.c[3]?.v),
      CostY3: toNumber(row.c[4]?.v)
    }));
    renderMultiChart("#gi-chart", "GI (ตัน)", giData, "GI", ["CostY1", "CostY2", "CostY3"]);
  } catch (err) {
    console.error("โหลดข้อมูลจากชีตไม่สำเร็จ (GI):", err);
  }
}

// ---- RB-DB ----
async function fetchRBDbandCost() {
  try {
    const res = await fetch(API_URL_PRODUCT);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const rbdbData = json.table.rows.map(row => ({
      month: row.c[0]?.v || '',
      RBDB: toNumber(row.c[6]?.v),
      CostY1: toNumber(row.c[7]?.v),
      CostY2: toNumber(row.c[8]?.v),
      CostY3: toNumber(row.c[9]?.v)
    }));
    renderMultiChart("#rbdb-chart", "RB-DB (ตัน)", rbdbData, "RBDB", ["CostY1", "CostY2", "CostY3"]);
  } catch (err) {
    console.error("โหลดข้อมูลจากชีตไม่สำเร็จ (RB-DB):", err);
  }
}

// ---- Black Steel ----
async function fetchBlackSteelAndCost() {
  try {
    const res = await fetch(API_URL_PRODUCT);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const bsData = json.table.rows.map(row => ({
      month: row.c[0]?.v || '',
      BS: toNumber(row.c[11]?.v),
      CostY1: toNumber(row.c[12]?.v),
      CostY2: toNumber(row.c[13]?.v),
      CostY3: toNumber(row.c[14]?.v)
    }));
    renderMultiChart("#bs-chart", "Black Steel (ตัน)", bsData, "BS", ["CostY1", "CostY2", "CostY3"]);
  } catch (err) {
    console.error("โหลดข้อมูลจากชีตไม่สำเร็จ (Black Steel):", err);
  }
}

// ---- Render Generic ----
function renderMultiChart(targetId, title, data, mainKey, costKeys) {
  const options = {
    chart: { height: 500, type: 'line', stacked: false },
    stroke: { width: [0, 3, 3, 3] },
    series: [
      { name: title, type: 'column', data: data.map(d => zeroToNull(d[mainKey])) },
      { name: '2566', type: 'line', data: data.map(d => zeroToNull(d[costKeys[0]])) },
      { name: '2567', type: 'line', data: data.map(d => zeroToNull(d[costKeys[1]])) },
      { name: '2568', type: 'line', data: data.map(d => zeroToNull(d[costKeys[2]])) }
    ],
    colors: ['#ff5858ff', '#FFC000', '#00B050', '#00B0F0'],
    xaxis: { categories: data.map(d => d.month) },
    yaxis: [
      {
        title: { text: title },
        labels: {
          formatter: val => Number(val).toLocaleString('en-US', {
            minimumFractionDigits: 0, maximumFractionDigits: 0
          })
        }
      },
      {
        opposite: true,
        title: { text: "Cost (บาท/กก.)" },
        labels: {
          formatter: val => Number(val).toLocaleString('en-US', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
        }
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        { formatter: val => val ? Number(val).toLocaleString('en-US') + " ตัน" : "" },
        { formatter: val => val ? Number(val).toFixed(2) + " บาท/กก." : "" },
        { formatter: val => val ? Number(val).toFixed(2) + " บาท/กก." : "" },
        { formatter: val => val ? Number(val).toFixed(2) + " บาท/กก." : "" }
      ]
    },
    plotOptions: { bar: { columnWidth: '90%', borderRadius: 2 } },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1, 2, 3],
      formatter: val => val ? Number(val).toFixed(2) : ""
    },
    grid: { borderColor: '#e0e0e0', strokeDashArray: 4 }
  };

  const chart = new ApexCharts(document.querySelector(targetId), options);
  chart.render();
}


fetchGIAndCost();
fetchRBDbandCost();
fetchBlackSteelAndCost();

// ---- Sales Daily ----