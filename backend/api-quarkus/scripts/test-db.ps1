# Test PostgreSQL container manager for ARMORA API
param(
    [ValidateSet("start", "stop", "restart", "status")]
    [string]$Action = "start"
)

$containerName = "armora-test-pg"
$port = 5433
$user = "armora_test"
$pass = "armora_test_pass"
$db = "armora_test"

function Start-Container {
    $existing = docker ps -a --filter "name=$containerName" --format "{{.Names}}" 2>$null
    if ($existing -eq $containerName) {
        $running = docker ps --filter "name=$containerName" --format "{{.Names}}" 2>$null
        if ($running -eq $containerName) {
            Write-Host "[OK] Container $containerName is already running on port $port" -ForegroundColor Green
            return
        }
        Write-Host "[INFO] Starting existing container $containerName..." -ForegroundColor Yellow
        docker start $containerName
    } else {
        Write-Host "[INFO] Creating container $containerName on port $port..." -ForegroundColor Yellow
        docker run -d --name $containerName `
            -e POSTGRES_USER=$user `
            -e POSTGRES_PASSWORD=$pass `
            -e POSTGRES_DB=$db `
            -p ${port}:5432 `
            postgres:16-alpine
    }
    Write-Host "[OK] Test database ready: jdbc:postgresql://localhost:$port/$db ($user)" -ForegroundColor Green
}

function Stop-Container {
    Write-Host "[INFO] Stopping container $containerName..." -ForegroundColor Yellow
    docker stop $containerName 2>$null
    docker rm $containerName 2>$null
    Write-Host "[OK] Container $containerName stopped and removed" -ForegroundColor Green
}

function Restart-Container {
    Stop-Container
    Start-Container
}

function Get-Status {
    $running = docker ps --filter "name=$containerName" --format "{{.Names}}" 2>$null
    if ($running -eq $containerName) {
        $info = docker ps --filter "name=$containerName" --format "Ports: {{.Ports}}" 2>$null
        Write-Host "[OK] $containerName is RUNNING - $info" -ForegroundColor Green
        return
    }
    $existed = docker ps -a --filter "name=$containerName" --format "{{.Names}}" 2>$null
    if ($existed -eq $containerName) {
        Write-Host "[WARN] $containerName exists but is STOPPED" -ForegroundColor Yellow
        return
    }
    Write-Host "[INFO] $containerName does not exist" -ForegroundColor Cyan
}

switch ($Action) {
    "start"   { Start-Container }
    "stop"    { Stop-Container }
    "restart" { Restart-Container }
    "status"  { Get-Status }
}
