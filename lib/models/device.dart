/// An IoT device (ESP32 or STM32 board) shown on the Devices tab.
class IoTDevice {
  IoTDevice({
    required this.id,
    required this.name,
    required this.type,
    required this.location,
    required this.online,
    required this.temperature,
    required this.humidity,
    required this.relayOn,
  });

  final String id;
  final String name;

  /// e.g. 'ESP32' or 'STM32'.
  final String type;
  final String location;
  final bool online;

  /// Last known temperature / humidity, degrees Celsius / %.
  double temperature;
  double humidity;

  /// Relay / output state. Toggled from the Devices tab.
  bool relayOn;

  IoTDevice copyWith({
    String? id,
    String? name,
    String? type,
    String? location,
    bool? online,
    double? temperature,
    double? humidity,
    bool? relayOn,
  }) {
    return IoTDevice(
      id: id ?? this.id,
      name: name ?? this.name,
      type: type ?? this.type,
      location: location ?? this.location,
      online: online ?? this.online,
      temperature: temperature ?? this.temperature,
      humidity: humidity ?? this.humidity,
      relayOn: relayOn ?? this.relayOn,
    );
  }
}
