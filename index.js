const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000

// middleware 
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.l9yjteg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();
    const coffeeCollection = client.db('coffeeDB').collection('coffee')

    app.get('/coffee',async(req,res) => {
      const cursor = await coffeeCollection.find().toArray();
      res.send(cursor)
      
    })
    app.get('/coffee/:id',async(req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result);
      
    })

    app.post('/coffee',async(req,res)=>{
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result)
    })

    app.put('/coffee/:id', async(req,res) =>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCCoffee = req.body
      const update = {
        $set: {
          name:updateCCoffee.name,
          chef:updateCCoffee.chef,
          Price:updateCCoffee.Price,
          taste:updateCCoffee.taste,
          Photo:updateCCoffee.Photo,
          details:updateCCoffee.details,
          category:updateCCoffee.category
        },
      };
      const result = await coffeeCollection.updateOne(filter, update, options);
      res.send(result)
      console.log(id);
    })

    app.delete('/coffee/:id' , async(req,res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res) => {
    res.send('coffee making server is running')
})


app.listen(port, ()=>{
    console.log('coffee making server running port on',port);
})