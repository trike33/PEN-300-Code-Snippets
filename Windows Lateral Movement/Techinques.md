**PsExec:** https://www.ired.team/offensive-security/lateral-movement/lateral-movement-with-psexec

Alternatively to the techinque explained in this link, you can also perform psexec from metasploit using these modules:
(note that using metasploit modules will likely trigger any AV/EDR/firewall)

```
1. windows/smb/psexec   -> The exploit/windows/smb/psexec module is an exploit module. Exploit modules allow the operator to set a payload. Payloads such as windows/exec support specifying arbitrary commands to be executed as a payload.(net user ankylo Ankylo33_ /add /y, for example)

2. auxiliary/scanner/smb/psexec_loggedin_users -> lists all logged on users by querying the registry hives
```

Alternatively you can perform PsExec from powershell/powershell empire with this script: 

https://github.com/EmpireProject/Empire/blob/master/data/module_source/lateral_movement/Invoke-PsExec.ps1

If you want to perform more evasion you can create a custom EXE and specify it in the "Command" parameter and then specify a legitimate Windows service like SensorService on the "ServiceName" property.

**WMI:** https://www.ired.team/offensive-security/lateral-movement/t1047-wmi-for-lateral-movement

**DCOM:** https://enigma0x3.net/2017/01/05/lateral-movement-using-the-mmc20-application-com-object/

**PSRemoting:(Relies on WinRM and WinRS)** https://pentestlab.blog/2018/05/15/lateral-movement-winrm/  -> this link provides lots of alternatives

**Weaponization of this techniques:** https://github.com/0xthirteen/SharpMove
