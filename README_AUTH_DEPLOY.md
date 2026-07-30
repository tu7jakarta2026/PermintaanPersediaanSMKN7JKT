# Login NRK + PIN dan Dashboard Berbasis Role

## Arsitektur akhir

Browser React hanya berbicara ke Vercel API. Vercel menyimpan sesi pada cookie `HttpOnly` yang ditandatangani. Vercel kemudian menghubungi Google Apps Script memakai `GAS_BACKEND_SECRET`. URL Apps Script dan secret tidak dikirim ke browser.

Role aplikasi:

- `PEMOHON`: membuat dan melihat permintaan miliknya sendiri.
- `PETUGAS_GUDANG`: memeriksa permintaan masuk dan memvalidasi serah terima.
- `APPROVER`: menyetujui atau menolak permintaan yang sudah diperiksa gudang.
- `ADMIN`: melihat seluruh data dan dapat menjalankan tindakan lintas role.

Alur status:

`PENDING_RECEIPT` → `PENDING_APPROVAL` → `PENDING_VALIDATION` → `VALIDATED`

Approver dapat mengubah `PENDING_APPROVAL` menjadi `REJECTED`.

## 1. Pasang Apps Script final

1. Buka project Apps Script yang terhubung ke spreadsheet salinan.
2. Ganti seluruh isi `Code.gs` dengan file `AppsScript_Auth_Final_Code.gs.txt` dari paket ini.
3. Simpan.
4. Pilih fungsi `setupAuthSystem`, lalu klik **Run**.
5. Berikan izin saat diminta.
6. Buka **Execution log** dan salin nilai setelah:

   `GAS_BACKEND_SECRET=`

7. Apps Script otomatis membuat tab `Master_Pegawai`, hash PIN, dan secret backend.
8. PIN awal semua akun adalah `123456` dan wajib diganti saat login pertama.

### Role awal yang dibuat

- Semua pegawai lain: `PEMOHON`
- Dwi Ratih: `APPROVER`
- Turimin, Maya Permatasari, dan Sunaryo: `PETUGAS_GUDANG`
- Masdarul Ihsan: `ADMIN`

Role dapat diubah langsung pada kolom **Role Aplikasi** di tab `Master_Pegawai`. Nilai yang valid hanya `PEMOHON`, `PETUGAS_GUDANG`, `APPROVER`, atau `ADMIN`.

## 2. Perbarui deployment Apps Script

1. Klik **Deploy → Manage deployments**.
2. Edit deployment Web App yang aktif.
3. Pilih **New version**.
4. Execute as: **Me**.
5. Who has access: **Anyone**.
6. Deploy dan pastikan URL tetap berakhiran `/exec`.

`doGet` sekarang hanya mengembalikan status backend. Data permintaan tidak lagi dibuka melalui URL Apps Script publik.

## 3. Environment Variables Vercel

Tambahkan untuk Production, Preview, dan Development:

- `GAS_URL`: URL deployment Apps Script `/exec`.
- `GAS_BACKEND_SECRET`: nilai dari Execution log Apps Script.
- `SESSION_SECRET`: secret acak minimal 32 karakter.
- `ITEMS_CSV_URL`: opsional, URL CSV master barang.

Buat `SESSION_SECRET` dari PowerShell:

```powershell
$bytes = New-Object byte[] 48
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

Setelah semua environment variables disimpan, lakukan **Redeploy** pada deployment terbaru.

## 4. Pengujian

Tanpa login:

- `/api/health` harus `200` dan menampilkan `authConfigured: true`.
- `/api/config` harus `401`.
- `/api/requests` harus `401`.

Respons `401` pada config dan requests adalah perilaku yang benar karena endpoint sudah dilindungi sesi.

Login pertama:

1. Masuk memakai NRK dan PIN `123456`.
2. Sistem wajib menampilkan halaman ganti PIN.
3. Buat PIN baru 6 digit.
4. Dashboard otomatis mengikuti role akun.

Uji workflow:

1. Pemohon membuat permintaan.
2. Petugas Gudang memilih **Periksa & Teruskan**.
3. Approver memilih **Setujui** atau **Tolak**.
4. Petugas Gudang memilih **Serah Terima & Foto**.
5. Status akhir menjadi `VALIDATED` dan foto tersimpan ke Google Drive.

## 5. Keamanan penting

- Jangan commit `.env`.
- Jangan commit salinan `Code.gs`; file tersebut sudah masuk `.gitignore`.
- Jangan menampilkan `GAS_BACKEND_SECRET` atau `SESSION_SECRET` di screenshot publik.
- Setelah pengujian, ubah PIN semua akun yang masih memakai PIN awal.
