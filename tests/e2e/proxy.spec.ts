import { test, expect } from '@playwright/test';

test.describe('Middleware de Autenticação e Rotas', () => {

  test('Deve redirecionar usuário não autenticado de /dashboard para /login', async ({ page }) => {
    // Tenta acessar a rota protegida
    await page.goto('/dashboard');

    // O middleware deve interceptar e jogar para o login
    // Usamos regex para garantir que a URL termine com /login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Deve redirecionar usuário não autenticado de /backoffice/panel para /login', async ({ page }) => {
    // Tenta acessar a área de admin
    await page.goto('/backoffice/panel');

    // Novamente, sem sessão do Supabase, deve cair no login
    await expect(page).toHaveURL(/.*\/login/);
  });

});