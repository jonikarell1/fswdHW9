const express = require('express')
const router = express.Router()
const pool = require ('../config')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const DEFAULT_LIMIT = 10
const DEFAULT_PAGE = 1
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middlewares/Auth');


router.get("/users", verifyTokenAndAdmin,(req,res)=>{

    const {limit, page} = req.query;

    let resultLimit = limit ? +limit : DEFAULT_LIMIT;
    let resultPage = page ? +page : DEFAULT_PAGE;

    const query = `
        SELECT 
            *
        FROM users
    `
    pool.query (query, (err,result)=>{
        if (err) throw err

        res.status(200).json(result.rows)
    })
})
router.get("/users/:id", verifyTokenAndAuthorization, (req,res)=>{

    const {id} = req.params
    const query = `
        SELECT 
            *
        FROM users
            WHERE id = $1
    `
    pool.query(query,[id], (err, result)=>{
        if (err) throw err

        res.status(200).json(result.rows[0])
    })
})

router.put("/users/:id", verifyTokenAndAuthorization, (req,res)=>{

    const {id} = req.params
    const {email, gender, password, role} = req.body;

    const updateQuery = `
        UPDATE users
            SET email = $1,
                gender = $2,
                password = $3,
                role = $4
        WHERE id = $5;
    `
    pool.query(updateQuery, [email, gender, password, role, id], (err, result)=>{
        if(err) throw err

        res.status(200).json({
            message: "User updated successfully"
        })
    })

})

router.delete("/users/:id", verifyTokenAndAuthorization, (req,res)=>{
    const {id} = req.params

    const findQuery = `
        SELECT 
            *
        FROM users
        WHERE id = $1
    `
    pool.query(findQuery,[id], (err, response)=>{
        if(err) throw err

        
        if (response.rows[0]){

            const deleteQuery = `
                DELETE FROM users
                WHERE id = $1;
            `
            pool.query(deleteQuery,[id],(err,response)=>{
                if (err) throw err

                res.status(200).json({
                    message: "User deleted successfully"
                })
            })
        }
    })
})

module.exports = router