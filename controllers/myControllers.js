'use strict'

const controller = {
    test: (req, res) => {
        return res.status(200).send({
            message: 'Hola soy un mensaje de prueba'
        });
    },

    getUsers: (req,res) => {
        req.getConnection((err,conn) => {
            if(err) return res.status(400).send({
                message : err
            })

            conn.query("SELECT * FROM usuarios", (err,rows) => {
                if(err) return res.status(400).send(err)

                return res.status(200).send({
                    status: 'ok',
                    rows
                })
            })
        })
    },

    addUser: (req,res) => {
        req.getConnection((err,conn) => {
            if(err) return res.status(400).send({
                message : err
            });

            conn.query('INSERT INTO usuarios SET ?', [req.body] , (err,rows) => {
                if(err) return res.status(400).send({
                    message: req.body
                });

                return res.status(200).send({
                    status : 'ok',      
                    message :'Added sucesfully'
                })
            })
            // console.log(req.body)
        
        })
    },
    deleteUser : (req,res) => {
        req.getConnection((err,conn) => {
            if(err) return res.status(400).send({
                message : 'error aqui'
            })

   
            conn.query("DELETE FROM usuarios WHERE id = ? ",[req.params.id], (err,rows) => {
                if(err) return res.status(400).send({message : 'Hubo un problema tratando de eliminar al usuario,',err})

                return res.status(200).send({
                    status: 'ok',
                    message :'Usuario eliminado'
                })
            })
        })
    },

    updateUser : (req,res) => {
        req.getConnection((err,conn) => {
            if(err) return res.status(400).send({
                message : err
            });

            conn.query("UPDATE usuarios SET ? WHERE id = ?", [req.body , req.params.id], (err,rows) => {
                if(err) return res.status(400).send({
                    message : err
                });

                return res.status(200).send({
                    status:'ok',
                    message:'Usuario actualizado'
                });
            });
        });
    }
    
}

module.exports = controller