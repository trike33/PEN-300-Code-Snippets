Ansible configuration directory   -> /etc/ansible       /etc/ansible/hosts

2 primary ways to distribute commands:
1. Via Ad-hoc commands, which are stand-alone shell commands to be executed on all the ansible victims machines. Examples:
  
  ```ansible victims -a "whoami"        ansible victims -a "whoami" --become root```

2. Via playbook scripts, these scripts must be in a .yml format and are run in this manner:

     ```ansible-playbook script.yml```

**Ansible Vaults:**

Are encrypted passwords in the playbooks, this is done in order to avoid writting plaintext credentials in a file. The "!vault" keyword, lets Ansible know that the value is vault-encrypted. However, we can try to crack the encryption.

Example of an ansible vault:

```
ansible_become_pass: !vault |
 $ANSIBLE_VAULT;1.1;AES256
 
39363631613935326235383232616639613231303638653761666165336131313965663033313232
 
3736626166356263323964366533656633313230323964300a323838373031393362316534343863
 
36623435623638373636626237333163336263623737383532663763613534313134643730643532
 
3132313130313534300a383762366333303666363165383962356335383662643765313832663238
 3036
```

To crack the password we will first copy the encrypted string to a file named "test.yml", then use the "ansible2john"
(/usr/share/john/ansible2john.py) utility to convert the hash to a format that JTR accepts.

```
Contents of test.yml:
$ANSIBLE_VAULT;1.1;AES256
393636316139353262353832326166396132313036386537616661653361313139656630333132323736626166356263323964366533656633313230323964300a323838373031393362316534343863366234356236383736366262373331633362636237373835326637636135343131346437306435323132313130313534300a3837623663333036663631653839623563353836626437653138326632383036

~# python3 /usr/share/john/ansible2john.py test.yml > testhash.txt

~# john --wordlist=/usr/share/wordlists/rockyou.txt testhash.txt
```

Now, we are ready to decrypt the vault:

```
~# cat test.yml | ansible-vault decrypt
```

**Weak permissions in a playbook:**

If we have write permissions over a playbook, we might be able to gain code execution. Such as creating a new SSH key-pair, and then transferring the public one to the victim, in consequence being able to use our new private SSH key to log into the victim. 
