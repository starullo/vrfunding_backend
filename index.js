const server = require('./api/server');
require('dotenv').config();

const PORT = process.env.PORT || 7775;

server.listen(PORT, (req, res, next)=>{
    console.log('all good on port ' + PORT)
})