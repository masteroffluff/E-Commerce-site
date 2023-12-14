const Pool = require('pg').Pool
const pool = new Pool({
  user: 'fluffy',
  host: 'localhost',
  database: 'ecommercedb',
  password: 'supersecretpassword',
  port: 5432,
})


// db.userExists(email);
function userExists(email) {
  return new Promise((resolve, reject) => {
    pool.query('SELECT count(*)>0 AS customer_exists FROM customers WHERE email=$1', [email], (error, results) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(results.rows[0].customer_exists);
      }
    });
  });
}


/* 
function findByUsername(username, callback){
  pool.query('SELECT * FROM customers ORDER BY cutomer_id ASC', (error, results) => {
    if (error) {
    throw error
    }
    response.status(200).json(results.rows)
})

// findById(id, function (err, user) 
async function findById(id, callback){

}

*/
//insertUser(newUser);

function insertUser(newUser) {
  return new Promise((resolve, reject) => {
    const sql = `
    INSERT INTO customers 
    (email, password_hash, first_name, last_name, street1, street2, postcode, city, country_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    pool.query(sql, newUser, (error, results) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(results.rows[0].customer_exists);
      }
    });
  });
}


///////////////////////
// dismiss pool at end of process//
////////////////////////

process.on('exit', () => {
  pool.end();
});

process.on('SIGINT', async () => {
  // Handle Ctrl+C
  try {
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Error closing pool:', err);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  // Handle termination signal
  try {
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Error closing pool:', err);
    process.exit(1);
  }
});

process.on('uncaughtException', async (err) => {
  console.error('Uncaught exception:', err);
  try {
    await pool.end();
    process.exit(1);
  } catch (err) {
    console.error('Error closing pool:', err);
    process.exit(1);
  }
});

module.exports= {userExists,insertUser};