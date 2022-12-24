const mongoose = require('mongoose')


const connection  = ()=>{
    mongoose.connect('mongodb://0.0.0.0:27017/Ecommerce',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
   
}).then((data)=>{
    console.log(`Mongodb connected with server :${data.connection.host}`)

})
}


module.exports = connection