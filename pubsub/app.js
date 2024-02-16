const bodyParser = require('body-parser');
const express = require('express');
const uuid = require('uuid');

const redis = require('./libs/redis');
const jobApplicantRepository = require('./repositories/jobApplicant');
const matchingScoreService = require('./services/matchingScore');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/v1/jobs/:job_id/apply', async (_, res) => {
    try {
        const jobApplicationId = uuid.v4();
        const score = await matchingScoreService.calculate(jobApplicationId);
        jobApplicantRepository.createJobApplicant(jobApplicationId, score);
        res.status(200).json({ 'job_applicant_id': jobApplicationId, 'score': score });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/v1/jobs/:job_id/applicants/:job_applicant_id', async (req, res) => {
    try {
        const jobApplicantId = req.params['job_applicant_id'];
        const jobApplicant = jobApplicantRepository.findJobApplicant(jobApplicantId);
        res.status(200).json({ 'id': jobApplicant.id, 'score': jobApplicant.score });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/v2/jobs/:job_id/apply', async (_, res) => {
    try {
        const jobApplicationId = uuid.v4();

        // 1. Publish message
        await redis.publishClient().publish('job_applicant_score', jobApplicationId);

        res.status(200).json({ 'job_applicant_id': jobApplicationId, 'score': null });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// 2. Subscribe message
redis.subscribeClient().subscribe('job_applicant_score', async (jobApplicationId, _) => {
    // 3. Matching score request, response
    const score = await matchingScoreService.calculate(jobApplicationId);
    jobApplicantRepository.updateJobApplicantScore(jobApplicationId, score);
    console.log(score);
});
