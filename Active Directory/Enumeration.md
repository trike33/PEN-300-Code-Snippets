One of the easiest ways to enumerate an Active Directory enviroment is using [SharpHound.ps1](https://github.com/BloodHoundAD/BloodHound/blob/master/Collectors/SharpHound.ps1) ingestor or [SharpHound.exe](https://github.com/BloodHoundAD/BloodHound/blob/master/Collectors/SharpHound.exe), and 
then viewing the results with [BloodHound](https://github.com/BloodHoundAD/BloodHound). 

Alternatively, you can use [PowerView](https://github.com/PowerShellEmpire/PowerTools/blob/master/PowerView/powerview.ps1) or windows built-in programs or with
PowerShell, however these methods are more time consuming and requires a great deep understanding of Active Directory enviroments.

ACLARATION: All the methods explained here, will provide you with the same information. A method being more diffuclt than other, doesn't directly correlates into
more or better information being gathered.

Here are some useful PowerView commands:

```
Search for ACEs(appliable to all of our domain user accounts) that our current user has: 
Get-DomainUser | Get-ObjectAcl -ResolveGUIDs | Foreach-Object {$_ | Add-Member -NotePropertyName Identity -NotePropertyValue (ConvertFrom-SID $_.SecurityIdentifier.value) -Force; $_} | Foreach-Object {if ($_.Identity -eq $("$env:UserDomain\$env:Username")) {$_}}

Search for ACEs(appliable to all of our domain groups) that our current user has:
Get-DomainGroup | Get-ObjectAcl -ResolveGUIDs | Foreach-Object {$_ | Add-Member -NotePropertyName Identity -NotePropertyValue (ConvertFrom-SID $_.SecurityIdentifier.value) -Force; $_} | Foreach-Object {if ($_.Identity -eq $("$env:UserDomain\$env:Username")) {$_}}

To apply additional access rights such as GenericAll, GenericWrite, or even DCSync:
Add-DomainObjectAcl -TargetIdentity testservice2 -PrincipalIdentity offsec -Rights All

Enumerate unconstrained delegations: Get-DomainComputer -Unconstrained
		
Enumerate constrained delegation: Get-DomainUser -TrustedToAuth   / Get-DomainComputer -TrustedToAuth

Enumerate forest trusts using win APIs: Get-DomainTrust -API

Enumerate forest trusts using LDAP: Get-DomainTrust

Enumerate group members of a domain: Get-DomainGroupMember -Identity 'Enterprise Admins' -Domain corp1.com

Get a domain SID: Get-DomainSid -Domain corp1.com

Enumerate foreign forests trusts: Get-DomainTrustMapping

Enumerate foreign forest(corp2.com) group membership: Get-DomainForeignGroupMember -Domain corp2.com    -> this will return us a SID that we can convert

To convert a SID: ConvertFrom-SID 'S-1-5-21-634106289-3621871093-708134407-1110'

Enumerates users who are in groups outside of the user's domain: Get-DomainForeignUser

Interforest trusts enumeration(corp2.com is the forest domain): Get-DomainTrust -Domain corp2.com
```

**ENUMERATION WITH SHARPHOUND:**

Add this line at the end of SharpHound.ps1:

```
Invoke-SharpHound -CollectionMethod All
```
