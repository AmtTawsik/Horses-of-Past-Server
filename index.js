const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { response, query } = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// Middle Wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5ctwbw8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){
    try{
        const categoriCollection = client.db("HorsesOfPast").collection("Categories");
        const productCollection = client.db("HorsesOfPast").collection("Products");
        const userCollection = client.db("HorsesOfPast").collection("Users");
        const bookingCollection = client.db("HorsesOfPast").collection("Booking");

        app.get('/categories', async(req,res)=>{
            const query = {};
            const cursor = categoriCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        })

        app.get('/categories/:categoryName', async(req,res)=>{
            const categoryName = req.params.categoryName;
            const query = { categoryName };
            const products = await productCollection.find(query).toArray();
            res.send(products);
        })

        app.get('/products/:email', async(req,res)=>{
          const email = req.params.email;
          const query = { sellerEmail:email };
          const cursor = productCollection.find(query);
          const result = await cursor.toArray();
          res.send(result)
      })
      
      app.get('/users', async (req, res) => {
        const role = req.query.role;
        const query = { role };
        const cursor = userCollection.find(query);
        const users = await cursor.toArray();
        res.send(users);
        console.log(users);
    });

    app.put('/users/:email', async(req,res)=>{
      const email = req.params.email;
      const filter = {email:email};
      const options = {upsert:true};
      const updatedDoc = {
        $set: {
          isVarified: true,
        },
      };
      const result = await userCollection.updateOne(filter,updatedDoc,options);
      res.send(result)
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
          $set: {
              isAdvertized: true,
          },
      };
      const result = await productCollection.updateOne(filter, updatedDoc, options);
      res.send(result)
  })
  

    app.delete('/users/:email', async(req,res)=>{
      const email = req.params.email;
      const filter = {email:email};
      const result = await userCollection.deleteOne(filter);
      res.send(result)
    })

    app.get('/users/:email', async(req,res)=>{
      const email = req.params.email;
      const query = {email:email};
      const result = await userCollection.findOne(query);
      res.send(result)
    })

        app.post('/users',async(req,res)=>{
          const user = req.body;
          email = user.email;
          const query = { email };
          
          let postedUser = await userCollection.findOne(query);
          if(postedUser === null){
            postedUser = {}
          }
          console.log(postedUser.email,email)
            if(postedUser.email !== email){
              const result = userCollection.insertOne(user);
              res.send(result)
            }
          
      })
 
      
        app.post('/booking',async(req,res)=>{
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result)
        })

        // add product 
        app.post('/product',async(req,res)=>{
          const product = req.body;
          const result = await productCollection.insertOne(product);
          res.send(result);
      })

        app.get('/booking/:email', async(req,res)=>{
          const email = req.params.email;
          const query = { buyersEmail:email };
          const cursor = bookingCollection.find(query);
          const result = await cursor.toArray();
          res.send(result)
      })

        
    }
    finally{

    }
}
run().catch((err) => console.error(err));


app.get("/", (req, res) => {
  res.send("Horses Of Past server is running");
});

app.listen(port, () => {
  console.log(`Horses Of Past server is running on port ${port}`);
});
