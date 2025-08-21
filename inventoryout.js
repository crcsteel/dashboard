// ===========================
// Inventory Out Dashboard
// ===========================

// --- Helper ---
function toNumber(val) {
  if (!val) return null; // ถ้าไม่มีค่า → null
  let num = parseFloat(val.toString().replace(' MB',''));
  return isNaN(num) || num === 0 ? null : num; // NaN หรือ 0 → null
}

// --- ฟังก์ชันกลาง ใช้สร้างกราฟจากชีท ---
async function fetchAndRenderInventoryOutChart(targetId, startCol, yTitle, unit = "") {
  try {
    const res = await fetch(API_URL_INVENTORY_OUT);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const months = [], year1 = [], year2 = [], year3 = [], year4 = [];

    json.table.rows.forEach(row => {
      const monthName = row.c[0]?.v || '';

      const val1 = toNumber(row.c[startCol]?.v);
      const val2 = toNumber(row.c[startCol+1]?.v);
      const val3 = toNumber(row.c[startCol+2]?.v);
      const val4 = toNumber(row.c[startCol+3]?.v);

      if (val1 !== null || val2 !== null || val3 !== null || val4 !== null) {
        months.push(monthName);
        year1.push(val1 !== null ? +val1.toFixed(2) : null);
        year2.push(val2 !== null ? +val2.toFixed(2) : null);
        year3.push(val3 !== null ? +val3.toFixed(2) : null);
        year4.push(val4 !== null ? +val4.toFixed(2) : null);
      }
    });

    // --- Render Chart ---
    const options = {
      chart: { type: 'line', height: 400, toolbar: { show: true } },
      series: [
        { name: 'ก.ค 65 - มิ.ย 66', data: year1 },
        { name: 'ก.ค 66 - มิ.ย 67', data: year2 },
        { name: 'ก.ค 67 - มิ.ย 68', data: year3 },
        { name: 'ก.ค 68 - มิ.ย 69', data: year4 }
      ],
      xaxis: { categories: months },
      stroke: { width: 3, curve: 'smooth' },
      colors: ['#FFC000', '#00B050', '#00B0F0', '#EC34DF'],
      yaxis: {
        labels: { formatter: val => val.toFixed(2) },
        title: { text: yTitle }
      },
      tooltip: {
        y: {
          formatter: val => (val ? val.toLocaleString() : "-") + " " + unit
        }
      }
    };

    document.querySelector(targetId).innerHTML = ""; // clear chart เดิม
    new ApexCharts(document.querySelector(targetId), options).render();

  } catch (err) {
    console.error(`โหลดข้อมูลไม่สำเร็จ (${targetId}):`, err);
  }
}

// --- โหลดข้อมูลพร้อมกัน ---
async function fetchAllInventoryOutData() {
  try {
    await Promise.all([
      fetchAndRenderInventoryOutChart("#inventory-out-gi-chart",    13, "ปริมาณ (ตัน)", "ตัน"),
      fetchAndRenderInventoryOutChart("#inventory-out-rbdb-chart",  13, "ปริมาณ (ตัน)", "ตัน"),
      fetchAndRenderInventoryOutChart("#inventory-out-ton-chart",   13, "ปริมาณ (ตัน)", "ตัน"),
      fetchAndRenderInventoryOutChart("#inventory-out-bath-chart",  13, "ปริมาณ (ตัน)", "ตัน"),
      fetchAndRenderInventoryOutChart("#inventory-out-backsteel-chart", 13, "ปริมาณ (ตัน)", "ตัน"),
    ]);
    console.log("✅ โหลดข้อมูล Inventory Out ครบแล้ว");
  } catch (err) {
    console.error("❌ โหลดข้อมูล Inventory Out บางส่วนไม่สำเร็จ:", err);
  }
}

// --- Run ---
fetchAllInventoryOutData();
