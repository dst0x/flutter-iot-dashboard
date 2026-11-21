// Smoke test for the IoT dashboard.
//
// Pumps the real app and checks the dashboard boots with its sensor cards
// and bottom navigation. The previous version of this file was the default
// counter template: it imported a non-existent package:material_ui,
// referenced a MyApp class that does not exist, and expected a counter.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:iot_dashboard/main.dart';

void main() {
  testWidgets('Dashboard boots with sensor cards and navigation',
      (WidgetTester tester) async {
    await tester.pumpWidget(const IoTDashboardApp());
    await tester.pump();

    // App bar title and the four sensor cards on the dashboard.
    expect(find.text('IoT Dashboard'), findsOneWidget);
    expect(find.text('Temperature'), findsWidgets);
    expect(find.text('Humidity'), findsWidgets);

    // Bottom navigation labels.
    expect(find.text('Dashboard'), findsOneWidget);
    expect(find.text('Devices'), findsWidgets);
    expect(find.text('Alerts'), findsOneWidget);
    expect(find.text('Settings'), findsOneWidget);

    // Tapping Devices in the bottom bar switches away from the dashboard.
    // ('Devices' also labels a dashboard section, so scope the tap to the bar.)
    await tester.tap(find.descendant(
      of: find.byType(BottomNavigationBar),
      matching: find.text('Devices'),
    ));
    await tester.pump();
    expect(find.text('Temperature'), findsNothing);
  });
}
