1. They are running on ubuntu 22 VMs (Hyper-V) (I would probably do these on LXE containers in the future)

2. 4 enterprise catalysts, 4 WAPS, 6 Lenovo SR630s, ~6 dell poweredge r720s, 4 WAPS, 20 or so VMs, 2 palo alto firewalls

3. Databases going out of sync and front end of netdisco failed often, had to write a cronjob to update database regularly and to update once a day (not many things are changed in our network). switchmap was tricky with the perl scripts getting it to run updates

4. no 

5. its a lot easier, I've had a time where we needed to remotely configure the ports that 5x NIC ports were going to on a dell poweredge sr720 running proxmox and I needed to switchport access the management port and trunk the other ports that were going to be bonded and I had the mac addresses of the NIC on my spreadsheet (which was missing the physical cisco port info) and just need to use netdisco to find which ports where which.

6. adding a new device librenms

Infrastructure Monitoring & Management Notes
LibreNMS Configuration
1. Adding a Device via Backend
Bash

# SSH into the monitoring server
ssh <USER>@<MONITORING_SERVER_IP>
sudo su - librenms

# Add device using SNMP v2c
./lnms device:add --v2c -c <COMMUNITY_STRING> <DEVICE_IP>
2. Configuring SNMP Client (Debian/Ubuntu)
Install SNMP daemon:

Bash

sudo apt-get update && sudo apt install snmpd snmp libsnmp-dev
Configure /etc/snmp/snmpd.conf:

Bash

# Set location and contact
sysLocation    <LOCATION_NAME>
sysContact     <ADMIN_NAME> <ADMIN_EMAIL>

# Define Read-Only community
rocommunity <COMMUNITY_STRING>

# Change agentAddress to listen on all interfaces (or specific management IP)
agentAddress udp:161
Enable and Restart Service:

Bash

systemctl enable snmpd
systemctl restart snmpd
systemctl status snmpd
3. Maintenance and Troubleshooting
Fixing daily.sh failures:

Bash

sudo -u librenms -H bash
cd /opt/librenms
tail -n 200 logs/daily.log || true
./daily.sh
Cleaning Dirty Git Tree:

Bash

sudo -u librenms -H bash
cd /opt/librenms

# Reset local changes
git reset --hard
git clean -fd

# Cleanup and Update
./scripts/github-remove -d
git pull --rebase --autostash
composer install --no-dev -o
./daily.sh
php validate.php
Netdisco Configuration
1. Device Discovery & Management
Bash

sudo -iu netdisco

# Discover devices by IP
netdisco-do discover -d <DEVICE_IP>

# Bulk discovery loop
for ip in <IP_RANGE>; do
  ~/bin/netdisco-do add -d "$ip" -c <COMMUNITY_STRING>
done

# Delete devices
~/bin/netdisco-do delete -d <DEVICE_IP>
2. Automation (Crontab)
Bash

# crontab -e for netdisco user
# Poll all devices, refresh MAC tables, and refresh ARP tables hourly
0 * * * * /home/netdisco/bin/netdisco-do discoverall --force --quiet
10 * * * * /home/netdisco/bin/netdisco-do macwalk --force --quiet
20 * * * * /home/netdisco/bin/netdisco-do arpwalk --force --quiet

# Scheduled web front-end restart for stability
0 3 * * * /bin/bash -c 'cd ~ && ~/bin/netdisco-web restart' >> ~/netdisco_restart.log 2>&1
3. deployment.yml (Sanitized Template)
YAML

database:
  name: 'netdisco'
  user: 'netdisco'
  pass: '<DB_PASSWORD>'
  host: '<DB_HOST_IP>'

device_auth:
  - tag: 'infrastructure_group'
    community: '<COMMUNITY_STRING>'
    read: true
    write: false

discover:
  - '<SERVER_SUBNET>'
  - '<LAB_SUBNET>'
  - '<FIREWALL_SUBNET>'

domain:
  name: '<INTERNAL_DOMAIN>'

snmp:
  communities:
  - '<COMMUNITY_STRING>'

polling:
  schedule:
    - every: '24h'
      task: 'discover'
    - every: '72h'
      task: 'macsuck'

workers:
  tasks: 'AUTO * 2'
4. Updating Netdisco
Bash

sudo -iu netdisco
cd ~
~/bin/localenv cpanm --notest App::Netdisco
5. Troubleshooting Front-end/Backend Crashes
If the web UI is unresponsive or the database schema is out of sync:

Bash

# Stop services
~/bin/netdisco-backend stop
~/bin/netdisco-web stop

# Upgrade DB Schema (e.g., v90 to v93)
~/bin/netdisco-db-deploy

# Restart services
~/bin/netdisco-backend start
~/bin/netdisco-web start







