const { test, expect } = require('@playwright/test');

test('expanded glossary exposes all entries and four central authorial concepts', async ({ page }) => {
  const errors=[];
  page.on('pageerror', error=>errors.push(error.message));
  await page.goto('/conceitos.html');
  await expect(page.locator('h1')).toHaveText('glossário');
  await expect(page.locator('.gloss-entry')).toHaveCount(65);
  await expect(page.locator('#list .orig')).toHaveCount(4);
  await expect(page.locator('#results')).toHaveText('65 verbetes encontrados');
  await expect(page.locator('#endurecimento')).toContainText('não produz intensidade global');
  expect(errors).toEqual([]);
});

test('search ignores accents and includes definition text in both languages', async ({ page }) => {
  await page.goto('/conceitos.html');
  await page.getByRole('searchbox').fill('monocromatizacao');
  await expect(page.locator('.gloss-entry')).toHaveCount(1);
  await expect(page.locator('#list a[data-id="monocromatizacao"]')).toBeVisible();
  await page.getByRole('searchbox').fill('recepcao');
  await expect(page.locator('#list a[data-id="sentido"]')).toBeVisible();
  await page.getByRole('searchbox').fill('not-a-real-concept');
  await expect(page.locator('#results')).toHaveText('0 verbetes encontrados');
  await expect(page.locator('#reader')).toContainText('Nenhum verbete encontrado.');
  await page.locator('#list a[data-id="glossario"]').click();
  await expect(page.getByRole('searchbox')).toHaveValue('');
  await expect(page.locator('.gloss-entry')).toHaveCount(65);
});

test('deep links win over saved selection and navigation works with keyboard and history', async ({ page }) => {
  await page.addInitScript(()=>localStorage.setItem('av_concept','iconocracia'));
  await page.goto('/conceitos.html#pathosformel');
  await expect(page.locator('h1')).toHaveText('Pathosformel');
  const related=page.locator('.rchip[data-id="nachleben"]');
  await expect(related).toHaveAttribute('href','#nachleben');
  await related.focus();
  await related.press('Enter');
  await expect(page).toHaveURL(/#nachleben$/);
  await expect(page.locator('h1')).toHaveText('Nachleben');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page.locator('h1')).toHaveText('Pathosformel');
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Pathosformel');
});

test('English glossary and accessible labels retain endurecimento as a technical term', async ({ page }) => {
  await page.goto('/conceitos.html#endurecimento');
  await page.getByRole('button',{name:'EN',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.getByRole('searchbox',{name:'Search the glossary'})).toBeVisible();
  await expect(page.locator('h1')).toHaveText('endurecimento');
  await expect(page.locator('#reader')).toContainText('axis of allegorical fixity');
  await expect(page.locator('#reader')).not.toContainText('hardening');
  await page.locator('#reader a[data-id="glossario"]').click();
  await expect(page.locator('.gloss-entry')).toHaveCount(65);
  await expect(page.locator('#legendtxt')).toHaveText('four central authorial concepts');
  await page.getByRole('button',{name:'PT',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
});

test('mobile glossary navigation leaves space for the reader and does not overflow', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/conceitos.html');
  expect(await page.locator('#list').evaluate(el=>el.getBoundingClientRect().height)).toBeLessThan(300);
  await page.getByRole('searchbox').fill('feminilidade de estado');
  await page.locator('#list a[data-id="feminilidade"]').click();
  await expect(page.locator('h1')).toBeFocused();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('all definitions remain readable without JavaScript and native links reach entries', async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://localhost:8080/conceitos.html');
  await expect(page.locator('.gloss-entry')).toHaveCount(65);
  await page.locator('#list a[href="#racial"]').click();
  await expect(page.locator('#racial')).toContainText('branquitude constitutiva');
  await expect(page).toHaveURL(/#racial$/);
  await context.close();
});
