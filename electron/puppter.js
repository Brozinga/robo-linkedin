const puppeteer = require('puppeteer');
const { ipcMain } = require('electron');
const scrollPageToBottom = require('puppeteer-autoscroll-down');
const scrollStep = 100 // default
const scrollDelay = 200
let numberOfCorrects = 0

async function NavigationLinkedin(data, event) {

    const { user, pass, perfil, message } = data;
    // default

    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 760 })
    await page.goto('https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin');

    await page.waitForSelector('#username');

    try {

        //LOGIN
        await page.type('#username', user);
        await page.type('#password', pass);
        await page.waitFor(1000);
        await page.$eval('[data-litms-control-urn="login-submit"]', el => el.click());

        //PESQUISA

        await page.goto('https://www.linkedin.com/search/results/people/?keywords=' + perfil + '&origin=SWITCH_SEARCH_VERTICAL&page=1');

        await page.waitForSelector(".search-results__list > li.search-result");

        const lastPosition = await scrollPageToBottom(page, scrollStep, scrollDelay)


        await page.waitForSelector('.artdeco-pagination__indicator.artdeco-pagination__indicator--number');
      
        for (let i = 2, length = 100; i < length; i++) {

            await page.waitForSelector(".search-results__list li.search-result");

            try {

                await page.$('header[data-control-name="overlay.minimize_connection_list_bar"]', { timeout: 2000 });
                await page.$eval('header[data-control-name="overlay.minimize_connection_list_bar"]', el => el.click());
                await SendMessage(page, message);
                await page.goto('https://www.linkedin.com/search/results/people/?keywords=' + perfil + '&origin=SWITCH_SEARCH_VERTICAL&page=' + i);
                await page.waitFor(2000);
                const lastPosition = await scrollPageToBottom(page, scrollStep, scrollDelay)

            } catch (error) {

                await SendMessage(page, message);
                await page.goto('https://www.linkedin.com/search/results/people/?keywords=' + perfil + '&origin=SWITCH_SEARCH_VERTICAL&page=' + i);
                await page.waitFor(2000);
                const lastPosition = await scrollPageToBottom(page, scrollStep, scrollDelay)
            }

        }

        await browser.close();

    } catch (error) {

        await browser.close();
        return  {finish: true, error: true}
    }

}

async function SendMessage(page, message) {
    const ButtonsConectar = await page.$$('button.search-result__action-button:not(:disabled)');
    
    for (let i = 0, length = ButtonsConectar.length; i < length; i++) {

        



        try {

            
            await page.waitFor(500);
            await page.$('header[data-control-name="overlay.minimize_connection_list_bar"]', { timeout: 2000 });
            await page.$eval('header[data-control-name="overlay.minimize_connection_list_bar"]', el => el.click());

        } catch (error) {


            try {
                

                await page.waitFor(500);
                const item = await page.evaluateHandle((i) => {
                    return document.querySelectorAll('button.search-result__action-button')[i];
                }, i);

                await page.waitFor(1000);

                try {

                    
                    await page.waitFor(500);
                    await page.$('header[data-control-name="overlay.minimize_connection_list_bar"]', { timeout: 2000 });
                    await page.$eval('header[data-control-name="overlay.minimize_connection_list_bar"]', el => el.click());
                    
                    const lastPosition = await scrollPageToBottom(page, scrollStep, scrollDelay)
                    await item.click();

                } catch (error) {
                    const lastPosition = await scrollPageToBottom(page, scrollStep, scrollDelay)
                    await item.click();
                    
                }


                try {

                    await page.waitFor(500);
                    await page.waitForSelector('.send-invite__success-icon', { timeout: 2000 });
                    await page.$eval('.mr1.artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--secondary.ember-view', el => el.click());
                    
                    await page.waitFor(1000);
                    
                    try {

                        if (message) {
                            await page.waitForSelector('#custom-message', { timeout: 2000 });
                            await page.type('#custom-message', message);
                            await page.waitFor(500);
                        }
                        await page.$eval('.ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view', el => el.click());

                    } catch (error) {
                        return;
                    }

                } catch (error) {

                    
                    await page.waitForSelector('#custom-message', { timeout: 2000 });
                    try {
                        if (message) {
                            await page.waitForSelector('#custom-message', { timeout: 2000 });
                            await page.type('#custom-message', message);
                            await page.waitFor(500);
                        }
                        await page.$eval('.ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view', el => el.click());
                    } catch (error) {
                        return;
                    }
                }
            } catch (error) {
                try {
                    

                    await page.waitFor(500);
                    const item = await page.evaluateHandle((i) => {
                        return document.querySelectorAll('button.search-result__action-button')[i];
                    }, i);

                    await page.waitFor(1000);
                    await item.click();
                    

                    try {

                        await page.waitFor(500);
                        await page.waitForSelector('.send-invite__success-icon', { timeout: 2000 });
                        await page.$eval('.mr1.artdeco-button.artdeco-button--muted.artdeco-button--3.artdeco-button--secondary.ember-view', el => el.click());
                        await page.waitFor(1000);
                        
                        try {

                            if (message) {
                                await page.waitForSelector('#custom-message', { timeout: 2000 });
                                await page.type('#custom-message', message);
                                await page.waitFor(500);
                            }
                            await page.$eval('.ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view', el => el.click());
                            return { finish: true, error: false };
                        } catch (error) {
                            return;
                        }

                    } catch (error) {

                        
                        await page.waitForSelector('#custom-message', { timeout: 2000 });
                        try {
                            if (message) {
                                await page.waitForSelector('#custom-message', { timeout: 2000 });
                                await page.type('#custom-message', message);
                                await page.waitFor(500);
                            }
                            await page.$eval('.ml1.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view', el => el.click());
                            return { finish: true, error: false };
                        } catch (error) {
                            return;
                        }
                    }
                } catch (error) {


                }



            }

        }

    }

}

module.exports = NavigationLinkedin;
