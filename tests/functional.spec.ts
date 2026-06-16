import { test, expect } from '@playwright/test'

test.describe('Gallery filters', () => {
  test('filter buttons change displayed images', async ({ page }) => {
    await page.goto('/')
    // Wait for gallery to hydrate
    await page.waitForSelector('.gallery-filters', { timeout: 10000 })

    // Initially "All Projects" active — all 12 items visible
    const allCount = await page.locator('.gallery-item').count()
    expect(allCount).toBe(12)

    // Click "Kitchens"
    await page.click('button.filter-btn:has-text("Kitchens")')
    await page.waitForTimeout(300)
    const kitchenCount = await page.locator('.gallery-item').count()
    expect(kitchenCount).toBe(3)

    // Click "Bathrooms"
    await page.click('button.filter-btn:has-text("Bathrooms")')
    await page.waitForTimeout(300)
    const bathroomCount = await page.locator('.gallery-item').count()
    expect(bathroomCount).toBe(6)

    // Click "All Projects" — back to 12
    await page.click('button.filter-btn:has-text("All Projects")')
    await page.waitForTimeout(300)
    const backToAll = await page.locator('.gallery-item').count()
    expect(backToAll).toBe(12)
  })
})

test.describe('Contact links', () => {
  test('phone links have correct tel href', async ({ page }) => {
    await page.goto('/')
    // Scroll down to contact section to check footer links
    const phoneLinks = await page.locator('a[href^="tel:"]').all()
    expect(phoneLinks.length).toBeGreaterThan(0)
    for (const link of phoneLinks) {
      const href = await link.getAttribute('href')
      expect(href).toBe('tel:+447896051540')
    }
  })

  test('WhatsApp button has correct href', async ({ page }) => {
    await page.goto('/')
    const waLink = await page.locator('a[href*="wa.me"]').first()
    const href = await waLink.getAttribute('href')
    expect(href).toContain('wa.me/447896051540')
  })
})

test.describe('Contact form', () => {
  test('form shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/')
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await page.waitForSelector('form[aria-label="Contact RJW Renovations"]', { timeout: 10000 })

    // Submit empty form
    await page.click('button[type="submit"]:has-text("Request My Free Quote")')
    await page.waitForTimeout(500)

    // Should show field errors
    const errors = await page.locator('.field-error').count()
    expect(errors).toBeGreaterThan(0)
  })

  test('form has correct Formspree action', async ({ page }) => {
    await page.goto('/')
    const form = page.locator('form[aria-label="Contact RJW Renovations"]')
    const action = await form.getAttribute('action')
    expect(action).toContain('formspree.io/f/xzdqagea')
  })
})

test.describe('TrustBar layout', () => {
  test('trust bar shows all 4 items', async ({ page }) => {
    await page.goto('/')
    const trustItems = await page.locator('.trust-item').count()
    expect(trustItems).toBe(4)
  })
})
