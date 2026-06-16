import 'package:flutter/material.dart';
import '../../../core/network/api_client.dart';
import 'package:armora_mobile_core/core/design/status.dart';

class HomePage extends StatefulWidget {
  final ApiClient apiClient;
  const HomePage({super.key, required this.apiClient});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String _healthStatus = 'Cargando...';

  @override
  void initState() {
    super.initState();
    _loadHealth();
  }

  Future<void> _loadHealth() async {
    final res = await widget.apiClient.health();
    setState(() {
      _healthStatus = res.data?['status'] ?? 'Error';
    });
  }

  @override
  Widget build(BuildContext context) {
    final statusType = _healthStatus == 'UP' ? StatusType.operativo : StatusType.critico;
    return Scaffold(
      appBar: AppBar(title: const Text('ARMORA Proveedor')),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.store, size: 64, color: Color(0xFF335296)),
            const SizedBox(height: 16),
            Text('Bienvenido', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 8),
            StatusBadge(status: statusType),
          ],
        ),
      ),
    );
  }
}
