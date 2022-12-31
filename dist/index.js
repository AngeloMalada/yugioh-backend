"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// type Card = {
//   id: number;
//   name: string;
//   desc: string;
//   card_images: {
//     image_url: string;
//   }[];
// };
// type Result = {
//   data: Card[];
// };
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
async function getCard(random1, random2) {
    const card1 = await prisma.card.findUnique({
        where: {
            id: random1,
        },
    });
    const card2 = await prisma.card.findUnique({
        where: {
            id: random2,
        },
    });
    return [card1, card2];
}
async function vote(a, b) {
    const vote = await prisma.vote.create({
        data: {
            againstId: a,
            forId: b,
        },
    });
}
const getResults = async () => {
    const results = await prisma.card.findMany({
        orderBy: {
            votesFor: { _count: "desc" },
        },
        select: {
            name: true,
            desc: true,
            image_url: true,
            _count: {
                select: {
                    votesFor: true,
                    votesAgainst: true,
                },
            },
        },
    });
    return results.filter((result) => result._count.votesFor > 0);
};
const fillDB = async () => {
    const cards = await axios_1.default.get(`https://db.ygoprodeck.com/api/v7/cardinfo.php`);
    const cardData = cards.data.data;
    //for 12000 times create a card in db
    for (let i = 0; i < 12000; i++) {
        const card = await prisma.card.create({
            data: {
                name: cardData[i].name,
                desc: cardData[i].desc,
                image_url: cardData[i].card_images[0].image_url,
            },
        });
    }
};
app.get("/results", (req, res) => {
    getResults().then((results) => {
        res.send({
            results: results,
        });
    });
});
app.get("/fill", (req, res) => {
    fillDB()
        .then(() => {
        res.send({
            message: "success",
        });
    })
        .catch((err) => {
        res.send({
            message: err,
        });
    });
});
app.post("/vote", (req, res) => {
    const { a, b } = req.query;
    vote(Number(a), Number(b)).then(() => {
        res.send({
            message: "success",
        });
    });
});
app.get("/getCards", (req, res) => {
    const { name } = req.query;
    getCard(Math.floor(Math.random() * 12000), Math.floor(Math.random() * 12000))
        .then((cards) => {
        res.send({
            cards: cards.map((card) => {
                return {
                    id: card.id,
                    name: card.name,
                    desc: card.desc,
                    image_url: card.image_url,
                };
            }),
        });
    })
        .catch((err) => {
        res.send({
            cards: [],
        });
    });
});
app.delete("/delete", (req, res) => {
    //delete all cards from db
    prisma.card.deleteMany({}).then(() => {
        res.send({
            message: "success",
        });
    });
});
app.listen(8080, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map