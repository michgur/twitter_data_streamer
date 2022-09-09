import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function testLocal(query) {
    const { main } = await import("./index.js");

    const req = {
        body: { query }
    };
    const res = {
        status: (code) => {
            console.log(`status ${code}`);
            return res;
        },
        send: console.log,
    };

    main(req, res);
}

async function testServer(query) {
    const url = 'https://us-central1-tilde-359707.cloudfunctions.net/twitter-data-dump';

    const headers = {
        'Content-Type': 'application/json',
    };
    const body = { query };

    console.log('sending request');
    const response = await axios({
        url,
        headers,
        method: 'POST',
        data: body,
    });

    console.log(`status ${response.status}`);
    console.log(response.data);
}

await testServer('trump')
