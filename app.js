const express = require("express");

const app = express();

const PORT = 4000;

// Importar a configuração do banco de dados (mongoose)
const db = require("./config/db.config");
// Invoca a função que realiza a conexão com o banco de dados
db();

// Configurar o nosso app para entender requisições com conteudo em JSON
app.use(express.json());

// Importar os roteadores
const roomRouter = require("./routes/room.routes");
app.use("/", roomRouter);

// Subir o servidor web para escutar as requisições
app.listen(PORT, () => console.log(`Server up at PORT ${PORT}`));
