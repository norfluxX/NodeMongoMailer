# EmailSender-NodeMongo using Docker compose
### In this project, we have created an application using NodeJS which can send email to anyone and also make a copy of data in a mongo database over HTTPS. 
### Also, we will be fetching details from MongoDB via API using Postman tool.
### Prerequisties: 
1. Node version >= 16 and NPM >= 8.0
2. Docker and Docker-compose installed on the system.
### Steps to run:
1. Clone the repository:
   ```
    git clone https://github.com/norfluxX/EmailSender-NodeMongo.git
   ```
2. Edit the app.js file and add email credentials(Use App passwords).
3. Go inside the directory and run the following command:
   ```
   docker-compose up -d
   ```
4. Visit the page i.e. https://localhost and fill out the details asked and you will receive an email as well the entry will sent to mongo database container.
5. Now, let's fetch the details from MonogoDB using API. We will be using basic authentication - username and password provided in the app.js file. Following is the screenshot of the same.
<p align="center">
      <img src="https://github.com/norfluxX/EmailSender-NodeMongo/assets/35907619/6acf7a22-f98a-4452-bddf-c29d09938760" />
</p>

### Steps to run on bare metal machine for local testing:
1. Install monogo docker container. We have preferred to use a Dockerfile as a new database with collections needs to be configured.
   Following is our Dockerfile with init script mentioned in the repo:
   ```
   FROM mongo:latest
   ENV MONGO_INITDB_ROOT_USERNAME=admin \
   MONGO_INITDB_ROOT_PASSWORD=admin \
   MONGO_INITDB_DATABASE=foo
   RUN mkdir -p /data/db
   COPY init.js /docker-entrypoint-initdb.d/
   EXPOSE 27017
   CMD ["mongod", "--auth", "--port", "27017", "--bind_ip", "0.0.0.0"]
   ```
2. Save the file as "Dockerfile" and run the following command for custom build:
   ```
   sudo docker build -t mongo-container .
   ```
3. Fire up the container using the following command:
   ```
   sudo docker run -dp 27017:27017 mongo-container
   ```
4. Check if the docker container is up and running using the following command:
   ```
   sudo docker ps
   ```
5. You can take access of the mongo container and cross check if the database and collections are created or not:
   ```
   sudo docker exec -it <containerid> mongosh -u admin -p
   ```
   Once connected, using the mongo commands to check:
   ```
   show dbs;
   ```
   ```
   use foo;
   ```
   ```
   show collections;
   ```
   ```
   db.collectionName.find();
   ```
   **The above command will return the data stored in the collection aka table.**
  
6. Note down the mongodb IP and we need to hard code in the app.js file. Using the following command:
   ```
   sudo docker inspect <containerid> | grep -i "IP"
   ```
   This should look like - 172.17.0.x
7. Edit the app.js file to replace the IP address and email credentials(Use App passwords).
8. Spin up the node-alpine container. We have used the following Dockerfile:
   ```
   FROM node:alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 443
   CMD ["npm", "start"]
   ```
9. Visit the page i.e. https://localhost and fill out the details asked and you will receive an email as well the entry will sent to mongo database container.
