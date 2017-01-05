# ansible-remote-deployment

Provides a simple method to trigger the execution of an Ansible playbook against any machine.

There are 4 processes...

ARDA - Admin UI
You can track the status of deployments, define machine groups & the playbooks they can run and upload public SSH keys & shell scripts. 

ARDE - Executor 
Attaches to a message queue topic and waits for new jobs, it will then execute the job. The executor can be deployed on a seperate instance, it just requires access to the message queue (ARDQ) and your Ansible playbook repository.

ARDS - Scheduler
Provides an API which servers / desktops / instances can send data, once verified it then creates a job which is pushed to a message queue topic.
The scheduler can also host static assets such as public SSH keys (to allow the executor user to connect) and shell scripts.

ARDQ - Message Queue
Provides a message queue function for the executor and scheduler. You can define a message queue topic against a machine group, this is used by the scheduler when new jobs are created. If you run multiple executors, you can pin each to a different message queue topic.


# Trigger Methods

- PXE Network Install (e.g. kickstart) - using a post-install script to trigger the API call
- AWS Autoscale (new instance is created) - injecting user-data to trigger the API call
- Cron (scheduled execution) - using a script to trigger the API call 

