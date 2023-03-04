const express = require('express')
const router = express.Router()
const pool = require ('../config')
const {verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization} = require ('../middlewares/Auth')
const DEFAULT_LIMIT = 10
const DEFAULT_PAGE = 1

router.get("/movies", verifyToken, (req,res)=>{

    const {limit, page} = req.query;

    let resultLimit = limit ? +limit : DEFAULT_LIMIT;
    let resultPage = page ? +page : DEFAULT_PAGE;
    const query = `
        SELECT 
            *
        FROM movies 
        LIMIT ${resultLimit}
        OFFSET ${(resultPage - 1) * resultLimit}
    `
    pool.query (query, (err,result)=>{
        if (err) throw err

        res.status(200).json(result.rows)
    })
})
router.get("/movies/:id", verifyToken, (req,res)=>{

    const {id} = req.params
    const query = `
        SELECT 
            *
        FROM movies
            WHERE id = $1
    `
    pool.query(query,[id], (err, result)=>{
        if (err) throw err

        res.status(200).json(result.rows[0])
    })
})

router.post("/movies",verifyTokenAndAdmin, (req,res)=>{

    const {title, genres, year} = req.body;

    const insertQuery = `
        INSERT INTO movies(title, genres, year)
            VALUES
            ($1, $2, $3)
    `
     pool.query(insertQuery,[title, genres, year], (err, result)=>{
        if (err) throw err

        res.status(201).json({
            message: "Movies created successfully"
        })
    })
})

router.put("/movies/:id", verifyTokenAndAdmin, (req,res)=>{

    const {id} = req.params
    const {title, genres, year} = req.body

    console.log(req.body)
    console.log(req.params)
    const updateQuery = `
        UPDATE movies
            SET title = $1,
                genres = $2,
                year = $3
        WHERE id = $4;
    `
    pool.query(updateQuery, [title, genres, year, id], (err, result)=>{
        if(err) throw err

        res.status(200).json({
            message: "Movies updated successfully"
        })
    })

})

router.delete("/movies/:id", verifyTokenAndAdmin, (req,res)=>{
    const {id} = req.params

    const findQuery = `
        SELECT 
            *
        FROM movies
        WHERE id = $1
    `
    pool.query(findQuery,[id], (err, response)=>{
        if(err) throw err

        if (response.rows[0]){

            const deleteQuery = `
                DELETE FROM movies
                WHERE id = $1;
            `
            pool.query(deleteQuery,[id],(err,response)=>{
                if (err) throw err

                res.status(200).json({
                    message: "Movies deleted successfully"
                })
            })
        }
    })
})

module.exports = router