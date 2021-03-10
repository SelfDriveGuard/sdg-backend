# sdg-backend
这是sdg-backend的镜像文件。
其中，Dockerfile用于docker build。

#### Build From Docker

Run following command to pull this image.

```bash
# pull the image based on version
sudo docker pull selfdriveguard/sdg-backend:[version tag]
```

#### How to run it with docker

1. Run sdg-backend

   ```sh
   # On Linux system
   docker run -it --network="host" selfdriveguard/sdg-backend:[version tag]
   
   # On Windows/MacOS system
   docker run -it -p 8090-8093:8090-8093 selfdriveguard/sdg-backend:[version tag]
   ```
2. Run sdg-frontend

