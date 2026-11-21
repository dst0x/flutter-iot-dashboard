import 'dart:async';
import 'dart:math';

import 'package:flutter/foundation.dart';

import '../models/device.dart';
import '../models/sensor_reading.dart';

enum AlertSeverity { info, warning, critical }

/// One alert entry shown on the Alerts tab.
class IoTAlert {
  const IoTAlert({
    required this.timestamp,
    required this.message,
    required this.severity,
  });

  final DateTime timestamp;
  final String message;
  final AlertSeverity severity;
}

// ===========================================================================
// MQTT-READY SECTION
// ---------------------------------------------------------------------------
// The app runs WITHOUT hardware by default: a simulator (Timer below)
// generates readings every 2 seconds. To use a real ESP32 / STM32:
//
//   1. Add the broker details in Settings (or edit the constants below).
//   2. In the TODO block inside _connectMqtt(), create an MqttServerClient,
//      connect, and subscribe to [mqttTopic].
//   3. On each message, parse the JSON payload with
//      SensorReading.fromJson(...) and call _addReading(reading).
//   4. Stop the simulator Timer (call _timer?.cancel()) once MQTT is live.
//
// The device firmware should publish JSON like this to
// `iot/<device-id>/telemetry`:
//   {"temperature": 27.4, "humidity": 63.0, "pressure": 1012.5, "power": 120.0}
// ===========================================================================
class SensorService extends ChangeNotifier {
  SensorService() {
    // Seed a few readings so the chart is not empty on first paint.
    for (var i = 0; i < 5; i++) {
      _addSimulatedReading();
    }
    _timer = Timer.periodic(const Duration(seconds: 2), (_) {
      _addSimulatedReading();
      notifyListeners();
    });
  }

  // --- MQTT configuration (editable from Settings) -----------------------
  static const String defaultMqttHost = 'broker.hivemq.com';
  static const int defaultMqttPort = 1883;
  static const String defaultMqttTopic = 'iot/+/telemetry';

  String mqttHost = defaultMqttHost;
  int mqttPort = defaultMqttPort;
  String mqttTopic = defaultMqttTopic;

  // TODO: swap the simulator for mqtt_client.
  // Example (needs `import 'package:mqtt_client/mqtt_client.dart';`
  // and `import 'package:mqtt_client/mqtt_server_client.dart';`):
  //
  //   Future<void> _connectMqtt() async {
  //     final client = MqttServerClient(mqttHost, 'iot_dashboard');
  //     client.port = mqttPort;
  //     client.keepAlivePeriod = 20;
  //     await client.connect();
  //     client.subscribe(mqttTopic, MqttQos.atMostOnce);
  //     client.updates?.listen((List<MqttReceivedMessage<MqttMessage>> events) {
  //       final payload = (events[0].payload as MqttPublishMessage)
  //           .payload.message;
  //       final json = jsonDecode(payload) as Map<String, dynamic>;
  //       _addReading(SensorReading.fromJson(json));
  //       notifyListeners();
  //     });
  //   }
  //
  // Then cancel the simulator Timer in the constructor once connected.

  // --- Thresholds (editable from Settings) --------------------------------
  double tempThreshold = 30.0;
  double humidityThreshold = 70.0;

  // --- Live data ------------------------------------------------------------
  final List<SensorReading> _readings = <SensorReading>[];
  final List<IoTAlert> _alerts = <IoTAlert>[];

  List<SensorReading> get readings => List.unmodifiable(_readings);
  List<IoTAlert> get alerts => List.unmodifiable(_alerts);

  SensorReading? get latestReading =>
      _readings.isEmpty ? null : _readings.last;

  final List<IoTDevice> devices = <IoTDevice>[
    IoTDevice(
      id: 'esp32-living',
      name: 'ESP32 Living Room',
      type: 'ESP32',
      location: 'Living Room',
      online: true,
      temperature: 27.1,
      humidity: 62.0,
      relayOn: true,
    ),
    IoTDevice(
      id: 'esp32-weather',
      name: 'ESP32 Weather Station',
      type: 'ESP32',
      location: 'Roof / Outdoor',
      online: true,
      temperature: 28.4,
      humidity: 65.0,
      relayOn: false,
    ),
    IoTDevice(
      id: 'stm32-greenhouse',
      name: 'STM32 Greenhouse',
      type: 'STM32',
      location: 'Greenhouse',
      online: true,
      temperature: 29.2,
      humidity: 68.0,
      relayOn: true,
    ),
    IoTDevice(
      id: 'esp32-energy',
      name: 'ESP32 Energy Meter',
      type: 'ESP32',
      location: 'Main Panel',
      online: false,
      temperature: 25.0,
      humidity: 58.0,
      relayOn: false,
    ),
  ];

  int get onlineDeviceCount => devices.where((d) => d.online).length;

  Timer? _timer;
  final Random _random = Random();
  double _temperature = 27.0;
  double _humidity = 62.0;
  double _pressure = 1012.0;
  double _power = 120.0;

  DateTime? _lastTempAlert;
  DateTime? _lastHumidityAlert;

  void _addSimulatedReading() {
    // Random walk, clamped to realistic indoor ranges.
    _temperature = (_temperature + (_random.nextDouble() - 0.5) * 0.8)
        .clamp(24.0, 32.0)
        .toDouble();
    _humidity = (_humidity + (_random.nextDouble() - 0.5) * 2.0)
        .clamp(55.0, 75.0)
        .toDouble();
    _pressure = (_pressure + (_random.nextDouble() - 0.5) * 0.6)
        .clamp(1008.0, 1018.0)
        .toDouble();
    _power = (_power + (_random.nextDouble() - 0.5) * 12.0)
        .clamp(60.0, 240.0)
        .toDouble();

    _addReading(
      SensorReading(
        timestamp: DateTime.now(),
        temperature: double.parse(_temperature.toStringAsFixed(1)),
        humidity: double.parse(_humidity.toStringAsFixed(1)),
        pressure: double.parse(_pressure.toStringAsFixed(1)),
        power: double.parse(_power.toStringAsFixed(1)),
      ),
    );
  }

  void _addReading(SensorReading reading) {
    _readings.add(reading);
    if (_readings.length > 30) {
      _readings.removeAt(0);
    }

    // Mirror the latest values onto the first online device, so the
    // Devices tab moves with the chart.
    for (final device in devices) {
      if (device.online) {
        device.temperature = reading.temperature;
        device.humidity = reading.humidity;
        break;
      }
    }

    _checkAlerts(reading);
  }

  void _checkAlerts(SensorReading reading) {
    final now = DateTime.now();
    if (reading.temperature > tempThreshold &&
        (_lastTempAlert == null ||
            now.difference(_lastTempAlert!).inSeconds > 10)) {
      _lastTempAlert = now;
      _alerts.insert(
        0,
        IoTAlert(
          timestamp: now,
          message:
              'High temperature: ${reading.temperature.toStringAsFixed(1)}°C '
              '(threshold ${tempThreshold.toStringAsFixed(0)}°C)',
          severity: AlertSeverity.critical,
        ),
      );
    }
    if (reading.humidity > humidityThreshold &&
        (_lastHumidityAlert == null ||
            now.difference(_lastHumidityAlert!).inSeconds > 10)) {
      _lastHumidityAlert = now;
      _alerts.insert(
        0,
        IoTAlert(
          timestamp: now,
          message:
              'High humidity: ${reading.humidity.toStringAsFixed(1)}% '
              '(threshold ${humidityThreshold.toStringAsFixed(0)}%)',
          severity: AlertSeverity.warning,
        ),
      );
    }
  }

  /// Flip a device relay on/off and refresh the UI.
  void toggleRelay(String deviceId) {
    for (final device in devices) {
      if (device.id == deviceId) {
        device.relayOn = !device.relayOn;
        break;
      }
    }
    notifyListeners();
  }

  void clearAlerts() {
    _alerts.clear();
    notifyListeners();
  }

  void updateMqttSettings({
    required String host,
    required int port,
    required String topic,
  }) {
    mqttHost = host;
    mqttPort = port;
    mqttTopic = topic;
    notifyListeners();
  }

  void updateTempThreshold(double value) {
    tempThreshold = value;
    notifyListeners();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
