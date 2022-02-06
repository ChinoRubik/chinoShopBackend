const controller = {
    
    getProducts: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            })

            conn.query("SELECT * FROM products", (err, rows) => {
                if (err) return res.status(400).send(err)
                
                return res.status(200).send({
                    status: 'ok',
                    rows
                })
            })
        })
    },

    detailProduct: (req,res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            })

            conn.query("SELECT * FROM products WHERE uuid = ?", [req.params.uuid], (err, rows) => {
                if (err) return res.status(400).send(err)
                
                return res.status(200).send({
                    status: 'ok',
                    rows
                })
            })
        })
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

    getImages: (req, res) => {
        req.getConnection((err, conn) => {
            if (err) return res.status(400).send({
                message: err
            })

            conn.query("SELECT * FROM images WHERE product_uuid = ? ",[req.params.uuid], (err, rows) => {
                if (err) return res.status(400).send(err)
                
                return res.status(200).send({
                    status: 'ok',
                    rows
                })
            })
        })
    }
}

module.exports = controller;