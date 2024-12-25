const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const {
  getUsuarios,
  registroUsuario,
  deleteUsuario,
  verificarUsuario,
} = require("./consultas");

app.listen(3000, console.log("SERVER ON"));
app.use(cors());
app.use(express.json());

app.get("/usuarios", async (req, res) => {
  try {
    const eventos = await getUsuarios();
    res.json(eventos);
  } catch (error) {
    res.status(error.code || 500).send(error);
  }
});
app.delete("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const autorizacion = req.headers.authorization;
    const [bearer, token] = autorizacion.split(" ");
    console.log(token);
    jwt.verify(token, "jmmb");
    const payload = jwt.decode(token);
    console.log(payload);
    await deleteUsuario(id);
    res.status(200).json({ message: "Usuario borrado con éxito" });
  } catch (error) {
    console.error(error);
    if (error.code) {
      res.status(error.code).send(error);
    } else {
      res.status(500).send(error);
    }
  }
});
app.post("/usuarios", async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    await registroUsuario(email, password, rol, lenguage);
    res.status(200).json({ message: "usuario registrado" });
  } catch (error) {
    console.error(error);
    res.status(error.code || 500).send(error);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password} = req.body;
    await verificarUsuario(email, password);
    const token = jwt.sign({ email, status: "Activo" }, "jmmb");

    res.status(200).json({ message: "usuario autenticado", token });
  } catch (error) {
    console.error(error);
    res.status(error.code || 500).send(error);
  }
});
