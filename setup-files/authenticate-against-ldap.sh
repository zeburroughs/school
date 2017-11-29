#!/bin/bash
yum install -y openldap-clients nss-pam-ldapd
authconfig --enableldap --enableldapauth --ldapserver="10.1.11.14 --ldapbasedn="dc=8bitb,dc=com" --enablemkhomedir --update
