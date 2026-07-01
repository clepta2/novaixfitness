Write-Host "=== APP FILES > 200 LINES ==="
Get-ChildItem -Recurse -Filter "*.js" "app/" | ForEach-Object {
    $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
    if ($lines -gt 200) {
        Write-Output ("{0} {1}" -f $lines, $_.FullName)
    }
} | Sort-Object { [int]($_ -split " ")[0] } -Descending

Write-Host ""
Write-Host "=== COMPONENT FILES > 100 LINES ==="
Get-ChildItem -Recurse -Filter "*.js" "src/components/" | ForEach-Object {
    $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
    if ($lines -gt 100) {
        Write-Output ("{0} {1}" -f $lines, $_.FullName)
    }
} | Sort-Object { [int]($_ -split " ")[0] } -Descending

Write-Host ""
Write-Host "=== HARDCODED COLORS IN APP FILES ==="
$pattern = "'#[0-9A-Fa-f]{6}'"
Get-ChildItem -Recurse -Filter "*.js" "app/" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "'#[0-9A-Fa-f]{6}'") {
        Write-Output $_.FullName
    }
}
