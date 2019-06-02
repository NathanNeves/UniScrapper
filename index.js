const Uniscrapper = require('./Uniscrapper');
const SqlMethods = require('./node_modules/connection');
const newuni = new Uniscrapper();
const Sql = new SqlMethods();
async function executarScript(){
    const e = await newuni.getData(9999);
    const resp =  await Sql.attTabela(e);
    console.log(resp);
    /*await Sql.inserirTabela(e);*/
}
executarScript().then(()=>{
    console.log("Script executado com sucesso");
   // Sql.destroyConnection();
});









