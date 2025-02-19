# Nordom Gates Bot

| ✅  | Feature                        |
| --- | ------------------------------ |
| ✅  | Automates tasks (not telegram) |
| ✅  | Playing games                  |
| ✅  | Playing Wheel game             |
| ✅  | Playing Puzzle game             |
| ✅  | Handles multiple accounts      |
| ✅  | Proxy support                  |
| ✅  | Automatic task verification    |
| ✅  | Manually set up tasks for skipping    |
| ✅  | Random restart timer           |

## For suggestions or to report a bug, please contact [telegram](https://t.me/tor_dev)

## Installation

1. Clone the repository:

    - Open your terminal or command prompt.
    - Navigate to the directory where you want to install the bot.
    - Run the following command:
        ```
        git clone https://github.com/TOR968/NordomGatesBot.git
        ```
    - This will create a new directory named `NordomGatesBot` with the project files.

2. Navigate to the project directory:

    - Change into the newly created directory:
        ```
        cd NordomGatesBot
        ```

3. Install the required dependencies:

    ```
    npm install
    ```

4. Open the `data.txt` file in a text editor and add your account tgWabAppData, one per line:

    ```
    account_1_here
    account_2_here
    account_3_here
    ```

5. If you need to use proxies, fill in the `proxy.txt` file with your proxy addresses, one per line. If not, you can leave this file empty. [example](proxy-example.txt)

## How to Get Your Account tgWabAppData

To obtain your account tgWabAppData:

1. Log in to the app in Telegram or Telegram Web.
2. Open your browser's Developer Tools (usually F12 or right-click and select "Inspect").
3. Go to the "Application" tab in the Developer Tools.
4. Copy tgWabAppData highlighted in red.

![img](image.png)

5. Copy this tgWabAppData and paste it into your `data.txt` file.
6. **In the index.js file, you can edit the “config” for yourself.**

## Usage

To run the bot, use the following command in your terminal:

```
node index.js
```

## Disclaimer

This bot is for educational purposes only. Use it at your own risk and make sure you comply with the terms of service of the Nordom Gates platform.

## License

This project is open source and available under the [GPL License](LICENSE).
