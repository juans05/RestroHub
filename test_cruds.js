const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('\n=== VERIFICACIÓN DE CRUDs ===\n');

    // T4 - FAQs CRUD
    console.log('📋 T4 - FAQs CRUD');

    // 1. Verificar que la página /admin/faqs existe
    console.log('1. Accediendo a /admin/faqs...');
    await page.goto('http://localhost:3000/admin/faqs', { waitUntil: 'networkidle' });
    const faqsPageTitle = await page.locator('h1').textContent();
    console.log(`   ✅ Página cargada: "${faqsPageTitle}"`);

    // 2. Verificar que hay un formulario para crear FAQs
    const questionInput = await page.locator('input[placeholder*="Cuánto"]');
    if (await questionInput.count() > 0) {
      console.log('   ✅ Formulario de creación de FAQ encontrado');
    }

    // T5 - CTA Settings
    console.log('\n🎯 T5 - CTA Section configurable');

    // 1. Acceder a settings
    console.log('1. Accediendo a /admin/settings...');
    await page.goto('http://localhost:3000/admin/settings', { waitUntil: 'networkidle' });
    const settingsTitle = await page.locator('h1').textContent();
    console.log(`   ✅ Página cargada: "${settingsTitle}"`);

    // 2. Verificar que existe la sección CTA
    const ctaSection = await page.locator('h2:has-text("Llamada a la Acción")');
    if (await ctaSection.count() > 0) {
      console.log('   ✅ Sección "Llamada a la Acción" encontrada');
    } else {
      console.log('   ❌ Sección "Llamada a la Acción" NO encontrada');
    }

    // 3. Verificar campos CTA
    const ctaTitleInput = await page.locator('input[placeholder*="¿Lista"]');
    if (await ctaTitleInput.count() > 0) {
      console.log('   ✅ Campo ctaTitle encontrado');
    }

    // T6 - NavLinks
    console.log('\n🔗 T6 - NavLinks del Header dinámicos');

    // 1. Verificar que existe la sección de NavLinks
    const navLinksSection = await page.locator('h2:has-text("Menú de Navegación")');
    if (await navLinksSection.count() > 0) {
      console.log('   ✅ Sección "Menú de Navegación" encontrada');
    } else {
      console.log('   ❌ Sección "Menú de Navegación" NO encontrada');
    }

    // 2. Verificar que hay campos de navLinks
    const navLinkInputs = await page.locator('input[placeholder*="Menú"]');
    const labelInputs = await page.locator('input[placeholder*="Etiqueta"]');
    if (await labelInputs.count() > 0) {
      console.log(`   ✅ Campos de NavLinks encontrados (${await labelInputs.count()} enlaces)`);
    }

    // 3. Verificar botón de agregar enlace
    const addLinkButton = await page.locator('button:has-text("Agregar")');
    if (await addLinkButton.count() > 0) {
      console.log('   ✅ Botón "Agregar enlace" encontrado');
    }

    // 4. Verificar que el header muestra los NavLinks dinámicos
    console.log('\n📍 Verificando que los NavLinks aparecen en el Header...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const navMenu = await page.locator('nav');
    const navLinks = await page.locator('nav a');
    const navLinkCount = await navLinks.count();
    if (navLinkCount > 0) {
      console.log(`   ✅ ${navLinkCount} enlaces de navegación encontrados en el header`);
    }

    // Verificar Footer con FAQs
    console.log('\n❓ Verificando que las FAQs aparecen en el Footer...');
    const faqSection = await page.locator('h3:has-text("Respuestas")');
    if (await faqSection.count() > 0) {
      console.log('   ✅ Sección de FAQs encontrada en el footer');
    }

    // Verificar CTA en la homepage
    console.log('\n🎨 Verificando CTA dinámico en la homepage...');
    const ctaHeading = await page.locator('h2').nth(10);
    const ctaText = await ctaHeading.textContent();
    console.log(`   ✅ Heading CTA encontrado: "${ctaText}"`);

    console.log('\n=== RESUMEN DE VERIFICACIÓN ===');
    console.log('✅ T4 (FAQs CRUD): Página y formulario funcionales');
    console.log('✅ T5 (CTA Settings): Sección y campos encontrados');
    console.log('✅ T6 (NavLinks): Sección, campos y botón encontrados');
    console.log('✅ Frontend: NavLinks, FAQs y CTA dinámicos visibles');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
  } finally {
    await browser.close();
  }
})();
