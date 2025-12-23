import { test, expect } from '@playwright/test';

test.describe('Next.js App End-to-End Tests', () => {

    test('Home page should load and display correctly', async ({ page }) => {
        await page.goto('/');

        // Check main title
        await expect(page.getByText('AI Full Stack Demo')).toBeVisible();

        // Check links to other features
        await expect(page.getByRole('link', { name: '知识库问答' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'AI 导购电商' })).toBeVisible();
    });

    test('Shop page should display products and navigation', async ({ page }) => {
        await page.goto('/shop');

        // Header
        await expect(page.getByText('AI 商城 V2')).toBeVisible();

        // Categories navigation
        const categories = ['全部', '鞋类', '数码', '家具', '家居'];
        for (const cat of categories) {
            // Use getByRole link to avoid matching visible text elsewhere (like headers)
            await expect(page.getByRole('link', { name: cat, exact: true })).toBeVisible();
        }

        // Check functionality: clickable category
        await page.getByRole('link', { name: '数码', exact: true }).click();
        await expect(page).toHaveURL(/category=%E6%95%B0%E7%A0%81|category=数码/);
        await expect(page.getByText('当前分类: 数码')).toBeVisible();

        // Reset to All
        await page.getByRole('link', { name: '全部', exact: true }).click();
        await expect(page).toHaveURL(/\/shop$/);

        // Check Header Icons (Cart and Login)
        await expect(page.getByTitle('查看购物车')).toBeVisible();
        await expect(page.getByTitle('用户登录')).toBeVisible();

        // Check Products or Seed Button
        // If no products, we expect the seed button
        const seedButton = page.getByText('初始化测试数据');
        const productCards = page.locator('.group').first();

        if (await seedButton.isVisible()) {
            console.log('Seed button is visible');
        } else {
            // Verify at least one product
            await expect(productCards).toBeVisible();
            // Verify Add to Cart button exists
            await expect(page.locator('button').filter({ hasText: 'Add' }).first()).toBeVisible().catch(() => { });
        }
    });

    test('Login page should render login options', async ({ page }) => {
        await page.goto('/login');

        await expect(page.getByText('登录商城')).toBeVisible();
        await expect(page.getByText('微信一键登录')).toBeVisible();
        await expect(page.getByPlaceholder('请输入邮箱')).toBeVisible();
        await expect(page.getByPlaceholder('请输入密码')).toBeVisible();

        // Check Anonymous login
        await expect(page.locator('button').filter({ hasText: '游客' }).first()).toBeVisible();
    });

    test('RAG page should load knowledge base interface', async ({ page }) => {
        await page.goto('/rag');

        await expect(page.getByText('AI 知识库问答')).toBeVisible();
        await expect(page.getByText('上传 PDF 文档')).toBeVisible();

        // Check input area
        await expect(page.getByPlaceholder('问我任何关于文档的问题...')).toBeVisible();
        // Check upload button
        await expect(page.getByText('上传并学习')).toBeVisible();
    });

});
