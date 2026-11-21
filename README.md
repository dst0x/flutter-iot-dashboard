# IoT Dashboard — Flutter

Dashboard IoT untuk memantau sensor ESP32 / STM32: suhu, kelembapan,
tekanan, dan daya — dengan grafik live, kontrol relay, dan alert.

> **English summary:** Flutter IoT dashboard for ESP32/STM32 sensor
> monitoring with live charts, device control and alerts. Data is
> simulated by default, so it runs without any hardware. Connect a
> real device via MQTT (see below).

## Fitur / Features

- Dashboard: 4 kartu statistik (suhu, kelembapan, tekanan, daya),
  grafik live suhu + kelembapan (30 data terakhir), ringkasan perangkat
- Devices: daftar ESP32 / STM32, status online, suhu/kelemapan,
  switch untuk toggle relay
- Alerts: alert otomatis saat suhu > ambang batas (default 30°C)
  atau kelembapan > 70%, lengkap dengan waktu & severity, tombol Clear
- Settings: host / port / topic broker MQTT, slider ambang suhu, About
- Tema gelap Material 3, aksen teal. Tanpa Firebase.

## Cara menjalankan / How to run

Di Windows (Dani) atau Linux:

```bash
flutter pub get
flutter run -d windows
# atau:
flutter run -d chrome
flutter run -d linux
```

Untuk HP Android (setelah Android SDK terpasang):

```bash
flutter run
```

## Menghubungkan ESP32 / STM32 asli via MQTT

1. Isi broker di tab **Settings** (default: `broker.hivemq.com:1883`,
   topik `iot/+/telemetry`), atau ubah konstanta di
   `lib/services/sensor_service.dart`.
2. Firmware ESP32 / STM32 publish JSON ke topik
   `iot/<device-id>/telemetry`, contoh:

```json
{"temperature": 27.4, "humidity": 63.0, "pressure": 1012.5, "power": 120.0}
```

3. Di `lib/services/sensor_service.dart`, ikuti blok TODO
   `MQTT-READY SECTION`: buat `MqttServerClient`, subscribe ke topik,
   parse payload dengan `SensorReading.fromJson(...)`, lalu hentikan
   Timer simulator.

Secara default data **disimulasi** (random walk suhu 24–32°C,
kelembapan 55–75%, update tiap 2 detik), jadi aplikasi langsung
jalan tanpa hardware.

## Struktur

```
lib/
  main.dart                 # Material 3 dark theme, bottom nav 4 tab
  models/
    sensor_reading.dart     # SensorReading (+ fromJson MQTT)
    device.dart             # IoTDevice (ESP32/STM32, relayOn)
  services/
    sensor_service.dart     # ChangeNotifier, simulator 2 detik,
                            # alerts, toggleRelay, konstanta MQTT
  widgets/
    stat_card.dart
    sensor_chart.dart       # fl_chart LineChart suhu + kelembapan
    device_tile.dart
  screens/
    dashboard_screen.dart
    devices_screen.dart
    alerts_screen.dart
    settings_screen.dart
```
