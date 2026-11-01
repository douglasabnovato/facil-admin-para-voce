<#
  verificar.ps1 · facil-admin-para-voce
  Verificações estáticas do site (HTML/CSS/JS puros, sem build).
  Uso, na raiz do projeto:
      powershell -ExecutionPolicy Bypass -File .\docs\claudeia\verificar.ps1
      powershell -ExecutionPolicy Bypass -File .\docs\claudeia\verificar.ps1 -Abrir
  Só lê arquivos. Não altera, não apaga e não instala nada.
  Código de saída: 0 = sem falhas; 1 = há falhas (avisos não reprovam).
#>
param(
    [string]$Raiz = (Get-Location).Path,
    [switch]$Abrir
)

$ErrorActionPreference = 'Stop'
if (-not (Test-Path (Join-Path $Raiz 'index.html'))) {
    $Raiz = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
}
Set-Location $Raiz

$script:falhas = 0
$script:avisos = 0
function Ok($m)    { Write-Host "  [OK]    $m" -ForegroundColor Green }
function Falha($m) { Write-Host "  [FALHA] $m" -ForegroundColor Red; $script:falhas++ }
function Aviso($m) { Write-Host "  [AVISO] $m" -ForegroundColor Yellow; $script:avisos++ }
function Ler($p)   { [System.IO.File]::ReadAllText((Join-Path $Raiz $p), [System.Text.Encoding]::UTF8) }

Write-Host "Verificando: $Raiz" -ForegroundColor Cyan

# 1. Arquivos essenciais
Write-Host "`n1. Arquivos essenciais"
foreach ($f in 'index.html', 'style.css', 'script.js', '.nojekyll') {
    if (Test-Path (Join-Path $Raiz $f)) { Ok $f } else { Falha "$f não encontrado" }
}
if ($script:falhas -gt 0) { Write-Host "Interrompido: faltam arquivos essenciais." -ForegroundColor Red; exit 1 }

$html = Ler 'index.html'
$css  = Ler 'style.css'
$js   = Ler 'script.js'

# 2. Cabeçalho do HTML
Write-Host "`n2. Cabeçalho do HTML"
if ($html -match '<html[^>]*\blang="pt-BR"') { Ok 'lang="pt-BR"' } else { Falha 'lang="pt-BR" ausente' }
if ($html -match '<meta charset="UTF-8"') { Ok 'charset UTF-8' } else { Falha 'meta charset ausente' }
if ($html -match '<meta name="viewport"') { Ok 'meta viewport' } else { Falha 'meta viewport ausente' }
if ($html -match '<meta name="description" content="[^"]{50,}"') { Ok 'meta description' } else { Falha 'meta description ausente ou curta' }
if ($html -match '<title>[^<]{10,}</title>') { Ok 'title' } else { Falha 'title ausente' }
if ($html -match '</html>\s*$') { Ok 'HTML termina em </html>' } else { Aviso 'fechamento </html> ausente' }

# 3. Arquivos locais referenciados (src/href) existem
Write-Host "`n3. Arquivos locais referenciados no HTML"
$refs = [regex]::Matches($html, '(?:src|href)="([^"#]+)"') | ForEach-Object { $_.Groups[1].Value } |
    Where-Object { $_ -notmatch '^(https?:|mailto:|tel:|data:|//)' } | Sort-Object -Unique
foreach ($r in $refs) {
    $caminho = Join-Path $Raiz ($r -replace '^\./', '' -replace '\?.*$', '')
    if (Test-Path $caminho) { Ok $r } else { Falha "referência quebrada: $r" }
}

# 4. url() no CSS
Write-Host "`n4. url() locais no CSS"
$urls = [regex]::Matches($css, 'url\(\s*["'']?([^"'')]+)') | ForEach-Object { $_.Groups[1].Value } |
    Where-Object { $_ -notmatch '^(https?:|data:|//|#)' } | Sort-Object -Unique
if (-not $urls) { Ok 'nenhum url() local' }
foreach ($u in $urls) { if (Test-Path (Join-Path $Raiz $u)) { Ok $u } else { Falha "url() quebrada: $u" } }

# 5. Âncoras internas e ids
Write-Host "`n5. Âncoras internas e ids"
$ids = [regex]::Matches($html, '\bid="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
$dup = $ids | Group-Object | Where-Object Count -gt 1
if ($dup) { $dup | ForEach-Object { Falha "id duplicado: $($_.Name)" } } else { Ok "$($ids.Count) ids, nenhum duplicado" }
$ancoras = [regex]::Matches($html, 'href="#([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
foreach ($a in $ancoras) { if ($ids -contains $a) { Ok "#$a" } else { Falha "âncora sem destino: #$a" } }
$vazios = ([regex]::Matches($html, 'href="#"')).Count
if ($vazios -gt 0) { Aviso "$vazios link(s) com href=""#"" (placeholder, ex.: redes sociais)" }
$labels = [regex]::Matches($html, '<label[^>]*\bfor="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
$orfaos = $labels | Where-Object { $ids -notcontains $_ }
if ($orfaos) { $orfaos | ForEach-Object { Falha "label for=""$_"" sem campo" } } else { Ok "$(@($labels).Count) labels ligados a campos" }

# 6. Elementos que o script.js exige
Write-Host "`n6. Elementos usados pelo script.js"
$seletores = @{
    'header'               = '<header'
    '.hamburger-menu'      = 'class="hamburger-menu'
    '.nav-menu'            = 'class="nav-menu'
    '#contact-form'        = 'id="contact-form"'
    '#form-feedback'       = 'id="form-feedback"'
    '#form-status'         = 'id="form-status"'
    '#feedback-ok'         = 'id="feedback-ok"'
    '.btn-submit'          = 'btn-submit'
}
foreach ($k in $seletores.Keys) { if ($html.Contains($seletores[$k])) { Ok $k } else { Falha "script.js espera $k e o HTML não tem" } }
foreach ($campo in 'name', 'phone', 'email', 'profile_type', 'message') {
    $erro = if ($campo -eq 'profile_type') { 'profile-type-error' } else { "$campo-error" }
    if ($html -match "name=""$campo""" -and $html -match "id=""$erro""") { Ok "campo $campo + $erro" } else { Falha "campo $campo ou $erro ausente" }
}

# 7. Regras do formulário (captura do lead)
Write-Host "`n7. Formulário"
if ($html -match 'action="https://formspree\.io/f/[a-z0-9]+"') { Ok 'action Formspree (https)' } else { Falha 'action do formulário fora do padrão' }
if ($html -match 'name="origem" value="facil-admin-para-voce"') { Ok 'campo oculto origem' } else { Falha 'campo origem ausente: leads deixam de ser identificados' }
if ($html -match 'name="_gotcha"') { Ok 'honeypot _gotcha' } else { Falha 'honeypot ausente' }
if ($html -match 'LGPD') { Ok 'aviso LGPD' } else { Falha 'aviso LGPD ausente' }

# 8. Imagens
Write-Host "`n8. Imagens"
foreach ($img in [regex]::Matches($html, '<img\b[^>]*>')) {
    $t = $img.Value
    $src = [regex]::Match($t, 'src="([^"]+)"').Groups[1].Value
    $faltam = @()
    if ($t -notmatch '\balt="[^"]+"') { $faltam += 'alt' }
    if ($t -notmatch '\bwidth="\d+"' -or $t -notmatch '\bheight="\d+"') { $faltam += 'width/height' }
    if ($faltam) { Falha "$src sem $($faltam -join ', ')" } else { Ok $src }
}
$usados = $refs | ForEach-Object { ($_ -replace '^\./', '') }
Get-ChildItem (Join-Path $Raiz 'assets') -File -ErrorAction SilentlyContinue | ForEach-Object {
    $rel = "assets/$($_.Name)"
    if (($usados -notcontains $rel) -and ($css -notmatch [regex]::Escape($_.Name))) {
        Aviso ("{0} não é referenciado ({1:N0} KB)" -f $rel, ($_.Length / 1KB))
    }
}

# 9. Ícones decorativos
Write-Host "`n9. Acessibilidade simples"
$semHidden = [regex]::Matches($html, '<i\s+class="fa[bsr]? [^"]*"\s*>') | Where-Object { $_.Value -notmatch 'aria-hidden' }
if ($semHidden.Count -gt 0) { Aviso "$($semHidden.Count) ícone(s) <i> sem aria-hidden" } else { Ok 'ícones com aria-hidden' }
if ($html -match 'class="skip-link"') { Ok 'skip link' } else { Falha 'skip link ausente' }
if (([regex]::Matches($html, '<h1\b')).Count -eq 1) { Ok 'exatamente um h1' } else { Falha 'quantidade de h1 diferente de 1' }

# 10. Higiene do repositório
Write-Host "`n10. Repositório"
if (Test-Path (Join-Path $Raiz 'deploy.yml')) { Aviso 'deploy.yml na raiz não é executado pelo GitHub (precisa estar em .github/workflows/)' }
$segredos = Get-ChildItem $Raiz -Force -File | Where-Object { $_.Name -like '.env*' }
if ($segredos) { Falha "arquivo de ambiente na raiz: $($segredos.Name -join ', ')" } else { Ok 'nenhum .env na raiz' }

# 11. Sintaxe do JavaScript (só se o Node estiver instalado)
Write-Host "`n11. Sintaxe do script.js"
if (Get-Command node -ErrorAction SilentlyContinue) {
    & node --check (Join-Path $Raiz 'script.js')
    if ($LASTEXITCODE -eq 0) { Ok 'node --check script.js' } else { Falha 'erro de sintaxe em script.js' }
} else {
    Aviso 'Node não instalado: sintaxe do JS não verificada'
}

Write-Host ""
$cor = if ($script:falhas -eq 0) { 'Green' } else { 'Red' }
Write-Host "Resultado: $($script:falhas) falha(s), $($script:avisos) aviso(s)." -ForegroundColor $cor

if ($Abrir) { Start-Process (Join-Path $Raiz 'index.html') }
if ($script:falhas -gt 0) { exit 1 } else { exit 0 }
