Note that to throw any of this commands, you must have a High Integrity session.

**FROM A POWERSHELL SESSION:**

```
Turning the real-time protection off:
PS C:\> Set-MpPreference -DisableRealtimeMonitoring $true
```

**FROM A CMD:**

```
Disabling the Windows Defender service
C:\> sc stop WinDefend
```
