docker system prune
docker build -t my-mongodb-image .
docker run -d -p 6001:27017 --name my-mongodb-container my-mongodb-image
