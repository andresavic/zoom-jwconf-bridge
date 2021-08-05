# zoom-jwconf-bridge


### Setup and usage

##### Customize .env file 
```
cp .env.example .env
nano .env 
```

##### Build and run docker container
```
docker build -t jwconf --build-arg vnc_password=<VNC password> .
docker run -d -p 7900:7900 -p 3000:3000 --shm-size="2g" --env-file .env jwconf
```

##### Open webinterface in webbrowser

```
http://localhost:3000
```