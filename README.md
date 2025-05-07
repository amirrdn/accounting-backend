# Accounting System Backend

Backend API untuk Sistem Akuntansi & Manajemen Bisnis yang dibangun menggunakan Node.js, Express, TypeScript, dan TypeORM. Sistem ini menyediakan API endpoints untuk mengelola keuangan, persediaan, pembelian, penjualan, dan laporan bisnis.

## 🚀 Fitur Utama

- **RESTful API**: Endpoints untuk semua operasi CRUD
- **Autentikasi & Otorisasi**: JWT-based authentication dan role-based access control
- **Manajemen Data**:
  - Akun & Jurnal
  - Pelanggan & Supplier
  - Produk & Stok
  - Pembelian & Penjualan
  - Kas & Bank
- **Database**: MySQL dengan TypeORM
- **Validasi**: Request validation dan error handling
- **Audit Trail**: Logging untuk tracking perubahan data
- **File Upload**: Manajemen file dan dokumen

## 🛠️ Teknologi

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/)
- [MySQL](https://www.mysql.com/)
- [JWT](https://jwt.io/)
- [Class Validator](https://github.com/typestack/class-validator)
- [Multer](https://github.com/expressjs/multer)

## 📦 Instalasi & Menjalankan Lokal

1. **Clone repository**
   ```bash
   git clone https://github.com/username/repo-name.git
   cd repo-name/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Setup database**
   - Buat database MySQL baru
   - Salin `.env.example` ke `.env` dan sesuaikan konfigurasi database
   ```bash
   cp .env.example .env
   ```

4. **Jalankan migrasi database**
   ```bash
   npm run typeorm migration:run
   # atau
   yarn typeorm migration:run
   ```

5. **Jalankan aplikasi**
   ```bash
   # Development
   npm run dev
   # atau
   yarn dev

   # Production
   npm run build
   npm start
   # atau
   yarn build
   yarn start
   ```

6. **Akses API**
   - API akan berjalan di [http://localhost:3000](http://localhost:3000)
   - Dokumentasi API tersedia di [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 📁 Struktur Folder

```
src/
├── config/         # Konfigurasi aplikasi
├── controllers/    # Controller untuk handle request
├── entity/         # TypeORM entities
├── middleware/     # Custom middleware
├── migration/      # Database migrations
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## 🔒 Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=accounting_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

# File Upload
UPLOAD_DIR=uploads
```

## 📝 API Endpoints

### Autentikasi
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru

### Akun
- `GET /api/accounts` - Daftar akun
- `POST /api/accounts` - Buat akun baru
- `PUT /api/accounts/:id` - Update akun
- `DELETE /api/accounts/:id` - Hapus akun

### Pelanggan
- `GET /api/customers` - Daftar pelanggan
- `POST /api/customers` - Tambah pelanggan
- `PUT /api/customers/:id` - Update pelanggan
- `DELETE /api/customers/:id` - Hapus pelanggan

### Supplier
- `GET /api/suppliers` - Daftar supplier
- `POST /api/suppliers` - Tambah supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Hapus supplier

### Produk
- `GET /api/products` - Daftar produk
- `POST /api/products` - Tambah produk
- `PUT /api/products/:id` - Update produk
- `DELETE /api/products/:id` - Hapus produk

### Pembelian
- `GET /api/purchases` - Daftar pembelian
- `POST /api/purchases` - Buat pembelian baru
- `GET /api/purchases/:id` - Detail pembelian
- `PUT /api/purchases/:id` - Update pembelian

### Penjualan
- `GET /api/sales` - Daftar penjualan
- `POST /api/sales` - Buat penjualan baru
- `GET /api/sales/:id` - Detail penjualan
- `PUT /api/sales/:id` - Update penjualan

## 📝 Kontribusi

Kontribusi sangat terbuka! Silakan buat issue atau pull request untuk perbaikan dan penambahan fitur.

## 📄 Lisensi

MIT License 