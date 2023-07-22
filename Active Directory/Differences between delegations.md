**UNCONSTRAINED DELEGATION:**

Kerberos unconstrained delegation, basically allows the frontend service to use the TGT recieved to AUTHENTICATE(and access) to ANY SERVICE they wish. So this would be the
easier scenario for an attacker.

**CONSTRAINED DELEGATION:**

This type of delegation involves the use of 2 extensions of kerberos, the S4U2Self and S4U2Proxy. What differs from unconstrained delegation is that the computer/user object 
configured with constrained delegation(appearance of the msds-allowedtodelegateto property) can only use its recieved TGT to authenticate to the SPN specified in the 
"msds-allowedtodelegateto" on the frontend service property. This is obiously a harder scenario for an attacker, but it is still exploitable, what will vary will be the impact(can you get RCE on the 
SPN specified in the msds-allowedtodelegateto property? If yes the impact would be the same as unconstrained delegation, if not you will only have access to that SPN).

**RESOURCE-BASED CONSTRAINED DELEGATION(RBCD):**

RBCD is pretty similar to constrained delegation, however RBCD removes the requiriment of having the SeEnableDelegationPrivilege enabled. In RBCD the frontend machine must
have a registered SPN, if not the attack won't work. The SID of the computer that the frontend can delegate to is specified in the "msDS-AllowedToActOnBehalfOfOtherIdentity" backend service property, this SID has an special format, so you need to convert it to the "normal" format of an SID(S-R-I-S). 
