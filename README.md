# **Connect Everything**

A self-hosted media streaming server which can transmit locally stored media files over the internet to some
other device.

Run the following commands:

1. `yarn install` in both the root and client directory of this project.

2. Go to the root directory of this project and start the server using: `yarn dev`

3. Go to client folder and start the U.I. using: `yarn start`

Whenever you will start your server, it will provide you the IP Address, Local IP Address and Port in the terminal, use these to connect to your server from other devices.

On your other device,

1. Connect to the client server (U.I), use the IP and Port of U.I. provided in the server's and client's terminal respectively.
 
2. Once connected to the U.I., enter the IP and Port of the server in the form.
 
3. You will receive a "connected" alert after a successful connection.
 
4. Enter the absolute path to any directory located on the server which contains some media.
 
5. If a media file is found, it will be listed on the website.
 
6. Click on its name and a player will popup which will play that file.


---

This project is currently ongoing and I will implement more things when I will have time to do so.
