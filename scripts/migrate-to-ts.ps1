# scripts/migrate-to-ts.ps1
# Migra .js para .ts/.tsx

$root = "C:\Users\clept\OneDrive\Documents\academia\novaix-fitness"

function Has-JSX($filePath) {
    $content = Get-Content $filePath -Raw -ErrorAction SilentlyContinue
    if ($null -eq $content) { return $false }
    if ($content -match '<View|<Text|<TouchableOpacity|<ScrollView|<FlatList|<Image|<Modal|<TextInput|<ActivityIndicator|<Pressable|<Animated|<KeyboardAvoidingView|<SafeAreaView|<StyleSheet\.create') {
        return $true
    }
    return $false
}

$folders = @("app", "src")
$totalRenamed = 0
$errors = @()

foreach ($folder in $folders) {
    $folderPath = Join-Path $root $folder
    if (-not (Test-Path $folderPath)) { continue }

    $jsFiles = Get-ChildItem -Path $folderPath -Recurse -Filter *.js | Where-Object {
        $_.FullName -notlike "*node_modules*" -and
        $_.FullName -notlike "*__tests__*" -and
        $_.FullName -notlike "*.test.js" -and
        $_.FullName -notlike "*coverage*" -and
        $_.FullName -notlike "*dist*"
    }

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
}

Write-Host "`n--- CONCLUIDO ---" -ForegroundColor Cyan
Write-Host "Renomeados: $totalRenamed" -ForegroundColor Green
Write-Host "Erros: $($errors.Count)" -ForegroundColor $(if ($errors.Count -gt 0) { "Red" } else { "Green" })
