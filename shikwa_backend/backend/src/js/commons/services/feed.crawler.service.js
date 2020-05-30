const Parser = require('rss-parser');
const axios = require('axios');
const productDb = require('../../api/products/products.dao');


let parser = new Parser();

exports.feed = (async() => {

    try {

        let feed = await parser.parseURL('https://ec.europa.eu/consumers/consumers_safety/safety_products/rapex/alerts/?event=main.rss&lng=en');
        console.log(feed.title);

        feed.items.forEach(item => {
            var link = item.link.replace("main.weeklyOverview", "main.weeklyReport.XML");

            axios.get(link).then((response) => {
                console.log("response: " + response);
                process(response.data);
            }).then((error) => {
                if (error)
                    console.log(error);
            }).catch((error) => {
                console.log(error);
            });

        });
    } catch (error) {
        console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++ " + error);
    }

});

function process(data) {

    var xpath = require('xpath');
    dom = require('xmldom').DOMParser;

    var doc = new dom().parseFromString(data);
    var nodes = xpath.select("//notification", doc);

    var values = [];

    for (var node of nodes) {
        var childs = node.childNodes;

        var tmp = {};

        for (var index in childs) {
            var element = childs[index];

            if (element.nodeType == 1) {

                tmp[element.localName] = element.textContent;

                // category
                // name
                // type_numberOfModel
                // riskType
                // danger
                // notifyingCountry
                // countryOfOrigin
                // brand
                // pictures

                if (element.localName == "pictures") {
                    var pictures = element.childNodes;

                    for (var picIndex in pictures) {
                        var picture = pictures[picIndex];
                        if (picture) {
                            tmp[picture.localName] = picture.textContent ? picture.textContent.trim() : "";
                            break;
                        }
                    }
                }
                // console.log(element.localName);
            }
        }

        var value = [];

        value.push(tmp.name);
        value.push(tmp.brand);
        value.push(tmp.category);
        value.push(tmp.countryOfOrigin);
        value.push(""); //cityOrigin
        value.push(tmp.riskType);
        value.push(tmp.danger);
        value.push(tmp.picture);

        values.push(value);
    }
    // console.log(values);

    productDb.insertBatch(values, (error, results) => {
        console.log(results);
        console.log(error);
    });
}