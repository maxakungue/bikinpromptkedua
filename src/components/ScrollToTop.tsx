import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Komponen ini berfungsi untuk memaksa halaman kembali ke posisi paling atas (scroll to top)
 * setiap kali terjadi perpindahan navigasi (URL berubah).
 * 
 * Di React (SPA), navigasi tidak memicu reload halaman penuh, sehingga posisi scroll
 * biasanya menetap di posisi sebelumnya. Komponen ini memperbaiki perilaku tersebut.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // window.scrollTo(0, 0) akan menarik pandangan user ke koordinat (X:0, Y:0) yaitu paling atas
    window.scrollTo(0, 0);
  }, [pathname]); // UseEffect ini akan jalan terus SETIAP KALI pathname (URL) berubah

  return null; // Komponen ini tidak perlu merender apa pun ke layar
}
