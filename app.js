// โหลด Sidebar
fetch("sidebar.html")
  .then(res => res.text())
  .then(html => { document.getElementById("sidebar").innerHTML = html; })
  .catch(err => console.error("โหลด Sidebar ไม่ได้:", err));

// ตรวจสอบการ Login เฉพาะหน้า backorderandcost.html
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "backorderandcost.html") {
    const loggedIn = localStorage.getItem("loggedIn");
    const loginTime = localStorage.getItem("loginTime");

    if (loggedIn !== "true" || !loginTime) {
      alert("กรุณาเข้าสู่ระบบก่อนเข้าหน้านี้");
      window.location.href = "login.html";
      return;
    }

    // ตรวจสอบ session หมดอายุ (1 ชั่วโมง)
    if (Date.now() - loginTime > 3600000) {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("loginTime");
      alert("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
      window.location.href = "login.html";
    }
  }
});
