# Catatan Pengeluaran

Pencatat pengeluaran pribadi sederhana dengan antarmuka yang terinspirasi dari internet zaman dulu.

## Buka Situs

Buka `index.html` di peramban web modern. Tidak perlu proses build atau pustaka eksternal.

Catatan pengeluaran, anggaran bulanan, dan mata uang tampilan tersimpan di browser pada perangkat ini menggunakan `localStorage`.

## Fitur

- Tambahkan dan hapus catatan pengeluaran yang berisi keterangan, jumlah, tanggal, dan kategori.
- Lihat total bulanan, jumlah catatan, dan sisa anggaran.
- Atur anggaran bulanan dan lihat bilah progres sederhana.
- Filter daftar pengeluaran berdasarkan kategori atau cari berdasarkan keterangannya.
- Ganti mata uang tampilan dengan catatan terpisah untuk setiap mata uang, atau konversikan jumlah menggunakan kurs referensi harian dari Frankfurter. Kurs bank dan biaya tambahan bisa berbeda.
- Beralih antara tema terang dan gelap, serta gunakan bahasa Inggris atau Bahasa Indonesia.
- Simpan tema, bahasa, dan data catatan untuk setiap mata uang di browser ini.
- Buka ringkasan dalam dua bahasa tentang pentingnya mencatat pengeluaran, lengkap dengan tautan ke sumber dari BCA.
- Buka tiap bagian melalui navigasi dengan sorotan singkat selama satu detik.
- Gunakan palet putih pudar, hitam, dan abu-abu tua tanpa bayangan.

## Konsep Tugas dalam Kode

- Variabel dan tipe data: JavaScript menggunakan string, angka, array, objek, dan boolean untuk menyimpan catatan serta pengaturan.
- Operasi: kode menjumlahkan pengeluaran, mengurangi total pengeluaran dari anggaran, dan menghitung persentase anggaran yang terpakai.
- Array: catatan pengeluaran dan nama kategori disimpan dalam array.
- Perulangan: perulangan `for...of` membuat pilihan kategori, menghitung total, memfilter catatan, dan menampilkan baris tabel.
- Fungsi: fungsi bernama digunakan untuk memuat data, memformat jumlah, memperbarui ringkasan, menampilkan daftar pengeluaran, dan menangani formulir.
- If dan else: kondisi digunakan untuk memeriksa data formulir, menangani daftar yang kosong, dan menunjukkan apakah pengeluaran masih sesuai anggaran.

## Berkas

- `index.html` berisi struktur halaman.
- `styles.css` berisi tata letak responsif dengan warna solid.
- `script.js` berisi perilaku pencatat pengeluaran.
