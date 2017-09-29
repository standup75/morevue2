## morevue2

> Offline first boilerplate

> Technologies: Mongo, Node, CouchDB, Vue

The mongoDB instance only stores users. The node app manages user, and creates a database in couchDB per user. This doesn't even create a session on the server, it just checks the password and returns the information needed for the user to connect to his database in couchDB. PouchDB then handles the rest and synchronizes with the couchDB database.

## What type of app is that good for?

This is an elegant solution for an app that requires to record and synchronize private data. It backs up the user data in real-time

## Features

- Signup
- Login
- Password forgotter: no email send, you need to complete the sendEmail method in api/src/utils with the service you choose to use
- Logout
- Update profile

## Build Setup

1/ Download and Install [http://couchdb.apache.org/](couchDB), [https://nodejs.org/en/download/](node), [https://www.mongodb.com/download-center](mongoDB)

2/ Start mongoDB and couchDB

3/ Start api server

``` bash
cd api
npm start
```

4/ Start client

``` bash
cd client

# install dependencies
npm install

# serve with hot reload at 0.0.0.0:8180
npm run dev

# build for production with minification
npm run build

```

Based on the webpack template for vue: For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Create a couchDB instance on AWS

``` bash
git clone https://github.com/redgeoff/docker-ce-vagrant
cd docker-ce-vagrant
sudo ./ubuntu.sh # Select "keep the local version ... "
sudo ./docker.sh
mkdir /home/ubuntu/common
sudo docker run -d --name couchdb \
  --restart always \
  -p 5984:5984 \
  -p 5986:5986 \
  -p 4369:4369 \
  -p 9100-9200:9100-9200 \
  -v /home/ubuntu/common:/home/couchdb/common \
  -e COUCHDB_DATA_DIR="/home/couchdb/common/data" \
  -e COUCHDB_USER='admin' \
  -e COUCHDB_HASHED_PASSWORD='-pbkdf2-b1eb7a68b0778a529c68d30749954e9e430417fb,4da0f8f1d98ce649a9c5a3845241ae24,10' \
  -e COUCHDB_COOKIE='mycookie' \
  -e COUCHDB_SECRET='mysecret' \
  -e COUCHDB_NODE_NAME='172.30.1.165' \
  redgeoff/couchdb
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
sudo npm install npm -g
sudo npm install -g add-cors-to-couchdb
add-cors-to-couchdb http://localhost:5984 -u admin -p admin
```

