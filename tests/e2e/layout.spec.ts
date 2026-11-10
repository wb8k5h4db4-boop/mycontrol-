import {test,expect} from '@playwright/test';
test('адаптация iPhone и широкого экрана',async({page})=>{
await page.goto('/');await expect(page.locator('.add-top')).toBeEnabled();await page.screenshot({path:'test-results/mycontrol-iphone.png',fullPage:true});
await page.setViewportSize({width:1440,height:1000});await expect(page.locator('.sidebar')).toBeVisible();await page.screenshot({path:'test-results/mycontrol-desktop.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
