
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
})

test('Clicking the "Draw" button displays the div with an id of "choices"', async () => {
    await driver.findElement(By.id('draw')).click()
    const choicesSection = await driver.findElement(By.id('choices'))
    const displayed = await choicesSection.isDisplayed()
    expect(displayed).toBe(true)
})

test('Clicking the "Add to Duo" button displays the div with an id of "choices"', async () => {
    await driver.findElement(By.id('draw')).click()
    await driver.sleep(100)
    await driver.findElement(By.css('.bot-btn')).click()
    const playerDuoSection = await driver.findElement(By.id('player-duo'))
    const choicesSection = await driver.findElement(By.id('choices'))
    const displayed = await choicesSection.isDisplayed()
    expect(displayed).toBe(true)
})
test('When a bot is removed from the "duo" section, it goes back to the "choices" section', async () => {
    await driver.findElement(By.id('draw')).click()
    await driver.sleep(3000)
    await driver.findElement(By.css('.bot-btn')).click()
    const selectedRobotName = await driver.findElement(By.xpath('//div[@id="player-duo"]/div/h3')).getText()
    await driver.findElement(By.xpath('//button[text()="Remove from Duo"]')).click()
    await driver.sleep(3000)
    const returnedRobot = await driver.findElement(By.xpath('//div[@id="choices"]/div/h3[contains(text(), ' + selectedRobotName + ' )]'))
    const displayed = await returnedRobot.isDisplayed()
    expect(displayed).toBe(true)
    await driver.sleep(3000)
})