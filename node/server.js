const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

let connection;

(async () => {
  connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
  });

  await connection.query("DROP TABLE  IF EXISTS people;");

  await connection.query(
    "CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255));"
  );

  const people = [
    { id: 1, name: "João" },
    { id: 2, name: "Fernando" },
    { id: 3, name: "Pedro" },
  ];

  people.forEach(async (person) => {
    const query = `INSERT INTO people (name) VALUES ('${person.name}')`;
    await connection.query(query);
  });
})();

app.get("/", async (_req, res) => {
  const [people] = await connection.query("SELECT id, name FROM people");

  const html = `
    <html>
      <head>
        <title>Lista de Pessoas</title>
      </head>
      <body>
        <h1>Full Cycles Rocks!</h1>
        <ul>
          ${people.map((person) => `<li>${person.name}</li>`).join("")}
        </ul>
      </body>
    </html>
  `;

  // Definindo o cabeçalho da resposta como HTML e enviando o conteúdo
  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

app.listen(process.env.PORT, () => {
  console.log("Example app listening on port 3001!");
});
