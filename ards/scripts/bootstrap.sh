#!/bin/bash

SSHPORT=<SSHPORT>
HOSTGROUP="<SSHPORT>"
ARDS_KEY_URL="http://<ARDS_SERVER_URL>/ards/ansible-ssh-key"
ARDS_ADD_URL="http://<ARDS_SERVER_URL>/ards/add-server"
LOGFILE="/var/log/ards_bootstrap.log"


IPADDRESS=`ifconfig  | grep 'inet addr:'| grep -v '127.0.0.1' | cut -d: -f2 | awk '{ print $1}' | head -1 | sed '/^$/d'`
HOSTNAME=`hostname`

SCRIPTPATH=$( cd $(dirname $0); pwd -P )
SCRIPTNAME=$(basename $0)

export http_proxy=""
export https_proxy=""

function installPkg {
  PKG_NAME=$1
  PKG_MAN=`which apt-get`
  if [[ $? > 0 ]];
  then
    PKG_MAN=`which yum`
    if [[ $? > 0 ]];
    then
      echo "ERROR: Unsupported package manager!"
      exit 1 
    else
      PKG_MAN="yum install "
    fi
  else
    PKG_MAN="apt-get install "
  fi
  $PKG_MAN${PKG_NAME} 
}

installPkg wget
installPkg sudo
installPkg openssh-server

# Change SSH Port
sed 's/^Port .*/Port '${SSHPORT}'/' /etc/ssh/sshd_config > /etc/ssh/sshd_config.new
if [[ -f /etc/ssh/sshd_config.new ]];
then
  mv /etc/ssh/sshd_config /etc/ssh/sshd_config.old
  mv /etc/ssh/sshd_config.new /etc/ssh/sshd_config
fi

# Always restart SSH
if [[ -f /etc/init.d/ssh ]];
then
  service ssh restart
else
  if [[ -f /etc/init.d/sshd ]];
  then
    service sshd restart
  fi
fi

# Check the ansible user exists
ANSIBLE_HOME=`cat /etc/passwd | grep ^ansible | awk 'BEGIN { FS = ":" } ; { print $6 }'`

if [[ "${ANSIBLE_HOME}" == "" ]];
then
  useradd -d /home/ansible -m -s /bin/bash -c "Ansible Bootstrap" ansible
  mkdir -p /home/ansible/.ssh
  chown -R ansible:ansible /home/ansible
  chmod 750 /home/ansible
  chown ansible /home/ansible/.ssh
  chmod 700 /home/ansible/.ssh
  touch /home/ansible/.ssh/authorized_keys
  wget -O /home/ansible/.ssh/authorized_keys ${ARDS_KEY_URL}
  chown ansible /home/ansible/.ssh/authorized_keys
  chmod 600 /home/ansible/.ssh/authorized_keys
cat <<EOF >> /etc/sudoers
ansible   ALL=NOPASSWD: ALL
EOF
fi

# Flush IPTables
iptables -F
  
# JSON Payload 
CONTENT_TYPE="application/json"
POST_DATA='{ "data": { "ip_address": "'${IPADDRESS}'", "ssh_port": "'${SSHPORT}'", "host_group": "'${HOSTGROUP}'", "hostname": "'${HOSTNAME}'" } }'

wget -O- --server-response --post-data="${POST_DATA}" --header="Content-Type: application/json" ${ARDS_ADD_URL} >> ${LOGFILE}

# Now Ansible has hopefully executed, move the script to prevent it running on reboot
mv ${SCRIPTPATH}/${SCRIPTNAME} /tmp/${SCRIPTNAME}
