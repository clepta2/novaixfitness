# scripts/migrate-backend-ts.ps1
# Migra backend .js para .ts

$root = "C:\Users\clept\OneDrive\Documents\academia\novaix-fitness\backend"

function Has-JSX($filePath) {
    $content = Get-Content $filePath -Raw -ErrorAction SilentlyContinue
    if ($null -eq $content) { return $false }
    if ($content -match 'JSX\.Element|React\.FC|<View|<Text|<TouchableOpacity') { return $true }
    return $false
}

$jsFiles = Get-ChildItem -Path "$root\src" -Recurse -Filter *.js | Where-Object {
    $_.FullName -notlike "*node_modules*" -and
    $_.FullName -notlike "*__tests__*" -and
    $_.FullName -notlike "*.test.js" -and
    $_.FullName -notlike "*coverage*"
}

$totalRenamed = 0
$errors = @()

foreach ($file in $jsFiles) {
    try {
        $hasJsx = Has-JSX $file.FullName
        $newExtension = if ($hasJsx) { ".tsx" } else { ".ts" }
        $newPath = $file.DirectoryName + "\" + $file.BaseName + $newExtension

        if (-not (Test-Path $newPath)) {
            Rename-Item -Path $file.FullName -NewName ($file.BaseName + $newExtension)
            $totalRenamed++
            Write-Host "OK: $($file.Name) -> $($file.BaseName)$newExtension" -ForegroundColor Green
        } else {
            Write-Host "SKIP: $($file.Name) (exists)" -ForegroundColor Yellow
        }
    } catch {
        $errors += "$($file.Name): $($_.Exception.Message)"
        Write-Host "ERR: $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`n--- CONCLUIDO ---" -ForegroundColor Cyan
Write-Host "Renomeados: $totalRenamed" -ForegroundColor Green
Write-Host "Erros: $($errors.Count)" -ForegroundColor $(if ($errors.Count -gt 0) { "Red" } else { "Green" })
