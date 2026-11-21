import 'package:flutter/material.dart';

import '../services/sensor_service.dart';

/// Alerts tab: threshold alerts with time and severity, plus Clear.
class AlertsScreen extends StatelessWidget {
  const AlertsScreen({super.key, required this.service});

  final SensorService service;

  Color _severityColor(AlertSeverity severity) {
    switch (severity) {
      case AlertSeverity.critical:
        return Colors.redAccent;
      case AlertSeverity.warning:
        return Colors.amber;
      case AlertSeverity.info:
        return Colors.lightBlueAccent;
    }
  }

  @override
  Widget build(BuildContext context) {
    final alerts = service.alerts;

    return Column(
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: <Widget>[
              Expanded(
                child: Text(
                  '${alerts.length} alert(s)',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
              FilledButton.icon(
                onPressed: alerts.isEmpty ? null : service.clearAlerts,
                icon: const Icon(Icons.clear_all),
                label: const Text('Clear'),
              ),
            ],
          ),
        ),
        Expanded(
          child: alerts.isEmpty
              ? const Center(
                  child: Text('No alerts — sensors are within limits.'),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: alerts.length,
                  itemBuilder: (BuildContext context, int index) {
                    final alert = alerts[index];
                    return Card(
                      child: ListTile(
                        leading: Icon(
                          Icons.warning_amber,
                          color: _severityColor(alert.severity),
                        ),
                        title: Text(alert.message),
                        subtitle: Text(
                          '${alert.timestamp.toLocal()} • '
                          '${alert.severity.name}',
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
