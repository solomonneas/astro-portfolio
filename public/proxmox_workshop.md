https://netlab-docs.netdevgroup.com/install/deploy_netlab_vm/



Day 1 chat

# Proxmox Workshop for NETLAB+ Admins - Chat Transcript

**Date:** July 8, 2025  
**Duration:** 4:01:27  
**Shared screen with speaker view**

---

## Chat Messages

### Storage and File System Discussions

**Brian Kirsch (56:20):** Can you leave both environments running for Scenario 2 until you get everything running or is that actually Scenario 3?

**Allen Luck (57:38):** Will Proxmox operate with resource sharing (clustering), or is each user server going to work independently of one another?

**Michael Barkdoll (58:25):** By default does this use Ceph?

**David Hicks (58:27):** Recommended file systems? CEPH for clustering?

**David Hicks (01:02:14):** What are your recommendations for Hardware RAID Controllers? Use them or use as HBA?

### Storage Configuration

**David Hicks (01:19:29):** For storage, we have smaller drives because we use the fault tolerance of the raid controller with VMware. Should we continue to do this with proxmox? We had also planned to use ZFS, but that doesn't sound like it's supported by NDG. Can you discuss these options and recommendations a little more?

**Cory Kleman (01:27:24):** 15 TB drives are the minimum for the mgmt. server?

**Cory Kleman (01:29:50):** We have 5 TB drives currently on our HP Servers and have not taxed them at all or come near capacity. Can we assume we will can continue to use our current drives without upgrading?

**Steven Romero (01:31:32):** All of our drives are SAS SSD, we should use those for backup now and get all new nvme?

### Hardware and SAN Discussion

**Chris Scotto (01:32:14):** We are running our vSphere environment on HPE Blades connected to HPE 3Par SAN. Will this hardware be supported when we migrate to proxmox?

**William Atkinson (03:56:01):** Steven, iSCSI SANs will work under Debian Linux- however, setting up iscsid can be extremely confusing, especially if you have security configured on the SAN.

### Network Configuration

**Allen Luck (02:33:39):** Resolvable externally correct?

**Tom Pearson (02:36:19):** Our Network team only allows access to the Netlab server from outside. We must use VPN to connect to the netlab infrastructure servers.

**Will (02:42:35):** I am a little confused on the fqdn. You are talking about proxmox being accessible from the outside correct?

### Setup and Installation

**Mark Verhoeven (02:40:54):** All installed.

**Mark Verhoeven (02:43:46):** Ours is not able to be accessed outside. We are on our own VLAN, which I can only reach from either the server room or a port in my classroom.

### Storage Architecture

**Michael Barkdoll (03:59:13):** They explained the RAID controller becomes a bottleneck.

**Will (04:07:17):** ....but if you are doing raid, that goes back to the controller being the issue again.

**Michael Barkdoll (04:09:20):** This is why CEPH is more efficient it uses a clusters nodes CPU for their algorithm. Very resource intensive and expensive.

**William Atkinson (04:01:52):** Our management server (SR630 v2) was originally shipped with 2x NVMe drives in a RAID 1 array for boot, and it has 8 SAS hard disks in a RAID array (RAID5 or RAID6) with two hot-spare disks (6 member drives + 2 hot-spares). Would you recommend leaving that hard disk RAID in place as-is, or dismantling it and turning it into an 8-wide ZFS RAIDZ2/Z3 array?

**David Hicks (04:04:24):** They said they don't support ZFS.

### GPU and Passthrough

**Michael Barkdoll (04:36:34):** I'm new to NETLAB but I'd assume we can passthrough the GPU for custom labs?

**Steven Romero (04:39:35):** If you want to passthrough a GPU to a single VM, not too bad, but if you're trying to share it with multiple VMs, that's when you have to pay for the drivers from Nvidia.

**Ryan Hoffman (04:38:32):** We have a virtual GPU in our host with licensing, but we did it with VMware. Is it doable in Proxmox?

### Networking - OVS and Switches

**William Atkinson (05:09:30):** What (dis)advantages do OVS switches/bonds have in comparison to Linux switches/bonds?

**Michael Barkdoll (05:10:09):** OVS is OpenvSwitch powers SDN

**Tom Pearson (05:10:25):** Open vSwitch supports advanced network capabilities like a flow-based architecture, efficient packet processing and prioritization, as well as more detailed control of your outgoing and internally trafficked data.

**William Atkinson (05:15:01):** I've also found that you can create a bridge and not attach it to hardware interfaces- for example, if you were running a firewall as a virtual machine and you wanted to put pods/VMs behind it.

### Networking Configuration

**William Atkinson (05:15:01):** I've got an OPNsense VM running on our main VM server. The WAN side of it is attached to our local network, and the LAN side connects to a vSwitch, and then any pods that we want to give Internet access to get attached to the same vSwitch.

### Documentation and Training

**Rick Barnes (59:20):** Can we get a link to the document

**Alex Zaugg (59:52):** https://netlab-docs.netdevgroup.com/doe/vmi/

**Hasan Bilal (59:55):** https://netlab-docs.netdevgroup.com/

**NDG Support (02:24:16):** https://portal.netdevgroup.com/learn/pve8-aa0-training

**NDG Support (02:24:29):** https://portal.netdevgroup.com/learn/pve8-sm-training

### Closing Comments

**Mark Verhoeven (05:44:07):** Great session today, thanks for doing this.

**Jeff Scott (05:44:14):** Thanks everyone!

**Michael Barkdoll (05:44:26):** Thanks for accepting our torture.

**William Atkinson (05:48:41):** See y'all tomorrow :-)

---

## Key Topics Covered

- Storage configuration and file systems
- RAID vs. HBA configurations
- Ceph clustering options
- Proxmox clustering and management
- Network configuration and FQDN setup
- GPU passthrough capabilities
- Open vSwitch (OVS) networking
- Migration from VMware to Proxmox
- Hardware requirements for management servers
- Backup and disaster recovery strategies
- Virtual firewall (OPNsense) integration

## Participants

Participants included NETLAB+ administrators from multiple institutions discussing deployment strategies for Proxmox virtualization platform to replace existing vSphere/VMware environments.


Day 2 Chat:

| Time    | User              | Message                                                                                                 |
| ------- | ----------------- | ------------------------------------------------------------------------------------------------------- |
| 0:55:41 | NDG Support       | https://portal.netdevgroup.com/learn/pve8-sm-training/                                                  |
| 0:56:39 | NDG Support       | https://portal.netdevgroup.com/learn/pve8-aao-training/                                                 |
| 0:57:06 | Xiaomao Liu       | I agree. Lets have on-site sessions.                                                                    |
| 1:00:28 | NDG Support       | NDGlabpass123!                                                                                          |
| 1:05:47 | Kelly Niemela     | We've created a proxmox datacenter for a different server for our AI program. I;m wondering, when we... |
| 1:09:44 | Kelly Niemela     | Much appreciated, thank you! We were discussing the pros and cons yesterday                             |
| 1:11:27 | Will              | I believe yesterday that they talked about how they are modifying elements in hirarchy, priority etc... |
| 1:12:10 | Jenn M.           | is server1 the management server? and if so, do you always add this server to the cluster first?        |
| 1:12:20 | Kelly Niemela     | Thanks Will! I missed a bit of the session yesterday for a call                                         |
| 1:12:50 | Will              | Real live intrudes way too often doesn't it?                                                            |
| 1:13:03 | Jenn M.           | ah, ty for the clarification. my uni doesn't have that many servers to dedicate. :)                     |
| 1:13:14 | Kelly Niemela     | Critical things always break at the perfect time hah                                                    |
| 1:13:20 | Jenn M.           | ty                                                                                                      |
| 1:14:09 | Will              | He also said yesterday that the reason they did the voting stats was to overcome some of the proxmox... |
| 1:17:56 | Shannon Norris Jr | Will NDG transition to Proxmox Datacenter Manager (PDM) vs using clustering once PDM is out of beta?    |
| 1:32:26 | Will              | Pretty direct. No problems.                                                                             |
| 1:32:43 | Cory Kleman       | Stupid question....when we convert to proxmox will we need physical access to the servers or can it ... |
| 1:33:58 | Will              | I would think initial install on the server. Basic ISO or USB install of proxmox.                       |
| 1:34:27 | Josh G.           | xClarity controllers for Lenovo.                                                                        |
| 1:35:48 | Will              | Yup, yup                                                                                                |
| 1:36:44 | Will              | IPMI, good thing to have VERY segmented from the rest of the network.                                   |
| 1:37:20 | Josh G.           | We configure ours on a separate subnet completely.                                                      |
| 1:37:35 | David Hicks       | OOB - out of band network                                                                               |
| 1:37:39 | Will              | How often and quickly are updates done on the IPMI?                                                     |
| 1:37:49 | Will              | :-)                                                                                                     |
| 1:38:10 | Will              | Risk, vulnerability, all the pesky stuff.                                                               |
| 1:39:12 | Jeff Scott        | Might be a question for Jason. Can we use 2 3.84TB U.2. Drives if we are using smaller number of lab... |
| 1:42:21 | Jeff Scott        | I can wait. Didn't mean to break the flow                                                               |
| 1:47:04 | Will              | Why are you including RAM?                                                                              |
| 1:48:23 | Will              | Ah, so the machines start faster.                                                                       |
| 1:49:16 | Will              | Reduces time for client machines to start in the portal I would guess.                                  |
| 2:05:34 | Allen Luck        | Quick Comment: For those that are doing the labs and following along in the portal, for the next wor... |
| 2:06:31 | Michael Barkdoll  | Which lab are we spinning up now? Sorry in two meetings trying to follow along.                         |
| 2:12:23 | Will              | Tape backup is still huge                                                                               |
| 2:12:27 | Mark Verhoeven    | LTO tape backup.                                                                                        |
| 2:12:36 | Will              | Data is the new oil                                                                                     |
| 2:13:06 | Will              | IBM has an entire division here in Tucson that is based upon disk to tape solutions.                    |
| 2:13:22 | Mark Verhoeven    | Tape is forever, long term storage. It can last 100+ years.                                             |
| 2:13:24 | Will              | Visa and the like                                                                                       |
| 2:14:48 | Will              | https://www.ibm.com/solutions/tape-storage                                                              |
| 2:25:43 | Michael Barkdoll  | Oh we needed root@pam                                                                                   |
| 2:28:38 | Jenn M.           | yup                                                                                                     |
| 2:28:43 | Mark Verhoeven    | sounds good                                                                                             |
| 2:28:44 | Allen Luck        | Yep!                                                                                                    |
| 3:02:58 | Allen Luck        | FYI: The Agenda Screen is still being shared                                                            |
| 3:03:04 | Jeremy Hoffmann   | Screen share is not visible                                                                             |
| 3:03:10 | Jeremy Hoffmann   | Thanks allen                                                                                            |
| 3:15:30 | Michael Barkdoll  | Are RAW disks supported by NETLAB+?                                                                     |
| 3:16:55 | Xiaomao Liu       | raw and virtual disks are not mixed usually.                                                            |
| 3:18:27 | Michael Barkdoll  | In NETLAB+ docs is says it provides 10% performance boost.                                              |
| 3:18:37 | Michael Barkdoll  | So, I thought it might be supported.                                                                    |
| 3:18:51 | Will              | I think you want qcow if you want to do snapshots etc.                                                  |
| 3:19:09 | Will              | qcow is optimized for what they are doing.                                                              |
| 3:19:28 | Michael Barkdoll  | Some labs would get a performance gain if they were long term I was thinking.                           |
| 3:19:42 | Will              | I would think anything else might throw off scripts etc.                                                |
| 3:20:40 | Will              | qcow also allows for thin provisioning.                                                                 |
| 3:21:01 | Michael Barkdoll  | a very demanding lab :)                                                                                 |
| 3:24:52 | Will              | Before you get too far from CPU a good read is: https://pve.proxmox.com/pve-docs-7/chapter-qm.html#q... |
| 3:28:49 | Will              | Sorry, did not mean to throw off the flow. Just know there is a difference between virtual cores dif... |
| 3:37:23 | Will              | I didn't quite catch, how are VM isolated from each other, or are they?                                 |
| 3:37:44 | Will              | If they are all set to the same bridge...                                                               |
| 3:39:42 | Will              | Ah, gotcha. Do those show in proxmox?                                                                   |
| 3:40:30 | Will              | Yeah, that's why I was wandering how it was going to work with prox                                     |
| 3:43:33 | Michael Barkdoll  | Good old cloud-init...                                                                                  |
| 3:44:00 | Will              | Found it! https://netlab-docs.netdevgroup.com/npd/autonet_directives/#pod-auto-net-host-setup-suppor... |
| 3:52:45 | Rick Barnes       | trusted=yes                                                                                             |
| 4:04:27 | Allen Luck        | LAB 5A?                                                                                                 |
| 4:04:42 | Tom Pearson       | 5a                                                                                                      |
| 4:04:42 | Michael Barkdoll  | Lab 05A: Deploying Virtual Machines                                                                     |
| 4:04:47 | David Hicks       | Proxmox VE 8: AAO                                                                                       |
| 4:05:24 | Allen Luck        | Ah, it's duplicated with different lab numbers                                                          |
| 4:06:03 | Tom Pearson       | Setup and Management 5a                                                                                 |
| 4:06:32 | Josh Kretzschmar  | Is there a link to the Advanced course? It doesn't show up in my courses.                               |
| 4:06:47 | David Hicks       | https://portal.netdevgroup.com/learn/pve8-aao-training/                                                 |
| 4:06:49 | Allen Luck        | For laughs and giggles, I tried to initialize Lab 9A, but am getting an error starting                  |
| 4:07:10 | Allen Luck        | "An error occurred. Please try again later"                                                             |
| 4:07:22 | Allen Luck        | Ah                                                                                                      |
| 4:28:44 | Steven Romero     | Was there any delay with using VNC like there used to be? Like a trailing cursor?                       |
| 4:29:24 | Ryan Hoffman      | Just saw this "With additional packages, VirGL can also support 3D graphical acceleration capabiliti... |
| 4:32:46 | Michael Barkdoll  | RHEL no GUI boot debugging very useful                                                                  |
| 4:35:22 | Michael Barkdoll  | Those NVMe's be burning hot                                                                             |
| 4:40:16 | Michael Barkdoll  | It worked in this lab                                                                                   |
| 4:44:54 | Ryan Hoffman      | What isn't working with the noVNC clipboard is copying from my OS to the clipboard. I can type into ... |
| 4:44:58 | Marko Uusitalo    | I tried copy and paste from ubuntu virtual machine, and I was not able to paste it to client or to m... |
| 4:45:31 | Michael Barkdoll  | You have to use the client machine to copy and paste from the client to the VM                          |
| 4:47:51 | Michael Barkdoll  | Where did you change the font size                                                                      |
| 4:48:28 | Michael Barkdoll  | Got it thank you                                                                                        |
| 4:50:00 | Allen Luck        | Yep                                                                                                     |
| 4:50:21 | Bryan Bennett     | Me too                                                                                                  |
| 4:51:15 | Allen Luck        | Just in case I do get "lucky", were were moving to 9B cor...                                            |
| 4:51:28 | Michael Barkdoll  | I'm getting innnn                                                                                       |
| 4:52:11 | Allen Luck        | Admin Tip: Set in Bios for Physical Servers to Auto Turn ...                                            |
| 4:52:14 | Michael Barkdoll  | I think someone ended all the old reservations                                                          |
| 4:52:19 | Michael Barkdoll  | Because mine auto closed                                                                                |
| 4:54:18 | Allen Luck        | Still not lucky 🙁                                                                                      |
| 4:54:47 | Marko Uusitalo    | I tested that I can copy/paste from client to ubuntu-...                                                |
| 4:55:03 | Michael Barkdoll  | You have to first paste into the clipboard                                                              |
| 4:56:45 | David Hicks       | Are there performance considerations (negative impact) f...                                             |
| 5:09:41 | Michael Barkdoll  | Worked on first time. When you select the text edito...                                                 |
| 5:10:00 | Michael Barkdoll  | Ywp                                                                                                     |
| 5:10:08 | Ryan Hoffman      | Mine was already logged in when I connected                                                             |
| 5:14:15 | Michael Barkdoll  | Hrm, couldn't get file sharing working. I'm sure I ...                                                  |
| 5:16:46 | Michael Barkdoll  | Can we use RAW file format?                                                                             |
| 5:17:41 | NDG Support       | Will NDG transition to Proxmox Datacenter Manager (PDM) ...                                             |
| 5:18:02 | Ryan Hoffman      | Is it too late to sign up for beta? If not, where do we ...                                             |
| 5:18:19 | Steven Romero     | If we opt to run a Hybrid environment until VMware exp...                                               |
| 5:18:47 | David Hicks       | What Jason mentioned... https://pve.proxmox.com/wiki/Sto...                                             |
| 5:18:48 | Josh G.           | I am still also interested in getting our institution on the...                                         |
| 5:18:51 | Steven Romero     | I'd also like the beta.                                                                                 |
| 5:19:06 | Michael Barkdoll  | Is Graphic card: VirGL GPU supported?                                                                   |
| 5:21:12 | Michael Barkdoll  | I think it just lets you use the host GPU with PV                                                       |
| 5:23:32 | Will              | I will have more tomorrow                                                                               |
| 5:23:35 | Xiaomao Liu       | I can get in now.                                                                                       |
| 5:23:36 | Will              | ;-)                                                                                                     |
| 5:24:18 | Steven Romero     | Have you guys tested any PCIe expansion cards to be ab...                                               |
| 5:24:30 | Will              | The weekend should be a whole lot of fun for all of you.                                                |
| 5:24:40 | John Stewart      | We have the pods and can possibly help                                                                  |
| 5:24:50 | Steven Romero     | Thanks!                                                                                                 |
| 5:25:02 | Steven Romero     | Dell R640                                                                                               |
| 5:25:24 | Ryan Hoffman      | We have a 640 as well                                                                                   |
| 5:26:27 | Will              | Looking forward to it.                                                                                  |
| 5:27:02 | Will              | Yes                                                                                                     |
| 5:27:08 | Joseph Jeansonne  | yes                                                                                                     |
| 5:27:56 | Jeremy Hoffmann   | It is really helpful with 2 screens ( or 3 in my case) but if you had a smaller screen it is tricky ... |
| 5:28:28 | Michael Barkdoll  | What are you doing a PhD in?                                                                            |
| 5:28:57 | Shankar Ravi      | Good luck!                                                                                              |
| 5:28:59 | Joseph Jeansonne  | I have a general net lab question… is there a mecha...                                                  |
| 5:29:45 | Joseph Jeansonne  | Trying to generate unique flags                                                                         |
| 5:29:58 | Joseph Jeansonne  | Yes                                                                                                     |
| 5:30:58 | Joseph Jeansonne  | Thanks                                                                                                  |
| 5:33:10 | Michael Barkdoll  | I was able to get copy&paste to work with spice and...                                                  |
| 5:34:41 | Michael Barkdoll  | From client vm in the pod to the spice client                                                           |
| 5:35:04 | Michael Barkdoll  | Im not sure whatever the labs demo'd                                                                    |
| 5:35:37 | Michael Barkdoll  | Oh                                                                                                      |
| 5:35:39 | Michael Barkdoll  | Gotcha                                                                                                  |
| 5:36:55 | Joseph            |                                                                                                         |

# Proxmox Workshop for NETLAB+ Admins – Zoom Chat
Date: Jul 10, 2025 09:43 AM

- **33:51 – Mark Verhoeven (MV)**  
  yes

- **33:52 – Jeremy Hoffmann (JH)**  
  yes

- **33:53 – Allen Luck (AL)**  
  Yes

- **34:03 – David Bey (DB)**  
  yep

- **34:09 – Will (W)**  
  https://netlab-docs.netdevgroup.com/

- **38:36 – Jeff Scott (JS)**  
  Is 128GB of RAM okay for Management server? We have the V1 of the Lenovo servers.

- **39:22 – Mark Verhoeven (MV)**  
  We only have two servers, so we would skip the middle server if we have real equipment pods?

- **40:07 – Jeff Scott (JS)**  
  Nice. Thanks.

- **(no name shown)**  
  Sweet.

- **41:19 – Will (W)**  
  The high iops will primarily be on the User servers, correct?

- **44:43 – Richard Smith (RS)**  
  can't wait for that to be available

- **45:29 – Will (W)**  
  Might you be working in alerting as well?

- **(no name shown)**  
  Thank you on the dev license approach. That will be very helpful.

- **52:11 – Ryan Hoffman (RH)**  
  I assume since we only have 2 servers, we should go scenario 1

- **52:50 – Andrew Linthicum (AL)**  
  So, if we do option 2, what happens to the VMs and linked clones?

- **56:20 – Will (W)**  
  You mentioned before that you had some unique tweaks that modify the proxmox norm on clustering.

- **(no name shown)**  
  kk

- **56:48 – Jeff Scott (JS)**  
  Does NETLAB need to be at v24 to migrate to v25? We are on v22 at the moment. I’m downloading v24 at the moment.

- **57:01 – Shannon Norris Jr (SN)**  
  i have a silly question that's been on my mind. I don't see us purchasing new hardware and we've been using shared storage (fiber channel) for our environment for years. What if attaching say two 15TB LUN (just throwing out a number) to each host. SO it would look "local" to the hosts. In your opinion would that perform better, even though all the LUNS attached to the hosts are part of the same disk pool, perform a little better than sharing several LUNS between all of them?

- **58:18 – Allen Luck (AL)**  
  Is there a good way to just export stats from pods into a csv or something?

- **(no name shown)**  
  So we can continue with a scenario 1 (fresh install) instead of a migration?

- **01:00:18 – Cory Kleman (CK)**  
  What is the drawback of scenario 2?

- **(no name shown)**  
  It is a pain for us to get physical access to our servers. Which scenario would help us not need physical access?  
  Yes

- **01:03:50 – Will (W)**  
  Over phone...that sounds painful.

- **01:04:20 – Rick Barnes (RB)**  
  Will we have access to a management pod like that

- **01:04:43 – Michael Barkdoll (MB)**  
  Was just looking at the docs it stated that all user pod traffic is isolated and proxying traffic through the NETLAB+ server. I was just curious if it is possible to put user pods on the same network as well?

- **(no name shown)**  
  No  
  I mean if I wanted people to attack each others pods in ethical hacking environment.

- **01:06:58 – Will (W)**  
  We are planning on doing the same.  
  Will you be using SDN?

- **01:15:30 – Mark Verhoeven (MV)**  
  So if we do option 2, we don't have to make any changes to the wiring side of our physical Pod setup, like linking PDUs, real routers, switches, etc.  
  We have 6, so I don't want to either.

- **01:16:55 – Richard Smith (RS)**  
  Definitely for us with about 16 cisco pods

- **01:17:01 – Mark Verhoeven (MV)**  
  Thank you, very helpful.  
  SSL Certificates, and all that will still work with option 2?

- **01:19:04 – Will (W)**  
  Nothing wrong with following your passion.

- **01:19:23 – Steven Romero (SR)**  
  Quick question - is the goal just to remove the VMs from the catalog? If so, do we need to delete from disk since we're installing a new hypervisor anyway? I ask just because I know deleting from disk as well takes a long time compared to just removing from catalog.  
  Sounds good.

- **01:35:19 – Will (W)**  
  Has proxmox been cooperative in working with you folks on finer details?  
  LOL  
  But they have been supportive.  
  Are you folks using Open vSwitch? If so does this script install that?

- **01:41:35 – Hasan Bilal (HB)**  
  Here's the Proxmox Helper scripts for those interested: https://community-scripts.github.io/ProxmoxVE/scripts

- **01:42:05 – Will (W)**  
  Agreed. Simplicity is better.

- **01:42:31 – Allen Luck (AL)**  
  What if we didn't want to disable HA, and use it for other VM's that may run on the management host; any implications you can think of?

- **01:44:08 – Will (W)**  
  In the future, PGP signing?

- **01:44:42 – Hasan Bilal (HB)**  
  I am a bit confused, apologies if I didn't hear beforehand. For existing Admin's Why would it be best to use scenario 2 if we are to delete all Vms, iSO's etc?  
  Oh, yeah that would be an issue if I had to re-configure the cisco pods, lol. Thank you.

- **01:46:29 – Mark Verhoeven (MV)**  
  I'm an old senior faculty and I create new classes in Netlab for every new class I teach. I like to start fresh.  
  I'm probably doing it the hard way

- **01:47:47 – William Atkinson (WA)**  
  The cloud is just someone else's computer...

- **01:47:54 – Hasan Bilal (HB)**  
  Another question, Will there be NDG Netlab Staff/ support members be on standby in the event we get stuck/ have issues when installing the Proxmox environment? (Knowing me It's bound to happen with my luck.

- **01:48:09 – William Atkinson (WA)**  
  Yep. Remember ITS?

- **01:48:16 – Michael Lynn (ML)**  
  You should t-shirt that! The line about cloud pricing.

- **01:48:35 – Richard Smith (RS)**  
  we just had that situation this last year, until they found the cost to be 5 x our yearly cost including our upgrade pattern :)

- **01:48:38 – Hasan Bilal (HB)**  
  Whew, Thank you.

- **01:53:14 – Steven Romero (SR)**  
  Can we get away with local RAID5 SAS drives for the OS or should we go with a BOSS card with m.2 sata?

- **01:54:31 – William Atkinson (WA)**  
  So block storage and SSD TRIM don't really get alone?  
  So that does horrible things to disk space allocation...  
  It does

- **01:57:33 – Will (W)**  
  That was very helpful

- **01:58:01 – Tom Pearson (TP)**  
  I have Dell servers with 2 1.92TB SSD SATA drives. WIll this work or will I need to upgrade the drives? I only use it for Red Hat, Ethical Hacking, and a custom Forensics POD

- **01:58:02 – William Atkinson (WA)**  
  So block storage becomes a horrible LVM nightmare that requires endless digging around

- **01:59:49 – Michael Barkdoll (MB)**  
  Could you explain the networking between the servers a bit more? I see Intel X710-T4L 10GBASE-T 4-port OCP Ethernet Adapter listed as the recommended NIC on the latest server. Yesterday or the first day I think they showed MGMT, USER, CLUSTER, STORAGE traffic. I'm trying to understand where in the docs it shows to configure those networks. Do they all run over just one MGMT NIC? Sorry, been looking at the docs a bit and having a hard time finding it for some reason.

- **02:00:25 – Andrew Linthicum (AL)**  
  miserable

- **02:00:36 – Richard Smith (RS)**  
  just re-installed it

- **02:00:37 – Michael Lynn (ML)**  
  BAHHHH NOooooo

- **02:00:45 – Richard Smith (RS)**  
  had to do it the other day

- **02:00:50 – Will (W)**  
  Vcenter reninstall.....have the Tshirt

- **02:00:54 – Michael Lynn (ML)**  
  Fresh Nightmare fuel

- **02:01:12 – William Atkinson (WA)**  
  I had vCenter go down because the certs expired. Useless error messages and some Googling finally led me to the solution. CLI'd in and reset the cert chains and it came back.

- **02:01:46 – Andrew Linthicum (AL)**  
  the certs expiring suck...

- **02:02:01 – Michael Barkdoll (MB)**  
  So could i trunk 1 x 10Gbps?  
  Let's say we have 2 x 10 Gbps ports how would you set it up?

- **02:03:42 – Andrew Linthicum (AL)**  
  Is a cluster network required?

- **02:04:12 – Mark Verhoeven (MV)**  
  I have one line coming from the Schools IT to our Netlab. When people go to Netlab.school.edu it goes to that line. Is that where the management line goes?  
  ok, thank you  
  I think so kind of  
  Our servers all have 6 ports, I think 2 on each is 10 gb

- **02:06:53 – Andrew Linthicum (AL)**  
  we currently have two 10g ports on each host. We can just use 1 for management 2 for cluster?

- **02:07:02 – Mark Verhoeven (MV)**  
  We have the SR630s

- **02:07:03 – William Atkinson (WA)**  
  Duplicate VMIDs = kaboom! Just like duplicate MAC addresses

- **02:07:12 – Andrew Linthicum (AL)**  
  Not currently  
  yes

- **02:07:35 – Johnny Stewart (JS)**  
  do the Lenovo v1 have 4 10g ports?

- **02:08:10 – Michael Barkdoll (MB)**  
  Does the MGMT interface transfer the VMs?

- **02:08:13 – Johnny Stewart (JS)**  
  ok

- **02:09:28 – William Atkinson (WA)**  
  Due to client rate limiting and disk/compute overheads?

- **02:10:00 – David Hicks (DH)**  
  Can you use one 25Gb port and put the individual networks needed on VLANs?

- **02:10:36 – William Atkinson (WA)**  
  Is there any way to make PBS run multithreaded?  
  Interesting- I'd be tempted to have SSHFS mounts and then rsync across that. Because that is an \*incredible\* amount of overhead...

- **02:12:11 – Will (W)**  
  The proxmox developers have probably found themselves busier than they ever imagined.

- **02:13:03 – William Atkinson (WA)**  
  Not exactly- more along the lines of PBS itself using sshfs/rsync  
  Ok  
  Is promiscuous mode effectively "the switch is a hub"?  
  (Just as long as that IP address is RFC1918 and no gateway is set)

- **02:26:40 – Will (W)**  
  Could you add that to the documentation  
  For emphasis

- **02:27:26 – Michael Barkdoll (MB)**  
  "Cluster Network that will be used for cluster communication and virtual machine cloning/migrating" -- Sorry, so what exactly is the difference between MGMT network and cluster network transferring VMs?  
  https://netlab-docs.netdevgroup.com/vmi/proxmox/install/setup_networking/#create-cluster-network  
  It is just a bit confusing for be coming from cloud platforms.

- **02:28:49 – Cory Kleman (CK)**  
  We had NDG on site to configure our system. Would they have configured the idrac IP or documented the settings somewhere?

- **02:28:50 – Michael Barkdoll (MB)**  
  for me\*

- **02:29:41 – Cory Kleman (CK)**  
  No easy way to remotely find that either I am guessing

- **02:29:43 – Michael Barkdoll (MB)**  
  MGMT typically doesn't do the vm transfer there so you'd think it was cluster/storage but appreciate the docs.  
  Perfect

- **02:31:40 – Ryan Hoffman (RH)**  
  That would be good

- **02:31:41 – David Hicks (DH)**  
  Yes

- **02:31:43 – Josh G. (JG)**  
  Break good.

- **02:31:46 – Allen Luck (AL)**  
  When is a lunch break?

- **02:32:04 – Michael Barkdoll (MB)**  
  in 15 mins  
  for 30 mins

- **02:32:09 – Ryan Hoffman (RH)**  
  30 mins around now

- **02:32:59 – Cory Kleman (CK)**  
  Is there a way to remotely find the idrac IP Address?

- **03:03:30 – Mark Verhoeven (MV)**  
  Here and ready to go

- **03:03:45 – Cory Kleman (CK)**  
  Is this afternoon the actual walk-through of the processes?  
  This will all be recorded also?

- **03:05:46 – Mark Verhoeven (MV)**  
  Our Netlab states: System is up to date. Current software version 22.8.7 is the latest.  
  Lost me at Database Migration, that sounds scary.  
  OK ty

- **03:10:05 – Hasan Bilal (HB)**  
  It shows on my end that 24.0.1 is the latest. I'll need to contact support for the latest update? Would there be any issues if I migrate from not the latest version?  
  Yes sir, thanks

- **03:14:05 – Kelly Niemela (KN)**  
  So sorry, I missed the answer to Hasan's question. We're on 22.8.7. Any update required before we migrate?  
  Thank you!

- **03:17:40 – William Atkinson (WA)**  
  Doesn't the VirtIO driver stack have the highest performance and lowest overhead compared to all the others?  
  And then when we move custom pods over with Windows VMs, we'll need to boot to WinRE and inject the VirtIO driver into the Windows install to successfully boot said VM?  
  Ok  
  Does guest-trim help with TRIM and reduce the raw size of the disks in the event of a move?  
  Ok  
  We're on 24.0.1 on ESXi- any updates required to move to Proxmox?  
  Sounds good. I was out doing some things so I missed that part.

- **03:25:56 – Hasan Bilal (HB)**  
  When I check for updates on 24.0.1, It tells me I am on the latest.  
  Oh, my bad. Thank you.

- **03:26:44 – William Atkinson (WA)**  
  We've got a temporary/staging Proxmox host- can we move the VM to Proxmox after doing the 24.1.0 upgrade, and then upgrade to 25.0.0, install Proxmox on our management server, and then move the VM back to the real management server?  
  Sounds good! I've been slowly migrating our custom pod VMs to our staging host in the past couple weeks, so we're well equipped for that  
  If we're part of the beta, when can we contact support to start the migration?  
  Sounds good

- **03:29:13 – Hasan Bilal (HB)**  
  How do we get on the beta list?

- **03:29:39 – Kelly Niemela (KN)**  
  We can't do our upgrade until the end of the semester as it's in use this summer. We're hoping to to migrate between the week of Aug 18 to Sept 2. Should we sign up for the beta? Or will it be ready by then?  
  VMware is expiring Aug 31 :(  
  Yeah, I was thinking hold off but just curious about the timelines  
  Is this something we can do in a day or two?  
  We are fast :)  
  That's a great idea. We email support for that?  
  Yeah, we have a few custom pods. Persistent ones as well

- **03:32:39 – Steven Romero (SR)**  
  How long did it take you to convert your environment? I assume this can be done over a weekend, even with custom pods.

- **03:32:48 – Kelly Niemela (KN)**  
  Thank you!  
  Which part of the documentation has the prep we can do now, sorry?

- **03:33:12 – Hasan Bilal (HB)**  
  Classes start August 21 Licenses expire August 30th I'm in a bit of a pickle, I hope the conversion process is fast. I don't have any custom pods.

- **03:33:29 – Kelly Niemela (KN)**  
  Kk most excellent!

- **03:33:31 – Johnny Stewart (JS)**  
  same at Polk

- **03:33:38 – Allen Luck (AL)**  
  Is there a place we can confirm we requested beta access?  
  I believe I did when it first came out, but I haven't heard anything in a long time and would like some peace of mind :)

- **03:35:06 – Richard Smith (RS)**  
  So glad our timeline is slightly different, finish semester 3 mid August and start semester 1 in the middle of September

- **03:35:38 – Mark Verhoeven (MV)**  
  but if we only have one mgt server and one host server, we can't run both right?

- **03:45:52 – Hasan Bilal (HB)**  
  Jason, Sorry for the long question: Is there a Netlab Admin Training/ guide that will happen in the near future? I am a relatively New Admin, New to Netlab, and would like to do more for my college and Utilize Netlabs to it's fullest. Such as I am not aware of the backend to run scripts, where to run it, how to run them to make multiple vms, etc.  
  It would be most appreciated it I could join one of your sessions to understand Netlabs more often. Thank You.

- **03:49:22 – Josh G. (JG)**  
  That change sounds really good.  
  Looks good.

- **03:50:52 – Kelly Niemela (KN)**  
  Looks good

- **03:50:53 – Ryan Hoffman (RH)**  
  yes

- **03:50:57 – David Bey (DB)**  
  yes

- **03:56:53 – William Atkinson (WA)**  
  My calculations showed a bit over 15Gbps

- **04:04:28 – Michael Barkdoll (MB)**  
  Yes

- **04:04:30 – William Atkinson (WA)**  
  Yes

- **04:04:30 – Ryan Hoffman (RH)**  
  yes

- **04:04:35 – Will (W)**  
  Yup.

- **04:05:56 – Hasan Bilal (HB)**  
  Regarding the Netlab VE , after it is fully setup, Will we use a helper script to keep a backup copy in the event it does have issues later on? What do you suggest we do to keep a backup copy just in case?  
  Correct

- **04:07:47 – Will (W)**  
  Nope

- **04:07:48 – Hasan Bilal (HB)**  
  Thank you, I hope to see it in the documentation.

- **04:11:56 – Richard Smith (RS)**  
  Do we have to redo the agreement or will the old one carry over?

- **04:11:59 – William Atkinson (WA)**  
  If we're already set up for access to pods with a prior completed CSSIA agreement, will those be available on Proxmox or will we need to fill out a new agreement?  
  Ah ok  
  That's a lot nicer than having to download the VMs from the CSSIA Synology NAS and its horribly unstable network connection  
  I actually had to write a Bash script that automates it because it was THAT unstable

- **04:18:26 – Johnny Scott (JS)**  
  does that copy it to all host with the Netlab1 storage

- **04:22:24 – William Atkinson (WA)**  
  We increment by 100s for different pod types. Pod 1000 would be the master, and 1001-1016 (or however many user pods there are) are the user pods, and then Pod 1100 would be a master pod for a different pod type, and so on  
  Ok

- **04:25:35 – Hasan Bilal (HB)**  
  What is the importance of a template pod?  
  Oh, I see. Thank you

- **04:28:45 – Will (W)**  
  On the networking will you see a slew of automated bridges?

- **04:30:04 – William Atkinson (WA)**  
  Organized digital chais

- **04:31:56 – Michael Barkdoll (MB)**  
  When we do linked clones from the full template on the host do we have to do that for each pod that will run or are these dynamically allocated as needed later? Just curious how that process is managed?

- **04:31:59 – Hasan Bilal (HB)**  
  If I may ask, Can you demonstrate how to clone pods via script as you mentioned?  
  Yes sir

- **04:34:25 – Michael Barkdoll (MB)**  
  Yeah, I just need to review the docs

- **04:35:38 – Josh G. (JG)**  
  Can you convert the template back into a VM?  
  Yeah, that was all I could do-- and it made keeping IDs a pain.  
  Thank you for that explanation!

- **04:38:39 – David Hicks (DH)**  
  Is there a PCIe 5.0 x16 NVMe adapter that you'd recommend?

- **04:38:46 – Will (W)**  
  Where do we get the guide?  
  Missed that  
  Yes PDF  
  Ahh  
  I'm good

- **04:41:04 – Steven Romero (SR)**  
  the pacing is good

- **04:46:40 – Xiaomao Liu (XL)**  
  NDG not functional since last august due to VMware license issues. nothing is accessable now. Better to start fresh?

- **04:47:10 – Kelly Niemela (KN)**  
  Just a bit of a side question. You mentioned we can start to prepare our custom VMs now. We don't have a spare server at to deploy proxmox before we do the actual migration. Is there anything we can do now or is proxmox required to prep?

- **04:47:32 – Xiaomao Liu (XL)**  
  thanks. yes.

- **04:47:53 – Travis Sellers (TS)**  
  If hosts CPU will be the same, but management server CPU will different should we use x86-64-v2-AES?

- **04:48:49 – Michael Barkdoll (MB)**  
  E.g., Win XP they suggested yesterday.,

- **04:48:49 – Travis Sellers (TS)**  
  yeah thanks

- **04:49:29 – Xiaomao Liu (XL)**  
  We use a 2TB ssd for OS and SAS RAID 5 for VMs. Can I do the same for proxmox?

- **04:52:44 – Michael Barkdoll (MB)**  
  Just a suggestion, it might make sense to have different management server specs based upon the number of pods?

- **04:53:47 – Xiaomao Liu (XL)**  
  Does Dell R630 support NVMe like what mentioned earlier?

- **04:59:35 – Kelly Niemela (KN)**  
  :)  
  I am she  
  I feel you hah  
  Most excellent, thank you Jason! I have another competing project at the end of August and I am a dept of 1.5. So anything I can do now will help a lot

- **05:00:44 – Michael Barkdoll (MB)**  
  The new MGMT server recommends 256 GB of RAM. The previous server recommended 128 GB. If were just running 16 pods what is minimum ram you'd want on the MGMT server? It just seems 256 GM seems excessive, but I don't know all the process work you have going on there.  
  Yes, thanks.

- **05:04:33 – NDG Support (NS)**  
  May have missed this ... I've been asked what environment to use for custom development. I've tried both VMware Pro and Virtual Box and then import, but that means a lot of tweaking on Proxmox. I've thought about using a Proxmox instance (that could be a VM inside of VMware/Virtual Box) and then develop directly on Proxmox. Your thoughts?

- **05:04:58 – Michael Barkdoll (MB)**  
  Fun Fun...  
  Does PODS allows vested VMs inside the VMs?

- **05:11:00 – Jeff Scott (JS)**  
  I’m using a minisforum MS-01 as a proxmox server at the house. It’s a great system for this. My main windows system is a Proxmox VM I RDP into.

- **05:15:29 – William Atkinson (WA)**  
  I know that with at least OPNsense, rules aren't mapped directly to interfaces- you can assign physical interfaces to aliases (WAN/LAN/OPT1/etc), so physical interfaces being renamed doesn't break any existing rulesets.  
  Pretty much a simple export/import.  
  With Windows 11, the CPU \*MUST\* be set to Host. Windows VMs will NOT boot unless the VirtIO drivers were previously installed or you boot to WinRE and inject the VirtIO disk drivers that way.

- **05:19:03 – Michael Barkdoll (MB)**  
  Will code for pods.

- **05:20:35 – William Atkinson (WA)**  
  I also like to snapshot custom VMs as soon as they're imported- if the initial boot somehow causes the VM to blow up or the post-import work breaks the VM, it avoids having to re-import the VM from scratch.  
  Can VMs be backed up to PBS while they're live?

- **05:23:05 – Hasan Bilal (HB)**  
  Question: how can I utilize Netlabs to run on 3 nodes and have HA configured so say if 1 node goes down, it auto uses another node (based off the vote system of 3 servers?

- **05:23:45 – Allen Luck (AL)**  
  For your Synology PBS VM: Do the backups write to your VM disk files, or does it write directly to a directory?

- **05:24:08 – Shannon Norris Jr (SN)**  
  We have some PODs that consist of 14, and 18 VM's, Also some POD VM's that have 2 disks, one with 500GB disk, the other with 200GB. Another server in the same POD, 300GB and the other the same size. We create 100's of these a term. We've tried to ask our Academic department to reduce the size of these. But, how is the cloning performance of Proxmox vs vSphere? We do and will continue to use shared storage (fiber channel).

- **05:25:22 – Saem Lee (SL)**  
  We have Synology

- **05:26:03 – Allen Luck (AL)**  
  Exploring options of a VM on a synology or qnap, or going a container route; wondering if you directly mount into the PBS VM, or its mapped within the PBS VM

- **05:26:55 – Steven Romero (SR)**  
  If using an older R720 for PBS, do you add it to the cluster?  
  Yeah.

- **05:27:19 – Allen Luck (AL)**  
  Based off your setup, it looks like the backups are writing to your PBS disk files then. Thanks

- **05:31:39 – William Atkinson (WA)**  
  Is there a way to configure backup jobs for non-PBS backup endpoints?

- **05:34:42 – Will (W)**  
  Have you had disscussions with proxmox if they are resolved to keep a community version?

- **05:34:58 – William Atkinson (WA)**  
  Ok

- **05:35:25 – Will (W)**  
  Free

- **05:35:49 – Shannon Norris Jr (SN)**  
  I may have missed it, did you answer my question above?

- **05:36:03 – Josh G. (JG)**  
  You'll need to change the repositories if you plan on using the non-enterprise features. It comes pre-loaded to access those repos for updates.  
  Oh, shoot-- that's awesome. :)

- **05:37:03 – William Atkinson (WA)**  
  Just need to modify /etc/apt/sources.list

- **05:37:47 – Shannon Norris Jr (SN)**  
  yes we are

- **05:40:25 – William Atkinson (WA)**  
  We use persistent VMs sparingly- usually only in select usecases where we need the pods to retain their state between sessions

- **05:41:21 – Steven Romero (SR)**  
  We're using persistent pods as well for a server class; I was hopeful that at some point we could do differential snapshots to load vm lab states that are consistent where they should be at in the semester.

- **05:41:40 – William Atkinson (WA)**  
  Can one script automatic snapshotting of VMs?  
  Read and write amplification- it's a performance killer for sure  
  I've heard about extreme write amplification absolutely burning through solid-state storage

- **05:46:15 – Travis Sellers (TS)**  
  Earlier you had talked about using file storage over block because of file cleanup. With a NVMe SAN would it be best to stick with file level by going NFS or iSCSI disk with Directory on top of the iSCSI disk?  
  yeah no local, but we have a NVMe SAN  
  currently that runs our netlab  
  ok sounds good  
  that would be really helpful

- **05:49:21 – William Atkinson (WA)**  
  Not really- storage system design is something of a hobby of mine

- **05:49:36 – Will (W)**  
  It's awesome. Well done.

- **05:49:41 – William Atkinson (WA)**  
  It's something really interesting to think about

- **05:49:50 – Ryan Hoffman (RH)**  
  Very good workshop. Thanks!

- **05:49:53 – Michael Barkdoll (MB)**  
  I guess I drink from firehoses everyday because this felt like a day off.

- **05:50:03 – William Atkinson (WA)**  
  Our old disk shelf was actually called Firehose

- **05:50:05 – Allen Luck (AL)**  
  Where can we confirm we're on the list for beta? Email NDG Support?

- **05:50:07 – Steven Romero (SR)**  
  Were you able to test adding the PCIe m.2 card in an R640 that you mentioned yesterday? I'm going to need to do that to add NVMe support.

- **05:50:44 – Xiaomao Liu (XL)**  
  great but may have all kind of headaches when doing the real work. any help will be appreciated.

- **05:50:45 – Will (W)**  
  It's hard because I think you have different levels of background. You need to keep at least one of the days firehose and open question like this one.

- **05:50:52 – Richard Smith (RS)**  
  Some real good information, speed was fine and can understand you and Bill better than Rich :)

- **05:51:04 – Hasan Bilal (HB)**  
  The ride had just started, we still have 2 more workshops left, lol.

- **05:51:36 – Travis Sellers (TS)**  
  Understandable

- **05:52:19 – Patrick Murphy (PM)**  
  Hi, Ive been following along. I inherited a system running on some older Lenovo System X 3550 M5 servers. I'm guessing from what I am hearing that these servers are too outdated to run Proxmox. Our requirements are pretty simple, we are a small college and basically using Cisco PODS (10) and some Linux PODs for one course. No more than 10 - 15 pods in use at a time.

- **05:53:17 – William Atkinson (WA)**  
  I think we're sub-40ms latency- flat switching to the router core, and then it's fiber all the way out to the upstream IXP

- **05:53:37 – Jeff Scott (JS)**  
  @Patrick you may be better off on Proxmox

- **05:54:36 – Shannon Norris Jr (SN)**  
  Do you have a guide outlining the recommended maximum configuration for POD deployments? Additionally, We'd like to schedule some time to review our current setup and explore how we can optimize POD configurations and implement appropriate limitations.

- **05:55:39 – Patrick Murphy (PM)**  
  Currently running VMware 8 and no issue

- **05:55:41 – William Atkinson (WA)**  
  Patrick, we've got a Dell PowerEdge R620 that's running Proxmox as a staging/test host (16C/32T with 144GB of RAM) and it runs everything acceptably well

- **05:56:17 – Steven Romero (SR)**  
  Can you recommend a PCIe card to get for those servers?

- **05:56:31 – William Atkinson (WA)**  
  R7x0-series servers can have their PERC controllers cross-flashed to IT-mode firmware, and then you can stand up ZFS zpools on them, and they \*zip\* along very well  
  Er, PowerEdge 620/720 servers, and we're running an R710 server actually

- **05:58:30 – Patrick Murphy (PM)**  
  Thanks for the info...I may be a year before I can get newer hardware due to budget. I'm willing to load Proxmox and give it a try!

- **06:04:33 – Jeremy Hoffmann (JH)**  
  Is there an official NDG GitHub for users that we can pull some of your automations?

- **06:06:39 – William Atkinson (WA)**  
  Is Bill present in today's webinar?

- **06:07:00 – Michael Barkdoll (MB)**  
  So we have to have pods running for them to be available?

- **06:07:03 – William Atkinson (WA)**  
  Wanted to ask if you got our firewall rules

- **06:07:12 – Steven Romero (SR)**  
  I did

- **06:07:44 – William Atkinson (WA)**  
  You're welcome!

- **06:08:32 – Shannon Norris Jr (SN)**  
  Do you have a guide outlining the recommended maximum configuration for POD deployments? Additionally, We'd like to schedule some time to review our current setup and explore how we can optimize POD configurations and implement appropriate limitations.

- **06:08:49 – Mark Verhoeven (MV)**  
  I like the use of Teams in Netlab for labs. I deliver CISCO using live online zoom classes. Usually 2 or 3 students per pod. They learn from each other, plus me when they call me into their room. 5-6 pods is fine.

- **06:09:38 – Steven Romero (SR)**  
  I'll usually set up like 16 pods, and 95% of utilization is on the first 3-4 pods, so I split the pods across 4 servers, skipping by 4 to "load balance". The only thing I need to do is to random which server is pod "1" for each different pod type. It'll be nice when you can just have templates to auto create linked clones on demand based on server utilization.

- **06:12:12 – Shannon Norris Jr (SN)**  
  Can you show that in in netlab again

- **06:15:52 – William Atkinson (WA)**  
  Do y'all need some extra help getting systems migrated to Proxmox?

- **06:18:49 – Shannon Norris Jr (SN)**  
  the setting to restrict usage

- **06:21:31 – William Atkinson (WA)**  
  Ok- went looking for a careers page on the NDG website and wasn't able to find anything

- **06:21:49 – Shannon Norris Jr (SN)**  
  I thought since they were linked then they couldn't move due to persistent setup as they break

- **06:22:27 – William Atkinson (WA)**  
  Ok

- **06:22:33 – Michael Barkdoll (MB)**  
  Small often reflects better cost savings.

- **06:25:30 – Jeff Scott (JS)**  
  yep

- **06:25:30 – Steven Romero (SR)**  
  I was AE/PE  
  Well, PE.

- **06:25:36 – Richard Smith (RS)**  
  yep

- **06:25:45 – Shankar Ravi (SR)**  
  PE

- **06:25:48 – Steven Romero (SR)**  
  2?

- **06:25:51 – Jeff Scott (JS)**  
  Java Applets not for the win

- **06:26:08 – Richard Smith (RS)**  
  8 pe

- **06:26:15 – Shankar Ravi (SR)**  
  we did a 2+8

- **06:26:32 – Steven Romero (SR)**  
  Thanks! :)

- **06:27:09 – Jeff Scott (JS)**  
  lol

- **06:27:19 – Shankar Ravi (SR)**  
  it is siting around on a 710

- **06:27:34 – William Atkinson (WA)**  
  Shankar, more like a PE2850/2750

- **06:28:07 – Shankar Ravi (SR)**  
  pe 2850

- **06:29:13 – Michael Barkdoll (MB)**  
  <3 Vagrant

- **06:31:19 – Jeff Scott (JS)**  
  I remember you showing this to some of us at one of your trainings

- **06:31:23 – Tom Pearson (TP)**  
  very cool

- **06:31:50 – William Atkinson (WA)**  
  Those buggers are H E A V Y !

- **06:32:30 – Steven Romero (SR)**  
  Was that a Cat OS switch? I don't remember...

- **06:32:30 – Mark Verhoeven (MV)**  
  Thank you for this training.

- **06:32:31 – Michael Barkdoll (MB)**  
  Thank you for sharing that bit about: https://github.com/cliffe/SecGen Really appreciate that!

- **06:32:41 – Tom Pearson (TP)**  
  I managed 6509's and 4507's when I worked for Motorola back in the day

- **06:33:05 – Shankar Ravi (SR)**  
  right now having a tech stack  
  is the biggest issue

- **06:33:08 – William Atkinson (WA)**  
  I've manhandled PE2850s, those are not friendly servers to handle

- **06:33:12 – Shankar Ravi (SR)**  
  is the biggest issue

- **06:33:27 – Hasan Bilal (HB)**  
  Thank You!

- **06:33:39 – Allen Luck (AL)**  
  Awesome, thanks for everything. Recordings will be available after the last workshop session, and FAQ will be updated as they come in?

- **06:33:43 – William Atkinson (WA)**  
  Is there a way to directly message Bill in the chat here?

- **06:34:14 – Saem Lee (SL)**  
  Than you! Great training, very helpful.

- **06:34:19 – William Atkinson (WA)**  
  It just shows 'Hosts and Panelists' and 'Everyone''  
  Ok, just wanted some feedback on our firewall rules

- **06:35:03 – Josh G. (JG)**  
  Tons of info.

- **06:35:10 – Patrick Murphy (PM)**  
  Great

- **06:35:13 – Shankar Ravi (SR)**  
  we are also looking to run a class CTF and these resources are quite a good expansion option. Thank you.

- **06:35:27 – Steven Romero (SR)**  
  I have 4 R640s. To finalize, you would recommend a BOSS card for the OS in raid 1, and then PCIe for the VMs, and I can maybe use the old RAID 5 array for local backups?

- **06:35:29 – William Atkinson (WA)**  
  Very much so!

- **06:35:31 – Shankar Ravi (SR)**  
  I am going to request a quote for onsite installation for proxmox custom

- **06:35:32 – Raja Mendadala (RM)**  
  Ooh yeah

- **06:35:42 – Will (W)**  
  Proxmox is getting more and more impressive

- **06:35:47 – Steven Romero (SR)**  
  I'm looking forward to Proxmox honestly. It looks like there are more potential features we can add.

- **06:35:49 – William Atkinson (WA)**  
  We're looking to run screaming from VMware just as soon as wen can

- **06:36:23 – Hasan Bilal (HB)**  
  Jason

Workshop 1 notes:

- Support will give us a new NETLAB+ license key while we test out the beta.
- 300,000 lines of code
- NDG Support - Bill 
- Jason Zeller - 
- Once you set up your DNS for Proxmox, it will be a commitment that will be hard to change.
- Go through the labs first and get familiar with the topics.
- Stable version is 24.0.1, Beta version is 25.0.0
- Look at the green known issues before reporting in the beta.
- No VCenter in Proxmox
- Pointing all Proxmox stuff to the management server.
- Management server will have Staging POD vms, Netlab VE Pods, Netlab SDK VMs, and Proxmox backup servers.
- SDK (Software Development Kit) Python api will work with the system.
- Lenovo SR630V3 are the preferred servers.
- NOT using Ceph for clustering file systems.
- Systems will be clustered but not designed to load balance.
- Can't have master and link clones with Proxmox. That's why the 15 TB NVMe and 512-768GB RAM is ideal.
- Entirety of all NETLAB+ VMs available is ~4TB.
- You will have to delete all NETLAB catalog VMS and download all VMS again. Because there is a new distribution method f or the virtual machines.
- When you download the PODs they will go into the Staging Pod VMs in the management server.
- Proxmox you can't use two different disks for link clones.
- You want the DNS to be resolvable externally if you're using certifications. (This is what we need for the website)
- Storage directories should be named NETLAB1 and NETLAB2
- -proxmox are linux containers and dockers are more application based
- Install and use TMUX so you can keep a shell running in the background if you leave the shell or your connection gets HUPd
- Install and configure something such as APC UPS Daemon or Network UPS Tools to ensure a safe, orderly shutdown in the event of a power failure
- -Anything you can do on Debian 12 should be doable since Proxmox is basically a frontend to standard utilities
- You start with 1 virtual bridge and the names default to vmbr1


Workshop 2 Notes:

-When proxmox goes live, the VMs (OVAs) will be released from their distribution process

## Backup
- If there's a VM running, stop it before backing up

## Spice 
- They do want all VMs using SPICE as a connection so you can do copy/paste things in the future.
- You can have multiple screens for the VM with SPICE
- 2 Main packages
- Windows - it will install guest package with extra installs
- Linux- will have spice web dev package, and a few other things (?)

Jason Zeller is doing a PhD in Cyber Engineering
## Agenda  **Day 2:**
## Labs from Proxmox courses that are specific to NETLAB+ Deployment

- **Setup and Management Lab 14:** Clustering and High Availability  
- **Setup and Management Lab 10 / 11:** Backup  - Proxmox Backup Server  
- **Setup and Management Lab 5A / 5B:** Deploying Virtual Machines  
- Deploying Containers  
- What’s a Container and what’s a VM  
- What’s a LXE container vs a Docker Container


## Advanced Administration
- **Labs 9A / 9B:**  
  - Deploying Virtual Machines  
  - Deploying Containers  
    - What’s a Container and what’s a VM  
    - What’s a LXE container vs a Docker Container  

- **Lab 1A:**  
  - Importing Virtual Machines from VMware ESXi  

- **Lab 7A:**  
  - Advanced Monitoring  
    - Future NDG Implementation

Day 3 notes:

- Best to blow away everything and start from scratch and follow the guides
- Safety net is a linux bridge
- proxmox can only have one datacenter
- Moved on from "Golden Master" nomenclature to just "Golden"
- DO NOT CLONE THROUGH PROXMOX DEFAULT CLONING
- 

- With Windows 11, the CPU *MUST* be set to Host. Windows VM will NOT boot unless the VirtIO driers were previously installed or you boot ro WinRE and inject the VirtIO disk drivers that way.

- Create a PROXMOX backup server and run it as a native server with local storage
- USE OLD DELL 720 or something like that are good options as backup servers
- create a VMID pool for all the pods/labs
- Do the SM lab on how to stand up a backup proxmox server

- Jason uses a Synology server with a Proxmox backup VM running on it. PBS
- When running synology you have to change vgma to vga when creating a virtual machine in synology. 
- Add the PBS in Datacenter > Storage > Add > Proxmox Backup Server
- Snapshot backups are VZDumps 
- Key-M to PCIe Adapter Card M.@ NVME SSD Converters - To speed up older machines x2 in each server. 1x for master and 1x for link clones
- netlab-py.s3.amazonaws.com/docs/quickstart.html#installation
- for python SDK scripts
- Lookup SecGen for CTF stuff 
- github.com/cliffe/secgen
## Agenda
Day 3
**Proxmox Installation Specifics** 
- Why the script
- What does it do?
- How and when do I run?

**NETLAB+ Deployment Scenarios**
- Scenario 1: Fresh Install
- Scenario 2: VMware to Proxmox Migration
- Scenario 3: Both - Overview  
      - LIMITED USE CASE - 

- **NDG VM Distribution System**
- **Live Demo of NETLAB+ Fresh Installation**
     - Pod Deployments
     - NETLAB+ Catalog VMs
     - Real Hardware
     - Custom VMs - Game Plan -
         - **TIME CONSUMING!!!**
- **Q&A Open Forum** 

Jason Zeller - Main netlab/proxmox guy working on his doctorate

Richard Weeks - Bald NDG guy with glasses

Bill ???? - NDG Support