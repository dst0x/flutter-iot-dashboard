/// One sensor sample. All values are plain doubles so the model works
/// with the built-in simulator and with real MQTT JSON payloads alike.
class SensorReading {
  const SensorReading({
    required this.timestamp,
    required this.temperature,
    required this.humidity,
    required this.pressure,
    required this.power,
  });

  final DateTime timestamp;

  /// Degrees Celsius.
  final double temperature;

  /// Relative humidity, %.
  final double humidity;

  /// Air pressure, hPa.
  final double pressure;

  /// Power draw, watts.
  final double power;

  /// Build from an MQTT JSON payload, e.g.
  /// `{"temperature": 27.4, "humidity": 63.0, "pressure": 1012.5, "power": 120.0}`
  factory SensorReading.fromJson(Map<String, dynamic> json) {
    return SensorReading(
      timestamp: DateTime.now(),
      temperature: (json['temperature'] as num?)?.toDouble() ?? 0,
      humidity: (json['humidity'] as num?)?.toDouble() ?? 0,
      pressure: (json['pressure'] as num?)?.toDouble() ?? 0,
      power: (json['power'] as num?)?.toDouble() ?? 0,
    );
  }

  Map<String, dynamic> toJson() => <String, dynamic>{
        'timestamp': timestamp.toIso8601String(),
        'temperature': temperature,
        'humidity': humidity,
        'pressure': pressure,
        'power': power,
      };
}
