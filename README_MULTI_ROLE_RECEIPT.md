# Multi-Role dan Konfirmasi Penerimaan Pemohon

Versi ini menambahkan satu akun dengan beberapa role, foto pendukung permintaan yang opsional, bukti penyerahan dari Petugas Gudang, dan konfirmasi penerimaan langsung oleh Pemohon.

## Alur status

```text
PENDING_RECEIPT
→ PENDING_APPROVAL
→ PENDING_VALIDATION
→ AWAITING_REQUESTER_CONFIRMATION
→ VALIDATED
```

Setelah Petugas Gudang mengunggah foto penyerahan, status berubah menjadi `AWAITING_REQUESTER_CONFIRMATION`. Pemohon asli dapat langsung menekan **Konfirmasi Diterima**. Foto Pemohon bersifat opsional; bila memilih **Diterima dengan Catatan**, catatan wajib diisi.

## Multi-role

Akun dapat memiliki beberapa role:

- `PEMOHON`
- `PETUGAS_GUDANG`
- `APPROVER`
- `ADMIN`

Role aktif dapat diganti dari pemilih **Mode Kerja** di header. Backend hanya menerima role yang benar-benar tercatat untuk NRK tersebut.

### Google Sheets

- `Master_Pegawai` kolom **Role Utama** menentukan mode awal setelah login.
- Tab `User_Roles` menyimpan satu baris untuk setiap pasangan NRK dan role.
- Untuk menambah role, tambahkan baris baru dengan `Aktif = TRUE`.
- Untuk mencabut role, ubah `Aktif = FALSE`; jangan menghapus PIN Salt atau PIN Hash.
- Pengguna harus logout lalu login lagi setelah role diubah di Google Sheets.

Contoh:

```text
222538 | PEMOHON         | TRUE
222538 | PETUGAS_GUDANG  | TRUE
```

## Dokumentasi foto

- Foto pendukung permintaan: diunggah Pemohon, opsional.
- Foto penyerahan: diunggah Petugas Gudang, wajib.
- Foto konfirmasi penerimaan: diunggah Pemohon, opsional.
- URL Google Drive tetap disimpan; frontend mengubah URL tersebut menjadi URL thumbnail agar gambar dapat ditampilkan.

## Upgrade Apps Script

1. Ganti seluruh isi `Code.gs` menggunakan `AppsScript_MultiRole_Receipt_Final_Code.gs.txt`.
2. Jalankan fungsi `upgradeMultiRoleAndReceiptSystem()` satu kali.
3. Buat versi deployment Apps Script baru.
4. `GAS_BACKEND_SECRET` lama tetap digunakan dan PIN pengguna tidak direset.

Fungsi upgrade akan membuat tab `User_Roles`, menambahkan kolom konfirmasi Pemohon, dan mempertahankan data lama.

## Tes lokal

```powershell
npm run lint
npm run check:serverless
npm run check:multirole
npm run build
```

Data lama berstatus `VALIDATED` tetap dianggap selesai. Konfirmasi Pemohon berlaku untuk alur baru setelah upgrade.
