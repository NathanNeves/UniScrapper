const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const loading = require("cli-progress");

class Uniscrapper{
        constructor(){
                this.url = "http://sistemas.unirio.br/projetos/projeto/index?ID_PROJETO=";

        }
        //Função que pega os Dados de Pesquisa da Unirio e retorna um array de objetos
        async getData(number1){
                        const links = await this.generateLinks(number1);
                        let dados = new Array(); 
                        const databar = new loading.Bar({stopOnComplete:true,position:'center',clearOnComplete: true,
                        format: 'Requisitando dados: [{bar}] {percentage}% | Tempo estimado: {eta}s | {value}/{total}'});
                        databar.start(links.length,0);
                        for(const index in links){
                                databar.update(index);
                        let response = await axios.get(links[index]);
                        const $ = cheerio.load(response.data);
                        const titulo = $('.table tbody td').eq(1).text()
                        const unidade = $('.table tbody td').eq(5).text();
                        const situacao = $('.table tbody td').eq(11).text();
                        const ano = $('.table tbody td').eq(15).text();
                        const coordenador = $('.table tbody td').eq(7).text().slice(0,$('.table tbody td').eq(7).text().indexOf('('));
                        const camarapesquisa = $('table:nth-child(4) tbody td:contains("Câmara de pesquisa")').next().text();
                        const cnpq = $('table:nth-child(4) tbody td:contains("Grupo do CNPq")').next().text();
                        const cpf = await this.getCpf(coordenador);
                                if(cpf != ""){
                                dados.push([titulo,unidade,coordenador,cnpq,camarapesquisa,situacao,ano,cpf])
                                }
                        }
                        return dados;
                         
                        
        }
        //Função que verifica quais ids existem ou não dentro do banco de dados
       
        //Função que cria um array com diversos números de Id existentes ou não
        async generateLinks(n1){
                let links = new Array();
                const bar = new loading.Bar({stopOnComplete:true,position:'center',clearOnComplete: true,
                format: 'Gerando links: [{bar}] {percentage}% | Tempo estimado: {eta}s | {value}/{total}'});
                bar.start(n1,0);
                for(let n =0;n<=n1;n++){
                        bar.update(n);
                        try{   
                                let response = await axios.get(this.url+n);
                                if(response.status == 200){
                                        
                                        links.push(this.url+n);
                                }
                        }
                              catch(e){
                                      
                              }
                }
                return links;
        }
        async getCpf(pessoa){
                let query = pessoa.split(" ");
                let nome="";
                for(let i=0;i<query.length-1;i++){
                        nome+=query[i]+"+";
                }
                nome+=query[query.length-1];
                        const browser = await puppeteer.launch();
                        const page = await browser.newPage();
                        const link = "http://www.portaltransparencia.gov.br/pessoa-fisica/busca/lista?termo="+nome+"&pagina=1&tamanhoPagina=10&servidorPublico=true";
                        await page.goto(link);
                        const cpf = await page.evaluate(()=>{
                                
                                let data = {
                                        nome: "",
                                        cpf:"",
                                        resultado: false
                                }
                                try{
                                const suspeito = document.querySelectorAll("a")[124].innerHTML;
                                const linha = document.querySelectorAll(".titulo-6--menor")[1].innerHTML;
                                        data.nome = suspeito;
                                        data.cpf = linha.slice(8,15);
                                        return data;
                                }
                                catch(e){
                                        console.log("Impossivel encontrar nome");
                                        return data;
                                }
                                        
                        });
                        await browser.close();
                        if(cpf.nome === pessoa){
                                return cpf.cpf;
                        }
                        
                        return "";
                
                
        }
        
}
module.exports = Uniscrapper;

