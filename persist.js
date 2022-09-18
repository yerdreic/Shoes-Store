// const { MongoClient } = require("mongodb");
//import {MongoClient} from './server';
const MongoClient = require("./server");
const uri =
  "mongodb+srv://evilker:Evilker6998266@cluster0.baets.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log("DB is connected");
  } catch (e) {
    console.log(e);
  }
}

main().catch(console.error);

const findOneUserInDB = async (...params) => {
  let paramsCount = 0;
  let ans;

  params.forEach((param) => {
    paramsCount++;
  });

  if (paramsCount === 0) {
    ans = await client.db("ShoesStore").collection("Users").find({}).toArray();
  } else if (paramsCount === 1) {
    ans = await client
      .db("ShoesStore")
      .collection("Users")
      .findOne({ email: params[0] });
  } else if (paramsCount === 2) {
    ans = await client
      .db("ShoesStore")
      .collection("Users")
      .findOne({ email: params[0], password: params[1] });
  }

  return ans;
};

const findUsersViaRegex = async (searchVal) => {
  return await client
    .db("ShoesStore")
    .collection("Users")
    .find({
      $or: [
        { email: { $regex: searchVal, $options: "i" } },
        { password: null },
      ],
    })
    .toArray();
};

const insertOneUserToDB = async (...params) => {
  let paramsCount = 0;
  let ans;

  params.forEach((param) => {
    paramsCount++;
  });

  if (paramsCount === 1) {
    ans = await client
      .db("ShoesStore")
      .collection("Users")
      .insertOne({ email: params[0] });
  } else if (paramsCount === 2) {
    ans = await client
      .db("ShoesStore")
      .collection("Users")
      .insertOne({ email: params[0], password: params[1] });
  }

  return ans;
};

const findOneProductInDB = async (key, param) => {
  let ans;

  if (key === "name") {
    ans = await client
      .db("ShoesStore")
      .collection("Products")
      .findOne({ name: param });
  } else if (key === "_id") {
    ans = await client
      .db("ShoesStore")
      .collection("Products")
      .findOne({ _id: param });
  } else if (key === "noKey") {
    ans = await client
      .db("ShoesStore")
      .collection("Products")
      .find({})
      .toArray();
  }

  return ans;
};

const findProductViaRegex = async (searchVal) => {
  return await client
    .db("ShoesStore")
    .collection("Products")
    .find({
      $or: [
        { name: { $regex: searchVal, $options: "i" } },
        { price: null },
        { image: null },
      ],
    })
    .toArray();
};

const deleteOneProductInDB = async (param) => {
    return await client
      .db("ShoesStore")
      .collection("Products")
      .deleteOne({ name: param });
};

const insertOneProductToDB = async (...params) => {
  let paramsCount = 0;
  let ans;

  params.forEach((param) => {
    paramsCount++;
  });

  if (paramsCount === 3) {
    ans = await client
      .db("ShoesStore")
      .collection("Products")
      .insertOne({ name: params[0], price: params[1], image: params[3] });
  }

  return ans;
};

const findEventsInDB = async () => {
  return await client.db("ShoesStore").collection("Events").find({}).toArray();
};

const findEventsViaRegex = async (searchVal) => {
  return await client
    .db("ShoesStore")
    .collection("Events")
    .find({
      $or: [
        { login: { $regex: searchVal, $options: "i" } },
        { logout: { $regex: searchVal, $options: "i" } },
      ],
    })
    .toArray();
};

const insertOneEventToDB = async (...params) => {
  let paramsCount = 0;
  let ans;

  params.forEach((param) => {
    paramsCount++;
  });

  if (paramsCount === 2) {
    //let title = params[0];
    if (params[0] === "login") {
      ans = await client
        .db("ShoesStore")
        .collection("Events")
        .insertOne({ login: params[1] });
    } else if (params[0] === "logout") {
      ans = await client
        .db("ShoesStore")
        .collection("Events")
        .insertOne({ logout: params[1] });
    }
  }

  return ans;
};

module.exports = {
  findEventsViaRegex,
  findEventsInDB,
  findProductViaRegex,
  findUsersViaRegex,
  findOneUserInDB,
  insertOneUserToDB,
  insertOneEventToDB,
  insertOneProductToDB,
  findOneProductInDB,
  deleteOneProductInDB,
};
