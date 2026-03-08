# Ular Tangga (Text-Based)

[**Mainkan Sekarang!**](https://aflah012.github.io/Ular-Tangga-text-based/)

Permainan **Ular Tangga** versi teks sederhana yang dapat dimainkan langsung di browser. Proyek ini dibuat untuk tujuan pembelajaran dan eksperimen dengan JavaScript, HTML, dan CSS.

---

## 📖 Deskripsi
Ular Tangga adalah permainan klasik yang dimainkan dengan dadu. Setiap pemain bergiliran melempar dadu dan bergerak sesuai angka yang keluar. Jika mendarat di kepala ular, pemain akan turun ke ekor ular. Jika mendarat di kaki tangga, pemain akan naik ke atas tangga. Pemain pertama yang mencapai kotak ke-100 adalah pemenangnya!

---

## 🎮 Cara Bermain
1. **Buka game** di browser: [https://aflah012.github.io/Ular-Tangga-text-based/](https://aflah012.github.io/Ular-Tangga-text-based/)
2. **Pilih jumlah pemain** (2, 3, atau 4 pemain) dengan mengklik tombol radio di bagian atas.
3. **Klik tombol "Acak"** (dadu) untuk memulai permainan.
4. **Giliran pemain** akan bergantian secara otomatis.
5. **Jika mendapatkan angka 6**, pemain akan mendapatkan giliran tambahan.
6. **Pemain pertama yang mencapai kotak 100 menang!**

---

## 📂 Struktur File
| File/Folder       | Deskripsi                                                                 |
|-------------------|---------------------------------------------------------------------------|
| `index.html`      | File utama HTML untuk menjalankan game.                                  |
| `script.js`       | Logika permainan (giliran pemain, perhitungan skor, dll.).               |
| `style.css`       | Styling untuk tampilan game.                                             |
| `images.png`      | Icon untuk tombol dadu.                                                  |
| `images_black.png`| Alternatif icon dadu (tidak digunakan secara default).                   |
| `README.md`       | Dokumentasi proyek (file ini).                                            |

---

## 🛠 Teknologi yang Digunakan
- **HTML5**: Struktur halaman.
- **CSS3**: Styling dan tampilan.
- **JavaScript**: Logika permainan.

---

## 📝 Aturan Khusus
- Jika pemain mendapatkan **angka 6 tiga kali berturut-turut**, giliran akan berpindah ke pemain berikutnya.
- Jika pemain **melebihi kotak 100**, skor akan dikurangi dari 100 (misal: 102 → 98).
- **Ular dan Tangga**:
  - 5 → 26 (Tangga)
  - 9 → 31 (Tangga)
  - 28 → 47 (Tangga)
  - 39 → 1 (Ular)
  - 43 → 80 (Tangga)
  - 55 → 37 (Ular)
  - 68 → 50 (Ular)
  - 73 → 91 (Tangga)
  - 77 → 96 (Tangga)
  - 93 → 75 (Ular)
  - 99 → 83 (Ular)

---

## 🔧 Kontribusi
Jika Anda ingin berkontribusi, silakan buat **Pull Request** atau **Issue** di repositori ini. Beberapa ide untuk kontribusi:
- Menambahkan papan permainan visual.
- Meningkatkan UI/UX (misal: animasi, suara).
- Menambahkan fitur multiplayer online.

---

## 📜 Lisensi
Proyek ini dilisensikan di bawah **MIT License**. Lihat file [LICENSE](LICENSE) untuk detailnya.

---
© 2026 [Aflah012](https://github.com/Aflah012)