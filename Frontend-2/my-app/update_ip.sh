#!/bin/bash

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')

# Path to your React Native project's file where the IP needs to be updated
TARGET_FILE="./config/apiConfig.js" # Adjust path to match your project structure

# Update the file dynamically
sed -i "s|http://[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}:5000|http://$LOCAL_IP:5000|g" $TARGET_FILE

echo "Updated local IP in $TARGET_FILE to http://$LOCAL_IP:5000"
