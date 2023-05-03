# **Connect Everything**

A self-hosted media streaming server which can transmit locally stored media files over the internet to some other device.

### Screenshots:

-   Server

    ![Server](/public/server.png)

-   Initial page
    ![Initial page](/public/initial.png)

-   Example directory containing 3 sample videos:
    ![Example directory](/public/eg_dir.png)

-   Directory Page
    ![Directory page](/public/dir_page.png)

-   Media selection:
    ![Media selection](/public/media_selection.png)

-   Media playback
    ![playback](/public/playback.png)

### To start the frontend, run the following commands:

-   `cd client`
-   `npm i` or `yarn`
-   `npm start` or `yarn start`

### To start the server, run the following commands:

-   `cd server`
-   `npm i` or `yarn`
-   `npm start` or `yarn start`

### How to play media on other device?

-   First start the server on the device which has the media files, the server will let you know the local ip, public ip and port it is running on in the terminal.
-   Connect to the frontend, this can be started in any device. The address of the frontend would be in the terminal when you start it. By default it is `localhost:3000`.
-   Connect to the server using the frontend, **by default it uses port 3001**. If both device are on the same network then you can use Local IP to connect. If they are on different network then you will need to open the port(s) on the host device so that the other device can connect to it using Public IP.
-   On the next page, enter the **absolute path** of the folder which contains media and click on submit.
-   On the new page, you will need to select the media you want to play. It will play successfully if it is supported by your browser otherwise you will get an error.
