const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://localhost:27017/piyushgargnodejs")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((e) => {
    console.log(e);
  });

const usersSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  jobtitle: {
    type: String,
  },
  gender: {
    type: String,
  },
});
mongoose.model("users", usersSchema);

app.use((req, res, next) => {
  //log all req
  const reqests = `${Date.now() + " " + req.method + req.path} \n`;
  fs.appendFile("./reqlog.txt", reqests, (err, result) => {
    if (err) return res.send(err.message);
    else {
      console.log(result, "done logging");
      next();
    }
  });
});

app.get("/", (req, res) => {
  return res.send("health check server running");
});

app.get("/users", (req, res) => {
  /**
   * <ul>
   *      <li>{user.name}</li>
   * </ul>
   */
  const htmlres = `<ul>
           ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
            </ul>`;

  return res.send(htmlres);
});

//rest APis
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// console.log(users);
app.post("/api/user", (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.gender ||
    !body.email ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "all fields are required" });
  }

  users.push({ id: users.length + 1, ...body });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, result) => {
    //   console.log(result);
    if (err) {
      return res.send(err);
    } else {
      return res.status(201).json({
        status: "success",
        userId: users.length,
      });
    }
  });
});

// app.get("/api/users/:id", (req, res) => {
//   const id = Number(req.params.id); // exact match and irts a number in mockjson
//   console.log(id);
//   const user = data.find((item) => {
//     return item.id === id;
//   });
//   return res.json(user);
// });
// app.patch("/api/users/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const body = req.body;

//   const index = users.findIndex((user) => user.id === id);

//   if (index === -1) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // Update user
//   users[index] = { ...users[index], ...body };

//   fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     return res.json({
//       status: "success",
//       user: users[index],
//     });
//   });
// });
// app.delete("/api/users/:id", (req, res) => {
//    const id = Number(req.params.id);

//   const index = users.findIndex((user) => user.id === id);

//   if (index === -1) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const deletedUser = users[index];

//   // Remove user
//   users.splice(index, 1);

//   fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     return res.json({
//       status: "success",
//       deletedUser,
//     });
//   });
// });

//// Grouping hte routes
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    console.log(id);
    const user = users.find((item) => {
      return item.id === id;
    });
    if (!user) return res.status(400).json({ err: "user not found" });
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user
    users[index] = { ...users[index], ...body };

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      return res.json({
        status: "success",
        user: users[index],
      });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);

    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = users[index];

    // Remove user
    users.splice(index, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      return res.json({
        status: "success",
        deletedUser,
      });
    });
  });

app.listen(port, () => {
  console.log("app is running on port");
});
