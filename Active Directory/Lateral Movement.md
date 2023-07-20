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

**PASS THE TICKET:**



**GOLDEN TICKETS:**


**SILVER TICKETS:**

**BRONZE TICKETS:**


**DOMAIN CONTROLLER SYNCHRONIZATION:**
