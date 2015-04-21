# ansible-remote-deployment

A suite of services that enable servers / desktop machines, to be bootstrapped, configured & managed using Ansible.

The suite consists of 3 components:-


ARDA - Ansible Remote Deployment Admin - A web UI and control interface to allow the tracking of current deployments, the execution of new deployments and the management of server / desktop machines. An API will be exposed to allow server / desktop machines to interact with during Ansible execution.
The end goal is to provide a UI that users can interact with and an API that Ansible playbooks can POST data to.


ARDE - Ansible Remote Deployment Executor - ARDE watches a message queue, when a job enters the queue, the job data is extracted and the client details are then used to execute a playbook.



ARDS - Ansible Remote Deployment Scheduler - ARDS provides an API that accepts POST data, in JSON format, from server / desktop machines. ARDS can only accept data sent from the machine that is to be bootstrapped / configured.
Once data has been checked, a job is created and placed into the build queue (based on kue+redis). 
ARDS can host static content such as bootstrap scripts & public keys that can be used, for example, during the OS installation process.

