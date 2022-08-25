const express = require("express");
const app = express();
require("./src/db/conn");
const port = process.env.PORT || 3000;

const User = require("./src/models/userschema");

app.use(express.json());

//crypto password
const crypto = require("crypto");
const key = "password";
const algo = "aes128";

//jwt token
const jwt = require("jsonwebtoken");
jwtkey = "jwt";

app.post("/register", (req, res) => {
  // try{
  const cipher = crypto.createCipher(algo, key);
  const encrypted =
    cipher.update(req.body.password, "utf8", "hex") + cipher.final("hex");
  const createUser = new User({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    password: encrypted,
  });
  createUser
    .save()
    .then((result) => {
      jwt.sign({ result }, jwtkey, (err, token) => {
        res
          .status(201)
          .send({ message: "user create successfully",data:result, token: token });
      });
    })
    .catch((error) => {
      res.status(400).send({ message: "data not submited", error: error });
    });
});

//login api

app.post("/login", async (req, res) => {
  await User.findOne({ email: req.body.email })
    .then((data) => {
      const decipher = crypto.createDecipher(algo, key);
      const decrypted =
        decipher.update(data.password, "hex", "utf8") + decipher.final("utf8");

      if (decrypted == req.body.password) {
        jwt.sign({ data }, jwtkey, (err, token) => {
          res
            .status(200)
            .send({
              message: "user Login SuccessFully",
              data: { email: data.email, password: data.password },
              token: token,
            });
        });
      }
    })
    .catch((error) => {
      res.status(400).send({ message: "user Login Failed", error: error });
    });
});

app.get('/user',verifyToken,(req,res)=>{
    User.find().then((result)=>{
        res.status(200).send(result);
    }).catch((error)=>{
        res.status(400).send(error);
    })
})

function verifyToken(req,res,next){
    const bearerToken = req.headers["authorization"];
   
    if(typeof bearerToken !== "undefined"){
        const bearer = bearerToken.split(" ");
        req.token = bearer[1];    
        jwt.verify(req.token,jwtkey,(err,authData)=>{
            if(err){
                res.status(400).send({message:err})
            }else{
                if(authData){
                    res.status(200).send({message:"successfully",authData});
                }else{
                    next()
                }
            }
        })
    }else{
        res.send({result:"Token is Not Provided"})
    }
}

app.listen(port, () => console.log(`port is running on : ${port}`));
