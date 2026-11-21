import 'package:flutter/material.dart';

import '../services/sensor_service.dart';

/// Settings tab: MQTT broker host / port / topic, temperature
/// threshold slider, and an About section.
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key, required this.service});

  final SensorService service;

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late final TextEditingController _hostController;
  late final TextEditingController _portController;
  late final TextEditingController _topicController;

  @override
  void initState() {
    super.initState();
    _hostController =
        TextEditingController(text: widget.service.mqttHost);
    _portController =
        TextEditingController(text: widget.service.mqttPort.toString());
    _topicController =
        TextEditingController(text: widget.service.mqttTopic);
  }

  @override
  void dispose() {
    _hostController.dispose();
    _portController.dispose();
    _topicController.dispose();
    super.dispose();
  }

  void _saveMqtt() {
    final port = int.tryParse(_portController.text.trim()) ??
        SensorService.defaultMqttPort;
    widget.service.updateMqttSettings(
      host: _hostController.text.trim().isEmpty
          ? SensorService.defaultMqttHost
          : _hostController.text.trim(),
      port: port,
      topic: _topicController.text.trim().isEmpty
          ? SensorService.defaultMqttTopic
          : _topicController.text.trim(),
    );
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('MQTT settings saved (simulator still active)')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: <Widget>[
        Text('MQTT Broker', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 12),
        TextField(
          controller: _hostController,
          decoration: const InputDecoration(
            labelText: 'Broker host',
            hintText: 'broker.hivemq.com',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _portController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(
            labelText: 'Broker port',
            hintText: '1883',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _topicController,
          decoration: const InputDecoration(
            labelText: 'Topic',
            hintText: 'iot/+/telemetry',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 12),
        FilledButton(
          onPressed: _saveMqtt,
          child: const Text('Save MQTT settings'),
        ),
        const SizedBox(height: 24),
        Text('Alerts', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        Text(
          'Temperature threshold: '
          '${widget.service.tempThreshold.toStringAsFixed(0)}°C',
        ),
        Slider(
          value: widget.service.tempThreshold,
          min: 25,
          max: 35,
          divisions: 10,
          label: '${widget.service.tempThreshold.toStringAsFixed(0)}°C',
          onChanged: (double value) =>
              widget.service.updateTempThreshold(value),
        ),
        const SizedBox(height: 24),
        Text('About', style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        const Card(
          child: ListTile(
            title: Text('IoT Dashboard 1.0.0'),
            subtitle: Text(
              'ESP32 / STM32 sensor monitoring.\n'
              'Data is simulated by default, so the app runs without hardware. '
              'See README.md to connect a real device via MQTT.',
            ),
          ),
        ),
      ],
    );
  }
}
