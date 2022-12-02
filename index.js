const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleWire

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://flipphoe:GZHWvETybEReijVB@cluster0.j88am2v.mongodb.net/?retryWrites=true&w=majority";
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
    app.get("/role/:email", async (req, res) => {
      const user = await userCollection.findOne({ email: req.params.email });
      if (user?.role) {
        res.send({ role: user.role });
      } else {
        res.send({ role: "buyer" });
      }
    });
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
    app.get("/seller", async (req, res) => {
      const result = await userCollection.find({ role: "seller" }).toArray();
      res.send(result);
      app.delete('/seller/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.send(result);
      })
    });
    app.post("/addproduct", async (req, res) => {
      const result = await productsCollection.insertOne(req.body);
      res.send(result);
    });
    app.get("/myproducts/:email", async (req, res) => {
      const result = await productsCollection.find({ email: req.params.email }).toArray();
      res.send(result);
    });
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
