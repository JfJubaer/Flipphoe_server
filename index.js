const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleWire

app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://flipphoe:GZHWvETybEReijVB@cluster0.j88am2v.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






// databaseSection
function run() {
    try {
        const categoriesCollection = client.db('flipphoeDB').collection('categories');
        const productsCollection = client.db('flipphoeDB').collection('products');

        app.get('/categories', async (req, res) => {
            const result = await categoriesCollection.find({}).toArray();
            res.send(result);
        })
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result);
        })
    }

    finally {

    }
}


run();



app.get('/', (req, res) => {
    res.send('This is my server of used mobiles')
})

app.listen(port, () => {
    console.log('Server is running at ', port)
})