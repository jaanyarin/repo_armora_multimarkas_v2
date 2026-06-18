# Script para generar el seed UBIGEO desde los datos extraidos del repositorio oficial INEI
# Fuente: https://github.com/ernestorivero/Ubigeo-Peru

$inputFile = "$env:USERPROFILE\.local\share\opencode\tool-output\tool_ed8af82cb001j6wdtqOaOoKSBj"
$outputFile = "C:\repos\repo_armora_multimarkas_v2\backend\api-quarkus\src\main\resources\db\seed\ubigeo_peru.sql"

$content = Get-Content $inputFile -Raw

function Parse-InsertValues {
    param([string]$content, [string]$tableName)
    
    # Find ALL INSERT INTO statements for this table (there may be multiple batches)
    $pattern = "INSERT INTO ``$tableName``.*?VALUES\s*(.*?);"
    $matches = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    
    $allRows = @()
    foreach ($match in $matches) {
        $valuesText = $match.Groups[1].Value
        
        # Split by row boundaries: ends with '),\n or ');\n  
        # First normalize line breaks
        $normalized = $valuesText -replace "`r`n", "`n"
        
        # Split into individual row tuples
        $lines = $normalized -split "\),\s*`n"
        
        foreach ($line in $lines) {
            $trimmed = $line.Trim().TrimEnd(';').TrimEnd(')').TrimStart('(').Trim()
            if ($trimmed -eq "") { continue }
            
            # Parse CSV-like: 'val1', 'val2', 'val3'
            $parts = @()
            $current = ""
            $inQuotes = $false
            foreach ($ch in $trimmed.ToCharArray()) {
                if ($ch -eq "'") { $inQuotes = -not $inQuotes; continue }
                if ($ch -eq ',' -and -not $inQuotes) { 
                    $parts += $current.Trim()
                    $current = ""
                    continue 
                }
                $current += $ch
            }
            if ($current.Trim() -ne "") { $parts += $current.Trim() }
            
            if ($parts.Count -ge 2) {
                $allRows += [PSCustomObject]@{
                    col1 = $parts[0].Trim("'")  # code/id
                    col2 = $parts[1].Trim("'")  # name
                    col3 = if ($parts.Count -ge 3) { $parts[2].Trim("'") } else { "" }  # parent id
                }
            }
        }
    }
    
    return $allRows
}

Write-Host "=== Generando seed UBIGEO ==="

# Departamentos
Write-Host "Parseando departamentos..."
$departments = Parse-InsertValues -content $content -tableName "ubigeo_peru_departments" | Sort-Object col1
Write-Host "  Encontrados: $($departments.Count)"

# Provincias (puede haber una sola seccion)
Write-Host "Parseando provincias..."
$provinces = Parse-InsertValues -content $content -tableName "ubigeo_peru_provinces" | Sort-Object col1
Write-Host "  Encontrados: $($provinces.Count)"

# Distritos
Write-Host "Parseando distritos..."
$districts = Parse-InsertValues -content $content -tableName "ubigeo_peru_districts"
# Sort by district code
$districts = $districts | Sort-Object col1
Write-Host "  Total: $($districts.Count)"

# Verificar que datos parezcan completos
$uniqueProvCodes = ($districts | Select-Object -ExpandProperty col3 -Unique).Count
Write-Host "  Provincias referenciadas en distritos: $uniqueProvCodes"
Write-Host "  Departamentos referenciados: $(($districts | Select-Object -ExpandProperty col3 -Unique | ForEach-Object { $_.Substring(0,2) } | Select-Object -Unique).Count)"

# Generar SQL
$sql = @"
-- =============================================================================
-- ARMORA Multimarkas v2 - Seed UBIGEO Peru (SUNAT/INEI)
-- Datos oficiales de departamentos, provincias y distritos del Peru
-- Fuente: INEI - Instituto Nacional de Estadistica e Informatica
-- Datos extraidos del repositorio oficial: ernestorivero/Ubigeo-Peru (INEI 2016)
-- =============================================================================
--
-- Codigos UBIGEO oficiales:
--   - $($departments.Count) departamentos (codigo 2 digitos)
--   - $($provinces.Count) provincias (codigo 4 digitos)
--   - $($districts.Count) distritos (codigo 6 digitos)
--
-- Ejecutar DESPUES de la migracion V3 (V3__ubigeo.sql).
--
-- =============================================================================

BEGIN;

"@

# Departamentos
$sql += @"
-- =============================================================================
-- DEPARTAMENTOS ($($departments.Count))
-- =============================================================================
INSERT INTO departamentos (codigo, nombre) VALUES

"@
$deptValues = $departments | ForEach-Object { 
    $name = $_.col2 -replace "'", "''"
    "('$($_.col1)', '$name')" 
}
$sql += ($deptValues -join ",`n") + ";" + "`n`n"

# Provincias
$sql += @"
-- =============================================================================
-- PROVINCIAS ($($provinces.Count))
-- =============================================================================
WITH deps AS (SELECT id, codigo FROM departamentos)
INSERT INTO provincias (departamento_id, codigo, nombre) VALUES

"@
$provValues = $provinces | ForEach-Object { 
    $name = $_.col2.Trim() -replace "'", "''"
    "((SELECT id FROM deps WHERE codigo='$($_.col3)'), '$($_.col1)', '$name')" 
}
$sql += ($provValues -join ",`n") + ";" + "`n`n"

# Distritos
$sql += @"
-- =============================================================================
-- DISTRITOS ($($districts.Count))
-- =============================================================================
WITH provs AS (SELECT id, codigo FROM provincias)
INSERT INTO distritos (provincia_id, codigo, nombre) VALUES

"@
$distValues = $districts | ForEach-Object { 
    $name = $_.col2 -replace "'", "''"
    "((SELECT id FROM provs WHERE codigo='$($_.col3)'), '$($_.col1)', '$name')" 
}
$sql += ($distValues -join ",`n") + ";" + "`n`n"

$sql += @"
-- =============================================================================
-- COMMIT
-- =============================================================================
COMMIT;
"@

# Escribir archivo
$sql | Out-File -FilePath $outputFile -Encoding utf8 -Force

Write-Host "`n=== RESULTADO ==="
Write-Host "Archivo generado: $outputFile"
Write-Host "  Departamentos: $($departments.Count)"
Write-Host "  Provincias: $($provinces.Count)"
Write-Host "  Distritos: $($districts.Count)"

# Estimar tamano
$size = (Get-Item $outputFile).Length
Write-Host "  Tamano: $([math]::Round($size/1KB, 1)) KB"
Write-Host "`nDone!"
