-- Tabla de códigos de operadoras
CREATE TABLE codigos_telefono (
  id INT AUTO_INCREMENT PRIMARY KEY,
  operadora VARCHAR(255) NOT NULL,
  codigo_operadora CHAR(4) NOT NULL UNIQUE
);

-- Tabla de categorías de productos
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE
);

-- Tabla de proveedores
CREATE TABLE proveedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  telefono CHAR(7) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  codigo_telefono_id INT NOT NULL,
  FOREIGN KEY (codigo_telefono_id) REFERENCES codigos_telefono(id)
);

-- Tabla de productos
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  stock INT NOT NULL CHECK (stock >= 0),
  precio_compra DECIMAL(10,2) NOT NULL CHECK (precio_compra >= 0),
  precio_venta DECIMAL(10,2) NOT NULL CHECK (precio_venta >= 0),
  fecha_adquisicion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_vencimiento DATETIME NOT NULL,
  categoria_id INT NOT NULL,
  proveedor_id INT NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);

-- Tabla de movimientos de inventario
CREATE TABLE movimientos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('entrada', 'salida') NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad >= 0),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  producto_id INT NOT NULL,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  rol ENUM('administrador', 'usuario') NOT NULL DEFAULT 'usuario'
);

-- Inserta un usuario administrador por defecto con contraseña 'admin123'
INSERT INTO usuarios (nombre, contrasena, rol)
VALUES ('admin', '$2b$10$X1GkReUyLL3AXL.fV6ejxuxyHvTrdELstjETLq/K7..T3b21oWv8K', 'administrador');

