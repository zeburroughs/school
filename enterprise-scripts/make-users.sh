#!/bin/bash
buildings=$1
floors=$2
users=$3
file="test.ldif"
total="$(($buildings*$floors*$users))"
current=0
echo $total


function percentage() {
  echo -ne "\r\033[0K${1} out of ${total}"
}



> $file
# # Uncomment this section to if you need to create the root domain.
  # echo "dn: dc=8bitb,dc=com" >> $file
  # echo "objectClass: dcObject" >> $file
  # echo "dc: 8bitb" >> $file
  # echo "" >> $file

for (( a = 0; a < $buildings; a++ )); do
  # make buildings. $a is the current building number.
  echo "dn: ou=building$a,dc=8bitb,dc=com" >> $file
  echo "objectClass: organizationalunit" >> $file
  echo "ou: building$a" >> $file
  echo "" >> $file
  for (( b = 0; b < $floors; b++ )); do
    # this section adds the floor. $b is the floor number. It makes each floor name uniuqe.
    echo "dn: ou=floor$b,ou=building$a,dc=8bitb,dc=com" >> $file
    echo "objectClass: organizationalunit" >> $file
    echo "ou: floor$b" >> $file
    echo "" >> $file
    for (( c = 0; c < $users && c < 3000; c++ )); do
      # this section of the code will add the users to the ldif file. It increments the current user number by one so it can keep track of the total progress. And make sure each user has a unique name.
      current=$(($current+1))
      echo "dn: cn=user$current,ou=floor$b,ou=building$a,dc=8bitb,dc=com" >> $file
      echo "objectClass: top" >> $file
      echo "objectClass: account" >> $file
      echo "objectClass: posixAccount" >> $file
      echo "objectClass: shadowAccount" >> $file
      echo "cn: user$current" >> $file
      echo "uid: user$current" >> $file
      echo "uidNumber: 1$a$b$c" >> $file
      echo "gidNumber: 1$a$b$c" >> $file
      echo "gecos: user$current" >> $file
      echo "homeDirectory: /home/user$current" >> $file
      echo "loginShell: /bin/bash" >> $file
      echo "" >> $file
      percentage "$current"
    done
  done
done
echo
