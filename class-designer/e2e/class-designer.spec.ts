import { expect, test } from '@playwright/test';

async function createSpell(page: import('@playwright/test').Page, name: string, icon = 'Spell_Shadow_AnimateDead.PNG', level = 1) {
  await page.getByRole('button', { name: /Nouveau sort/ }).click();
  await page.getByLabel('Nom', { exact: true }).fill(name);
  await page.getByPlaceholder('Rechercher une icône…').fill(icon.replace('.PNG', ''));
  await page.getByRole('button', { name: `Choisir ${icon}` }).click();
  await page.getByLabel('Tooltip', { exact: true }).fill(`Description de ${name}.`);
  await page.getByLabel('Niveau d’apprentissage').fill(String(level));
  await page.getByRole('button', { name: 'Créer le sort' }).click();
  await expect(page.getByText(name, { exact: true })).toBeVisible();
}

async function drag(page: import('@playwright/test').Page, source: import('@playwright/test').Locator, target: import('@playwright/test').Locator) {
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  if (!from || !to) throw new Error('Drag source or target is not visible.');
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 12 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('creates and keeps multiple class prototypes', async ({ page }) => {
  await expect(page.getByText('Class Forge')).toBeVisible();
  await page.getByLabel('Nom du prototype').fill('Nécromancien');
  await page.getByLabel('Nouveau prototype').click();
  await page.getByLabel('Nom du prototype').fill('Chronomancien');
  await expect(page.getByLabel('Prototype actif').locator('option')).toHaveCount(2);
  await page.reload();
  await expect(page.getByLabel('Nom du prototype')).toHaveValue('Chronomancien');
});

test('creates a fake spell in the reserve and exports it', async ({ page }) => {
  await createSpell(page, 'Trait de mort');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Exporter/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('nouvelle-classe');
});

test('submits the spell dialog with Control+Enter from any field', async ({ page }) => {
  await page.getByRole('button', { name: /Nouveau sort/ }).click();
  await page.getByLabel('Nom', { exact: true }).fill('Sort au clavier');
  await page.getByPlaceholder('Rechercher une icône…').fill('Spell_Shadow_AnimateDead');
  await page.getByRole('button', { name: 'Choisir Spell_Shadow_AnimateDead.PNG' }).click();
  await page.getByLabel('Notes de design').fill('Soumis depuis une textarea.');
  await page.getByLabel('Notes de design').press('Control+Enter');

  await expect(page.getByRole('heading', { name: 'Créer un faux sort' })).toHaveCount(0);
  await expect(page.getByText('Sort au clavier', { exact: true })).toBeVisible();
});

test('duplicates, edits and deletes a spell from its context menu', async ({ page }) => {
  await createSpell(page, 'Sort contextuel');
  const card = page.locator('.spell-card').filter({ has: page.getByText('Sort contextuel', { exact: true }) });

  await card.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Dupliquer' }).click();
  await expect(page.locator('.reserve-panel .spell-card').filter({ hasText: 'Sort contextuel (copie)' })).toHaveCount(1);
  await expect(page.getByRole('status')).toHaveText('Sort dupliqué dans la réserve.');

  await card.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Modifier' }).click();
  await expect(page.getByRole('heading', { name: 'Modifier le sort' })).toBeVisible();
  await expect(page.getByLabel('Nom', { exact: true })).toHaveValue('Sort contextuel');
  await page.getByRole('button', { name: 'Annuler' }).click();

  await card.click({ button: 'right' });
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('menuitem', { name: 'Supprimer' }).click();
  await expect(card).toHaveCount(0);
});

test('places talents and uses the editable learning level for baseline spells', async ({ page }) => {
  await createSpell(page, 'Talent source');
  await createSpell(page, 'Talent cible', 'Spell_Shadow_DeathCoil.PNG');
  await createSpell(page, 'Sort baseline', 'Spell_Shadow_LifeDrain.PNG', 12);

  const firstTree = page.locator('.tree-panel').first();
  await drag(page, page.locator('.spell-card').filter({ hasText: 'Talent source' }).locator('.spell-drag-handle'), firstTree.getByTestId('cell-0-0'));
  await drag(page, page.locator('.spell-card').filter({ hasText: 'Talent cible' }).locator('.spell-drag-handle'), firstTree.getByTestId('cell-2-0'));
  await expect(firstTree.locator('.talent-node')).toHaveCount(2);

  expect(await firstTree.getByLabel('Prérequis vers Talent source').evaluate(element => getComputedStyle(element).pointerEvents)).toBe('none');
  await drag(page, firstTree.getByLabel('Prérequis depuis Talent source'), firstTree.getByLabel('Prérequis vers Talent cible'));
  await expect(firstTree.locator('.react-flow__edge')).toHaveCount(1);

  await drag(page, page.locator('.spell-card').filter({ hasText: 'Sort baseline' }).locator('.spell-drag-handle'), page.locator('.baseline-panel'));
  await expect(page.locator('.level-divider').getByText('Niveau 12', { exact: true })).toBeVisible();

  const baselineCard = page.locator('.baseline-panel .spell-card').filter({ hasText: 'Sort baseline' });
  await baselineCard.click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Modifier' }).click();
  await page.getByLabel('Niveau d’apprentissage').fill('24');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.locator('.level-divider').getByText('Niveau 24', { exact: true })).toBeVisible();
});

test('does not pan the talent tree when a connection reaches its edge', async ({ page }) => {
  await createSpell(page, 'Talent fixe');
  const firstTree = page.locator('.tree-panel').first();
  await drag(page, page.locator('.spell-card').filter({ hasText: 'Talent fixe' }).locator('.spell-drag-handle'), firstTree.getByTestId('cell-0-1'));
  const talent = firstTree.locator('.talent-node');
  await expect(talent).toHaveCount(1);
  const before = await talent.boundingBox();
  const treeBounds = await firstTree.locator('.tree-canvas').boundingBox();
  const handle = firstTree.getByLabel('Prérequis depuis Talent fixe');
  const handleBounds = await handle.boundingBox();
  if (!before || !treeBounds || !handleBounds) throw new Error('Talent tree is not visible.');
  await page.mouse.move(handleBounds.x + handleBounds.width / 2, handleBounds.y + handleBounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(treeBounds.x + treeBounds.width - 1, treeBounds.y + treeBounds.height / 2, { steps: 16 });
  await page.mouse.up();
  const after = await talent.boundingBox();
  expect(after?.x).toBeCloseTo(before.x, 0);
  expect(after?.y).toBeCloseTo(before.y, 0);
});

test('searches every spell placement with Ctrl or Cmd+F', async ({ page }) => {
  await createSpell(page, 'Épouvante talent');
  await createSpell(page, 'Grande epouvante', 'Spell_Shadow_DeathCoil.PNG');
  await createSpell(page, 'Epouvante baseline', 'Spell_Shadow_LifeDrain.PNG');

  const firstTree = page.locator('.tree-panel').first();
  await drag(page, page.locator('.spell-card').filter({ hasText: 'Épouvante talent' }).locator('.spell-drag-handle'), firstTree.getByTestId('cell-0-0'));
  await drag(page, page.locator('.spell-card').filter({ hasText: 'Epouvante baseline' }).locator('.spell-drag-handle'), page.locator('.baseline-panel'));

  const shortcutPrevented = await page.evaluate(() => {
    const event = new KeyboardEvent('keydown', { key: 'f', ctrlKey: true, bubbles: true, cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(shortcutPrevented).toBe(true);

  const search = page.getByLabel('Rechercher un sort');
  await expect(search).toBeFocused();
  await search.fill('epouvante');
  await expect(page.getByText('3 résultats', { exact: true })).toBeVisible();
  await expect(firstTree.locator('.talent-node.search-match')).toHaveCount(1);
  await expect(page.locator('.baseline-panel .spell-card.search-match')).toHaveCount(1);
  await expect(page.locator('.reserve-panel .spell-card.search-match')).toHaveCount(1);

  await search.press('Escape');
  await expect(search).toHaveCount(0);
  await expect(page.locator('.search-match')).toHaveCount(0);

  await page.keyboard.press('Meta+f');
  await expect(page.getByLabel('Rechercher un sort')).toBeFocused();
  await expect(page.getByText('0 résultats', { exact: true })).toBeVisible();
  await page.getByLabel('Rechercher un sort').fill('epouvante');
  await page.getByLabel('Nouveau prototype').click();
  await expect(page.getByLabel('Rechercher un sort')).toHaveValue('epouvante');
  await expect(page.getByText('0 résultats', { exact: true })).toBeVisible();

  await page.getByLabel('Fermer la recherche').click();
  await page.keyboard.press('Control+f');
  await expect(page.getByLabel('Rechercher un sort')).toHaveValue('');
});

test('keeps the native find shortcut available while a dialog is open', async ({ page }) => {
  await page.getByRole('button', { name: /Nouveau sort/ }).click();
  const shortcutPrevented = await page.evaluate(() => {
    const event = new KeyboardEvent('keydown', { key: 'f', ctrlKey: true, bubbles: true, cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
  });

  expect(shortcutPrevented).toBe(false);
  await expect(page.getByLabel('Rechercher un sort')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Créer un faux sort' })).toBeVisible();
});
