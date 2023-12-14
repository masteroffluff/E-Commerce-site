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
        console.log("error in userExists");
        reject(error);
      } else {
        resolve(results.rows[0].customer_exists);
      }
    });
  });
}



async function findByUsername(username, callback){
  try{
    console.log ("starting findByUsername")
    const userExist = await userExists(username)
    if (userExist){
      
      user = await getUser(username)
      //console.log(user)
      callback(null,user)
    }
    else {
      callback (null,false)
    }
    

  } catch (err){
    console.log ("error in findByUsername")
    callback(err,null)
  }
}

function getUser(email) {
  return new Promise((resolve, reject) => {
    pool.query('SELECT customers_id,password_hash FROM customers WHERE email=$1', [email], (error, results) => {
      if (error) {
        console.log("error in getuser");
        reject(error);
      } else {
        resolve({
          id:results.rows[0].customers_id,
          password:results.rows[0].password_hash
        });
      }
    });
  });
}


// findById(id, function (err, user) 
async function findById(id, callback){
  try{
  const user = await getUserbyId(id)
  callback(null,user)
} catch (err){
  console.log ("error in findById")
  callback(err,null)
}

}

function getUserbyId(customers_id) {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM customers WHERE customers_id=$1', [customers_id], (error, results) => {
      if (error) {
        console.log("error in getuser");
        reject(error);
      } else {
        resolve({
          id:results.rows[0].customers_id,
          password:results.rows[0].password_hash,
          ...results.rows[0]
        });
      }
    });
  });
}

function updateUser(customerId,newDetails){
  return new Promise((resolve, reject) => {
      const newDetails1 = Object.entries(newDetails).filter(([key,value])=>value!=undefined)
      const sqlSet =newDetails1.map(([key,value],index) => `${key}=$${index+2}`).join(",");
      console.log(sqlSet);
      const sql = `UPDATE customers SET ${sqlSet} WHERE customers_id=$1`
      console.log(sql);
      newParams = [customerId,...newDetails1.map(([key,value])=>value)]
      pool.query(sql, newParams, (error) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
}



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
        resolve(true);
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

module.exports= {userExists,insertUser,findByUsername,findById,updateUser};