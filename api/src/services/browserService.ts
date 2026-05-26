import puppeteer, { Browser, Page } from "puppeteer";

export class BrowserService {

  private static instance : BrowserService;
  private browser! : Browser;
  private page! : Page; 

  private constructor() {

  }

  public static async getInstance() : Promise<BrowserService> {
    if (!BrowserService.instance) {
      BrowserService.instance = new BrowserService();
      await BrowserService.instance.setUpBrowser();
    }
    return BrowserService.instance;
  }

  public async setUpBrowser() : Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH ?? "",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--start-maximized',
      ],
      defaultViewport: null,
    });
    this.page = await this.browser.newPage(); 
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/120.0.0.0 Safari/537.36'
    );
  }

  // might change func to a Promise<string>  
  public async doWebOperation<T>(url: string, func : (page : Page) => Promise<T>) : Promise<T> {
    await this.page.goto(url, {waitUntil: 'domcontentloaded'});
    await this.page.setViewport({ width: 1080, height: 1024 });
    return func(this.page);
  }

  public getPage() : Page {
    return this.page;
  }
  
  // change type here when i figure out what it is
  public async getNewPage() : Promise<Page> {
   this.page = await this.browser.newPage(); 
   return this.page;
  }

}
