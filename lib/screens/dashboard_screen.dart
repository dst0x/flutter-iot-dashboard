import 'package:flutter/material.dart';

import '../models/sensor_reading.dart';
import '../services/sensor_service.dart';
import '../widgets/sensor_chart.dart';
import '../widgets/stat_card.dart';

/// Dashboard tab: 4 stat cards, live chart, latest reading, device summary.
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key, required this.service});

  final SensorService service;

  @override
  Widget build(BuildContext context) {
    final SensorReading? latest = service.latestReading;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            'Live Sensors',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 8,
            crossAxisSpacing: 8,
            childAspectRatio: 1.6,
            children: <Widget>[
              StatCard(
                title: 'Temperature',
                value: latest == null
                    ? '--'
                    : latest.temperature.toStringAsFixed(1),
                unit: '°C',
                icon: Icons.thermostat,
                color: Colors.tealAccent,
              ),
              StatCard(
                title: 'Humidity',
                value: latest == null
                    ? '--'
                    : latest.humidity.toStringAsFixed(1),
                unit: '%',
                icon: Icons.water_drop,
                color: Colors.lightBlueAccent,
              ),
              StatCard(
                title: 'Pressure',
                value: latest == null
                    ? '--'
                    : latest.pressure.toStringAsFixed(0),
                unit: 'hPa',
                icon: Icons.speed,
                color: Colors.amber,
              ),
              StatCard(
                title: 'Power',
                value: latest == null
                    ? '--'
                    : latest.power.toStringAsFixed(0),
                unit: 'W',
                icon: Icons.bolt,
                color: Colors.orangeAccent,
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Temperature & Humidity (last 30 readings)',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 220,
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: SensorChart(readings: service.readings),
              ),
            ),
          ),
          const SizedBox(height: 8),
          const Row(
            children: <Widget>[
              Icon(Icons.circle, size: 10, color: Colors.tealAccent),
              SizedBox(width: 4),
              Text('Temperature'),
              SizedBox(width: 16),
              Icon(Icons.circle, size: 10, color: Colors.amber),
              SizedBox(width: 4),
              Text('Humidity'),
            ],
          ),
          const SizedBox(height: 16),
          Card(
            child: ListTile(
              leading: const Icon(Icons.access_time),
              title: const Text('Latest reading'),
              subtitle: Text(
                latest == null
                    ? 'No data yet'
                    : '${latest.timestamp.toLocal()}',
              ),
              trailing: Text(
                latest == null
                    ? ''
                    : '${latest.temperature.toStringAsFixed(1)}°C',
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: ListTile(
              leading: const Icon(Icons.devices),
              title: const Text('Devices'),
              subtitle: Text(
                '${service.onlineDeviceCount} of ${service.devices.length} online',
              ),
              trailing: Text('${service.alerts.length} alerts'),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Simulated data — updates every 2 seconds. '
            'Connect a real ESP32 / STM32 via MQTT in Settings.',
            style: TextStyle(fontSize: 12),
          ),
        ],
      ),
    );
  }
}
