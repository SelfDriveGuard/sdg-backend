# ADTest_backend
这是ADTest_backend的镜像文件。
其中，Dockerfile用于docker build；由于git代码托管在云效私人仓库，需要权限pull，因此把id_rsa私钥复制到容器内。

#### Build From Docker

Run following command to pull this image.

```bash
# pull the image based on version
sudo docker pull registry.cn-beijing.aliyuncs.com/ad-test/adtest_backend:[镜像版本号]
```

#### How to run it with docker

1. Run ADTest_backend

   ```sh
   # On Linux system
   docker run -it --network="host" registry.cn-beijing.aliyuncs.com/ad-test/adtest_backend:[镜像版本号]
   
   # On Windows/MacOS system
   docker run -it -p 8090-8093:8090-8093 registry.cn-beijing.aliyuncs.com/ad-test/adtest_backend:[镜像版本号]
   ```
2. Run ADTest_frontend

