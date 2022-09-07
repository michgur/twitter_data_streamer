import dotenv from "dotenv";

dotenv.config();

const { main } = await import("./index.js");

const req = {
    query: "elon musk"
};
const res = {
    status: (code) => {
        console.log(`status ${code}`);
        return res;
    },
    send: console.log,
};

main(req, res);
