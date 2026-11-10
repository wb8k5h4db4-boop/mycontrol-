import {test,expect} from '@playwright/test';
test('первый запуск, создание, редактирование, выполнение, история и офлайн',async({page,context})=>{
await page.goto('/');await expect(page.getByText('Здесь пока нет задач')).toBeVisible();
await page.locator('.add-top').click();
await page.getByLabel('Что нужно сделать?').fill('Оплатить аренду');
await page.getByLabel('Категория',{exact:true}).selectOption('Магазин');
await page.getByRole('button',{name:'Сохранить задачу'}).click();
await expect(page.getByText('Оплатить аренду',{exact:true})).toBeVisible();
await page.getByText('Оплатить аренду',{exact:true}).click();await page.getByLabel('Что нужно сделать?').fill('Оплатить аренду магазина');await page.getByRole('button',{name:'Сохранить задачу'}).click();
await page.reload();await expect(page.getByText('Оплатить аренду магазина',{exact:true})).toBeVisible();
await page.getByRole('button',{name:'Выполнить: Оплатить аренду магазина',exact:true}).click();
await page.locator('.bottom-nav').getByRole('button',{name:'Задачи',exact:true}).click();await page.getByRole('button',{name:'История',exact:true}).click();await expect(page.getByText('Оплатить аренду магазина',{exact:true})).toBeVisible();
await page.evaluate(async()=>{await navigator.serviceWorker.ready});await page.reload();await context.setOffline(true);await page.reload();await expect(page.getByRole('heading',{name:'Задачи',exact:true})).toBeVisible().catch(async()=>{await expect(page.getByRole('heading',{name:/Доброе утро|Добрый день|Добрый вечер/})).toBeVisible()});
await page.locator('.bottom-nav').getByRole('button',{name:'Задачи',exact:true}).click();await page.getByRole('button',{name:'История',exact:true}).click();await expect(page.getByText('Оплатить аренду магазина',{exact:true})).toBeVisible();
expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('календарь, JSON экспорт и восстановление, тема',async({page})=>{
await page.goto('/');await page.locator('.bottom-nav').getByRole('button',{name:'Настройки'}).click();await page.getByRole('button',{name:'Включить демоданные'}).click();await expect(page.getByText('Демонстрационные данные включены.',{exact:false})).toBeVisible();
const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Скачать резервную копию JSON'}).click();const file=await pending;const path=await file.path();
await page.getByRole('button',{name:'Тёмная',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
await page.getByRole('button',{name:'Удалить все данные',exact:true}).click();await page.getByRole('button',{name:'Подтвердить'}).click();await expect(page.getByText('Демонстрационные данные включены.',{exact:false})).toHaveCount(0);
await page.locator('input[type=file]').setInputFiles(path!);await page.getByRole('button',{name:'Подтвердить'}).click();await expect(page.getByText('Демонстрационные данные включены.',{exact:false})).toBeVisible();
await page.locator('.bottom-nav').getByRole('button',{name:'Календарь',exact:true}).click();await expect(page.locator('.calendar-grid button')).toHaveCount(42);await expect(page.getByText('Составить план на неделю',{exact:true})).toBeVisible();
});
