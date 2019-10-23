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
    }
    
     destroyConnection(){
        this.conn.end(end=>{
           console.log("Conexao terminada");
       });
    }
    
    
     async attTabela(array){
        const conn = mysql.createConnection(this.__connectionString);
        return new Promise((res,reject)=>{
            conn.query('TRUNCATE dados',(err,results,fields)=>{
                if(err){
                        reject(err);
                }
               res(results);
               conn.end();
            
            })
        });
    }
     async  _inserirTabela(array){
        const conn = mysql.createConnection(this.__connectionString);
            return new Promise((res,reject)=>{
                conn.query('INSERT INTO dados(titulo,departamento,coordenador,grupoCnpq,camara,situacao,ano,cpf,numSerie) VALUES ?',[array],(err,results,fields)=>{
                    if(err){
                       reject(err);
                   }
                    res(results)
                    conn.end();
                   })
            });
           
      }
      async pesquisardepartamento(data){
        const conn = mysql.createConnection(this.__connectionString);
        return new Promise((resolve,reject)=>{
            conn.query('SELECT * FROM metadata WHERE departamento = ?',[data],(err,results,fields)=>{
                if(err){
                    reject(err);
                }
                resolve(results);
                conn.end();
            });
        });
}
    
}
module.exports = SqlMethods;