const mongoose = require('mongoose')

async function main() {
    await mongoose.connect(process.env.MONGO_URI)
}

main().then(()=>{
    console.log("conecction sucsess");
})
.catch((err)=>{
    console.log(err);
})