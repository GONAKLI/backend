let express = require("express");
let cors = require("cors");
let mongoose = require("mongoose");


let app = express();
let session = require("express-session");
let port = 5005;
let mongo_url =
  "mongodb+srv://sanju:sanju@go-nakli.9rao9tp.mongodb.net/college?appName=GO-NAKLI";

const AdminAuthCheck = require("./Routes/AuthorizationRoutes/AdminAuth");
const AdminRoutes = require("./Routes/AdminRoutes");
const TeacherRoutes = require("./Routes/TeacherRoutes");
const TeacherAuthCheck = require("./Routes/AuthorizationRoutes/TeacherAuth");
let mongosession = require("connect-mongodb-session")(session);

let store = new mongosession({
  uri: mongo_url,
  collection: "user_sessions",
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://gonakli.com", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(
  session({
    secret: "sessionkey",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false },
  }),
);

app.use('/TeacherImages', express.static('TeacherImages'));
app.use("/StudentImages", express.static("StudentImages"));

app.use(AdminAuthCheck);
app.use(TeacherAuthCheck);
app.use(AdminRoutes);
app.use(TeacherRoutes);

mongoose.connect(mongo_url).then(() => {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
});
