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

const usersSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true },
);
const User = mongoose.model("users", usersSchema);

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

app.get("/usershtmllocalfile", (req, res) => {
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

app.get("/users", async (req, res) => {
  /**
   * <ul>
   *      <li>{user.name}</li>
   * </ul>
   */
  const allusers = await User.find({});

  const htmlres = `<ul>
           ${allusers.map((user) => `<li>${user.firstname} - ${user.email}</li> `).join("")}
            </ul>`;

  return res.status(200).send(htmlres);
});

//rest APis with file json
app.get("/api/userslocalfile", (req, res) => {
  return res.json(users);
});
app.get("/api/users", async (req, res) => {
  const AllUser = await User.find({});
  return res.status(200).json(AllUser);
});

// console.log(users);

// with local json
app.post("/api/userjsonfile", (req, res) => {
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

// with mongo
app.post("/api/user", async (req, res) => {
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

  const user = await User.create({
    firstname: body.first_name,
    lastname: body.last_name,
    jobtitle: body.job_title,
    gender: body.gender,
    email: body.email,
  });

  res.status(201).json({ msg: "success", user });
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
  .route("/apilocalfie/users/:id")
  .get((req, res) => {
    const id = User.findById(req.params.id);
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

//// mongo db
app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).json({ err: "user not found" });
    return res.json(user);
  })
  .patch(async (req, res) => {
    const body = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, {
      lastname: body.last_name,
    });
    return res.json(user);
  })
  .delete(async (req, res) => {
    const user = User.findByIdAndDelete(req.params.id);
    return res.json(user);
  });

app.listen(port, () => {
  console.log("app is running on port");
});
