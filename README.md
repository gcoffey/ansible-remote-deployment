# ansible-remote-deployment

A suite of services that enable servers to be bootstrapped for configuration management using Ansible.

The services currently comprise:-

ARDA - Ansible Remote Deployment Admin - Very much a work in progress. 
The goal is to track Ansible runs against clients by providing an API that clients can push to at the end of an Ansible run.
The data would then be made available via web interface to allow System Admins to see run status at a glance. 

ARDE - Ansible Remote Deployment Executor - It does just that, it listens for jobs entering a queue (kue + redis),
then executes an Ansible playbook against the client. JSON data provided by the client is stored with the job record
and used to populate playbook arguments.

ARDS - Ansible Remote Deployment Scheduler - The scheduler provides an API that clients push JSON data to, this data
is then used to create a build job which then gets popped in the queue (kue + redis). The scheduler also serves 
assets such as an Ansible user public key & a bootstrap script.
