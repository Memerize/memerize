"use client"; // Tambahkan ini di paling atas jika diperlukan

import React, { useEffect, useRef } from "react";

const InfiniteScroll = ({ loadMore, hasMore, children }) => {
  const observer = useRef(null);
  const lastElementRef = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    const callback = (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    };

    observer.current = new IntersectionObserver(callback);
    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [hasMore]);

  return (
    <div>
      {children}
      <div ref={lastElementRef} style={{ height: "20px" }} />
    </div>
  );
};

export default InfiniteScroll;

/*
CATATAN
Komponen InfiniteScroll berfungsi untuk memuat lebih banyak konten saat pengguna menggulir ke bawah halaman. Berikut adalah cara kerjanya:
Props: Menerima tiga props:
loadMore: Fungsi yang memuat lebih banyak data.
hasMore: Boolean yang menunjukkan apakah masih ada data yang bisa dimuat.
children: Konten yang akan ditampilkan.
Ref: Menggunakan useRef untuk menyimpan referensi ke IntersectionObserver dan elemen terakhir yang akan dipantau.
useEffect:
Menghentikan observer yang ada jika sudah ada.
Membuat callback yang akan dipanggil ketika elemen terakhir terlihat (intersecting) dan jika masih ada data (hasMore).
Mengamati elemen terakhir dengan observer.current.observe.
Render: Mengembalikan elemen div yang berisi children dan elemen div kosong dengan referensi lastElementRef untuk memicu pemanggilan loadMore saat terlihat.


*/
