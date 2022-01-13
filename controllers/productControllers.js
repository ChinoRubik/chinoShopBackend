'use strict'
var fs = require('fs');   

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
            
            conn.query('INSERT INTO productos SET ?', [req.body], (err, rows) => {
                if (err) return res.status(400).send({
                    message: req.body
                });

                return res.status(200).send({
                    status: 'ok',
                    message: 'Added sucesfully',
                    rows
                });
            }); 
        })
    },

    getShirts: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            })

            conn.query("SELECT * FROM productos WHERE categoria_id = 3", (err, rows) => {
                if (err) return res.status(400).send(err)
                
                return res.status(200).send({
                    status: 'ok',
                    rows
                })
            })
        })
    },

    uploadImages: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            })
     
            if(req.files){ 
                let totalPath = ''

                for(var i = 0; i < req.files.image.length; i++) {
                    const filePath = req.files.image[i].path; 
                    const cut = filePath.split('\\'); 
                    const path = cut[1]; 
                    const cut_two = path.split('.');
                    const ext = cut_two[1];
                    if(ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext =='gif'){
                        console.log(req.files.image.length)
                        if(i === (req.files.image.length - 1)) {
                            totalPath += path
                            console.log(totalPath)
                            return res.status(200).send({totalPath , extencion: ext });

                        } else {
                            totalPath += path+','
                        }
                        
                        // return res.status(200).send({path , extencion: ext });
                        
                    } else {
                        fs.unlink(filePath,(err)=>{
                            return res.status(404).send({messaje: 'Extención no valida'});
        
                        });
                    }
                }
                  

                    
                // const filePath = req.files.image.path; 
                // const cut = filePath.split('\\'); 
                // const path = cut[1]; 
                // const cut_two = path.split('.');
                // const ext = cut_two[1];
                
               
            }
        });
    }


}

module.exports = controller;