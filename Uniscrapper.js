const axios = require('axios');
const cheerio = require('cheerio');

class Uniscrapper{
        constructor(){
                this.url = "http://sistemas.unirio.br/projetos/projeto/index?ID_PROJETO=";

        }
        //Função que pega os Dados de Pesquisa da Unirio e retorna um array de objetos
        async getData(number){
                        const links = this.generateLinks(number);
                        const filteredLinks = await this.verifyStatus(links);
                        let dados = new Array();
                        for(const index in filteredLinks){
                        let response = await axios.get(filteredLinks[index]);
                        const $ = cheerio.load(response.data);
                        const titulo = $('.table tbody td').eq(1).text()
                        const unidade = $('.table tbody td').eq(5).text();
                        const coordenador = $('.table tbody td').eq(7).text();
                        const cnpq = $('table:nth-child(4) tbody td:contains("Grupo do CNPq")').next().text();
                        dados.push({Titulo:titulo,Unidade:unidade,Coordenador:coordenador,Cnpq:cnpq});
                        }
                        return dados;
                         
                        
        }
        //Função que verifica quais ids existem ou não dentro do banco de dados
        async verifyStatus(array){
                let verifiedLinks = new Array();
                for (const key in array) {
                     try{   
                        let response = await axios.get(array[key]);
                        if(response.status == 200){
                                
                                verifiedLinks.push(array[key]);
                        }
                }
                      catch(e){
                              
                      }
                }
               
                return verifiedLinks;
               
        }
        //Função que cria um array com diversos números de Id existentes ou não
        generateLinks(number){
                let links = new Array();
                for(let n =0;n<number;n++){
                        links.push(this.url+n)
                }
                return links;
        }
}
module.exports = Uniscrapper;

