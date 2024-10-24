const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Para hash de senha
const multer = require('multer');  // Importa o Multer
const path = require('path');

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());  // Para lidar com JSON

// Servir arquivos de imagens (uploads)
app.use('/uploads', express.static('uploads'));

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Define a pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));  // Define o nome único do arquivo
  }
});

// Filtro para aceitar apenas arquivos de imagem (jpeg e png)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo não suportado. Apenas JPEG e PNG são permitidos.'), false);
  }
};

// Limite de tamanho do arquivo para 5MB e aplicação dos filtros
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },  // Limite de 5MB
  fileFilter: fileFilter
});

// Endpoint para cadastrar um novo paciente com upload de foto
app.post('/pacientes', upload.single('foto'), async (req, res) => {
  const { nome, dataNascimento, sexo, altura, peso, endereco, telefoneContato, telefoneEmergencia } = req.body;

  // Logs para depuração
  console.log('Dados recebidos:', req.body);
  console.log('Arquivo recebido:', req.file);

  // Verifique se o arquivo foi recebido corretamente
  if (!req.file) {
    console.error('Nenhuma imagem foi enviada');
    return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
  }

  const foto = req.file ? req.file.filename : null;  // Pega o nome do arquivo da foto, se houver

  try {
    const novoPaciente = await prisma.paciente.create({
      data: {
        nome,
        dataNascimento: new Date(dataNascimento),
        sexo,
        altura: parseFloat(altura),
        peso: parseFloat(peso),
        foto,  // Armazena o nome do arquivo da foto
        endereco,
        telefoneContato,
        telefoneEmergencia,
      },
    });

    console.log('Paciente cadastrado com sucesso:', novoPaciente);
    res.status(201).json(novoPaciente);
  } catch (error) {
    console.error('Erro ao cadastrar paciente:', error);
    res.status(500).json({ error: 'Erro ao cadastrar paciente' });
  }
});



// Método GET para listar pacientes
app.get('/pacientes', async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany(); // Busca todos os pacientes
    res.json(pacientes); // Retorna como JSON
  } catch (error) {
    console.error('Erro ao buscar Pacientes:', error);
    res.status(500).json({ error: 'Erro ao buscar Pacientes' });
  }
});

// Endpoint de upload de foto (visualização)
app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);  // Corrige o caminho do arquivo
  
  // Verifica se o arquivo existe antes de enviá-lo
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Erro ao enviar o arquivo:', err);
      res.status(404).json({ error: 'Arquivo não encontrado' });
    }
  });
});


// Outros endpoints (funcionários, login, etc.) permanecem os mesmos

// Endpoint de Login
app.post('/login', async (req, res) => {
  const { login, senha } = req.body;

  try {
    const funcionario = await prisma.funcionario.findUnique({
      where: { login }
    });

    if (!funcionario) {
      return res.status(400).json({ error: 'Login ou senha incorretos' });
    }

    const senhaValida = await bcrypt.compare(senha, funcionario.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: 'Login ou senha incorretos' });
    }

    // Verifica se o usuário é admin
    const isAdmin = login === 'Admin' && senha === 'Admin';

    res.status(200).json({ message: 'Login bem-sucedido', isAdmin });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Métodos para funcionários (CRUD: GET, POST, PUT, DELETE) permanecem iguais...

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
