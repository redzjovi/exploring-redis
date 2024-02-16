function calculate(applicant) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
            const randomIndex = Math.floor(Math.random() * values.length);
            const score = values[randomIndex];
            resolve(score);
        }, 10000);
    });
}

module.exports = {
    calculate
}