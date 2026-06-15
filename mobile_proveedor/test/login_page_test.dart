import 'package:flutter_test/flutter_test.dart';
import 'package:armora_proveedor/app/app.dart';

void main() {
  testWidgets('App renders login page', (tester) async {
    await tester.pumpWidget(const ArmoraProveedorApp());
    expect(find.text('ARMORA Proveedor'), findsOneWidget);
    expect(find.text('Ingresar'), findsOneWidget);
  });
}
