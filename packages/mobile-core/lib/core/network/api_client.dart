import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/environment.dart';

class ApiResponse<T> {
  final T? data;
  final String? error;

  ApiResponse({this.data, this.error});
}

class ApiClient {
  final String baseUrl;
  final FlutterSecureStorage _storage;
  String? _token;
  bool _initialized = false;

  ApiClient({String? baseUrl, FlutterSecureStorage? storage})
      : baseUrl = baseUrl ?? Environment.apiBaseUrl,
        _storage = storage ?? const FlutterSecureStorage();

  Future<void> init() async {
    if (_initialized) return;
    _token = await _storage.read(key: 'armora_token');
    _initialized = true;
  }

  Future<void> setToken(String? token) async {
    _token = token;
    if (token != null) {
      await _storage.write(key: 'armora_token', value: token);
    } else {
      await _storage.delete(key: 'armora_token');
    }
  }

  Future<String?> getToken() async {
    if (!_initialized) await init();
    return _token;
  }

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  Future<ApiResponse<Map<String, dynamic>>> get(String endpoint) async {
    try {
      final res = await http.get(Uri.parse('$baseUrl$endpoint'),
          headers: _headers);
      if (res.statusCode == 200) {
        return ApiResponse(data: jsonDecode(res.body));
      }
      return ApiResponse(error: 'Error ${res.statusCode}');
    } catch (e) {
      return ApiResponse(error: 'Error de conexion: $e');
    }
  }

  Future<ApiResponse<Map<String, dynamic>>> post(
      String endpoint, Map<String, dynamic> body) async {
    try {
      final res = await http.post(Uri.parse('$baseUrl$endpoint'),
          headers: _headers, body: jsonEncode(body));
      if (res.statusCode == 200 || res.statusCode == 201) {
        return ApiResponse(data: jsonDecode(res.body));
      }
      return ApiResponse(error: 'Error ${res.statusCode}');
    } catch (e) {
      return ApiResponse(error: 'Error de conexion: $e');
    }
  }

  Future<ApiResponse<Map<String, dynamic>>> health() => get('/health');
  Future<ApiResponse<Map<String, dynamic>>> version() => get('/version');
}
