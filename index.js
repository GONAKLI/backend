let express = require("express");
let cors = require("cors");
let mongoose = require("mongoose");
let bcrypt = require("bcryptjs");
let app = express();
let session = require("express-session");
let port = 5005;
let mongo_url =
  "mongodb+srv://sanju:sanju@go-nakli.9rao9tp.mongodb.net/college?appName=GO-NAKLI";

let { admin } = require("./Schema/admin");
const Teacher = require("./Schema/add_teacher");
let mongosession = require("connect-mongodb-session")(session);

let store = new mongosession({
  uri: mongo_url,
  collection: "user_sessions",
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "https://gonakli.com", credentials: true }));
app.use(
  session({
    secret: "sessionkey",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false },
  }),
);

app.get("/admin/dashboard", (req, res, next) => {
  if (req.session && req.session.islogged) {
    res.json({
      message: `welcome ${req.session.name}`,
    });
  } else {
    res.status(401).json({ reason: "unauthorized" });
  }
});

app.post("/admin_signup", async (req, res) => {
  let { name, email, mobile, password } = req.body;
  let hashed = await bcrypt.hash(password, 15);
  let admin_data = new admin({
    name,
    email,
    mobile,
    password: hashed,
  });
  admin_data.save().then(() => {
    res.json({
      request: "fullfilled",
    });
  });
});

app.post("/admin_signin", async (req, res) => {
  let user = await admin.findOne({ email: req.body.email });
  if (user) {
    let checker = await bcrypt.compare(req.body.password, user.password);

    if (checker) {
      req.session.name = user.name.toString();
      req.session.user = user._id.toString();
      req.session.email = user.email.toString();
      req.session.islogged = true;

      res.json({
        reason: "user found",
        userid: user._id,
      });
    } else {
      res.json({
        email: user.email,
        reason: "incorrect password",
      });
    }
  } else {
    res.status(200).json({
      status: 404,
      reason: "user not found",
    });
  }
});

app.post("/admin/add-teacher", async (req, res, next) => {
  // if(req.session && req.session.islogged===true){
  let { name, address, email, dob, mobile, qualification, profilePic } =
    req.body;
  let admin_id = req.session.user;
  let admin_email = req.session.email;
  let admin_name = req.session.name;
  let teacher_data = new Teacher({
    name,
    address,
    email,
    dob,
    mobile,
    qualification,
    profilePic,
    admin_id,
    admin_email,
    admin_name,
  });
  teacher_data
    .save()
    .then(() => {
      res.status(200).json({
        response: "teacher added sucessfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        response: "unable to add teacher",
      });
    });
  // }
});

app.get("/admin/get-teachers", (req, res) => {
  Teacher.find({
    admin_id: req.session.user,
    admin_email: req.session.email,
  }).then((teacher) => {
    res.status(200).json(teacher);
  });
});

app.delete("/admin/delete-teacher/:id", (req, res) => {
  Teacher.findByIdAndDelete(req.params.id).then(() => {
    Teacher.find().then((teacher) => {
      res.json(teacher);
    });
  });
});
app.post("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({
        reason: `logout failed, ${err}`
      });
    } else {
      res.clearCookie("connect.sid");
      res.status(200).json({
        reason: "sucessfully logout",
      });
    }
  });
});

mongoose.connect(mongo_url).then(() => {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
});
