##Deploy to Debian Linux

### Create Debian user for Node server
````bash
$ apt-get update
$ useradd ipweb
$ passwd ipweb
$ mkhomedir_helper ipweb
````

https://stackoverflow.com/questions/16573668/best-practices-when-running-node-js-with-port-80-ubuntu-linode
$ sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080

MySql
    $ apt-get install mysql-server
    $ mysql_secure_installation

    Set up user
        $ mysql -uroot -p1234
        mysql> CREATE USER 'ipweb'@'localhost' IDENTIFIED BY '1234';
        mysql> GRANT ALL PRIVILEGES ON *.* TO 'ipweb'@'localhost' WITH GRANT OPTION;
    Create DB
        mysql> CREATE DATABASE ip_geo;

Git
    $ apt-get install git
    Clone project
        $ git clone https://github.com/Rossie/ip-geo-project.git ip-geo

NVM - Node Version Manager
    $ curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash

    Install node.js
        $ nvm install v8.9.4

pm2
    $ npm install pm2 -g
    Run server
        $ pm2 start ./bin/www

ORM doesn't create index so have to add it manually after tables are created:
    mysql> ALTER TABLE `comments` ADD INDEX `ip_id` (`ip_id` ASC);


## Outer sources:

CSS: https://bootswatch.com/pulse/