const validator = require('validator')

const controller = {

    updateUser: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            });

            const nameVal = req.body.name !== undefined ? !validator.isEmpty(req.body.name) : true 
            const lastnameVal = req.body.lastname !== undefined ? !validator.isEmpty(req.body.lastname) : true

            if( nameVal && lastnameVal) {
                const obj = {
                    name: req.body.name,
                    lastname: req.body.lastname,
                    updated_at: new Date(),
                }

                conn.query("UPDATE users SET ? WHERE uuid = ?", [obj, req.params.uuid], (err, rows) => {
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
    
}

module.exports = controller;