const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const port = 3001;

const db = require("./models");

app.use(cookieParser());
app.use(cors()); 
app.use(express.json({strict: false}));

//Router
const authRouter = require("./routes/Account")
app.use("/account", authRouter);

const cityRouter = require("./routes/City")
app.use("/city", cityRouter);

const districtRouter = require("./routes/District")
app.use("/district", districtRouter);

const wardRouter = require("./routes/Ward")
app.use("/ward", wardRouter);

const hamletRouter = require("./routes/Hamlet")
app.use("/hamlet", hamletRouter);

const taskRouter = require("./routes/Task")
app.use("/task", taskRouter);

const citizenRouter = require("./routes/Citizen")
app.use("/citizen", citizenRouter);


db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("Server running at port: " + port);
    })
});
