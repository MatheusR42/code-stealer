'use strict';
const scrape = require('website-scraper');
const ResourceSaver = require('./ResourceSaver');
const pages = require('./pages');
const debuglog = require('./debuglog')

function crawlerNextPage(pages) {
    var qtdPages = pages.length;
    if(qtdPages){
        var page = pages[qtdPages-1];
        pages.pop();

        var options = {
            urls: [page],
            directory: __dirname + '/result/',
            filenameGenerator: 'bySiteStructure',
            resourceSaver: ResourceSaver,
            //to VTEX
            // sources: [
            //     {selector: 'img[src*="arquivos/"]', attr: 'src'},
            //     {selector: 'link[rel="stylesheet"][href*="arquivos/"]', attr: 'href'},
            //     {selector: 'script[src*="arquivos/"],script[src*="/jquery/1.8.3"]', attr: 'src'}
            // ],
            request: {
                timeout: 60000
            },
            httpResponseHandler: (response) => {
                if (response.statusCode === 404) {
                  return Promise.reject(new Error('status is 404'));
              } else {
                  // if you don't need metadata - you can just return Promise.resolve(response.body)
                  
                //to VTEX
                //   var body = response.body;
                //   if(~body.indexOf('id="resultBusca"')){
                //       debuglog('busca vazia>> ', page);
                //     return Promise.reject(new Error('busca vazia'));
                //   }
                  
                  return Promise.resolve(response.body);
              }
            },
            requestConcurrency: 10
        };

        debuglog('init>> ',page)

        scrape(options).then((result) => {
            debuglog('sucess>> ',page)
            crawlerNextPage(pages);
        }).catch((err) => {
            debuglog('error>> ', page);
            crawlerNextPage(pages);
        });
    }
}
crawlerNextPage(pages)