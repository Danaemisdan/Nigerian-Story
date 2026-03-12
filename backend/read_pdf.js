const fs = require('fs');
const pdf = require('pdf-parse');

async function readPDF() {
    try {
        let dataBuffer = fs.readFileSync('/Users/sanjeevn/Downloads/The Nigerian story/Design/The Nigeria Story1.pdf');
        const data = await pdf(dataBuffer);
        console.log(data.text);
    } catch (e) {
        console.error("Error reading PDF:", e);
    }
}
readPDF();
