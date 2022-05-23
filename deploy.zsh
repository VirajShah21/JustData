#!/bin/zsh

# Build the application
echo Building the application
cd app
yarn build
echo Finished building the application

# Build the server
echo Building the server
cd ../server
yarn build
echo Finished building the server

# Change back to the root directory
cd ..

# Clean the deployments directory if it already exists
rm -rf deployments

# Setup the deployments directory
mkdir deployments
mkdir deployments/web
echo Finished setting up the deployments directory

# Copy the built server code to the deployments directory
cp -r server/dist/* deployments

# Copy the built application code to the deployments directory
cp -r app/build/* deployments/web

echo Done creating the deployment! 👍
