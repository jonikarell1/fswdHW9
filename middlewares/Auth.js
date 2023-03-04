const { json } = require("express/lib/response")
const { decode } = require("jsonwebtoken")
const jwt = require("jsonwebtoken")
const pool = require('../config')

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token
    if(authHeader){

        try{
            const token = authHeader.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SEC)
            const {id, role} = decoded;

            const findUser = `
                SELECT 
                    *
                FROM users
                    WHERE id = $1
            `
            pool.query(findUser,[id],(err,result)=>{
                if(err) throw err

                if(result.rows.lenght === 0){
                    res.status(400).json("not error found")
                }else{
                    const user = result.rows[0]

                    req.loggedUser = {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }
                    next();
                }

            })
        }catch(err){
            res.status(403).json("Token invalid")

        }

    } else {
        res.status(401).json("you are not authenticated")
    }
}

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,() =>{
        if (req.loggedUser.id == req.params.id || req.loggedUser.role === "admin"){
            next()
        } else {
            res.status(401).json("You are not authorized")
        }
    })  
}

const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res, () =>{
        if(req.loggedUser.role === "admin"){
            next()
        } else{
            res.status(401).json("You are not authorized")
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}