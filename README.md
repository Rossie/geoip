##Deploy to Debian Linux

### Create Debian user for Node server
````sh
$ apt-get update
$ useradd ipweb
$ passwd ipweb
$ mkhomedir_helper ipweb
````
[node js with port 80](https://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode)
*If node runs in a simple user account, it can not use port 80*
````sh
$ sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
````

### MySql
````sh
$ apt-get install mysql-server
$ mysql_secure_installation
````

Set up user
````sh
$ mysql -uroot -p1234
````
````sql
CREATE USER 'ipweb'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON *.* TO 'ipweb'@'localhost' WITH GRANT OPTION;
````
Create DB
````sql
CREATE DATABASE ip_geo;
````

### Git
````sh
$ apt-get install git
````

Clone project
````sh
$ git clone https://github.com/Rossie/ip-geo-project.git ip-geo
````

### NVM - Node Version Manager
````sh
$ curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
````

Install node.js
````sh
$ nvm install v8.9.4
````

### pm2 - Advanced, production process manager for Node.js
````sh
$ npm install pm2 -g
````

Run server
````sh
$ pm2 start ./bin/www
````

*ORM doesn't create index so have to add it manually after tables are created:*
````sql
ALTER TABLE `comments` ADD INDEX `ip_id` (`ip_id` ASC);
````


## Outer sources:

[Bootstrap theme](https://bootswatch.com/pulse/)