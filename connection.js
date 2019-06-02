const mysql = require('mysql');
class SqlMethods{
    constructor(){
        this.config = {
            connectionLimit : 100,
            host: "localhost",
            user: "root",
            password: "",
            database: "unirio",
            gracefulExit: true
        };
        this.conn = mysql.createPool(this.config); 
    }
    
     destroyConnection(){
        this.conn.end(end=>{
           console.log("Conexao terminada");
       });
    }
    
    
     async attTabela(array){
        
        this.conn.query('TRUNCATE dados',(err,results,fields)=>{
            if(err){
                return console.log(err.message);
            }
            console.log("Linhas afetadas: "+ results.affectedRows);
            this._inserirTabela(array);
        });
      }
      _inserirTabela(array){
            this.conn.query('INSERT INTO dados(titulo,departamento,coordenador,grupoCnpq,camara,situacao,ano,cpf) VALUES ?',[array],(err,results,fields)=>{
             if(err){
                return console.log(err.message);
            }
            console.log('Linhas Inseridas: '+ results.affectedRows);
                this.destroyConnection();
                process.exit();
            });
           
      }
    
}
module.exports = SqlMethods;