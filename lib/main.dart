import 'package:flutter/material.dart';

import 'screens/alerts_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/devices_screen.dart';
import 'screens/settings_screen.dart';
import 'services/sensor_service.dart';

void main() {
  runApp(const IoTDashboardApp());
}

class IoTDashboardApp extends StatelessWidget {
  const IoTDashboardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'IoT Dashboard',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.teal,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final SensorService _service = SensorService();
  int _selectedIndex = 0;

  @override
  void dispose() {
    _service.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = <Widget>[
      DashboardScreen(service: _service),
      DevicesScreen(service: _service),
      AlertsScreen(service: _service),
      SettingsScreen(service: _service),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('IoT Dashboard'),
        actions: <Widget>[
          AnimatedBuilder(
            animation: _service,
            builder: (BuildContext context, Widget? child) {
              return Padding(
                padding: const EdgeInsets.only(right: 16),
                child: Chip(
                  label: Text(
                    '${_service.onlineDeviceCount}/${_service.devices.length} online',
                  ),
                  avatar: const Icon(Icons.wifi, size: 16),
                ),
              );
            },
          ),
        ],
      ),
      body: AnimatedBuilder(
        animation: _service,
        builder: (BuildContext context, Widget? child) =>
            pages[_selectedIndex],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        type: BottomNavigationBarType.fixed,
        onTap: (int index) => setState(() => _selectedIndex = index),
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.devices),
            label: 'Devices',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications),
            label: 'Alerts',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
