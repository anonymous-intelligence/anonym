const mysql = require('mysql2/promise');

// XAMPP MySQL bağlantı konfigürasyonu
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP'te varsayılan olarak şifre yok
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8'
};

// Connection pool oluştur
const pool = mysql.createPool(dbConfig);

// Bağlantıyı test et
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL bağlantısı başarılı!');
    
    // Mevcut veritabanlarını listele
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('📊 Mevcut veritabanları:');
    databases.forEach(db => {
      console.log(`   - ${db.Database}`);
    });
    
    // Önemli veritabanlarının tablolarını kontrol et
    const importantDbs = ['gsmtc', '101m', 'secmen', 'data', 'veri'];
    
    for (const dbName of importantDbs) {
      try {
        await connection.query(`USE ${dbName}`);
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`📋 ${dbName} veritabanı tabloları:`);
        tables.forEach(table => {
          const tableName = Object.values(table)[0];
          console.log(`   - ${tableName}`);
        });
      } catch (error) {
        console.log(`❌ ${dbName} veritabanı bulunamadı veya erişilemiyor`);
      }
    }
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL bağlantı hatası:', error.message);
    return false;
  }
}

// Belirli bir veritabanına bağlan
async function getConnection(database) {
  try {
    const connection = await pool.getConnection();
    // USE komutunu query ile çalıştır (execute değil)
    await connection.query(`USE ${database}`);
    return connection;
  } catch (error) {
    console.error(`${database} veritabanına bağlantı hatası:`, error.message);
    throw error;
  }
}

module.exports = {
  pool,
  testConnection,
  getConnection,
  dbConfig
}; 