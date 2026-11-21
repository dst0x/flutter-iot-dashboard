import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../models/sensor_reading.dart';

/// Live line chart: temperature (teal) and humidity (amber),
/// last 30 readings. Both series share a 0-100 axis so they stay
/// readable together (temperature 24-32 C, humidity 55-75 %).
class SensorChart extends StatelessWidget {
  const SensorChart({super.key, required this.readings});

  final List<SensorReading> readings;

  @override
  Widget build(BuildContext context) {
    if (readings.isEmpty) {
      return const Center(child: Text('Waiting for sensor data...'));
    }

    final List<FlSpot> tempSpots = <FlSpot>[
      for (var i = 0; i < readings.length; i++)
        FlSpot(i.toDouble(), readings[i].temperature),
    ];
    final List<FlSpot> humiditySpots = <FlSpot>[
      for (var i = 0; i < readings.length; i++)
        FlSpot(i.toDouble(), readings[i].humidity),
    ];

    return LineChart(
      LineChartData(
        minY: 0,
        maxY: 100,
        gridData: const FlGridData(show: true),
        titlesData: const FlTitlesData(
          leftTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: true, reservedSize: 32),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          topTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          rightTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
        ),
        borderData: FlBorderData(show: true),
        lineBarsData: <LineChartBarData>[
          LineChartBarData(
            spots: tempSpots,
            isCurved: true,
            color: Colors.tealAccent,
            barWidth: 2,
            dotData: const FlDotData(show: false),
          ),
          LineChartBarData(
            spots: humiditySpots,
            isCurved: true,
            color: Colors.amber,
            barWidth: 2,
            dotData: const FlDotData(show: false),
          ),
        ],
      ),
    );
  }
}
