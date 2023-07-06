  **ON A WINDOWS MACHINE:**

To enumerate the posible Antivurs(AV) products and defenses implemented in our victim we can use the PowerShell [HostRecon](https://github.com/dafthack/HostRecon) script as follows:

Are there any AV products presents?

```
PS C:\windows\system32\inetsrv> . .\HostRecon.ps1

PS C:\windows\system32\inetsrv> Invoke-HostRecon
```

Is LSA enabled?

```
PS C:\windows\system32\inetsrv> Get-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Control\Lsa -Name "RunAsPPL"
```

Are there any AppLocker rules in use?

```
PS C:\windows\system32\inetsrv> Get-ChildItem -Path HKLM:\SOFTWARE\Policies\Microsoft\Windows\SrpV2\Exe
```
