$ascii = "C:\Users\15151\.codex\visualizations\2026\07\18\019f75a3-6370-71e0-b2b9-e3c6c9902acf\swiss_bp.pptx"
$out = "C:\Users\15151\.codex\visualizations\2026\07\18\019f75a3-6370-71e0-b2b9-e3c6c9902acf\preview"
Remove-Item $out -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $out | Out-Null
$app = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open($ascii, $true, $false, $false)
for ($i=1; $i -le $pres.Slides.Count; $i++) {
  $f = "{0}\slide_{1:D2}.png" -f $out, $i
  $pres.Slides.Item($i).Export($f, "png", 1600, 900)
}
$pres.Close()
$app.Quit() | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($app) | Out-Null
Get-ChildItem $out -Filter *.png | Measure-Object | Select-Object -ExpandProperty Count