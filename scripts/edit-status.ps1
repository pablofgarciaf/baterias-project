# estado: ""
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('init', 'acquire', 'release', 'check')]
    [string]$Action,
    [string]$Path
)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$commentStyles = @{
    '.ts' = @('// estado: "', '"')
    '.tsx' = @('// estado: "', '"')
    '.js' = @('// estado: "', '"')
    '.mjs' = @('// estado: "', '"')
    '.rules' = @('// estado: "', '"')
    '.css' = @('/* estado: "', '" */')
    '.md' = @('<!-- estado: "', '" -->')
    '.svg' = @('<!-- estado: "', '" -->')
    '.ps1' = @('# estado: "', '"')
}
$utf8 = [Text.UTF8Encoding]::new($false, $true)
$busy = 'en edici' + [char]0x00F3 + 'n'

function Resolve-EditablePath([string]$inputPath) {
    $full = [IO.Path]::GetFullPath((Join-Path $root $inputPath))
    if (-not $full.StartsWith($root + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Fuera del proyecto: $inputPath"
    }
    if (-not [IO.File]::Exists($full)) { throw "No existe: $inputPath" }
    if ($full.EndsWith('next-env.d.ts', [StringComparison]::OrdinalIgnoreCase)) {
        throw 'next-env.d.ts es generado por Next.js'
    }
    $ext = [IO.Path]::GetExtension($full).ToLowerInvariant()
    if (-not $commentStyles.ContainsKey($ext)) { throw "Formato sin comentario seguro: $ext" }
    return $full
}

function Update-Status([string]$inputPath, [string]$mode) {
    $full = Resolve-EditablePath $inputPath
    $ext = [IO.Path]::GetExtension($full).ToLowerInvariant()
    $style = $commentStyles[$ext]
    $hash = [Security.Cryptography.SHA256]::Create()
    try {
        $lockName = ([BitConverter]::ToString($hash.ComputeHash([Text.Encoding]::UTF8.GetBytes($full)))).Replace('-', '').ToLowerInvariant()
    } finally {
        $hash.Dispose()
    }
    $lockPath = Join-Path $env:TEMP "maresa-edit-$lockName.lock"
    $lock = [IO.FileStream]::new($lockPath, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write, [IO.FileShare]::None)
    try {
        $bytes = [IO.File]::ReadAllBytes($full)
        $bom = $bytes.Length -ge 3 -and $bytes[0] -eq 239 -and $bytes[1] -eq 187 -and $bytes[2] -eq 191
        $offset = if ($bom) { 3 } else { 0 }
        $body = $utf8.GetString($bytes, $offset, $bytes.Length - $offset)
        $lineEnd = $body.IndexOf("`n")
        $first = if ($lineEnd -ge 0) { $body.Substring(0, $lineEnd).TrimEnd("`r") } else { $body }
        $prefix = $style[0]
        $suffix = $style[1]
        $hasStatus = $first.StartsWith($prefix) -and $first.EndsWith($suffix)
        $current = if ($hasStatus) { $first.Substring($prefix.Length, $first.Length - $prefix.Length - $suffix.Length) } else { $null }
        if ($hasStatus -and $current -notin @('', $busy)) { throw "Estado desconocido: $inputPath" }

        if ($mode -eq 'check') {
            Write-Output "$inputPath : $(if ($hasStatus) { $current } else { 'sin estado' })"
            return
        }
        if ($mode -eq 'init' -and $hasStatus) { return }
        if ($mode -eq 'acquire' -and $current -ne '') { throw "Ocupado o sin inicializar: $inputPath ($current)" }
        if ($mode -eq 'release' -and $current -ne $busy) { throw "No esta en edicion: $inputPath" }

        $next = if ($mode -eq 'acquire') { $busy } else { '' }
        $newline = if ($body.Contains("`r`n")) { "`r`n" } else { "`n" }
        $tail = if ($hasStatus) {
            if ($lineEnd -ge 0) { $body.Substring($lineEnd + 1) } else { '' }
        } else { $body }
        $updated = $prefix + $next + $suffix + $newline + $tail
        $payload = $utf8.GetBytes($updated)
        if ($bom) { $payload = [byte[]](239, 187, 191) + $payload }
        [IO.File]::WriteAllBytes($full, $payload)
        if ($mode -ne 'init') { Write-Output "$inputPath : $next" }
    } finally {
        $lock.Dispose()
        [IO.File]::Delete($lockPath)
    }
}

if ($Action -eq 'init' -and -not $Path) {
    $candidates = git -C $root ls-files --cached --others --exclude-standard
    $count = 0
    foreach ($candidate in $candidates) {
        $ext = [IO.Path]::GetExtension($candidate).ToLowerInvariant()
        if (-not $commentStyles.ContainsKey($ext) -or $candidate -eq 'next-env.d.ts') { continue }
        if (-not [IO.File]::Exists((Join-Path $root $candidate))) { continue }
        Update-Status $candidate 'init'
        $count++
    }
    Write-Output "Revisados $count archivos compatibles."
} elseif ($Path) {
    Update-Status $Path $Action
} else {
    throw 'Indica -Path para esta acción.'
}
