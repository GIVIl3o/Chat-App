FROM fedora:30

WORKDIR /usr/src/app

RUN dnf install -y httpd

RUN dnf -y install npm 

COPY ./httpd.conf /etc/httpd/conf/httpd.conf

COPY ./package.json ./

RUN npm install --silent

COPY . .

RUN npm run build --silent

RUN cp -r ./build/* /var/www/html/

CMD httpd && tail -f /dev/null

