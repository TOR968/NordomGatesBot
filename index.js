import scheduleNextRun from "./schedule.js";
import { readFileSync } from "fs";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

const randomDelay = () => Math.random() * 3000 + 1000;

///////////////////////////////////////// Config  //////////////////////////////////////////////////
const config = {
    attempts: 2, // Number of times the door is opened per cycle (1-10)
    baseUrl: "https://nordgatetest-gfe0dubkf7cgc7f4.westeurope-01.azurewebsites.net/api/v1",
    dataFile: "data.txt",
    proxyFile: "proxy.txt",
    delay: randomDelay(),
};
///////////////////////////////////////////////////////////////////////////////////////////////////

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
};

function loadData() {
    try {
        const data = readFileSync(config.dataFile, "utf8");
        return data.split("\n").filter((line) => line.trim());
    } catch (error) {
        console.log(`${colors.red}Error loading data file: ${error}${colors.reset}`);
        return [];
    }
}

function loadProxies() {
    try {
        const data = readFileSync(config.proxyFile, "utf8");
        return data.split("\n").filter((line) => line.trim());
    } catch (error) {
        console.log(`${colors.red}Error loading proxy file: ${error}${colors.reset}`);
        return [];
    }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function createAxiosInstance(telegramData, proxyUrl = null) {
    const axiosConfig = {
        baseURL: config.baseUrl,
        headers: {
            "X-Telegram-Init-Data": telegramData,
            "User-Agent":
                "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1",
        },
    };

    if (proxyUrl) {
        axiosConfig.httpsAgent = new HttpsProxyAgent(proxyUrl);
    }

    return axios.create(axiosConfig);
}

async function makeRequest(axiosInstance, url, method = "GET", data = null) {
    try {
        const response = await axiosInstance({
            method,
            url,
            data,
        });
        await sleep(config.delay);
        return response.data;
    } catch (error) {
        console.log(`${colors.red}Request error: ${error.message}${colors.reset}`);
        if (error.response) {
            console.log(`${colors.red}Status: ${error.response.status}${colors.reset}`);
            console.log(`${colors.red}Data: ${JSON.stringify(error.response.data)}${colors.reset}`);
        }
        return null;
    }
}

async function getDashboard(axiosInstance) {
    console.log(`${colors.blue}Getting dashboard...${colors.reset}`);
    return await makeRequest(axiosInstance, "/dashboard");
}

async function getTasks(axiosInstance) {
    console.log(`${colors.blue}Getting tasks...${colors.reset}`);
    return await makeRequest(axiosInstance, "/tasks");
}

async function startTask(axiosInstance, taskId) {
    console.log(`${colors.yellow}Starting task ${taskId}...${colors.reset}`);
    return await makeRequest(axiosInstance, `/tasks/start/${taskId}`, "POST");
}

async function claimTask(axiosInstance, taskId) {
    console.log(`${colors.green}Claiming task ${taskId}...${colors.reset}`);
    return await makeRequest(axiosInstance, `/tasks/claim/${taskId}`, "POST");
}

async function selectDoor(axiosInstance, door) {
    console.log(`${colors.magenta}Selecting ${door} door...${colors.reset}`);
    return await makeRequest(axiosInstance, `/nordgate/select/${door}`, "POST");
}

async function riskPoints(axiosInstance) {
    console.log(`${colors.yellow}Risking points...${colors.reset}`);
    return await makeRequest(axiosInstance, "/nordgate/risk", "POST");
}

async function claimPoints(axiosInstance) {
    console.log(`${colors.green}Claiming points...${colors.reset}`);
    return await makeRequest(axiosInstance, "/nordgate/claim", "POST");
}

async function startKnockGame(axiosInstance) {
    console.log(`${colors.green}Starting knock game...${colors.reset}`);
    return await makeRequest(axiosInstance, "/knockgame/start", "POST");
}

async function claimKnockGamePoints(axiosInstance) {
    console.log(`${colors.green}Claiming knock game points...${colors.reset}`);
    return await makeRequest(axiosInstance, "/knockgame/claim/0", "PUT");
}

async function processKnockGame(axiosInstance) {
    await startKnockGame(axiosInstance);
    await claimKnockGamePoints(axiosInstance);
}

async function processTasks(axiosInstance) {
    const tasks = await getTasks(axiosInstance);
    if (!tasks || !tasks.data) return false;

    let taskProcessed = false;
    for (const task of tasks.data.nordom) {
        try {
            if (task.status === "notStarted") {
                await startTask(axiosInstance, task.id);
                taskProcessed = true;
            } else if (task.status === "completed") {
                await claimTask(axiosInstance, task.id);
                taskProcessed = true;
            }
        } catch (error) {
            console.log(`${colors.red}Error processing task ${task.id}: ${error.message}${colors.reset}`);
        }
    }
    return taskProcessed;
}

let winCount = 0;

async function playGameSession(axiosInstance) {
    const doors = ["first", "second", "third"];
    let userName = "";
    let sessionActive = true;
    let totalWins = 0;
    let totalLosses = 0;

    while (sessionActive) {
        const dashboard = await getDashboard(axiosInstance);
        if (!dashboard || !dashboard.data) return;

        userName = dashboard.data.userName;

        if (dashboard.data.knockGame.isAvailable) {
            processKnockGame(axiosInstance);
            continue;
        }

        if (dashboard.data.nordGateGame.levelToRisk != null) {
            await claimPoints(axiosInstance);
            continue;
        }

        let keys = dashboard.data.nordGateGame.key;
        console.log(`${colors.cyan}Available keys: ${keys}${colors.reset}`);

        if (keys === 0) {
            console.log(`${colors.yellow}No keys available. Processing tasks...${colors.reset}`);
            const tasksProcessed = await processTasks(axiosInstance);
            if (!tasksProcessed) {
                console.log(`${colors.red}No more tasks available. Session ended.${colors.reset}`);
                break;
            }
            continue;
        }

        console.log(`${colors.bright}\nStarting new game cycle${colors.reset}`);
        console.log(`${colors.cyan}Total wins: ${totalWins}, Total losses: ${totalLosses}${colors.reset}`);

        let currentLevel = 1;
        let cycleActive = true;

        while (cycleActive && keys > 0) {
            const doorIndex = Math.floor(Math.random() * 3);
            const result = await selectDoor(axiosInstance, doors[doorIndex]);

            if (!result || !result.data) {
                cycleActive = false;
                continue;
            }

            if (result.data.result === "win") {
                totalWins++;
                winCount++;
                console.log(`${colors.green}Won! Level: ${result.data.currentStateDto.currentLevel}${colors.reset}`);
                console.log(`${colors.green}Points: ${result.data.currentStateDto.accumulatedPoint}${colors.reset}`);

                if (winCount >= config.attempts) {
                    await claimPoints(axiosInstance);
                    winCount = 0;
                } else if (result.data.currentStateDto.currentLevel < result.data.currentStateDto.maxLevel) {
                    await riskPoints(axiosInstance);
                    currentLevel++;
                } else {
                    await claimPoints(axiosInstance);
                    cycleActive = false;
                }
            } else {
                totalLosses++;
                winCount = 0;
                console.log(`${colors.green}Lost! Starting new cycle...${colors.reset}`);
                cycleActive = false;
            }

            keys--;
        }

        if (keys === 0) {
            const tasksProcessed = await processTasks(axiosInstance);
            if (!tasksProcessed) {
                console.log(`${colors.yellow}No more tasks and keys available. Session ended.${colors.reset}`);
                sessionActive = false;
            }
        }
    }

    console.log(`${colors.bright}\n${userName} Session Statistics:${colors.reset}`);
    console.log(`${colors.green}Total wins: ${totalWins}${colors.reset}`);
    console.log(`${colors.red}Total losses: ${totalLosses}${colors.reset}`);
    console.log(
        `${colors.cyan}Win rate: ${((totalWins / (totalWins + totalLosses)) * 100).toFixed(2)}%${colors.reset}`
    );
}

async function main() {
    const telegramData = loadData();
    const proxies = loadProxies();

    for (let i = 0; i < telegramData.length; i++) {
        const proxyUrl = i < proxies.length ? proxies[i] : null;
        const axiosInstance = createAxiosInstance(telegramData[i], proxyUrl);

        console.log(`${colors.bright}\nStarting session ${i + 1}/${telegramData.length}${colors.reset}`);
        console.log(`${colors.bright}Using proxy: ${proxyUrl || "none"}${colors.reset}`);

        try {
            await playGameSession(axiosInstance);
        } catch (error) {
            console.log(`${colors.red}Session error: ${error.message}${colors.reset}`);
        }
    }

    scheduleNextRun(3, main);
}

process.on("unhandledRejection", (error) => {
    console.log(`${colors.red}Unhandled rejection: ${error.message}${colors.reset}`);
});

main().catch((error) => {
    console.log(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
});
