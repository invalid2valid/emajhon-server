const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

// ----------------------DB_PASS=Z9UdFvhiizDCCEAM

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = "mongodb://localhost:27017";
// "mongodb+srv://hazrat:hazratali@cluster0.y4uhtgw.mongodb.net/?retryWrites=true&w=majority";
// const uri =
//   "mongodb+srv://hazrat:hazratali@cluster0.y4uhtgw.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db("emajon").collection("products");
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.get("/products", async (req, res) => {
      const product = await productCollection.find().toArray();
      res.send(product);
    });

    app.get("/singleitem/:id", async (req, res) => {
      // console.log(req.params.id);
      const singleitem = await productCollection.findOne({
        _id: req.params.id,
      });

      if (!singleitem) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json(singleitem);
    });

    app.patch("/update/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const { name, seller, category, price, ratings, img } = req.body;

      const result = productCollection.updateOne(
        { _id: id },
        { $set: { name, seller, category, price, ratings, img } }
      );

      res.send(result);
    });

    app.post("/addproduct", async (req, res) => {
      const body = req.body;
      console.log(body);
      const result = await productCollection.insertOne(body);
      if (result?.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "can not insert now",
          status: false,
        });
      }
    });

    app.delete("/delete/:id", async (req, res) => {
      console.log(req.params.id);
      const deleteItem = await productCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(deleteItem);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//-----------------------

app.get("/", (req, res) => {
  res.send({ helo: "helo" });
});

app.listen(port, () => {
  console.log(`server is running port ${port}`);
});
