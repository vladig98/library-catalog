const { test, expect } = require('@playwright/test');

// Helper function to log in
async function login(page, email, password) {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('input[type="submit"]');
}

test.describe('Navigation Bar for Guest Users', () => {
    test('Verify "All Books" link is visible', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForSelector('nav.navbar');
        const allBooksLink = await page.$('a[href="/catalog"]');
        expect(await allBooksLink.isVisible()).toBeTruthy();
    });

    test('Verify "Login" button is visible', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForSelector('nav.navbar');
        const loginButton = await page.$('a[href="/login"]');
        expect(await loginButton.isVisible()).toBeTruthy();
    });

    test('Verify "Register" button is visible', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForSelector('nav.navbar');
        const registerButton = await page.$('a[href="/register"]');
        expect(await registerButton.isVisible()).toBeTruthy();
    });
});

test.describe('Navigation Bar for Logged-In Users', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, 'peter@abv.bg', '123456');
    });

    test('Verify "All Books" link is visible', async ({ page }) => {
        await page.waitForSelector('nav.navbar');
        const allBooksLink = await page.$('a[href="/catalog"]');
        expect(await allBooksLink.isVisible()).toBeTruthy();
    });

    test('Verify "My Books" link is visible', async ({ page }) => {
        await page.waitForSelector('nav.navbar');
        const myBooksLink = await page.$('a[href="/profile"]');
        expect(await myBooksLink.isVisible()).toBeTruthy();
    });

    test('Verify "Add Book" link is visible', async ({ page }) => {
        await page.waitForSelector('nav.navbar');
        const addBookLink = await page.$('a[href="/create"]');
        expect(await addBookLink.isVisible()).toBeTruthy();
    });

    test('Verify user email is visible', async ({ page }) => {
        await page.waitForSelector('nav.navbar');
        const userEmail = await page.$('nav .navbar-dashboard #user span');
        expect(await userEmail.isVisible()).toBeTruthy();
    });
});

test.describe('Login Page', () => {
    test('Submit the form with valid credentials', async ({ page }) => {
        await login(page, 'peter@abv.bg', '123456');
        await page.waitForURL('http://localhost:3000/catalog');
    });

    test('Submit the form with empty input fields', async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        page.on('dialog', dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('All fields are required!');
            dialog.accept();
        });
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/login');
    });

    test('Submit the form with empty email input field', async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.fill('input[name="password"]', '123456');
        page.on('dialog', dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('All fields are required!');
            dialog.accept();
        });
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/login');
    });

    test('Submit the form with empty password input field', async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.fill('input[name="email"]', 'peter@abv.bg');
        page.on('dialog', dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('All fields are required!');
            dialog.accept();
        });
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/login');
    });
});

test.describe('Register Page', () => {
    test('Submit the form with valid values', async ({ page }) => {
        await page.goto('http://localhost:3000/register');
        const uniqueEmail = `testuser${Date.now()}@example.com`;
        await page.fill('input[name="email"]', uniqueEmail);
        await page.fill('input[name="password"]', '123456');
        await page.fill('input[name="confirm-pass"]', '123456');
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/catalog');
        const allBooksLink = await page.locator('a[href="/catalog"]');
        await expect(allBooksLink).toBeVisible();
    });

    test('Submit the form with empty input fields', async ({ page }) => {
        await page.goto('http://localhost:3000/register');
        page.on('dialog', dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('All fields are required!');
            dialog.accept();
        });
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/register');
    });

    test('Submit the form with empty email field', async ({ page }) => {
        await page.goto('http://localhost:3000/register');
        await page.fill('input[name="password"]', '123456');
        await page.fill('input[name="confirm-pass"]', '123456');
        page.on('dialog', dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('All fields are required!');
            dialog.accept();
        });
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/register');
    });

    test('Submit the form with empty password field', async ({ page }) => {
        await page.goto('http://localhost:3000/register');
        await page.fill('input[name="email"]', 'newuser@abv.bg');
        await page.fill('input[name="confirm-pass"]', '123456');
        page.on('dialog', dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('All fields are required!');
            dialog.accept();
        });
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/register');
    });

    test('Submit the form with empty confirm password field', async ({ page }) => {
        await page.goto('http://localhost:3000/register');
        await page.fill('input[name="email"]', 'newuser@abv.bg');
        await page.fill('input[name="password"]', '123456');
        page.on('dialog', dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('All fields are required!');
            dialog.accept();
        });
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/register');
    });

    test('Submit the form with different passwords', async ({ page }) => {
        await page.goto('http://localhost:3000/register');
        await page.fill('input[name="email"]', 'newuser@abv.bg');
        await page.fill('input[name="password"]', '123456');
        await page.fill('input[name="confirm-pass"]', '654321');
        page.on('dialog', dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('Passwords don\'t match!');
            dialog.accept();
        });
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/register');
    });
});

test.describe('Add Book Page', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, 'peter@abv.bg', '123456');
    });

    test('Submit the form with correct data', async ({ page }) => {
        await page.click('a[href="/create"]');
        await page.fill('input[name="title"]', 'Test Book');
        await page.fill('textarea[name="description"]', 'Test Description');
        await page.fill('input[name="imageUrl"]', 'http://example.com/image.jpg');
        await page.selectOption('select[name="type"]', 'Fiction');
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/catalog');
    });

    test('Submit the form with empty title field', async ({ page }) => {
        await page.click('a[href="/create"]');
        await page.fill('textarea[name="description"]', 'Test Description');
        await page.fill('input[name="imageUrl"]', 'http://example.com/image.jpg');
        await page.selectOption('select[name="type"]', 'Fiction');
        page.on('dialog', dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('All fields are required!');
            dialog.accept();
        });
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/create');
    });

    test('Submit the form with empty description field', async ({ page }) => {
        await page.click('a[href="/create"]');
        await page.fill('input[name="title"]', 'Test Book');
        await page.fill('input[name="imageUrl"]', 'http://example.com/image.jpg');
        await page.selectOption('select[name="type"]', 'Fiction');
        page.on('dialog', dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('All fields are required!');
            dialog.accept();
        });
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/create');
    });

    test('Submit the form with empty image URL field', async ({ page }) => {
        await page.click('a[href="/create"]');
        await page.fill('input[name="title"]', 'Test Book');
        await page.fill('textarea[name="description"]', 'Test Description');
        await page.selectOption('select[name="type"]', 'Fiction');
        page.on('dialog', dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('All fields are required!');
            dialog.accept();
        });
        await page.click('input[type="submit"]');
        await page.waitForURL('http://localhost:3000/create');
    });
});

test.describe('All Books Page', () => {
    test('Verify that all books are displayed', async ({ page }) => {
        await login(page, 'peter@abv.bg', '123456');
        await page.goto('http://localhost:3000/catalog');
        await page.waitForSelector('.other-books-list');
        const books = await page.$$('.otherBooks');
        expect(books.length).toBeGreaterThan(0);
    });
});

test.describe('Details Page', () => {
    test('Verify that logged-in user sees details button and it works correctly', async ({ page }) => {
        await login(page, 'john@abv.bg', '123456');
        await page.goto('http://localhost:3000/catalog');
        await page.click('.otherBooks a.button');
        await page.waitForSelector('.book-information');
        expect(page.url()).toContain('/details/');
    });

    test('Verify that guest user sees details button and it works correctly', async ({ page }) => {
        await page.goto('http://localhost:3000/catalog');
        await page.click('.otherBooks a.button');
        await page.waitForSelector('.book-information');
        expect(page.url()).toContain('/details/');
    });

    test('Verify that all info is displayed correctly', async ({ page }) => {
        await page.goto('http://localhost:3000/catalog');
        await page.click('.otherBooks a.button');
        await page.waitForSelector('.book-information');
        const title = await page.$eval('.book-information h3', el => el.textContent);
        const type = await page.$eval('.book-information .type', el => el.textContent);
        const description = await page.$eval('.book-description p', el => el.textContent);
        expect(title).not.toBe('');
        expect(type).not.toBe('');
        expect(description).not.toBe('');
    });

    test('Verify if Edit and Delete buttons are visible for creator', async ({ page }) => {
        await login(page, 'peter@abv.bg', '123456');
        await page.goto('http://localhost:3000/catalog');
        await page.click('.otherBooks a.button');
        await page.waitForSelector('.book-information');
        const editButton = await page.$('a[href*="/edit"]');
        const deleteButton = await page.$('a[href*="javascript:void(0)"]');
        expect(await editButton.isVisible()).toBeTruthy();
        expect(await deleteButton.isVisible()).toBeTruthy();
    });

    test('Verify if Edit and Delete buttons are not visible for non-creator', async ({ page }) => {
        // Log in as non-creator
        await login(page, 'john@abv.bg', '123456');

        // Ensure there is a book created by another user (e.g., peter@abv.bg)
        await page.goto('http://localhost:3000/catalog');
        await page.click('.otherBooks a.button');

        await page.waitForSelector('.book-information');
        const editButton = await page.locator('a:has-text("Edit")');
        const deleteButton = await page.locator('a:has-text("Delete")');

        await expect(editButton).toBeHidden();
        await expect(deleteButton).toBeHidden();
    });

    test('Verify if Like button is not visible for creator', async ({ page }) => {
        // Log in as the creator
        await login(page, 'peter@abv.bg', '123456');

        // Ensure there is a book created by the logged-in user
        await page.goto('http://localhost:3000/catalog');
        await page.click('.otherBooks a.button');

        await page.waitForSelector('.book-information');
        const likeButton = await page.locator('a:has-text("Like")');

        await expect(likeButton).toBeHidden();
    });

    test('Verify if Like button is visible for non-creator', async ({ page }) => {
        await login(page, 'john@abv.bg', '123456');
        await page.goto('http://localhost:3000/catalog');
        await page.click('.otherBooks a.button');
        await page.waitForSelector('.book-information');
        const likeButton = await page.$('a[href*="javascript:void(0)"]');
        expect(await likeButton.isVisible()).toBeTruthy();
    });
});

test.describe('Logout Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await login(page, 'peter@abv.bg', '123456');
    });

    test('Verify that the "Logout" button is visible', async ({ page }) => {
        await page.waitForSelector('nav.navbar');
        const logoutButton = await page.$('a#logoutBtn');
        expect(await logoutButton.isVisible()).toBeTruthy();
    });

    test('Verify that the "Logout" button redirects correctly', async ({ page }) => {
        await page.click('a#logoutBtn');
        await page.waitForURL('http://localhost:3000/catalog');
        expect(page.url()).toBe('http://localhost:3000/catalog');
    });
});
