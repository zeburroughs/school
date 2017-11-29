#NOTES
- when I use code blocks the top comment will indicate which file to edit
- when I use 3 dots in code block. That means there is  content located in that area, but it is not relavant. **do not put the 3 dots in your file**
- I was able to get a 100% with this configuration. But I noticed somethings were not actually graded. Or somethings were graded but he did not give instructions on how to use it. Here are some things to really watch out for.
  - /etc/yum.repos.d
  - User Expirirary date.
  - setfacl 

---

#### 1A) Break the root password and change it to your own password:

- interupt grub by pressing tab during the boot process.
- append `init=/bin/bash` to the kernel line
- press enter to confirm edit.
- press `b` to boot the kernel
  **This will boot the computer into single user mode.**
- make the file system readable and writable `mount -o remount,rw /`
- change the root password `passwd root`
- fix the fstab file if needed. `vi /etc/fstab`
  **reboot the pc to get out of single user mode**

#### Configure static IP addressing:
- Confirm NetworkManager is off  `service NetworkManager stop`
- Prevent it from booting automatically `chkconfig NetworkManger off`
- Edit the files for static network.
```
# /etc/resolv.conf
domain 8bitb.com
search 8bitb.com
nameserver 161.210.253.3
```

```
# /etc/sysconfig/network
NETWORKING=yes
HOSTNAME=yourhostname
GATEWAY=10.1.0.1
```

```
# /etc/sysconfig/network-scripts/ifcfg-eth0
DEVICE=eth0
IPADDR=your_ip_address
NETMASK=255.255.0.0
ONBOOT=yes
BOOTPROTO=static
```
**HINT:** if you forget `ifcfg-eth0` then copy `/etc/sysconfig/network-scripts/ifcfg-lo` it has a very similar setup.

- turn on the network service `service network start`
- make the network service boot automatically `chkconfig network on`

**make sure you can ping `google.com` and the gateway `10.1.0.1` before continuing**

**You should aslo add a custom repo.**  `touch /etc/yum.repos.d/me.repo`

---


#### 2) Change the default run level to be (5)
```
#/etc/inittab
id:5:initdefault:
```

#### 3) configure httpd to start at reboot for only run level 3
- turn off chkconfig if needed: `chkconfig httpd off`
- turn on run level 3: `chkconfig httpd --level=3 on`

####4) set the sysv start order for httpd to be 84
- edit the `/etc/init.d/httpd` file.
- change the line `# chkconfig: - 85 15` to `# chkconfig: - 84 15`


####5) create directories
```
mkdir -p /root/hlinks /dmidterm/dfiles /dmidterm/dcorp/dsales /dmidterm/dcorp/dhr
```
####6) in /dmidterm/dfiles create the following files that have the listed permissions
| file | permissions |
| ---- | ----------- |
| f1   | rwx --- --- |
| f2   | rws --- --T |
| f3   | rw- rws --t |
| f4   | rwx rwx --T |

- create the files `touch f1 f2 f3 f4`
- add the permissions
```
chmod 700 f1
```
```
chmod 5700 f2
```
```
chmod 3671 f3
```
```
chmod 1770 f4
```

####7) hard link /dmidterm/dfiles/f1 to /root/hlinks/f1

```
ln /dmidterm/dfiles/f1 /root/hlinks/f1
```

####8) add the following users:  scott, tom, cindy, karla, mark
```
useradd scott
```
```
useradd tom
```
```
useradd cindy
```
```
useradd karla
```
```
useradd mark
```
####9) Add the following groups: gsales, ghr
```
groupadd gsales
```
```
groupadd ghr
```
####10) Add scott and tom to the gsales group. Add cindy, karla, and mark to the ghr group.
```
usermod -aG gsales scott
```
```
usermod -aG gsales tom
```
```
usermod -aG ghr cindy
```
```
usermod -aG ghr karla
```
```
usermod -aG ghr mark
```

####11) set the correct permission on /dmidterm/dcorp/dsales so that only root and members of gsales group can accesss. All members of gsales can create files. Only owner of file can delete file.
```
chown -R root:gsales /dmidterm/dcorp/dsales/
```
```
chmod -R 1770 /dmidterm/dcorp/dsales/ 
```
####12) Set the correct permission on /dmidterm/dcorp/dhr so that only cindy and members of ghr group can access. Only cindy can create and delete files. All other members of ghr can only read files.
```
chown -R cindy:ghr /dmidterm/dcorp/dhr/
```
```
chmod -R 1750 /dmidterm/dcorp/dhr/ 
```
####13) Add a user named bob. Has a UID of 1023. Home directory is /home/webmaster. Account will expire on 12-25-2017
```
useradd --uid 1023 --home /home/webmaster --expiredate 2017-12-25 bob
```
**I'm not sure if the `--expiredate` flag works. I did not test it. Another way to change the expiredate is `chage bob`. This will change the age for the user.
To check if the expiredate you can run `chage -l bob` **

####14) create a cron job for bob that executes /home/webmaster/backup.sh. That runs at 2:15pm on the first of every month.
 - run `crontab -e -u bob`
    in the file add the following line. **notice each section only has 1 space between it. and uses military time**
```
15 14 1 * * bob /home/webmaster/backup.sh
```
**check the crontab for syntax errors by running `crontab -l -u bob` **


####15) configure rsyslogd as a tcp server.
- find the following section and make sure the lines are uncommented.
```
# /etc/rsyslog.conf
...
# Provides TCP syslog reception
$ModLoad imtcp
$InputTCPServerRun 514
...
```


##The next section requires you to make some partitions. To do that you will need to use fdisk. I'm going to make all the partitions at once to make it easier to read.

```
fdisk -cu /dev/sda
```
```python
# inside fdisk run the following commands
# the pound sign idicates what the command does.

n  			# new partition
p  			# primary partition
3  			# use sda3
[enter] 	# press enter to select default starting point
+12G 		# make the size 12 gig
n 			# new partition
e 			# choose extended if needed
4 			# use sda4 if needed
[enter] 	# select default starting point
[enter] 	# select default ending point
n 			# new partition
5 			# use sda5
[enter] 	# default starting point
+16G 		# make size 16 gig
t 			# change drive id or something
5 			# use sda5
8e 			# 8e means logial volume
n 			# new partition
6 			# use sda6
[enter] 	# default starting point
+2G 		# make size 2 gig
t 			# change drive id or something
6 			# use sda6
82 			# 82 means linux swap partition
w 			# write changes to disk
```

- Now you need to reload the **sda** drive. Use `partx -a /dev/sda` otherwise you will need to reboot your computer.

####16) create a new partition sda3 of 12 gig. from sda3 create a new volgroup named vg_web. Make the extent size 1 meg. From vg_web create a new 6 meg volume named lv_west. Auto mount lv_west to /var/www/html/corp/west by mapper name.

```
vgcreate -s 1M vg_web /dev/sda3
```

```
lvcreate -n lv_west -L 6M vg_web
```

```
mkfs /dev/mapper/vg_web-lv_west
```

```
mkdir -p /var/www/html/corp/west
```

```
# /etc/fstab
...
/dev/mapper/vg_web-lv_west	/var/www/html/corp/west	ext4	defaults	1 1
...
```

**check fstab for errors** `mount -a`



#### 17) create a new partition sda5 of 16 gig. from sda5 create a new volgroup named vg_video. Make the extent size 8 meg. From vg_video create a new 16 meg volume named lv_mp4. Auto mount lv_mp4 to /var/www/html/corp/mp4 by UUID.

```
vgcreate -s 8M vg_video /dev/sda5
```

```
lvcreate -n lv_mp4 -L 16M vg_video
```

```
mkfs /dev/mapper/vg_video-lv_mp4
```

```
mkdir -p /var/www/html/corp/mp4
```

get the uuid using `blkid /dev/mapper/vg_video-lv_mp4`
```
# /etc/fstab
...
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx	/var/www/html/corp/mp4	ext4	defaults	1 1
...
```

**check fstab for errors** `mount -a`

####18) create a new swap sda6 of 2 gig. auto mount the new swap file.

```
mkswap /dev/sda6
```

```
swapon /dev/sda6
```

```
# /etc/fstab
...
/dev/sda6	swap	swap	defaults	0 0
...
```
**check fstab for errors** `mount -a`



#### 19) create a new user named Burt and Ernie. create a new directory /root/acl/. In /root/acl/ add a file named f1. Add burt to the acl of f1 so that he can rw the file. Ernie should only be able to read the file.

```
mkdir -p /root/acl
```

```
touch /root/acl/f1
```

```
setfacl -m u:burt:rw f1
```

```
setfacl -m u:ernie:r f1
```

