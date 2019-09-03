const db = require("../util/database");
const nodeMailer = require("nodemailer");
const bcrypt = require("bcryptjs");

//config Mail
const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

//GET all users details
exports.getAllUsers = (req, res) => {
  console.log(process.env.PASSWORD);
  db.query("SELECT PersonId, Name, Address FROM users")
    .then(result => {
      res.status(200).json({ result: result });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
};

//POST create one User (Register)
exports.registerUser = (req, res) => {
  // return console.log(req.body);
  const { PersonId, Name, Address } = req.body;
  let Password = req.body.Password;
  bcrypt.genSalt(12, (err, salt) => {
    if (err) {
      return res.json({ error: err });
    }
    bcrypt.hash(Password, salt, (err, hash) => {
      Password = hash;
      var sql = `INSERT INTO users (PersonId, Name, Address, Password) VALUES ("${PersonId}", "${Name}", "${Address}", "${Password}")`;

      db.query(sql)
        .then(result => {
          res.status(200).json({ msg: "User Created Success" });
        })
        .catch(err => {
          res.json({ msg: "User Created Fail", err: err });
        });
    });
  });
};

//POST Login User
exports.loginUser = (req, res) => {
  const { PersonId, Password } = req.body;

  db.query(`SELECT * FROM users WHERE PersonId = "${PersonId}" `)
    .then(user => {
      // console.log(user[0].Password);
      const hash = user[0].Password.toString();
      bcrypt.compare(Password, hash, (err, response) => {
        if (err) {
          return res.json({ err: err });
        }
        if (response === true) {
          res.status(200).json({ msg: "Login Success", user: user });
        } else {
          res.status(400).json({ msg: "Invalid Id or Password" });
        }
      });
    })
    .catch(err => {
      res.json({ err: err });
    });
};

//POST Update one User
exports.updateUser = (req, res) => {
  const { PersonId, Name, Address } = req.body;
  let sql = `UPDATE users SET Name = "${Name}", Address = "${Address}" WHERE PersonId = "${PersonId}" `;

  db.query(sql)
    .then(result => {
      res.status(200).json({ msg: "Updated Success" });
    })
    .catch(err => {
      res.status(500).json({ msg: "Updated Fail", error: err });
    });
};

//POST Delete one User
exports.deleteUser = (req, res) => {
  const { PersonId } = req.body;
  let exits = `SELECT * FROM users WHERE PersonId = "${PersonId}" `;

  db.query(exits)
    .then(user => {
      if (user[0].Name) {
        db.query(`DELETE FROM users WHERE PersonId = "${PersonId}" `).then(
          result => {
            res.status(200).json({ msg: "User Deleted Success" });
          }
        );
      }
    })

    .catch(err => {
      res.json({ error: "User Id Not Exits" });
    });
};

//Sending Mail
exports.sendMail = (req, res) => {
  const { email } = req.body;
  transporter.sendMail(
    {
      to: email,
      from: process.env.EMAIL_ID,
      subject: "Welcome",
      html: process.env.output
    },
    (err, info) => {
      if (err) {
        return res.json({ err: err });
      }
      console.log("Message sent: %s", info.messageId);
      res.status(200).json({ msg: "Message sent" });
    }
  );
};
