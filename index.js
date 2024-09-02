const express = require("express");
const cryptolib = require("./libs/customcrypto");
var cookieParser = require("cookie-parser");
var parsetrace = require("parsetrace");

const isDevelopmentEnv = true;

const app = express();
const port = 3000;

const flag = "flag{SECRET_KEY}";
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let database = {
  guest: "guestPW",
  admin: "FAKE_PW",
};

app.get("/", async (req, res) => {
  try {
    let token = req.cookies.auth || "";
    const payloadData = await cryptolib.readJWT(token, "FAKE_KEY");
    if (payloadData) {
      userflag = payloadData["uid"] == "admin" ? flag : "You are not admin";
      res.render("main", { username: payloadData["uid"], flag: userflag });
    } else {
      res.render("login");
    }
  } catch (e) {
    if (isDevelopmentEnv) {
      res.json(JSON.parse(parsetrace(e, { sources: true }).json()));
    } else {
      res.json({ message: "error" });
    }
  }
});

app.post("/validate", async (req, res) => {
  try {
        if (
          typeof database[req.body["id"]] !== "undefined" && database[req.body["id"]] === req.body["pw"]) {
          jwt = await cryptolib.generateJWT(req.body["id"], "FAKE_KEY");
          res
            .cookie("auth", jwt, {
              maxAge: 30000,
            })
            .send(
              "<script>alert('success');document.location.href='/'</script>"
            );
        } else {
          res.json({ message: "error", detail: "invalid id or password" });
        }
    } catch (e) {
    console.log("error");
  }
});

app.listen(port);
