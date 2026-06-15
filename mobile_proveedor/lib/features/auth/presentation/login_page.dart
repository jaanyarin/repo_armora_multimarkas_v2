import 'package:flutter/material.dart';
import '../../../core/network/api_client.dart';
import '../../home/presentation/home_page.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _correoController = TextEditingController();
  final _claveController = TextEditingController();
  final _apiClient = ApiClient();
  bool _loading = false;
  String? _error;

  Future<void> _login() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    final res = await _apiClient.post('/auth/login', {
      'correo': _correoController.text,
      'clave': _claveController.text,
    });
    setState(() => _loading = false);

    if (res.data != null && mounted) {
      final token = res.data!['token'] as String?;
      if (token != null) {
        _apiClient.setToken(token);
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
              builder: (_) => HomePage(apiClient: _apiClient)),
        );
      } else {
        setState(() => _error = 'Credenciales invalidas');
      }
    } else {
      setState(() => _error = res.error ?? 'Error de conexion');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('ARMORA Proveedor',
                  style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 32),
              if (_error != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Text(_error!,
                      style: const TextStyle(color: Colors.red)),
                ),
              TextField(
                  controller: _correoController,
                  decoration: const InputDecoration(labelText: 'Correo'),
                  keyboardType: TextInputType.emailAddress),
              const SizedBox(height: 16),
              TextField(
                  controller: _claveController,
                  decoration: const InputDecoration(labelText: 'Clave'),
                  obscureText: true),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: _loading ? null : _login,
                child: _loading
                    ? const CircularProgressIndicator()
                    : const Text('Ingresar'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
