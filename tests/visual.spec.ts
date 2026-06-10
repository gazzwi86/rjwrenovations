import { test, expect } from '@playwright/test'
import path from 'path'

test('home page loads with visible h1', async ({ page }) => {
  await page.goto('/')
  const h1 = page.locator('h1')
  await expect(h1).toBeVisible()
})

test('home page full-page screenshot', async ({ page }) => {
  await page.goto('/')
  await page.screenshot({
    path: path.join('tests', 'screenshots', 'home.png'),
    fullPage: true,
  })
})
