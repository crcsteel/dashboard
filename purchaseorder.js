async function fetchPurchaseData() {
  try {
    const res = await fetch(API_URL_PURCHASE);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const months = [], year1 = [], year2 = [], year3 = [];

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

      // ✅ ตัด val4 ออก ใช้แค่ 3 ปี
      if (val1 !== null || val2 !== null || val3 !== null) {
        months.push(monthName);
        year1.push(val1 !== null ? parseFloat(val1.toFixed(2)) : null);
        year2.push(val2 !== null ? parseFloat(val2.toFixed(2)) : null);
        year3.push(val3 !== null ? parseFloat(val3.toFixed(2)) : null);
      }
    });

    renderPurchaseChart(months, year1, year2, year3); // ✅ แก้ชื่อ function
  } catch (err) {
    console.error("โหลดข้อมูล Purchase ไม่สำเร็จ:", err);
  }
}

// ✅ ชื่อ function ต้องตรงกัน
function renderPurchaseChart(months, year1, year2, year3) {
  const options = {
    chart: { type: 'line', height: 350 },
    series: [
      { name: 'ก.ค 66 - มิ.ย 67', data: year1 },
      { name: 'ก.ค 67 - มิ.ย 68', data: year2 },
      { name: 'ก.ค 68 - มิ.ย 69', data: year3 }
    ],
    xaxis: { categories: months },
    stroke: { width: 3, curve: 'smooth' },
    colors: ['#1E90FF', '#FF6347', '#32CD32'],

    // ✅ เพิ่ม yaxis
    yaxis: [
      {
        title: { text: "Purchase (ล้านบาท)" },
      },
    ],

    // ✅ Tooltip แยกตามซีรีส์
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        { formatter: val => (val ? val.toLocaleString() + " MB" : "") },
        { formatter: val => (val ? val.toLocaleString() + " MB" : "") },
        { formatter: val => (val ? val.toLocaleString() + " MB" : "") }
      ]
    },

    // ✅ สวยขึ้น
    plotOptions: { bar: { columnWidth: '90%', borderRadius: 2 } },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1, 2, 3],
      formatter: val => (val ? val.toLocaleString() : "")
    },
    grid: { borderColor: '#e0e0e0', strokeDashArray: 4 }
  };

  new ApexCharts(document.querySelector("#purchase-chart"), options).render();
}

fetchPurchaseData();
