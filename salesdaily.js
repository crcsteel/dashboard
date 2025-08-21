// ฟังก์ชันฟอร์แมตตัวเลขเป็น #,###.00
function formatInt(num) {
  return Number(num).toLocaleString('en-US', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  });
}
function formatDateDDMMYY(dateObj) {
  if (!dateObj) return "";

  // กรณี JSON ส่งมาเป็น {v: "Date(2025,7,1)"} 
  // ต้อง parse ออกมาก่อน
  if (typeof dateObj === "string" && dateObj.startsWith("Date(")) {
    const parts = dateObj.match(/\d+/g).map(Number);
    // parts = [2025,7,1]
    const d = new Date(parts[0], parts[1], parts[2]);
    return d.getDate(); // ✅ ได้เลขวัน เช่น 1
  }

  // ถ้ามาเป็น date ปกติ
  const d = new Date(dateObj);
  if (isNaN(d)) return dateObj;
  return d.getDate();
}

// ---- Sales Daily ----
async function fetchData() {
  try {
    const resSales = await fetch(API_URL_DATA);
    const textSales = await resSales.text();
    const jsonSales = JSON.parse(textSales.substring(47, textSales.length - 2));

    let rows = jsonSales.table.rows.map(r => ({
      date: r.c[0]?.v || '',
      surin: Number(r.c[1]?.v || 0),
      nangrong: Number(r.c[2]?.v || 0),
      detudom: Number(r.c[3]?.v || 0),
      total: Number(r.c[4]?.v || 0),
      note: r.c[5]?.v || ''
    }));
    if (!rows.length) return;
    rows.sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalSales = [
      rows.reduce((sum, r) => sum + r.surin, 0),
      rows.reduce((sum, r) => sum + r.nangrong, 0),
      rows.reduce((sum, r) => sum + r.detudom, 0),
      rows.reduce((sum, r) => sum + r.total, 0)
    ];

    // Target
    const resTarget = await fetch(API_URL_TARGET);
    const textTarget = await resTarget.text();
    const jsonTarget = JSON.parse(textTarget.substring(47, textTarget.length - 2));
    const targets = jsonTarget.table.rows.map(r => Number(r.c[0]?.v || 0));

    // Cards
    const cards = document.querySelectorAll('#dashboard-cards .card');
    totalSales.forEach((sale, i) => {
      const target = targets[i] || 1;
      const percent = Math.min((sale / target) * 100, 100);

      cards[i].querySelector('h2').textContent = formatNumber(sale);
      cards[i].querySelector('p[style*="margin-left"]').textContent = formatNumber(target);

      const progressEl = cards[i].querySelector('.progress');
      const labelEl = cards[i].querySelector('.label');
      progressEl.style.width = percent.toFixed(1) + '%';
      progressEl.style.backgroundColor = '#1E90FF';
      progressEl.style.display = 'block';
      labelEl.textContent = percent.toFixed(1) + '%';
    });

    // Table
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = rows.map(r => `
      <tr>
        <td>${formatDateDDMMYY(r.date)}</td>
        <td style="text-align:right">${formatNumber(r.surin)}</td>
        <td style="text-align:right">${formatNumber(r.nangrong)}</td>
        <td style="text-align:right">${formatNumber(r.detudom)}</td>
        <td style="text-align:right">${formatNumber(r.total)}</td>
        <td>${r.note}</td>
      </tr>
    `).join('');

    renderChart(rows);
  } catch (err) {
    console.error('โหลดข้อมูลไม่สำเร็จ:', err);
  }
}
function renderChart(rows) {
  const options = {
    chart: { type: 'line', height: 350 },
    series: [
      { name: 'สุรินทร์', type: 'line', data: rows.map(r => r.surin) },
      { name: 'นางรอง', type: 'line', data: rows.map(r => r.nangrong) },
      { name: 'เดชอุดม', type: 'line', data: rows.map(r => r.detudom) },
      { name: 'รวม 3 สาขา', type: 'column', data: rows.map(r => r.total) }
    ],
    xaxis: { categories: rows.map(r => formatDateDDMMYY(r.date)) },
    stroke: { curve: 'smooth', width: [2, 2, 2, 0] },
    plotOptions: { bar: { columnWidth: '98%', borderRadius: 4 } },
    markers: { size: 3 },
    colors: ['#00B050', '#00B0F0', '#EC34DF', '#fff7b3ff'],

    // ✅ format แกน Y
    yaxis: {
      labels: {
        formatter: val => Number(val).toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })
      }
    },

    tooltip: {
      y: {
        formatter: val => Number(val).toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })
      }
    }
  };

  new ApexCharts(document.querySelector("#sales-chart"), options).render();
}



fetchData();
