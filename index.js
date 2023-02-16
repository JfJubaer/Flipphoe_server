const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")('sk_test_51MbPCuFJhUO1VhGGxexvteISUJPR7MV7klUxhprR0MmtpaREq8gE2amUpj5hhb3VGqBOUnTkEW80jhkmDBYS99Yv00gZSQDhIt');

// middleWire

app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j88am2v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


// databaseSection
function run() {
  try {
    const categoriesCollection = client.db("flipphoeDB").collection("categories");
    const productsCollection = client.db("flipphoeDB").collection("products");
    const userCollection = client.db("flipphoeDB").collection("users");
    const orderCollection = client.db("flipphoeDB").collection("orders");
    const paymentCollection = client.db("flipphoeDB").collection("payment");

    app.get("/categories", async (req, res) => {
      const result = await categoriesCollection.find({}).toArray();
      res.send(result);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { categoryId: id };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find({}).toArray();
      res.send(result);
    });
    app.post("/login", async (req, res) => {
      const result = await userCollection.insertOne(req.body);
      res.send(result);
    });
    app.post("/orders", async (req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.send(result);
    });
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const result = await orderCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/orders/:id", async (req, res) => {
      const { id } = req.params;
      const result = await orderCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
    app.get("/role/:email", async (req, res) => {
      const user = await userCollection.findOne({ email: req.params.email });
      if (user?.role === "buyer") {
        res.send({ role: "buyer" });
      }
      if (user?.role === "seller") {
        res.send({ role: "seller" });
      }
      if (user?.role === "admin") {
        res.send({ role: "admin" });
      }

    });
    // buyer route
    app.get("/buyer", async (req, res) => {
      const result = await userCollection.find({ role: "buyer" }).toArray();
      res.send(result);

    });
    app.delete('/buyer/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })
    // seller route
    app.get("/seller", async (req, res) => {
      const result = await userCollection.find({ role: "seller" }).toArray();
      res.send(result);
    });
    app.delete('/seller/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })
    app.post("/addproduct", async (req, res) => {
      const result = await productsCollection.insertOne(req.body);
      res.send(result);
    });
    app.get("/myproducts/:email", async (req, res) => {
      const result = await productsCollection.find({ email: req.params.email }).toArray();
      res.send(result);
    });
    app.delete("/myproducts/:id", async (req, res) => {
      const { id } = req.params;
      const result = await productsCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    // payment section
    app.post('/payment', async (req, res) => {
      const total = req.body.total;
      const price = total * 1;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: amount,
        "payment_method_types": [
          "card"
        ]
      });
      res.send({ clientSecret: paymentIntent.client_secret })
    })
    app.post('/payment-done', async (req, res) => {
      const payment = req.body;
      const result = await paymentCollection.insertOne(payment);
      res.send(result);
    })
  } finally {
  }
}

run();

app.get("/", (req, res) => {
  res.send("This is my server of used mobiles");
});

app.listen(port, () => {
  console.log("Server is running at ", port);
});
