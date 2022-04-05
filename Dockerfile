# Pull official base image
FROM node:16.14-alpine

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install 
RUN npm install react-scripts@5.0.0 -g 

# Add app
COPY . ./

# Start app
CMD ["npm", "run", "build"]
