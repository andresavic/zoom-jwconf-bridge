const webdriver = require('selenium-webdriver');
const chrome = require("selenium-webdriver/chrome");
const until = webdriver.until;
const By = webdriver.By;
const { exec } = require('child_process');

import cookie from 'cookie';
import jwt from 'jsonwebtoken';

let driver;

let zoom;

let running = false;

export default async function handler(req, res) {
  if (req?.headers?.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    try {
      jwt.verify(cookies?.['authorization'], process.env.PASSWORD);
    } catch(err) {
      res.status(200).json({ error: 'Not authenticated' });
      return;
    }
  
  }else{
    res.status(200).json({ error: 'Not authenticated' });
    return;
  }
  
  const { action } = req.query;
  console.log("ACTION", action);
  if (req.method != 'POST') {
    res.status(200).json({ error: 'Not supported method' });
    return;
  }

  if (action === 'start') {
    if (running) {
      res.status(200).json({ error: 'Already running' });
      return;
    }

    running = true;

    zoom = exec('zoom --url="' + process.env.ZOOM_MEETING_URL + '"');
    
    driver = new webdriver.Builder().usingServer('http://localhost:4444/wd/hub').forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('use-fake-ui-for-media-stream')).build();
    await driver.get(process.env.JWCONF_AUTOLOGIN_URL);
    let connectButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Verbinden')]"), 5000));

    connectButton.click();

  }else if(action === 'stop') {
    if (!running) {
      res.status(200).json({ error: 'Not running' });
      return;
    }

    running = false;

    zoom.kill('SIGKILL');
    exec('pkill "zoom"');
    
    try{  
      let disconnectButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Auflegen')]"), 5000));
      await disconnectButton.click();
    }catch(e){
      console.log(e);
    }
    
    driver.quit();
  }else if(action === 'state') {
    res.status(200).json({ running: running });
    return;
  }

  res.status(200).json({ okay: true });
}
