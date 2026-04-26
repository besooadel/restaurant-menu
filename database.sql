-- ============================================
-- Restaurant Digital Menu - Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS restaurant_menu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE restaurant_menu;

-- Categories Table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  icon VARCHAR(10),
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150),
  description_ar TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  stock_quantity INT DEFAULT 100,
  is_available TINYINT(1) DEFAULT 1,
  is_featured TINYINT(1) DEFAULT 0,
  calories INT DEFAULT 0,
  prep_time INT DEFAULT 15,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Addons Groups Table
CREATE TABLE addon_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  is_required TINYINT(1) DEFAULT 0,
  max_selections INT DEFAULT 1,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Addons Table
CREATE TABLE addons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  price DECIMAL(10,2) DEFAULT 0.00,
  is_available TINYINT(1) DEFAULT 1,
  FOREIGN KEY (group_id) REFERENCES addon_groups(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_number VARCHAR(10) NOT NULL,
  status ENUM('pending','confirmed','preparing','ready','delivered','cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  addons_json TEXT,
  addons_price DECIMAL(10,2) DEFAULT 0.00,
  notes TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Admin Users Table
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin','admin','staff') DEFAULT 'admin',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Slider/Banner Table
CREATE TABLE banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_ar VARCHAR(200),
  title_en VARCHAR(200),
  subtitle_ar VARCHAR(300),
  image_url VARCHAR(500),
  link_product_id INT NULL,
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Sample Data
-- ============================================

INSERT INTO admin_users (username, password_hash, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');
-- Default password: password

INSERT INTO categories (name_ar, name_en, icon, sort_order) VALUES
('المقبلات', 'Starters', '🥗', 1),
('البيتزا', 'Pizza', '🍕', 2),
('البرغر', 'Burgers', '🍔', 3),
('المشويات', 'Grills', '🥩', 4),
('المشروبات', 'Drinks', '🥤', 5),
('الحلويات', 'Desserts', '🍰', 6);

INSERT INTO products (category_id, name_ar, name_en, description_ar, price, stock_quantity, is_featured, calories, prep_time) VALUES
(1, 'سلطة سيزر', 'Caesar Salad', 'سلطة طازجة مع صلصة السيزر والخبز المحمص وجبن البارميزان', 35.00, 50, 0, 280, 10),
(1, 'حساء الطماطم', 'Tomato Soup', 'حساء طماطم كريمي مع الريحان الطازج', 28.00, 30, 0, 180, 15),
(2, 'بيتزا مارغريتا', 'Margherita Pizza', 'بيتزا كلاسيكية بصلصة الطماطم وجبن الموزاريلا والريحان', 65.00, 20, 1, 850, 20),
(2, 'بيتزا بيبروني', 'Pepperoni Pizza', 'بيتزا بالبيبروني الشهي وجبن الموزاريلا المذاب', 75.00, 20, 1, 950, 20),
(3, 'برغر كلاسيك', 'Classic Burger', 'برغر لحم بقري طازج مع الخس والطماطم والبصل', 55.00, 40, 1, 650, 15),
(3, 'تشيز برغر', 'Cheese Burger', 'برغر مزدوج مع جبن شيدر ذائب وصلصة خاصة', 65.00, 40, 0, 750, 15),
(4, 'مشاوي مشكلة', 'Mixed Grill', 'تشكيلة من أفخر اللحوم المشوية مع الخضروات', 120.00, 15, 1, 1200, 30),
(4, 'دجاج مشوي', 'Grilled Chicken', 'دجاج مشوي على الفحم مع التوابل الشرقية', 75.00, 25, 0, 520, 25),
(5, 'عصير برتقال', 'Orange Juice', 'عصير برتقال طازج 100٪', 20.00, 100, 0, 120, 5),
(5, 'كولا', 'Cola', 'مشروب غازي بارد', 15.00, 200, 0, 140, 2),
(6, 'كيك الشوكولاتة', 'Chocolate Cake', 'كيك شوكولاتة فاخر مع الكريمة والفراولة', 45.00, 20, 1, 480, 10),
(6, 'آيس كريم', 'Ice Cream', 'آيس كريم بنكهات متعددة', 30.00, 50, 0, 320, 5);

INSERT INTO addon_groups (product_id, name_ar, name_en, is_required, max_selections) VALUES
(3, 'حجم البيتزا', 'Pizza Size', 1, 1),
(3, 'إضافات', 'Extras', 0, 3),
(5, 'الإضافات', 'Add-ons', 0, 3),
(5, 'الصلصة', 'Sauce', 0, 1);

INSERT INTO addons (group_id, name_ar, name_en, price) VALUES
(1, 'صغير 25سم', 'Small 25cm', 0),
(1, 'وسط 30سم', 'Medium 30cm', 10),
(1, 'كبير 35سم', 'Large 35cm', 20),
(2, 'جبن إضافي', 'Extra Cheese', 8),
(2, 'فطر', 'Mushrooms', 5),
(2, 'زيتون', 'Olives', 5),
(3, 'جبن شيدر', 'Cheddar Cheese', 5),
(3, 'بيض مقلي', 'Fried Egg', 7),
(3, 'بيكون', 'Bacon', 10),
(4, 'كاتشب', 'Ketchup', 0),
(4, 'مايونيز', 'Mayonnaise', 0),
(4, 'صلصة حارة', 'Hot Sauce', 0);

INSERT INTO banners (title_ar, title_en, subtitle_ar, image_url, sort_order) VALUES
('عروض اليوم', 'Today''s Offers', 'استمتع بأشهى الوجبات بأفضل الأسعار', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200', 1),
('البيتزا الطازجة', 'Fresh Pizza', 'معجنات يومية من أجود المكونات', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200', 2),
('مشويات فاخرة', 'Premium Grills', 'لحوم طازجة مشوية على الفحم الطبيعي', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', 3);
