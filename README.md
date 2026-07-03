# AI Academic WhatsApp Assistant - Universitas Terbuka (BotWAUT)

Sistem Asisten Akademik & Knowledge Engine berbasis AI (Retrieval-Augmented Generation / RAG) untuk Universitas Terbuka (UT) yang berjalan full *self-hosted* di VPS Linux Ubuntu. Bot ini dapat merayap (*crawl*) mandiri dari situs resmi UT, mengindeks pengetahuan lokal, dan menjawab secara cerdas pertanyaan mahasiswa baik melalui perintah teks maupun bahasa alami (*Natural Language Processing*).

---

## 🚀 Fitur Utama
1. **Academic Crawler Engine**: Merayap informasi penting, pengumuman terbaru, jadwal akademik, dan FAQ dari 9 situs resmi UT.
2. **Local Database & Cache**: Semua data disimpan di local JSON database VPS. Tidak membutuhkan cloud database eksternal.
3. **TF-IDF Semantic Search**: Melakukan pencarian tingkat relevansi tinggi secara lokal tanpa resource berat.
4. **AI RAG (Retrieval-Augmented Generation)**: Menghubungkan OpenAI API dengan konteks lokal agar jawaban asisten akurat dan **anti-halusinasi**.
5. **Web Monitoring Dashboard**: Dashboard premium (glassmorphism dark mode) untuk memindai QR Code, memantau penggunaan RAM/CPU, statistik data, dan log terminal real-time.
6. **Low RAM Optimization**: Dikonfigurasi khusus agar stabil berjalan di VPS berspesifikasi rendah (RAM 512MB - 1GB) menggunakan optimasi Puppeteer Chromium.
7. **Group Moderation & Welcome**: Menyambut mahasiswa baru yang masuk grup, memblokir pengiriman link scam/iklan, serta fitur antrian cooldown agar anti-spam.

---

## 📁 Struktur Proyek
```text
/src
  /commands        - Penanganan perintah bot (.menu, .ujian, dll)
  /events          - Lifecycle listener WhatsApp
  /handlers        - Message router & middleware cooldown
  /middlewares     - Validasi akses admin/owner & anti-link
  /services        - Integrasi RAG OpenAI & WhatsApp Client launcher
  /crawler         - Cheerio crawler engine situs UT
  /knowledge       - Algoritma pencarian semantik TF-IDF
  /database        - Engine localDb dengan pengaman file korup
  /utils           - Logger terpadu (pino/chalk) & tools backup
  /scheduler       - Pengaturan interval crawl berkala
  /logs            - File logs (app.log, crawler.log, error.log)

/storage
  /db              - JSON database (knowledge, faq, dll)
  /knowledge       - Cache data semantik
  /backup          - Folder penyimpanan backup database
  /materials       - Modul pembelajaran lokal (jika ada)
  /scraped         - Raw crawl output

/session           - Penyimpanan session token login WhatsApp
/public            - Static assets untuk Express Web Dashboard
```

---

## 🛠️ Panduan Instalasi di VPS Ubuntu (22.04+)

### 1. Update Sistem & Install Dependensi Chromium
WhatsApp-web.js berjalan di atas headless browser Puppeteer. VPS Ubuntu memerlukan paket dependensi Chrome agar Puppeteer tidak crash.

Jalankan perintah berikut di terminal VPS Anda:
```bash
sudo apt update && sudo apt upgrade -y

# Install dependensi GUI & browser untuk Puppeteer (tmpwatch diganti dengan tmpreaper di Ubuntu modern)
sudo apt install -y chromium-browser tmpreaper gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget curl git build-essential
```

### 2. Install Node.js LTS (v20+)
Gunakan NodeSource PPA untuk menginstal Node.js versi terbaru:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi instalasi
node -v
npm -v
```

### 3. Install PM2 (Process Manager)
PM2 digunakan untuk menjaga bot tetap berjalan 24 jam di background dan melakukan restart otomatis jika terjadi crash.
```bash
sudo npm install -y -g pm2
```

### 4. Clone Proyek & Install NPM Packages
Upload folder proyek ke VPS Anda (misalnya ke `/var/www/BotWAUT`) lalu masuk ke direktori tersebut:
```bash
cd /var/www/BotWAUT
npm install
```

### 5. Konfigurasi Environment File (.env)
Salin contoh file `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Sunting file `.env` menggunakan nano:
```bash
nano .env
```
Sesuaikan konfigurasi berikut:
* `PORT`: Port web monitoring (default: `3000`).
* `OWNER_NUMBER`: Nomor WhatsApp admin utama bot tanpa tanda '+' (contoh: `628123456789`).
* `OPENAI_API_KEY`: Masukkan API Key OpenAI Anda untuk mengaktifkan fitur AI Pintar (RAG). Jika dikosongkan, bot akan bekerja dalam mode pencarian kata kunci lokal offline.
* `WEB_DASHBOARD_PASSWORD`: Password untuk login ke web monitoring dashboard.

---

## 🏃 Cara Menjalankan Aplikasi

### Mode Pengembangan (Development)
```bash
npm run dev
```

### Mode Produksi (Menggunakan PM2)
Gunakan PM2 agar aplikasi berjalan di background, tahan crash, dan membatasi konsumsi memori Puppeteer:
```bash
# Menjalankan bot via PM2
pm2 start ecosystem.config.js

# Melihat status bot di PM2
pm2 status

# Melihat log real-time
pm2 logs bot-wa-ut

# Mengatur agar PM2 otomatis berjalan saat VPS reboot/restart
pm2 startup
pm2 save
```

---

## 🔍 Cara Menautkan Akun WhatsApp (Pairing)

1. Buka browser Anda dan akses alamat IP VPS Anda beserta port yang diset (contoh: `http://192.168.1.100:3000`).
2. Masukkan password dashboard yang telah Anda atur di `.env`.
3. Dashboard akan menampilkan halaman utama dan memuat QR Code.
4. Buka aplikasi WhatsApp di HP Anda -> ketuk menu **Perangkat Tertaut** -> **Tautkan Perangkat** -> Pindai QR Code di layar browser Anda.
5. Bot akan bertransisi status menjadi **Connected** dan siap digunakan.

---

## 👥 Pengaturan Whitelist Grup WhatsApp
Untuk mencegah penyalahgunaan dan penyadapan oleh grup yang tidak dikehendaki, bot menggunakan sistem whitelist. Secara default, bot **tidak akan merespon** di dalam grup manapun sebelum diizinkan oleh Owner.

* **Mengizinkan Grup (.addgroup)**:
  * Masuk ke grup WhatsApp baru.
  * Gunakan nomor owner Anda, lalu kirim pesan: `.addgroup`
  * Bot akan merespon konfirmasi dan mulai aktif di grup tersebut.
* **Menghapus Izin Grup (.delgroup)**:
  * Ketik `.delgroup` di grup untuk menonaktifkan respon bot.
* **Daftar Grup Aktif (.listgroups)**:
  * Ketik `.listgroups` untuk melihat daftar semua ID grup yang di-whitelist.

---

## 📂 Backup & Pemeliharaan Database

### Backup Manual
Jalankan skrip backup berikut untuk menduplikasi seluruh database lokal Anda ke folder `/storage/backup`:
```bash
node src/utils/backup.js --manual
```
Atau Anda dapat mengetikkan perintah `.backup` langsung di obrolan admin WhatsApp ke nomor bot.

### Restore Database
Jika ingin memulihkan data lama:
1. Matikan proses bot: `pm2 stop bot-wa-ut`.
2. Salin file `.json` dari folder backup pilihan Anda (misalnya `/storage/backup/db-backup-YYYYMMDD-HHmmss/*`) ke dalam folder aktif `/storage/db/`.
3. Jalankan kembali bot: `pm2 start bot-wa-ut`.

### Merayap Website Secara Manual (Manual Crawl)
Crawler akan berjalan otomatis setiap 6 jam secara default. Jika Anda ingin melakukan *crawling* paksa saat itu juga:
```bash
npm run crawl
```
Atau ketik perintah `.crawl` di obrolan admin WhatsApp ke nomor bot, atau ketuk tombol **Run Web Crawler Now** di Web Dashboard.

---

## 🛠️ Troubleshooting (Penyelesaian Masalah)

### 1. Masalah Puppeteer / Chromium Crash saat Start
Jika Anda melihat error seperti `Error: Failed to launch the browser process!`, ini karena Puppeteer kekurangan hak akses atau dependensi di VPS.
* **Solusi**: Pastikan Anda telah menginstal seluruh paket pendukung GUI Linux di bagian Instalasi Langkah 1.
* Jika Anda menjalankan VPS sebagai root, pastikan opsi `--no-sandbox` terpasang di file `src/services/whatsappClient.js` (sudah dikonfigurasi secara default di proyek ini).

### 2. Sesi Sering Logout Sendiri (Troubleshooting Logout)
Jika WhatsApp bot sering memutus koneksi/minta scan ulang:
* **Solusi 1**: Hapus folder session yang rusak:
  ```bash
  pm2 stop bot-wa-ut
  rm -rf ./session
  pm2 start bot-wa-ut
  ```
  Lalu akses Web Dashboard untuk memindai ulang QR Code yang bersih.
* **Solusi 2**: Kurangi beban request berlebih. Cooldown per chat diatur sebesar 3 detik di file `.env` untuk mencegah deteksi spam dari pihak WhatsApp.

### 3. Masalah Memori RAM VPS Penuh
Karena Puppeteer membuka Chromium secara headless, penggunaan RAM dapat melonjak.
* **Solusi**: Proyek ini telah dipasang fitur PM2 `max_memory_restart: "450M"`. PM2 akan mendeteksi jika memori bot menyentuh 450MB lalu me-restart proses secara aman di background tanpa merusak data sesi login.
