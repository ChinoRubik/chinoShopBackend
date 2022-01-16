'use strict'
const fs = require('fs');   
const uuid = require('uuid');

const controller = {

    dashboard : (req, res) => {
        res.json({
            error: null,
            data: { 
                title: 'Esta es una ruta protegida',
                user: req.user
            }
        })
    },

    addProduct: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            })
            const obj = {
                uuid : uuid.v4(),
                price : req.body.price,
                description : req.body.description,
                name : req.body.name, 
                size : req.body.size,
                is_new : req.body.is_new,
                discount : req.body.discount,
                stock : req.body.stock,
                image : req.body.image,
                category_uuid : req.body.category_uuid
            }
            conn.query('INSERT INTO products SET ?', [obj], (err, rows) => {
                if (err) return res.status(400).send({
                    message: err
                });

                return res.status(200).send({
                    status: 'ok',
                    message: 'Added sucesfully',
                    rows
                });
            }); 
        })
    },

    // getShirts: (req,res) => {
    //     req.getConnection((err, conn) => {
    //         if (err) return res.status(400).send({
    //             message: err
    //         })

    //         conn.query("SELECT * FROM productos WHERE categoria_id = 3", (err, rows) => {
    //             if (err) return res.status(400).send(err)
                
    //             return res.status(200).send({
    //                 status: 'ok',
    //                 rows
    //             })
    //         })
    //     })
    // },

    uploadImages: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            })
     
            if(req.files){ 
                let totalPath = ''
                for(var i = 0; (i < req.files.image.length) && (req.files.image.length !== undefined)  ; i++) {
                    const filePath = req.files.image[i].path; 
                    const cut = filePath.split('\\'); 
                    const path = cut[1]; 
                    const cut_two = path.split('.');
                    const ext = cut_two[1];
                    if(ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext =='gif'){
                        if(i === (req.files.image.length - 1)) {
                            totalPath += path
                            return res.status(200).send({totalPath , extencion: ext });

                        } else {
                            totalPath += path+','
                        }
                                                
                    } else {
                        fs.unlink(filePath,(err)=>{
                             return res.status(404).send({messaje: 'Extención no valida' , err});
    
                        });
                    }
                }
                
                if (req.files.image.length === undefined ) {
                    const filePath = req.files.image.path; 
                    const cut = filePath.split('\\'); 
                    const path = cut[1]; 
                    const cut_two = path.split('.');
                    const ext = cut_two[1];
    
                    if(ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext =='gif'){
                        return res.status(200).send({path , extencion: ext });
                    } else {
                        fs.unlink(filePath,(err)=>{
                          return res.status(404).send({messaje: 'Extención no valida' , err});
                        });
                    }
                }
            }
        });
    },

    addCategory: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });
            const obj = {
                uuid : uuid.v4(),
                category : req.body.category
            }
            conn.query("INSERT INTO categories SET ?",[obj],(err,rows) => {
                if (err) return res.status(400).send({err})

                return res.status(200).send({
                    status: 'ok',
                    rows
                });
            });
        });
    },

    getCategories: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            })

            conn.query("SELECT * FROM categories", (err, rows) => {
                if (err) return res.status(400).send(err)
                
                return res.status(200).send({
                    status: 'ok',
                    rows
                })
            })
        })
    },

    deleteCategory: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: 'error aqui'
            })
            conn.query("DELETE FROM categories WHERE uuid = ? ", [req.body.uuid], (err, rows) => {
                if (err) return res.status(400).send({ message: 'Hubo un problema tratando de eliminar la categoría,', err })

                return res.status(200).send({
                    status: 'ok',
                    message: 'Categoría eliminada',
                    rows
                })
            })
        })
    }
}

module.exports = controller;