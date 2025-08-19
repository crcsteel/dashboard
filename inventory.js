// =======================
// Inventory Dashboard
// =======================

// ---- Inventory ----
async function fetchInventoryData() {
  try {
    const res = await fetch(API_URL_INVENTORY);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const months = [], year1 = [], year2 = [], year3 = [], year4 = [];

    function parseValue(cell) {
      if (!cell || !cell.v) return null;
      let val = cell.v.toString().replace(' MB','');
      val = parseFloat(val);
      if (isNaN(val)) return null;
      return val / 1000000; // แปลงเป็นล้านบาท
    }

    json.table.rows.forEach(row => {
      const monthName = row.c[0]?.v || '';
      const val1 = parseValue(row.c[1]);
      const val2 = parseValue(row.c[2]);
      const val3 = parseValue(row.c[3]);
      const val4 = parseValue(row.c[4]);

      if (val1 !== null || val2 !== null || val3 !== null || val4 !== null) {
        months.push(monthName);
        year1.push(val1 !== null ? parseFloat(val1.toFixed(2)) : null);
        year2.push(val2 !== null ? parseFloat(val2.toFixed(2)) : null);
        year3.push(val3 !== null ? parseFloat(val3.toFixed(2)) : null);
        year4.push(val4 !== null ? parseFloat(val4.toFixed(2)) : null);
      }
    });

    renderInventoryChart(months, year1, year2, year3, year4);
  } catch (err) {
    console.error("โหลดข้อมูล Inventory ไม่สำเร็จ:", err);
  }
}

function renderInventoryChart(months, year1, year2, year3, year4) {
  const options = {
    chart: { type: 'line', height: 350 },
    series: [
      { name: 'ก.ค 65 - มิ.ย 66', data: year1 },
      { name: 'ก.ค 66 - มิ.ย 67', data: year2 },
      { name: 'ก.ค 67 - มิ.ย 68', data: year3 },
      { name: 'ก.ค 68 - มิ.ย 69', data: year4 }
    ],
    xaxis: { categories: months },
    stroke: { width: 3, curve: 'smooth' },
    colors: ['#1E90FF', '#FF6347', '#32CD32', '#8A2BE2']
  };
  new ApexCharts(document.querySelector("#inventory-chart"), options).render();
}

// ---- PO ----
async function fetchPOData() {
  try {
    const res = await fetch(API_URL_INVENTORY);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const months = [], year1 = [], year2 = [], year3 = [], year4 = [];

    function parseValue(cell) {
      if (!cell || !cell.v) return null;
      let val = cell.v.toString().replace(' MB','');
      val = parseFloat(val);
      if (isNaN(val)) return null;
      return val;
    }

    json.table.rows.forEach(row => {
      const monthName = row.c[0]?.v || '';
      const val1 = parseValue(row.c[6]);
      const val2 = parseValue(row.c[7]);
      const val3 = parseValue(row.c[8]);
      const val4 = parseValue(row.c[9]);

      if (val1 !== null || val2 !== null || val3 !== null || val4 !== null) {
        months.push(monthName);
        year1.push(val1 !== null ? parseFloat(val1.toFixed(2)) : null);
        year2.push(val2 !== null ? parseFloat(val2.toFixed(2)) : null);
        year3.push(val3 !== null ? parseFloat(val3.toFixed(2)) : null);
        year4.push(val4 !== null ? parseFloat(val4.toFixed(2)) : null);
      }
    });

    renderPOChart(months, year1, year2, year3, year4);
  } catch (err) {
    console.error("โหลดข้อมูล PO ไม่สำเร็จ:", err);
  }
}

function renderPOChart(months, year1, year2, year3, year4) {
  const options = {
    chart: { type: 'line', height: 350 },
    series: [
      { name: 'ก.ค 65 - มิ.ย 66', data: year1 },
      { name: 'ก.ค 66 - มิ.ย 67', data: year2 },
      { name: 'ก.ค 67 - มิ.ย 68', data: year3 },
      { name: 'ก.ค 68 - มิ.ย 69', data: year4 }
    ],
    xaxis: { categories: months },
    stroke: { width: 3, curve: 'smooth' },
    colors: ['#1E90FF', '#FF6347', '#32CD32', '#8A2BE2']
  };
  new ApexCharts(document.querySelector("#po-chart"), options).render();
}

// ---- Group Bar ----
// ---- Group Bar ----
async function fetchGroupData() {
  try {
    const res = await fetch(API_URL_INVENTORY);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const stockData = [];

    json.table.rows.forEach(row => {
      const groupName = row.c[11]?.v || '';
      const surin = parseFloat(row.c[12]?.v || 0);
      const nangrong = parseFloat(row.c[13]?.v || 0);
      const detUdom = parseFloat(row.c[14]?.v || 0);

      if (groupName) {
        stockData.push({
          group: groupName,
          Surin: surin,
          Nangrong: nangrong,
          DetUdom: detUdom,
          Total: surin + nangrong + detUdom   // ✅ รวมทั้ง 3 สาขา
        });
      }
    });

    renderGroupBarChart(stockData);
  } catch (err) {
    console.error("โหลดข้อมูลไม่สำเร็จ:", err);
  }
}

function renderGroupBarChart(stockData) {
  const annotations = stockData.map(d => {
    return {
      x: d.group,
      y: Math.max(d.Surin, d.Nangrong, d.DetUdom) + 5, // ยก label ขึ้นเหนือบาร์สูงสุดเล็กน้อย
      label: {
        text: `รวม: ${d.Total.toFixed(2)}`,
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          background: '#ffa500',
          color: '#000'
        }
      }
    };
  });

  const options = {
    chart: { type: 'bar', height: 500 },
    plotOptions: { bar: { columnWidth: '90%' } },
    series: [
      { name: 'สุรินทร์', data: stockData.map(d => parseFloat(d.Surin.toFixed(2))) },
      { name: 'นางรอง', data: stockData.map(d => parseFloat(d.Nangrong.toFixed(2))) },
      { name: 'เดชอุดม', data: stockData.map(d => parseFloat(d.DetUdom.toFixed(2))) }
    ],
    colors: ["#0080ff", "#ff0000", "#06c000"],
    xaxis: { categories: stockData.map(d => d.group) },
    dataLabels: {
      enabled: true,
      formatter: val => val.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}),
      style: { fontSize: '10px', colors: ['#fff'] }
    },
    annotations: { points: annotations },  // ✅ ใช้ points แทน texts
    legend: { position: 'top', horizontalAlign: 'center' }
  };

  new ApexCharts(document.querySelector("#group-bar-chart"), options).render();
}



// ---- Stock ----
async function fetchStockData() {
  try {
    const res = await fetch(API_URL_INVENTORY);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const months = [], year2 = [], year3 = [], year4 = [];

    function parseValue(cell) {
      if (!cell || !cell.v) return null;
      let val = cell.v.toString().replace(' MB','');
      val = parseFloat(val);
      if (isNaN(val)) return null;
      return val ;
    }

    json.table.rows.forEach(row => {
      const monthName = row.c[0]?.v || '';
      const val2 = parseValue(row.c[17]);
      const val3 = parseValue(row.c[18]);
      const val4 = parseValue(row.c[19]);

      if (val2 !== null || val3 !== null || val4 !== null) {
        months.push(monthName);
        year2.push(val2 !== null ? parseFloat(val2.toFixed(2)) : null);
        year3.push(val3 !== null ? parseFloat(val3.toFixed(2)) : null);
        year4.push(val4 !== null ? parseFloat(val4.toFixed(2)) : null);
      }
    });

    renderStockChart(months, year2, year3, year4);
  } catch (err) {
    console.error("โหลดข้อมูล Stock ไม่สำเร็จ:", err);
  }
}

function renderStockChart(months, year2, year3, year4) {
  const options = {
    chart: { type: 'line', height: 350 },
    series: [
      { name: 'ก.ค 66 - มิ.ย 67', data: year2 },
      { name: 'ก.ค 67 - มิ.ย 68', data: year3 },
      { name: 'ก.ค 68 - มิ.ย 69', data: year4 }
    ],
    xaxis: { categories: months },
    stroke: { width: 3, curve: 'smooth' },
    colors: ['#FF6347', '#32CD32', '#8A2BE2']
  };
  new ApexCharts(document.querySelector("#stock-chart"), options).render();
}

// ---- Tables ----
function formatNumber(num) {
  return Number(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function loadTables() {
  try {
    const res = await fetch(API_URL);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const rows = json.table.rows.map(r => ({
      branch: r.c[0]?.v || "",
      value: Number(r.c[1]?.v || 0),
      weight: Number(r.c[2]?.v || 0),
      pending: Number(r.c[3]?.v || 0)
    }));

    document.getElementById("table-stock-value").innerHTML =
      rows.map(r => `<tr><td>${r.branch}</td><td>${formatNumber(r.value)}</td></tr>`).join("") +
      `<tr class="total"><td>รวม</td><td>${formatNumber(rows.reduce((s,r)=>s+r.value,0))}</td></tr>`;

    document.getElementById("table-stock-weight").innerHTML =
      rows.map(r => `<tr><td>${r.branch}</td><td>${formatNumber(r.weight)}</td></tr>`).join("") +
      `<tr class="total"><td>รวม</td><td>${formatNumber(rows.reduce((s,r)=>s+r.weight,0))}</td></tr>`;

    document.getElementById("table-stock-pending").innerHTML =
      rows.map(r => `<tr><td>${r.branch}</td><td>${formatNumber(r.pending)}</td></tr>`).join("") +
      `<tr class="total"><td>รวม</td><td>${formatNumber(rows.reduce((s,r)=>s+r.pending,0))}</td></tr>`;
  } catch (err) {
    console.error("โหลดข้อมูล Tables ไม่สำเร็จ:", err);
  }
}

// ---- Base Price ----
function getDiffIcon(diff) {
  if (diff > 0) return `<span style="color:red;">▲ ${formatNumber(diff)}</span>`;
  if (diff < 0) return `<span style="color:green;">▼ ${formatNumber(diff)}</span>`;
  return `<span style="color:orange;">– ${formatNumber(diff)}</span>`;
}

async function loadBasePrice() {
  try {
    const res = await fetch(API_URL_BASEPRICE_INVENTORY);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const rows = json.table.rows.map(r => ({
      group: r.c[0]?.v || "",
      price: Number(r.c[1]?.v || 0),
      diff: Number(r.c[2]?.v || 0),
      note: r.c[3]?.v || ""
    }));

    const table = document.getElementById("table-base-price");
    table.innerHTML = `
      <tr><th>กลุ่ม</th><th>ราคาเบท</th><th>Diff</th><th>หมายเหตุ</th></tr>
      ${rows.map(r => `
        <tr>
          <td>${r.group}</td>
          <td>${formatNumber(r.price)}</td>
          <td>${getDiffIcon(r.diff)}</td>
          <td>${r.note}</td>
        </tr>`).join("")}
    `;
  } catch (err) {
    console.error("โหลดข้อมูล Base Price ไม่สำเร็จ:", err);
  }
}

// --- โหลดข้อมูลพร้อมกัน ---
async function fetchAllInventoryData() {
  try {
    await Promise.all([
      loadBasePrice(),
      loadTables(),
      fetchGroupData(),
      fetchInventoryData(),
      fetchPOData(),
      fetchStockData()
    ]);
    console.log("✅ โหลดข้อมูล Inventory Dashboard ครบแล้ว");
  } catch (err) {
    console.error("❌ โหลดข้อมูล Inventory Dashboard บางส่วนไม่สำเร็จ:", err);
  }
}

// --- Run ---
fetchAllInventoryData();
