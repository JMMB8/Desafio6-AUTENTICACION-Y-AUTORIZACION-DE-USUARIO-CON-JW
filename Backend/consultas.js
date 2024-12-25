const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "5411747",
  database: "softjobs",
  allowExitOnIdle: true,
});

const getUsuarios = async () => {
  const { rows: eventos } = await pool.query("SELECT * FROM usuarios");
  return eventos;
};

const deleteUsuario = async (id) => {
  const consulta = "DELETE FROM usuarios WHERE id = $1";
  const values = [id];
  const { rowCount } = await pool.query(consulta, values);
  if (!rowCount)
    throw { code: 404, message: "No se encontró ningún evento con este ID" };
};

const registroUsuario = async (email, password, rol, lenguage) => {
  const sql =
    "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
  const values = [email, password, rol, lenguage];
  const { rowCount } = await pool.query(sql, values);
  if (!rowCount)
    throw {
      code: 404,
      message: "no se pudo registrar el usuario",
    };
};

const verificarUsuario = async (email, password) => {
  const sql = "SELECT id FROM usuarios WHERE email = $1 AND password =  $2";
  const values = [email, password];
  const { rowCount } = await pool.query(sql, values);
  if (!rowCount)
    throw {
      code: 404,
      message: "credenciales invalidos",
    };
};

module.exports = {
  getUsuarios,
  registroUsuario,
  deleteUsuario,
  verificarUsuario,
};
