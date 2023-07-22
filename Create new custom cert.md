```
1. ~#  openssl req -new -x509 -nodes -out cert.crt -keyout priv.key

2.  cat priv.key cert.crt > justice.pem
```

Additionally, we must make a little modification to the **/etc/ssl/openssl.cnf** file:

```
1. locate this line inside the /etc/ssl/openssl.cnf file:

CipherString=DEFAULT@SECLEVEL=2

2. Change the previous line for:

CipherString=DEFAULT
```
