function scheduleNextRun(defaultDelayInHours = 2, functionToRun) {
    const randomDelay = getRandomNumber(600000, 2400000);
    const totalDelay = defaultDelayInHours * 60 * 60 * 1000 + randomDelay;
    const startTime = Date.now();
    const endTime = startTime + totalDelay;

    const timerInterval = setInterval(() => updateTimer(endTime, timerInterval), 1000);

    setTimeout(() => {
        clearInterval(timerInterval);
        functionToRun();
    }, totalDelay);
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function updateTimer(endTime, timerInterval) {
    const currentTime = Date.now();
    const remainingTime = endTime - currentTime;

    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        return;
    }

    const { hours, minutes, seconds } = getTimeRemaining(remainingTime);
    process.stdout.write(`\r--- Restarting in ${hours}h ${minutes}m ${seconds}s ---`);
}

function getTimeRemaining(timeDifference) {
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
}

export default scheduleNextRun;