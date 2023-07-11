Under the example folder, there is a TestClass.cs that shows where and how to place your code in the DotNetToJScript project. Additioanlly there is a .hta, that shows how you can integrate your JScript output into a malicious HTA document to deliver it via web.

(Note that the .hta file also contains a kickout() function that is used for bypass AMSI)

There is also a .js file that show how your

**Writing code to DotNetToJScript:**

First we will navigate to the TestClass.cs file under the ExampleAssembly project. This ExampleAssembly will get compiled into a DLL. Once we have our code written under the "public TestClass()", we will switch from Debug to Release and build the entire solution(both DotNetToJScript and ExampleAssembly).

Now in order to convert our DLL into a .js, we need to grab some things: we will grab DotNetToJScript.exe and NDesk.Options.dll from the DotNetToJScript project and copy them to the C:\Tools\ folder. Then we must also grab the ExampleAssembly.dll from the ExampleAssembly project and copy it to the C:\Tools folder.

Next, we will throw this command from a CMD and under the C:\Tools\ folder:

```
C:\Tools> DotNetToJScript.exe ExampleAssembly.dll --lang=Jscript --ver=v4 -o demo.js
```
