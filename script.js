// Saat klik "Mulai", tampilkan form
btnMulai.onclick = () => formPengisian.style.display = 'flex';

// Saat klik "Daftar Diri", tampilkan popup
btnDaftar.onclick = () => popupDataDiri.style.display = 'flex';

// Tombol Close di popup → muncul konfirmasi
btnClosePopup.onclick = () => {
  Swal.fire({
    title: 'Anda Yakin Keluar?',
    text: 'Pilih OK untuk keluar atau Cancel untuk tetap di Data Diri.',
    icon: 'warning', showCancelButton: true,
    confirmButtonText: 'OK', cancelButtonText: 'Cancel'
  }).then(r => {
    if (r.isConfirmed) {
      popupDataDiri.style.display = 'none';
      Swal.fire('Popup Ditutup!', '', 'success');
    }
  });
};

// Tombol "Kembali ke Home" → sembunyikan form
btnHome.onclick = () => formPengisian.style.display = 'none';

// === Pilihan penelitian ===
penelitian.onchange = function () {
  // Sembunyikan semua form tambahan
  ['formPaper', 'formBuku', 'formJurnal'].forEach(id => document.getElementById(id).style.display = 'none');
  // Tampilkan sesuai pilihan
  if (this.value) document.getElementById('form' + this.value).style.display = 'block';
};

// === Kelas untuk hitung tahun masuk ===
class Mahasiswa {
  constructor(nama, nim, semester) {
    this.nama = nama;
    this.nim = nim;
    this.semester = +semester;
  }
}
class TahunMasuk extends Mahasiswa {
  getTahunMasuk() {
    return new Date().getFullYear() - Math.floor((this.semester - 1) / 2);
  }
}

// === Saat form disubmit ===
formUtama.onsubmit = e => {
  e.preventDefault();

  // Ambil input dasar
  const nim = nimInput.value.trim(),
        nama = namaInput.value.trim(),
        semester = semesterInput.value.trim(),
        jenis = penelitian.value;

  // Validasi dasar
  if (!nim || !nama || !semester || !jenis)
    return Swal.fire('Isi semua kolom yang tersedia', '', 'warning');
  if (isNaN(semester))
    return Swal.fire('Semester harus berupa angka', '', 'error');
  if (+semester < 3)
    return Swal.fire('Harus semester 2 ke atas untuk mengajukan pustaka digital!', '', 'info');

  // Hitung tahun masuk (inheritance)
  const mhs = new TahunMasuk(nama, nim, semester),
        tahunMasuk = mhs.getTahunMasuk();

  // Ambil detail tambahan sesuai pilihan
  const inputs = [...document.querySelectorAll(`#form${jenis} input`)].map(i => i.value);
  const label = { Paper: ['Penulis', 'Judul Paper', 'Tahun', 'Volume/Edisi/Halaman', 'DOI'],
                  Buku: ['Nama Buku', 'Judul Buku', 'Tahun', 'Volume/Edisi/Halaman', 'ISBN'],
                  Jurnal: ['Nama Jurnal', 'Judul Jurnal', 'Tahun', 'Volume/Edisi/Halaman', 'DOI/ISSN'] }[jenis];
  const detail = inputs.map((v, i) => `<p><b>${label[i]}:</b> ${v}</p>`).join('');

  // Tampilkan hasil pengisian
  Swal.fire({
    icon: 'success',
    title: `Pengisian ${jenis} Berhasil!`,
    html: `
      <div style="border:1px solid #333;padding:20px;background:#fff;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3>Hasil Pengajuan Daftar Pustaka Mahasiswa</h3>
          <div style="text-align:right;">
            <img src="Logo UPN.png" width="50"/><p style="margin:0;">UPN Veteran Jakarta</p>
          </div>
        </div><hr/>
        <div style="text-align:left;">
          <p><b>NIM:</b> ${nim}</p>
          <p><b>Nama:</b> ${nama}</p>
          <p><b>Tahun Masuk:</b> ${tahunMasuk}</p>
          <p><b>Jenis Penelitian:</b> ${jenis}</p>
          ${detail}
        </div>
      </div>`,
    width: 600,
    confirmButtonText: 'OK'
  }).then(() => {
    formPengisian.style.display = 'none'; // Tutup form
    formUtama.reset();                     // Reset form
    popupDataDiri.style.display = 'none';  // Tutup popup bila sempat terbuka
  });
};