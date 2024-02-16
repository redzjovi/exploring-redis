let jobApplicants = new Map();

function createJobApplicant(id, score) {
    jobApplicants.set(id, {
        'id': id,
        'score': score,
    })
}

function findJobApplicant(id) {
    return jobApplicants.get(id);
}

function updateJobApplicantScore(id, score) {
    jobApplicants.set(id, {
        'id': id,
        'score': score,
    })
}

module.exports = {
    createJobApplicant,
    findJobApplicant,
    updateJobApplicantScore,
}