# Generate RSA key pair for JWT signing
# Private key: PKCS#8 format for SmallRye JWT
# Public key: SPKI X.509 format for MicroProfile JWT verification

$privateKeyPath = "secrets/local/privatekey.pem"
$publicKeyPath = "src/main/resources/publickey.pem"

# Ensure directories exist
$null = New-Item -ItemType Directory -Path (Split-Path $privateKeyPath -Parent) -Force

Write-Host "[INFO] Generating 2048-bit RSA key pair..." -ForegroundColor Yellow

# Generate using Java keytool + openssl alternative
# Use certbot/java's built-in key generation via a temp Java class
$javaCode = @'
import java.io.*;
import java.nio.file.*;
import java.security.*;
import java.security.spec.*;
import java.util.Base64;

public class GenKeys {
    public static void main(String[] args) throws Exception {
        String privPath = args[0];
        String pubPath = args[1];
        
        KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
        gen.initialize(2048);
        KeyPair pair = gen.generateKeyPair();
        
        // Private key PKCS#8
        PKCS8EncodedKeySpec privSpec = new PKCS8EncodedKeySpec(pair.getPrivate().getEncoded());
        String privBase64 = Base64.getMimeEncoder(64, "\n".getBytes()).encodeToString(privSpec.getEncoded());
        String privPem = "-----BEGIN PRIVATE KEY-----\n" + privBase64 + "\n-----END PRIVATE KEY-----\n";
        Files.write(Paths.get(privPath), privPem.getBytes());
        
        // Public key X.509 SPKI
        X509EncodedKeySpec pubSpec = new X509EncodedKeySpec(pair.getPublic().getEncoded());
        String pubBase64 = Base64.getMimeEncoder(64, "\n".getBytes()).encodeToString(pubSpec.getEncoded());
        String pubPem = "-----BEGIN PUBLIC KEY-----\n" + pubBase64 + "\n-----END PUBLIC KEY-----\n";
        Files.write(Paths.get(pubPath), pubPem.getBytes());
        
        System.out.println("[OK] Keys generated:");
        System.out.println("  Private: " + privPath);
        System.out.println("  Public:  " + pubPath);
    }
}
'@

$tmpDir = [System.IO.Path]::GetTempPath()
$tmpFile = Join-Path $tmpDir "GenKeys.java"
$javaCode | Out-File -FilePath $tmpFile -Encoding ASCII

# Compile and run
$cwd = Get-Location
javac -d "$tmpDir" "$tmpFile" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Java compilation failed. Trying alternative approach..." -ForegroundColor Red
    
    # Alternative: Generate using PowerShell .NET
    $rsa = [System.Security.Cryptography.RSA]::Create(2048)
    
    # Private key PKCS#8
    $privBytes = $rsa.ExportPkcs8PrivateKey()
    $privB64 = [Convert]::ToBase64String($privBytes, [Base64FormattingOptions]::InsertLineBreaks)
    $privPem = "-----BEGIN PRIVATE KEY-----`n$privB64`n-----END PRIVATE KEY-----`n"
    Set-Content -Path $privateKeyPath -Value $privPem -NoNewline
    
    # Public key SPKI
    $pubBytes = $rsa.ExportSubjectPublicKeyInfo()
    $pubB64 = [Convert]::ToBase64String($pubBytes, [Base64FormattingOptions]::InsertLineBreaks)
    $pubPem = "-----BEGIN PUBLIC KEY-----`n$pubB64`n-----END PUBLIC KEY-----`n"
    Set-Content -Path $publicKeyPath -Value $pubPem -NoNewline
    
    Write-Host "[OK] Keys generated via .NET cryptography:"
} else {
    java -cp "$tmpDir" GenKeys $privateKeyPath $publicKeyPath
}

Write-Host "  Private: $privateKeyPath" -ForegroundColor Green
Write-Host "  Public:  $publicKeyPath" -ForegroundColor Green

# Cleanup temp
Remove-Item "$tmpFile" -ErrorAction SilentlyContinue
Remove-Item "$tmpDir\GenKeys.class" -ErrorAction SilentlyContinue

Write-Host "[INFO] IMPORTANT: The private key is now at $privateKeyPath" -ForegroundColor Cyan
Write-Host "[INFO] This path is excluded from git via .gitignore (secrets/ rule)" -ForegroundColor Cyan
Write-Host "[INFO] The public key stays in src/main/resources (safe to commit)" -ForegroundColor Cyan
