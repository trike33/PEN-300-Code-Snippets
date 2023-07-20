You can search through the internet to exploit your specific ACL you have. Here is a good link for it: https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/abusing-active-directory-acls-aces

**ABUSING GENERICALL:**

*On a user:*

If we have GenericAll permisions over a domain user account(user1 in this example), we can change his password without knowing the previous one as follows:

```
C:\> net user user1 h4x /domain
```
After changing the user1 password, we might be able to compromise an additional victim using techniques like pass-the-ticket.

*On a group:*

However, if we have GenericAll permissions over a domain group(group1 in our example) we can add ourselves to this group:

```
C:\> net group group1 trike /add /domain
```

**ABUSING WRITEDACL:**

The WriteDACL access right allow our us to add GenericAll rights over that object. We can change the ACE using the [Add-DomainObjectAcl](https://powersploit.readthedocs.io/en/latest/Recon/Add-DomainObjectAcl/) [PowerView](https://github.com/PowerShellMafia/PowerSploit/blob/master/Recon/PowerView.ps1) method.

```
PS C:\> Add-DomainObjectAcl -TargetIdentity user2 -PrincipalIdentity trike -Rights All
```
(In our example the trike user has WriteDACL over user2)

