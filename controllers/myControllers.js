'use strict'

const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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

            conn.query("SELECT * FROM usuarios", (err, rows) => {
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

            conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (err, rows) => {
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

                    conn.query('INSERT INTO usuarios SET ?', [req.body], (err, rows) => {
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

            conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (err,rows) => {
                if (err) return res.status(400).send({message:'Hubo un error en la conexión'})
                
                if (rows.length == 0) {
                    return res.status(400).send({
                        status: 'error',
                        message: 'Contraseña Incorrecta o Email Incorrecto (email incorrecto)'
                    }); 
                }

                if (rows.length >= 1){
                    const verified = bcrypt.compareSync(req.body.password, rows[0].password );
                    if (verified) {
                                        
                        var token = jwt.sign({
                            name: rows[0].name,
                            lastname: rows[0].lastname,
                            email: rows[0].email,
                            id: rows[0].id
                        }, process.env.TOKEN_SECRET)

                        res.header('auth-token', token).json({
                            error: null,
                            data: { token },
                            message: 'Bienvenido'
                        });
                    } else {
                        return res.status(400).send({
                            status: 'err',
                            message: 'Contraseña Incorrecta o Email Incorrecto (contraseña incorrecta)'
                        });
                    }
                }
            });
        });
       
    },
    deleteUser: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: 'error aqui'
            })


            conn.query("DELETE FROM usuarios WHERE id = ? ", [req.params.id], (err, rows) => {
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

            conn.query("UPDATE usuarios SET ? WHERE id = ?", [req.body, req.params.id], (err, rows) => {
                if (err) return res.status(400).send({
                    message: err
                });

                return res.status(200).send({
                    status: 'ok',
                    message: 'Usuario actualizado'
                });
            });
        });
    }

}

module.exports = controller