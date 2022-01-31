'use strict'
const fs = require('fs');   
const uuid = require('uuid');
const validator = require('validator')

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
            });

            const priceVal = validator.isNumeric(req.body.price);
            const descriptionVal = !validator.isEmpty(req.body.description);
            const nameVal = !validator.isEmpty(req.body.name);
            const sizeVal = !validator.isEmpty(req.body.size);
            const discountVal = validator.isNumeric(req.body.discount);
            const stockVal =  validator.isEmpty(req.body.stock);
            const imageVal = !validator.isEmpty(req.body.image);
            const categoryVal = !validator.isEmpty(req.body.category_uuid);
            // const isNewVal = validator.isBoolean(req.body.is_new);

            // console.log(priceVal, descriptionVal, nameVal , sizeVal, discountVal ,stockVal ,imageVal ,categoryVal)

            if (priceVal && descriptionVal && nameVal && sizeVal && discountVal && imageVal && categoryVal) {
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
            } else {
                return res.status(400).send({
                    status: 'error',
                    message: 'Completa bien los campos',
                    
                });
            }
 
        })
    },

    updateProduct: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });

            // const priceVal = req.body.price !== undefined ? validator.isNumeric(req.body.price) : true;
            // const descriptionVal = req.body.description !== undefined ? !validator.isEmpty(req.body.description) : true;
            // const nameVal = req.body.name !== undefined ? !validator.isEmpty(req.body.name) : true;
            // const sizeVal = req.body.size !== undefined ? !validator.isEmpty(req.body.size) : true;
            // const discountVal = req.body.discount !== undefined ? validator.isNumeric(req.body.discount) : true;
            // const stockVal = req.body.stock !== undefined ? validator.isEmpty(req.body.stock) : true;
            // const imageVal = req.body.image !== undefined ? !validator.isEmpty(req.body.image) : true;
            // const categoryVal = req.body.category_uuid !== undefined ? !validator.isEmpty(req.body.category_uuid) : true;
            // const isNewVal = validator.isBoolean(req.body.is_new);

            // console.log(priceVal, descriptionVal, nameVal , sizeVal, discountVal ,stockVal ,imageVal ,categoryVal)

            if (true) {

                conn.query('UPDATE products SET ? WHERE uuid = ?', [req.body, req.params.uuid], (err, rows) => {
                    if (err) return res.status(400).send({
                        message: err
                    });
    
                    return res.status(200).send({
                        status: 'ok',
                        message: 'Updated sucesfully',
                        rows
                    });
                }); 
            } else {
                return res.status(400).send({
                    status: 'error',
                    message: 'Completa bien los campos',
                    
                });
            }
 
        })
    },

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
                            return res.status(200).send({path: totalPath , extencion: ext });

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
            
            const categoryVal = !validator.isEmpty(req.body.category)

            if(categoryVal) {
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
            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'Completa los campos'
                });
            }            
        });
    },

    addSize: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });
            
            const sizeVal = !validator.isEmpty(req.body.size)

            if(sizeVal) {
                const obj = {
                    uuid : uuid.v4(),
                    size : req.body.size
                }
                conn.query("INSERT INTO sizes SET ?",[obj],(err,rows) => {
                    if (err) return res.status(400).send({err})
    
                    return res.status(200).send({
                        status: 'ok',
                        rows
                    });
                });
            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'Completa los campos'
                });
            }            
        });
    },

    deleteSize: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: 'error aqui'
            })
            conn.query("DELETE FROM sizes WHERE uuid = ? ", [req.params.uuid], (err, rows) => {
                if (err) return res.status(400).send({ message: 'Hubo un problema tratando de eliminar la talla,', err })

                return res.status(200).send({
                    status: 'ok',
                    message: 'Talla eliminada',
                    rows
                })
            })
        })
    },

    getSizes: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });
            conn.query("SELECT * FROM sizes",[req.params.uuid],(err,rows) => {
                if (err) return res.status(400).send({err})

                return res.status(200).send({
                    status: 'ok',
                    rows
                });
            });
        });
    },

    deleteCategory: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: 'error aqui'
            })
            conn.query("DELETE FROM categories WHERE uuid = ? ", [req.params.uuid], (err, rows) => {
                if (err) return res.status(400).send({ message: 'Hubo un problema tratando de eliminar la categoría,', err })

                return res.status(200).send({
                    status: 'ok',
                    message: 'Categoría eliminada',
                    rows
                })
            })
        })
    },

    deleteProduct: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });
            
            conn.query("SELECT * FROM products WHERE uuid = ?",[req.params.uuid],(err,rows) => {
                if (err) return res.status(400).send({err})
                
                fs.unlink(`uploads/${rows[0].image}`,(err)=>{ 
                    if(err) {
                        console.log(err)
                    }
                })
            })

            conn.query("DELETE FROM products WHERE uuid = ?",[req.params.uuid],(err,rows) => {
                if (err) return res.status(400).send({err})
                
                return res.status(200).send({
                    status: 'ok',
                    rows
                });
            });

        });
    },

    addToCart: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });
            
            const obj = {
                uuid : uuid.v4(),
                user_uuid: req.body.user_uuid,
                product_uuid: req.body.product_uuid,
                size: req.body.size ? req.body.size : 'm',
                amount: req.body.amount ? req.body.amount : 1 

            }
            conn.query("INSERT INTO cart SET ?",[obj],(err,rows) => {
                if (err) return res.status(400).send({err})

                return res.status(200).send({
                    status: 'ok',
                    rows
                });
            });
        });
    },

    getCart: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });
            conn.query("SELECT cart.uuid, cart.user_uuid, cart.product_uuid, cart.amount, cart.size, products.category_uuid, products.price, products.description, products.name, products.image, products.is_new, products.discount, products.stock FROM cart INNER JOIN products ON cart.product_uuid = products.uuid WHERE cart.user_uuid = ?",[req.params.uuid],(err,rows) => {
                if (err) return res.status(400).send({err})

                return res.status(200).send({
                    status: 'ok',
                    rows
                });
            });
        });
    },

    updateCart: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });

            const amountVal = req.body.amount !== undefined ? validator.isNumeric(req.body.amount) : true 
            const sizeVal = req.body.size !== undefined ? !validator.isEmpty(req.body.size) : true

            if( amountVal && sizeVal) {
                conn.query("UPDATE cart SET ? WHERE uuid = ?",[req.body, req.params.uuid],(err,rows) => {
                    if (err) return res.status(400).send({err})
    
                    return res.status(200).send({
                        status: 'ok',
                        rows
                    });
                });
            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'Completa los campos'
                });
            }
        });
    },

    deleteFromCart: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });

            conn.query("DELETE FROM cart WHERE product_uuid = ? AND size = ?",[req.params.product_uuid, req.params.size],(err,rows) => {
                if (err) return res.status(400).send({err})

                return res.status(200).send({
                    status: 'ok',
                    rows
                });
            });

        });
    }
}

module.exports = controller;