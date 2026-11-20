import { expect, test } from '@playwright/test'

test('driver standings are reachable from the nav and list the leader first', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Drivers' }).click()
  await expect(page).toHaveURL(/\/drivers$/)
  await expect(page.getByRole('heading', { name: 'Driver standings' })).toBeVisible()
  await expect(page.getByRole('row').nth(1)).toContainText('Lando Norris')
})
