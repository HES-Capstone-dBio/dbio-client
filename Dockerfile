# Pull official base image
FROM node:16.14-alpine

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Add app
COPY . ./

# Install app dependencies
RUN npm install 
RUN npm install react-scripts@5.0.0 -g 
RUN npm install serve -g 
RUN npm run build

# Start app
CMD ["serve", "-s", "build"]
