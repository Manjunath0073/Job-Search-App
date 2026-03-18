const express = require("express")
const { initializeDB } = require("./database")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())

let db = null  // ✅ define here

// Connect DB properly
initializeDB().then(database => {
  db = database
})

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]

  if (!authHeader) {
    return res.status(401).send("Token missing")
  }

  const token = authHeader.split(" ")[1]

  jwt.verify(token, "MY_SECRET_KEY", (err, payload) => {
    if (err) {
      return res.status(403).send("Invalid token")
    }

    req.user = payload
    next()
  })
}

// API
app.get("/jobs",authenticateToken, async (req, res) => {
  const jobs = await db.all("SELECT * FROM jobs")
  res.json(jobs)
})

app.listen(3001, () => {
  console.log("Server running on port 3001")
})

app.post("/register", async (req, res) => {
  const { username, password } = req.body

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, hashedPassword]
    )

    res.send("User created successfully")
  } catch (error) {
    res.status(400).send("User already exists")
  }
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body

  const user = await db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  )

  if (!user) {
    return res.status(400).send("Invalid user")
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)

  if (isPasswordMatch) {
    const payload = {
      username: user.username,
    }

    const token = jwt.sign(payload, "MY_SECRET_KEY")

    res.json({ jwtToken: token })
  } else {
    res.status(400).send("Invalid password")
  }
})

app.post("/apply/:jobId", authenticateToken, async (req, res) => {
  const { jobId } = req.params
  const username = req.user.username

  const date = new Date().toISOString()

  await db.run(
    `INSERT INTO applications (username, job_id, applied_at)
     VALUES (?, ?, ?)`,
    [username, jobId, date]
  )

  res.send("Applied successfully")
})

app.get("/my-applications", authenticateToken, async (req, res) => {
  const username = req.user.username

  const data = await db.all(
    `SELECT jobs.title, jobs.company, applications.applied_at
     FROM applications
     JOIN jobs ON applications.job_id = jobs.id
     WHERE applications.username = ?`,
    [username]
  )

  res.json(data)
})