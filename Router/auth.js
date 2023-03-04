// const express = require('express')
// const router = express.Router()
// const pool = require ('../config')
// const bcrypt = require('bcrypt')
// const saltRounds = 10;
// const jwt = require('jsonwebtoken')


// router.post("/register", (req,res)=>{

//     //console.log(req.body)

//     const {email, gender, password, role} = req.body;

//     const hashPassword = bcrypt.hashSync(password, saltRounds);

//     // console.log(hashPassword)

//     const insertQuery = `
//         INSERT INTO users (email, gender, password, role)
//             VALUES
//             ($1, $2, $3, $4)
//     `
//      pool.query(insertQuery,[email, gender, hashPassword, role], (err, result)=>{
//         if (err) throw err

//         res.status(201).json({
//             message: "User created successfully"
//         })
//     })
// })


// router.post("/login", (req,res)=>{

//     const {email, password} = req.body

//     // console.log(email, password)

//     const findQuery = `
//         SELECT 
//             *
//         FROM users
//         WHERE email = $1
//     `
//     pool.query(findQuery,[email], (err, result)=>{
//         if (err) throw err

//         //  res.status(200).json(result.rows[0])

//         if (result.rows[0]){
        
//             const hashPassword = result.rows[0].password

            
//             //  console.log(password)

//             const comparePass = bcrypt.compareSync(password, hashPassword);

//             if(comparePass === false){
//                  return res.status(401).json("Wrong Password");

//             } else {
//                 const accessToken = jwt.sign(
//         {
//             id: result.rows[0].id,
//             role: result.rows[0].role,
//         },
//         process.env.JWT_SEC,
//             {expiresIn:"1d"}
//         );
  
//         const { password, ...others } = result.rows[0];  
//          return res.status(200).json({
//             message: "login successfully", 
//             accessToken
//         });
//         }
//             }
//     })

// })

// module.exports = router