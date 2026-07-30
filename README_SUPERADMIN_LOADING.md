# Super Admin + Loading + Audit

Perubahan versi ini:

- Role `ADMIN` menjadi super-role dan dapat membuat permintaan, memeriksa, menyetujui/menolak, menyerahkan, serta mengonfirmasi penerimaan.
- Semua tindakan workflow dicatat ke tab Google Sheets `Audit_Log`; tindakan Admin diberi penanda `Admin Override = TRUE`.
- Loading overlay tampil saat penyimpanan, approval, unggah foto, konfirmasi, ganti role, dan refresh.
- Seluruh tombol aksi dinonaktifkan selama proses untuk mencegah klik ganda.
- Foto dikompres di browser maksimal 1280 px dan ditargetkan di bawah sekitar 900 KB sebelum dikirim.
- Form tidak ditutup atau direset jika penyimpanan gagal.

## Upgrade Apps Script

1. Ganti isi `Code.gs` dengan `code.gs.txt` versi ini.
2. Jalankan fungsi `upgradeSuperAdminAndAuditSystem()` satu kali.
3. Deploy sebagai **New version** pada deployment Web App yang sama.
4. Tidak perlu mengganti `GAS_URL`, `GAS_BACKEND_SECRET`, atau `SESSION_SECRET`.

## Tes lokal

```bash
npm run lint
npm run check:superadmin
npm run build
npm run dev
```
