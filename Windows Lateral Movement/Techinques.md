**PsExec:** https://www.ired.team/offensive-security/lateral-movement/lateral-movement-with-psexec
(keep in mind the LocalAccountTokenFilterPolicy)

```
#From an admin CMD
C:\> reg add HKLM\Software\Microsoft\Windows\	CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t 	REG_DWORD /d 1 /f
```

1. PsExec is also available from SysInternals, however it will create the "PSExecSVC" service which will trigger the AV.(https://learn.microsoft.com/en-us/sysinternals/downloads/psexec)

2. You can also try the python implementation from the impacket suite(note that to run this script you need to install the full impacket suite, since it imports modules from the impacket suite): https://github.com/fortra/impacket/blob/master/examples/psexec.py; using this script usally doesn't trigger the AV, meaning that you can establish a "stable" shell with the target.

3. Alternatively to the techinque explained in this link, you can also perform psexec from metasploit using these modules:
(note that using metasploit modules will likely trigger any AV/EDR/firewall)

```
windows/smb/psexec   -> The exploit/windows/smb/psexec module is an exploit module. Exploit modules allow the operator to set a payload. Payloads such as windows/exec support specifying arbitrary commands to be executed as a payload.(net user ankylo Ankylo33_ /add /y, for example)

auxiliary/scanner/smb/psexec_loggedin_users -> lists all logged on users by querying the registry hives
```

4. Alternatively you can perform PsExec from powershell/powershell empire with this script: 

https://github.com/EmpireProject/Empire/blob/master/data/module_source/lateral_movement/Invoke-PsExec.ps1
If you want to perform more evasion you can create a custom EXE and specify it in the "Command" parameter and then specify a legitimate Windows service like SensorService on the "ServiceName" property.

5. If you want to be even stealthier you can use the [lat_user_input.cs](https://github.com/trike33/PEN-300-Code-Snippets/blob/main/Windows%20Lateral%20Movement/lat_user_input.cs) script provided in this repository.(This is a great script since it won't trigger much signatures). If you want to use this script with a username-password pair, you will first need to use "sekurlsa::pth /user:Administrator /domain:contoso.com /ntlm:<ntlm_hash>" from mimikatz to execute the "lat_user_input.exe".

6. You can go even further reviewing this execellent repository about fileless lateral movement: https://github.com/Mr-Un1k0d3r/SCShell

**WMI(can use both DCOM and WinRM transport protocols):** 

(keep in mind the LocalAccountTokenFilterPolicy)

(DCOM comunications must be available meaning that the port 135 TCP must be open, in addtion to being able to communicate thourgh RPC via port 135 TCP)
1. Using wmic.exe -> https://www.ired.team/offensive-security/lateral-movement/t1047-wmi-for-lateral-movement

2. Using powershell:
You can use this command to execute a new process on localhost;

```
PS C:\> Invoke-WmiMethod -Path Win32_process -Name create -ArgumentList "calc.exe" -Verbose
```

However you can use/adapt this command to execute a new process in a remote machine(to do so, the firewall must be configured to allow remote WMI access, in a nutshell port 135 TCP needs to be open);

```
PS C:\> Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList 'notepad.exe' -ComputerName 192.168.72.134 -Credential 'WIN-B85AAA7ST4U\Administrator' 
```

3. More WMI exec(using impacket-wmiexec): https://www.trustedsec.com/blog/no_psexec_needed/

4. Deep to WMI [here](https://www.blackhat.com/docs/us-15/materials/us-15-Graeber-Abusing-Windows-Management-Instrumentation-WMI-To-Build-A-Persistent%20Asynchronous-And-Fileless-Backdoor-wp.pdf).

5. Python implementation(empire) of this WMI technique: https://github.com/EmpireProject/Empire/blob/master/lib/modules/powershell/lateral_movement/invoke_wmi.py

**DCOM(Windows Firewall will block this technique by default.):** 

1. https://enigma0x3.net/2017/01/05/lateral-movement-using-the-mmc20-application-com-object/

**PSRemoting:(Relies on WinRM and WinRS)** 

1. https://pentestlab.blog/2018/05/15/lateral-movement-winrm/  -> this link provides lots of alternatives

**2. Configuring PSRemoting(remotely enabling WinRM) & more PSRemoting:** https://pentestn00b.wordpress.com/2016/08/22/powershell-psremoting-pwnage/

You can search this link for info about [Invoke-WmiMethod](https://ss64.com/ps/invoke-wmimethod.html), which "Invoke-WmiMethod" works under Windows Management Instrumentation(WMI), therefore uses only DCOM. As an alternative you can use [Invoke-CimMethod](https://ss64.com/ps/invoke-cimmethod.html), which works under both DCOM and WinRM.

3. Python implementation of [Invoke-PSRemoting](https://github.com/EmpireProject/Empire/blob/master/lib/modules/powershell/lateral_movement/invoke_psremoting.py).

**Weaponization of this techniques(C# script):** https://github.com/0xthirteen/SharpMove

**RDP(C# Script):** https://github.com/0xthirteen/SharpRDP

**RDP Thieft(C# DLL injector + DLL):** https://github.com/trike33/PEN-300-Code-Snippets/blob/main/Windows%20Lateral%20Movement/RDP%20Thief.cs

This script searches for running instances of mstsc.exe and then dump the credentials stored, also uses this [malicious DLL](https://github.com/0x09AL/RdpThief).

**Review of lateral movement techniques + explanation:**

https://blog.harmj0y.net/empire/expanding-your-empire/
