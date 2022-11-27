const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleWire

app.use(cors());
app.use(express.json());

// databaseSection

app.get('/', (req, res) => {
    res.send('This is my server of used mobiles')
})

app.listen(port, () => {
    console.log('Server is running at ', port)
})