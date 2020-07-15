const axios = require("axios");
const fs = require("fs");

const path = "questions-answers.csv";
const baseUrl = "https://www.einbuergerungstest-online.eu/fragen/";
const totalPages = 10;

if (fs.existsSync(path)) {
    fs.unlinkSync(path);
}

for (let index = 1; index <= totalPages; index++) {
    const url = baseUrl + index;

    fetchUrl(url);
}

async function fetchUrl(url) {
    const response = await axios.get(url);
    const data = response.data;
    
    const myregexp1 = /questions-question-id">(\d+)\.<\/div><p><a\s+href=".*?">(.*?)<.*?question-answer-right">(.*?)</ig;
    const myregexp2 = /questions-question-id">(\d+)\.<\/div><p>(.*?)<.*?question-answer-right">(.*?)</ig;

    let match1 = myregexp1.exec(data);
    let match2 = myregexp2.exec(data);

    let questionNr = "";
    let question = "";
    let answer = "";

    while (match1 != null) {
        questionNr = match1[1];
        question = match1[2];
        answer = match1[3];

        if (questionNr && question && answer) {
            console.log(`${questionNr}. ${question} -> ${answer}`);
            saveQuestion(questionNr, question, answer);
        }

        match1 = myregexp1.exec(data);
    }
    while (match2 != null) {
        questionNr = match2[1];
        question = match2[2];
        answer = match2[3];

        if (questionNr && question && answer) {
            console.log(`${questionNr}. ${question} -> ${answer}`);
            saveQuestion(questionNr, question, answer);
        }

        match2 = myregexp2.exec(data);
    }
}

function saveQuestion(questionNr, question, answer) {
    const data = `\n${questionNr};${question};${answer}`;
    fs.appendFileSync(path, data);
}