import 'package:flutter/material.dart';

import '../models/device.dart';

/// One device row: name, type/location, online dot, live values,
/// and a Switch that toggles its relay.
class DeviceTile extends StatelessWidget {
  const DeviceTile({
    super.key,
    required this.device,
    required this.onToggle,
  });

  final IoTDevice device;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: device.online
              ? Colors.teal.withValues(alpha: 0.2)
              : Colors.grey.withValues(alpha: 0.2),
          child: Icon(
            device.type == 'STM32'
                ? Icons.memory
                : Icons.developer_board,
            color: device.online ? Colors.tealAccent : Colors.grey,
          ),
        ),
        title: Text(device.name),
        subtitle: Text(
          '${device.type} • ${device.location}\n'
          '${device.online ? 'Online' : 'Offline'} • '
          '${device.temperature.toStringAsFixed(1)}°C • '
          '${device.humidity.toStringAsFixed(0)}%',
        ),
        isThreeLine: true,
        trailing: Switch(
          value: device.relayOn,
          onChanged: device.online ? (_) => onToggle() : null,
        ),
      ),
    );
  }
}
