import 'package:flutter_test/flutter_test.dart';
import 'package:armora_cliente/app/app.dart';

void main() {
  testWidgets('App renders login page', (tester) async {
    await tester.pumpWidget(const ArmoraClienteApp());
    expect(find.text('ARMORA Cliente'), findsOneWidget);
    expect(find.text('Ingresar'), findsOneWidget);
  });
}
