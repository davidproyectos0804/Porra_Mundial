// Servicio de usuarios - Mock data
// Aquí se definirían las operaciones con datos de usuarios
// Por ahora usamos datos mockeados (sin base de datos)

// Mock data: Lista de usuarios de ejemplo
const mockUsers = [
  {
    id: 1,
    name: 'Juan García',
    email: 'juan.garcia@example.com'
  },
  {
    id: 2,
    name: 'María López',
    email: 'maria.lopez@example.com'
  },
  {
    id: 3,
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@example.com'
  },
  {
    id: 4,
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com'
  },
  {
    id: 5,
    name: 'Pedro Sánchez',
    email: 'pedro.sanchez@example.com'
  }
];

// Función para obtener todos los usuarios
const getAllUsers = () => {
  return mockUsers;
};

// Función para obtener un usuario por ID (preparada para futuro uso)
const getUserById = (id) => {
  return mockUsers.find(user => user.id === id);
};

module.exports = {
  getAllUsers,
  getUserById
};
