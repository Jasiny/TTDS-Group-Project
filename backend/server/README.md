### Reload uwsgi

- First check the running processes: `ps -aux | grep uwsgi`
- Kill those processes: `sudo pkill -f uwsgi -9`
- Apply uwsgi: `uwsgi uwsgi.ini`