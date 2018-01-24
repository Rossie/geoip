##Deploy to Debian Linux

Create Debian user for Node server
    $ apt-get update
    $ useradd ipweb
    $ passwd ipweb
    $ mkhomedir_helper ipweb

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
