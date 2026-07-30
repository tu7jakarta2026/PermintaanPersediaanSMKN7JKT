# Fix Vercel Serverless ESM

Perbaikan ini menangani error runtime Vercel:

```text
ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/lib/serverless/shared'
```

Perubahan utama:

- `api/health.ts` dan `api/config.ts` dibuat mandiri.
- Semua relative import serverless memakai ekstensi `.js`, sesuai runtime Node.js ESM.
- Import fallback barang dan pegawai juga memakai ekstensi `.js`.
- BOM pada source TypeScript dibersihkan.
- Ditambahkan `npm run check:serverless` untuk compile NodeNext dan smoke test seluruh endpoint.
- Tidak menggunakan `vercel.json`; Vercel mendeteksi file `api/*.ts` secara otomatis.

Tes sebelum push:

```powershell
npm run lint
npm run check:serverless
npm run build
```
