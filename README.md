# Nordom Gates Bot

| ✅  | Feature                        |
| --- | ------------------------------ |
| ✅  | Automates tasks (not telegram) |
| ✅  | Playing games                  |
| ✅  | Handles multiple accounts      |
| ✅  | Proxy support                  |
| ✅  | Automatic task verification    |
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

1. Log in to the PitchTalk app in Telegram or Telegram Web.
2. Open your browser's Developer Tools (usually F12 or right-click and select "Inspect").
3. Go to the "Application" tab in the Developer Tools.
4. Copy tgWabAppData highlighted in red.

![img](image.png)

5. Copy this tgWabAppData and paste it into your `data.txt` file.
6. In [config](https://github.com/TOR968/NordomGatesBot/blob/d4b9a625b49b690ec6ec0f083d9d3dc4de5a0bc3/index.js#L10), you can edit the number of open doors per 1 game of the attempts value.

**Important**: Keep your account tgWabAppData secret and never share it publicly. It provides access to your account.

## Usage

To run the bot, use the following command in your terminal:

```
node index.js
```

## Disclaimer

This bot is for educational purposes only. Use it at your own risk and make sure you comply with the terms of service of the Nordom Gates platform.

## License

This project is open source and available under the [GNU License](LICENSE).
