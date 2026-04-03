# vue3js-vite-template

Template frontend modern, tangguh, dan berstandar *Enterprise* yang dirancang khusus untuk integrasi mulus dengan ekosistem **Go (Gin Framework)**. Proyek ini menggunakan teknologi terbaru untuk performa tinggi dan kemudahan pemeliharaan.

---

## 🚀 Fitur Utama

- **Vue 3 (Composition API)** - Framework progresif dengan performa tinggi.
- **Vite 8 & Tailwind CSS v4** - *Bundling* super cepat dan sistem styling atomik terbaru.
- **Pinia State Management** - Pengelola status global yang ringan dan reaktif.
- **Enterprise-Grade Authentication**:
  - Alur login & registrasi lengkap.
  - Mekanisme **Token Refresh** otomatis via Axios Interceptors (aman dari _race conditions_).
  - Proteksi *Route Guard* (Admin & User roles).
- **Admin Management Dashboard**:
  - Tabel Manajemen Pengguna dengan fitur Pencarian (*Search*) dan Limitasi Data.
  - CRUD Lengkap (Tambah, Edit, Hapus).
  - Aktivasi & Deaktivasi akun secara instan.
  - Navigasi Paginasi yang sinkron dengan backend.
- **Global Toast Notification** - Sistem umpan balik modern dengan 4 variant (Success, Error, Warning, Info).
- **Modern UI/UX**:
  - Dark & Light Mode otomatis/manual.
  - Ikonografi dari Lucide-Vue-Next.
  - Desain modal konfirmasi yang intuitif.

---

## 🛠️ Tech Stack

- **Framework**: [Vue.js 3](https://vuejs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## 🔗 Referensi Backend

Aplikasi ini dirancang untuk bekerja secara harmonis dengan template backend Go berikut:
👉 **[Go-Gin-Template](https://github.com/memcpypid/Go-Gin-Template)**
👉 **[Xpress.js-Template](https://github.com/memcpypid/Xpress.js-Template)**
👉 **[Go-Fiber-Template](https://github.com/memcpypid/Go-Fiber-Template)**
Pastikan backend Anda berjalan dengan endpoint yang sesuai sebelum menjalankan aplikasi frontend ini.

---

## 📦 Instalasi & Persiapan

1. **Clone repositori**:
   ```bash
   git clone https://github.com/memcpypid/Vue3js-Vite-Template
   cd Vue3js-Vite-Template
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin berkas `.env.example` menjadi `.env` dan sesuaikan URL API Anda.
   ```bash
   cp .env.example .env
   ```
   Isi `VITE_API_BASE_URL` dengan alamat backend Anda (contoh: `http://localhost:8080`).

4. **Jalankan Mode Pengembangan**:
   ```bash
   npm run dev
   ```

5. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

---

## 📂 Struktur Folder
- `src/composables` - Logika reaktif yang dapat digunakan kembali (misal: `useToast`).
- `src/services` - Lapisan API Axios (`api.js`, `auth.service.js`, `user.service.js`).
- `src/stores` - Modul status global Pinia.
- `src/views` - Halaman utama aplikasi (Auth, Admin, User).
- `src/components/ui` - Komponen desain sistem (Toast, Modals, dll).

---

## 📄 Lisensi
MIT License

Copyright (c) 2026 M. Darma Putra Ramadhan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
