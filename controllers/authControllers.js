'use strict'

const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const uuid = require('uuid');
const fs = require('fs')
const path = require('path')
const controller = {
    
    test: (req, res) => {
        return res.status(200).send({
            message: 'Hola soy un mensaje de prueba'
        });
    },

    getUsers: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            })

            conn.query("SELECT * FROM users", (err, rows) => {
                if (err) return res.status(400).send(err)

                return res.status(200).send({
                    status: 'ok',
                    rows
                })
            })
        })
    },
    
    register: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });


            const params = req.body;
            const name = !validator.isEmpty(params.name);
            const lastname = !validator.isEmpty(params.lastname);
            const password = params.password.length >= 8;
            const email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var existEmail = false;

            conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (err, rows) => {
                if (err) {
                    return res.status(400).send({
                        message: err
                    });
                }
                if (rows.length >= 1) existEmail = false

                if (rows.length == 0) existEmail = true
                
                if (name && lastname && password && email && existEmail) {

                    const passwordHash = bcrypt.hashSync(req.body.password, 10);
                    req.body.password = passwordHash;

                    const obj = {
                        uuid : uuid.v4(),
                        name : req.body.name,
                        lastname : req.body.lastname,
                        email: req.body.email,  
                        password : req.body.password,
                        roll: 'user',
                        created_at : new Date(),
                        updated_at : new Date(),

                    }
                    conn.query('INSERT INTO users SET ?', [obj], (err, rows) => {
                        if (err) return res.status(400).send({
                            message: req.body
                        });

                        return res.status(200).send({
                            status: 'ok',
                            message: 'Added sucesfully',
                            rows
                        });
                    });
                } else {
                    if (existEmail == false) {
                        return res.status(400).send({
                            message: 'Ya existe un email registrado',
                            existEmail
                        });
                    }
                    return res.status(500).send({
                        message: 'Los datos están incompletos',
                    });

                }
            });
        });
    },

    login : (req,res)=> {
        req.getConnection((err,conn) =>{
            if (err) return res.status(400).send({
                message: 'Hubo un error al tratar de conectar'
            })

            const emailVal = !validator.isEmpty(req.body.email)
            const passVal = !validator.isEmpty(req.body.password)

            if(emailVal && passVal) {
                conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (err,rows) => {
                    if (err) return res.status(400).send({message:'Hubo un error en la conexión'})
                    
                    if (rows.length == 0) {
                        return res.status(400).send({
                            status: 'error',
                            message: 'Contraseña Incorrecta o Email Incorrecto'
                        }); 
                    }
    
                    if (rows.length >= 1){
                        const verified = bcrypt.compareSync(req.body.password, rows[0].password );
                        if (verified) {
                                            
                            var token = jwt.sign({
                                name: rows[0].name,
                                lastname: rows[0].lastname,
                                email: rows[0].email,
                                uuid: rows[0].uuid,
                                roll : rows[0].roll,
                            }, process.env.TOKEN_SECRET)
    
                            res.header('auth-token', token).json({
                                error: null,
                                data: { token },
                                message: 'Bienvenido'
                            });
                        } else {
                            return res.status(400).send({
                                status: 'error',
                                message: 'Contraseña Incorrecta o Email Incorrecto'
                            });
                        }
                    }
                });
            } else {
                return res.status(400).send({
                    status: 'error',
                    message: 'Completa los campos'
                });
            }
        });
       
    },
    
    deleteUser: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: 'error aqui'
            })



            conn.query("DELETE FROM users WHERE uuid = ? ", [req.params.uuid], (err, rows) => {
                if (err) return res.status(400).send({ message: 'Hubo un problema tratando de eliminar al usuario,', err })

                return res.status(200).send({
                    status: 'ok',
                    message: 'Usuario eliminado'
                })
            })
        })
    },

    updateUser: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });

            const nameVal = !validator.isEmpty(req.body.name)
            const lastnameVal = !validator.isEmpty(req.body.lastname)
            // const Val = !validator.isEmpty(req.body.name)

            if( nameVal && lastnameVal) {
                conn.query("UPDATE users SET ? WHERE id = ?", [req.body, req.params.id], (err, rows) => {
                    if (err) return res.status(400).send({
                        message: err
                    });
    
                    return res.status(200).send({
                        status: 'ok',
                        message: 'Usuario actualizado'
                    });
                });
            } else {
                return res.status(400).send({
                    status: 'error',
                    message: 'completa los campos'
                });
            }

           
        });
    },
    
    getImages: (req,res) => {

        const image = req.params.image;
        const path_file = './uploads/'+image;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file))
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }   
        })
    },

}

module.exports = controller