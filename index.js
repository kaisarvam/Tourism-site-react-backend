const express = require('express');
const cors  = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qrydk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){

    try{
      await client.connect();
      console.log("mongodb connected successfully");
      const database = client.db("Travel_site");
      const TravelSiteItems = database.collection("Services");
      const TravelSiteCartItems = database.collection("Carts");


    //=============================== Carts codes ===============================================================

      // Get All Carts
      app.get("/view/carts", async (req, res) => {
        const cursor = TravelSiteCartItems.find({});
        const itemsFound = await cursor.toArray();
        console.log("cursor is :", itemsFound);
        res.send(itemsFound);
      });


        // POST New Cart
        app.post("/add/cart", async (req, res) => {
            console.log("hit the post api for cart");
            const data = req.body.cartData;
            console.log("data here to post ",data);
            const result = await TravelSiteCartItems.insertOne(data);
            console.log("data is :", result);
            res.send(result);
          });


      // GET one person's cart
      app.get("/get/carts/:uid", async (req, res) => {
        const {uid}  = req.params;
        console.log("request id is : ", uid);
        const query = { uid: uid };
        const cursor =  TravelSiteCartItems.find(query);
        const cartsFound = await cursor.toArray();
        console.log("product found is :", cartsFound);
        res.send(cartsFound);
      });



       //Update Single Cart
       app.put("/update/cart/:id", async (req, res) => {
        const { id } = req.params;
        console.log("hitted update is is : ", id);
        const updateCart = req.body.data;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
           status : updateCart.status,
          },
        };

        console.log("updated Cart is : ", updateDoc);
        const result = await TravelSiteCartItems.updateOne(
          filter,
          updateDoc,
          options
        );

        console.log("final update cart result is : ", result);
        res.send(result);
      });




      //Delete Item From Cart

      app.delete("/delete/carts/:id", async (req, res) => {
        const { id } = req.params;
        console.log("request id is : ", id);
        const query = { _id: ObjectId(id) };
        const result =  TravelSiteCartItems.deleteOne(query);
        console.log("deleted cart id : ", id);
        res.send(result);
      });

//======================================= Services Codes ================================================


      // Get All Services
      app.get("/view/services", async (req, res) => {
        const cursor = TravelSiteItems.find({});
        const servicesFound = await cursor.toArray();
        console.log("cursor is :", servicesFound);
        res.send(servicesFound);
      });





      // GET single Service
      app.get("/get/service/:id", async (req, res) => {
        const { id } = req.params;
        console.log("request id is : ", id);
        const query = { _id: ObjectId(id) };
        const ServiceFound = await TravelSiteItems.findOne(query);
        console.log("product found is :", ServiceFound);
        res.send(ServiceFound);
      });

      // POST New Service
      app.post("/add/service", async (req, res) => {
        console.log("hit the post api");
        const data = req.body;
        console.log("req data to post ",data);
        const result = await TravelSiteItems.insertOne(data);
        console.log("data is :", result);
        res.send(result);
      });

      //Update Single Service
      app.put("/update/service/:id", async (req, res) => {
        const { id } = req.params;
        console.log("hitted update is is : ", id);
        const updateService = req.body.data;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            serviceName: updateService.serviceName,
            country: updateService.country,
            image: updateService.image,
            description: updateService.description,
            price: updateService.price,
            rating: updateService.rating,
            rated: updateService.rated,
          },
        };

        console.log("updated Service is : ", updateDoc);
        const result = await TravelSiteItems.updateOne(
          filter,
          updateDoc,
          options
        );

        console.log("final update result is : ", result);
        res.send(result);
      });
    }finally{
        // client.close();
    }
}

run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Travel Sites Backend server is running');
})

app.listen(port,()=>{
    console.log("server is running at port :",port);
});
