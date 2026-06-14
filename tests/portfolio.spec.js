const { test, expect } = require('@playwright/test');

test.describe('Portfolio Website Basic Functionalities', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the local server
    await page.goto('/');
  });

  test('Page loads successfully with correct title and structure', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Ramesh Senthil/);

    // Check navbar links
    const navMenu = page.locator('#navMenu');
    await expect(navMenu).toBeAttached();
    await expect(page.locator('#navLinkHome')).toBeVisible();
    await expect(page.locator('#navLinkExperience')).toBeVisible();

    // Check sections exist
    await expect(page.locator('#home')).toBeAttached();
    await expect(page.locator('#experience')).toBeAttached();
    await expect(page.locator('#skills')).toBeAttached();
    await expect(page.locator('#projects')).toBeAttached();
    await expect(page.locator('#homelab')).toBeAttached();
    await expect(page.locator('#certifications')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
  });

  test('Theme toggle switcher works and persists in localStorage', async ({ page }) => {
    const themeToggle = page.locator('#themeToggle');
    await expect(themeToggle).toBeVisible();

    // By default, the app is in dark mode (no 'light-theme' class on HTML)
    const htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/light-theme/);
    await expect(themeToggle).toHaveAttribute('aria-label', 'Switch to Light Theme');

    // Click the toggle to switch to light theme
    await themeToggle.click();
    await expect(htmlElement).toHaveClass(/light-theme/);
    await expect(themeToggle).toHaveAttribute('aria-label', 'Switch to Dark Theme');

    // Verify localStorage has saved theme as 'light'
    const storedThemeLight = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedThemeLight).toBe('light');

    // Reload the page and ensure theme persists
    await page.reload();
    await expect(htmlElement).toHaveClass(/light-theme/);

    // Toggle back to dark theme
    await themeToggle.click();
    await expect(htmlElement).not.toHaveClass(/light-theme/);
    await expect(themeToggle).toHaveAttribute('aria-label', 'Switch to Light Theme');

    const storedThemeDark = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedThemeDark).toBe('dark');
  });

  test('Project modals open and close with correct focus management', async ({ page }) => {
    const modal = page.locator('#projectModal');
    const modalBody = page.locator('#modalBody');
    const closeBtn = modal.locator('.modal-close');

    // Modal should be hidden by default
    await expect(modal).toHaveClass(/hidden/);

    // Trigger click on the first project card ("workspace")
    const workspaceCard = page.locator('.project-card').first();
    await workspaceCard.click();

    // Modal should be visible now (class 'hidden' is removed)
    await expect(modal).not.toHaveClass(/hidden/);

    // Verify modal content loaded dynamically
    await expect(modalBody.locator('.modal-title-h')).toHaveText(/Advanced Visualization Workspace/);
    await expect(modalBody.locator('.modal-tech-pill').first()).toBeVisible();

    // Accessibility test: Close button should receive focus automatically when modal opens
    await expect(closeBtn).toBeFocused();

    // Close the modal by clicking the close button
    await closeBtn.click();
    await expect(modal).toHaveClass(/hidden/);

    // Verify body overflow is reset to auto
    const bodyOverflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    expect(bodyOverflow).toBe('auto');

    // Reopen and close via Escape key
    await workspaceCard.click();
    await expect(modal).not.toHaveClass(/hidden/);
    
    // Press 'Escape' key
    await page.keyboard.press('Escape');
    await expect(modal).toHaveClass(/hidden/);
  });

  test('Mobile navigation drawer operations', async ({ page, isMobile }) => {
    const mobileToggle = page.locator('#mobileToggle');
    const navMenu = page.locator('#navMenu');

    if (!isMobile) {
      // On desktop, the toggle should be hidden or not visible
      await expect(mobileToggle).not.toBeVisible();
      return;
    }

    // On mobile viewports:
    await expect(mobileToggle).toBeVisible();
    await expect(navMenu).not.toHaveClass(/open/);

    // Click toggle to open drawer menu
    await mobileToggle.click();
    await expect(navMenu).toHaveClass(/open/);
    await expect(mobileToggle).toHaveAttribute('aria-expanded', 'true');

    // Click nav link to close drawer menu
    await page.locator('#navLinkExperience').click();
    await expect(navMenu).not.toHaveClass(/open/);
    await expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('Contact form field validation rules', async ({ page }) => {
    const nameInput = page.locator('#formName');
    const emailInput = page.locator('#formEmail');
    const subjectInput = page.locator('#formSubject');
    const messageInput = page.locator('#formMessage');
    const submitBtn = page.locator('#formSubmitBtn');

    // 1. Submit empty form
    const isNameInitiallyValid = await nameInput.evaluate(el => el.checkValidity());
    expect(isNameInitiallyValid).toBeFalsy();

    // Fill only name
    await nameInput.fill('Jane Doe');
    const isEmailInitiallyValid = await emailInput.evaluate(el => el.checkValidity());
    expect(isEmailInitiallyValid).toBeFalsy();

    // 2. Invalid Email format validation
    await emailInput.fill('invalid-email-address');
    await subjectInput.fill('Hello');
    await messageInput.fill('This is a test message.');

    const isEmailFormatValid = await emailInput.evaluate(el => el.checkValidity());
    expect(isEmailFormatValid).toBeFalsy();

    // Fill valid email address
    await emailInput.fill('jane.doe@example.com');
    const isFormValidNow = await page.evaluate(() => document.getElementById('contactForm').checkValidity());
    expect(isFormValidNow).toBeTruthy();
  });

  test('Contact form submission behaves correctly when mocked', async ({ page }) => {
    const form = page.locator('#contactForm');
    const successMsg = page.locator('#formSuccessMessage');
    const errorMsg = page.locator('#formErrorMessage');

    // Mock the Web3Forms submission endpoint to return success
    await page.route('https://api.web3forms.com/submit', async (route) => {
      const json = { success: true, message: 'Submission successful' };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json
      });
    });

    // Fill form details
    await page.locator('#formName').fill('Jane Doe');
    await page.locator('#formEmail').fill('jane.doe@example.com');
    await page.locator('#formSubject').fill('Collaboration Opportunity');
    await page.locator('#formMessage').fill('Hi Ramesh, love your portfolio website!');

    // Submit form
    await page.locator('#formSubmitBtn').click();

    // Form should hide and success message should appear
    await expect(form).toHaveClass(/hidden/);
    await expect(successMsg).toBeVisible();
    await expect(errorMsg).not.toBeVisible();
  });
});
