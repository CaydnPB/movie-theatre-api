const app = require("./src/app");
const { db } = require("./db/connection")
const PORT = 3000;

app.listen(PORT, () => {
    db.sync();
    console.log(`Listening at http://localhost:${PORT}/`)
})