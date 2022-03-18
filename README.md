# TTDS Group Project

## Team Members

- Youguang Zhou (s2201023)
- Yitian Wang (s2171454)
- Haochen Qin (s2255142)
- Ruoyi Yu (s2181173)
- Hongyan Deng (s2193724)
- Huajian Zhang (s2227123)

## Quick Start

### Frontend

Make sure you have Node and npm installed, then run:

```
cd frontend && npm install && npm start
```

`cd frontend`: get into [frontend](frontend/) folder

`npm install`: install all required dependencies

`npm start`: start dev sever at http://localhost:3000

### Backend

Make sure you have Python3 and pip installed, then run:

```
cd backend && pip install -r requirements.txt && python manage.py runserver
```

`cd backend`: get into [backend](backend/) folder

`pip install -r requirements.txt`: install all required dependencies

`python manage.py runserver`: start dev sever at http://localhost:8000

## Deployment

- Pull latest files: `git pull origin main`
- Build frontend: `cd frontend && npm run build`
- Check nginx status: `service nginx status`
- Stop the original apache2 process: `fuser -k 80/tcp`
- Start nginx: `service nginx start`
- Check uwsgi status: `ps -aux | grep uwsgi`
- Kill uwsgi processes: `sudo pkill -f uwsgi -9`
- Start uwsgi: `uwsgi backend/server/uwsgi.ini`
