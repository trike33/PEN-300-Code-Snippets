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

If you want to be even stealthier you can use the "lat_user_input.cs" script provided in this repository.

**WMI(requires port 135 TCP and RPC):** https://www.ired.team/offensive-security/lateral-movement/t1047-wmi-for-lateral-movement

More WMI exec: https://www.trustedsec.com/blog/no_psexec_needed/

Python implementation(empire) of this WMI technique: https://github.com/EmpireProject/Empire/blob/master/lib/modules/powershell/lateral_movement/invoke_wmi.py

**DCOM(Windows Firewall will block this technique by default.):** https://enigma0x3.net/2017/01/05/lateral-movement-using-the-mmc20-application-com-object/

**PSRemoting:(Relies on WinRM and WinRS)** https://pentestlab.blog/2018/05/15/lateral-movement-winrm/  -> this link provides lots of alternatives

**Configuring PSRemoting(remotely enabling WinRM) & more PSRemoting:** https://pentestn00b.wordpress.com/2016/08/22/powershell-psremoting-pwnage/

You can search this link for info about [Invoke-WmiMethod](https://ss64.com/ps/invoke-wmimethod.html), which "Invoke-WmiMethod" works under Windows Management Instrumentation(WMI). As an alternative you can use [Invoke-CimMethod](https://ss64.com/ps/invoke-cimmethod.html), however "Invoke-CimMethod" works under WinRM but if you want to enable WinRM, "Invoke-WmMethod" is a better alternative than "Invoke-CimMethod".

Python implementation of [Invoke-PSRemoting](https://github.com/EmpireProject/Empire/blob/master/lib/modules/powershell/lateral_movement/invoke_psremoting.py).

**Weaponization of this techniques:** https://github.com/0xthirteen/SharpMove

**RDP:** https://github.com/0xthirteen/SharpRDP

**More lateral movement techniques + explanation:**

https://blog.harmj0y.net/empire/expanding-your-empire/
