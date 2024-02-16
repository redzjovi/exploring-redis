const { faker } = require('@faker-js/faker');
const bodyParser = require('body-parser');
const express = require('express');
const { SchemaFieldTypes } = require('redis');

const redis = require('./libs/redis')

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/jobs/init', async (_, res) => {
    try {
        await redis.searchClient().ft.create('idx:jobs', {
            '$.id': {
                type: SchemaFieldTypes.TEXT,
                AS: 'id'
            },
            '$.title': {
                type: SchemaFieldTypes.TEXT,
                AS: 'title',
                SORTABLE: true
            }
        }, {
            ON: 'JSON',
            PREFIX: 'job:'
        });
        res.status(200).json({ 'message': 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/jobs/import', async (_, res) => {
    try {
        const jobs = faker.helpers.multiple(() => {
            return {
                id: faker.string.uuid(),
                title: faker.person.jobTitle(),
            }
        }, {
            count: 100000,
        });
        await Promise.all(jobs.map(job => {
            redis.searchClient().json.set(`job:${job.id}`, '$', {
                'id': job.id,
                'title': job.title
            })
        }));
        res.status(200).json({ 'message': 'success' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/jobs/search', async (req, res) => {
    const title = req.query.title;
    try {
        let result = await redis.searchClient().ft.search(
            'idx:jobs',
            `%${title.split(" ").join("% %")}%`
        );
        res.status(200).json({ 'data': result.documents.map(document => {
            return {
                'id': document.value.id,
                'title': document.value.title
            }
        }) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
