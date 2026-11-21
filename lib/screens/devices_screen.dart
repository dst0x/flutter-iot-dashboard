import 'package:flutter/material.dart';

import '../services/sensor_service.dart';
import '../widgets/device_tile.dart';

/// Devices tab: list of ESP32 / STM32 devices with a relay switch.
class DevicesScreen extends StatelessWidget {
  const DevicesScreen({super.key, required this.service});

  final SensorService service;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: service.devices.length,
      itemBuilder: (BuildContext context, int index) {
        final device = service.devices[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: DeviceTile(
            device: device,
            onToggle: () => service.toggleRelay(device.id),
          ),
        );
      },
    );
  }
}
