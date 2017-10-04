/**
 * 
 * @param crawler DOM trading view 
 * @author Xeleniumz Fx
 * @version 1.0
 */

import cheerio from 'cheerio';
import cheerioTableparser from 'cheerio-tableparser';
import rp from 'request-promise-native';
import striptags from 'striptags';




const optionsHeader = {
    bx: {
        uri: `https://bx.in.th`,
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
        },
        simple: false
    }
};
const Crawler = {

    async getPriceRate(req, res) {
        var _ = [];
        var bx = {};
       

        await rp(optionsHeader.bx)
            .then(function(html) {
                let $ = cheerio.load(html);
                let table = $('table.table').html();
                cheerioTableparser($);
                var data = $("table").parsetable();

                for (var index = 1; index < data[3].length; index++) {
                    let key = data[3][index];
                    if (key !== '' && key !== 'Qty. (THB)') {


                        if (data[2][index] === "THB") {
                            bx[key] = {
                                ticker: striptags(data[1][index]),
                                lastPrice: data[4][index],
                                percentChange: striptags(data[5][index]),
                                average: data[6][index],
                                high: data[7][index],
                                low: data[8][index],
                                volume: data[9][index],
                            }
                        }

                    }
                }

            })
            .catch(function(err) {
                console.log(err)
            });


        var _ = {
            bx: bx,
        };


        return _;
    },

   
}

export default Crawler
