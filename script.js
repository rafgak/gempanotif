// URL API BMKG
const apiUrl = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json';

// Variabel untuk menyimpan ID gempa terakhir yang telah ditampilkan
let lastEarthquakeId = null;

// Fungsi untuk mengambil data gempa dari API BMKG
async function getEarthquakeData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    const earthquake = data.Infogempa.gempa;
    const earthquakeId = earthquake.Shakemap;
    const magnitude = earthquake.Magnitude;
    const location = earthquake.Wilayah;
    const time = earthquake.Tanggal + ' ' + earthquake.Jam;
    const depth = earthquake.Kedalaman;
    const coordinates = earthquake.Coordinates;
    const shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/shakemap/${earthquake.Shakemap}.jpg`;

    document.getElementById('magnitude').textContent = magnitude;
    document.getElementById('location').textContent = location;
    document.getElementById('time').textContent = time;
    document.getElementById('depth').textContent = depth;
    document.getElementById('coordinates').textContent = coordinates;
    document.getElementById('shakemap-image').src = shakemapUrl;

    // Cek apakah gempa ini baru
    if (earthquakeId !== lastEarthquakeId) {
      lastEarthquakeId = earthquakeId; // Simpan ID gempa terbaru

      // Munculkan notifikasi jika magnitudo >= 5.0
      if (parseFloat(magnitude) >= 5.0) {
        showNotification(magnitude, location);
        document.getElementById('warning').classList.remove('hidden');
        document.body.classList.add('shake-effect');
        playBeep(); // Mainkan beep sebagai peringatan
      } else {
        document.getElementById('warning').classList.add('hidden');
        document.body.classList.remove('shake-effect');
      }
    }
  } catch (error) {
    console.error('Gagal mengambil data gempa:', error);
  }
}

// Fungsi untuk memainkan suara beep sederhana
function playBeep() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1000, context.currentTime); // Nada 1000 Hz
  oscillator.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.5); // Suara beep selama 0.5 detik
}

// Fungsi untuk menampilkan notifikasi
function showNotification(magnitude, location) {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Peringatan Gempa!', {
      body: `Gempa berkekuatan ${magnitude} terdeteksi di ${location}.`,
      icon: 'path_to_icon.png' // Kamu bisa menambahkan ikon khusus
    });
  }
}

// Minta izin untuk menampilkan notifikasi
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}

// Panggil fungsi untuk mengambil data saat halaman dibuka
getEarthquakeData();

// Lakukan refresh data setiap 30 detik
setInterval(getEarthquakeData, 30000); // 30.000 ms = 30 detik
