## Overview

This app allows multiple users to share messages in real time.<br>
I created this App as sample due to study gRPC.<br>

## Techniques

* __Frontend__
  * __typescript 4.4.2__
  * __next.js 11.1.2__
  * __React.js 17.0.2__
  * __grpc-web 1.2.1__
  * __google-protobuf 3.18.0__
  * __eslint 7.32.0__


* __Backend__
  * __golang 1.14.0__
  * __protobuf 1.5.0__
  * __grpc-web 0.14.1__
  * __grpc 1.32.0__


* __Infrastructure__
  * __Docker 20.10.7 / docker-compose 1.29.2__

### Local Deploy

1.  git clone
```terminal
git clone git@github.com:JuneOrg2020/gRPC-Sample.git
```

2.  Move directory
```terminal
cd gRPC-Sample
```

3. Activate Docker
```terminal
docker-compose up
```

4. Access to http://localhost:3000

## Image
 Input message <br>
<img src="https://user-images.githubusercontent.com/64642177/132992981-b0825085-9f5f-467a-9d77-b6cbeb144038.png" width=600><br>
 Message was posted <br>
<img src="https://user-images.githubusercontent.com/64642177/132992985-72c8db3a-a40c-44fb-a935-9616639bd817.png" width=600><br>
 You can rotate and frame the message  <br>
<img src="https://user-images.githubusercontent.com/64642177/132992988-465c07db-cc3d-4170-a8a4-01a8a005da8c.png" width=600><br>
<br>
<br>
If you are using two browsers, you can see that the above operations are shared in real time.
