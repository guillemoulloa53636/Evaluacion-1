import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ForgotPasswordPage, ResetPasswordPage, ProfilePage } from './AccountPages.jsx';
import { apiRequest } from '../lib/api.js';

vi.mock('../lib/api.js', () => ({ apiRequest: vi.fn(), clearAuth: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('ForgotPasswordPage', () => {
  it('pide solo el correo y muestra confirmación genérica', async () => {
    apiRequest.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<MemoryRouter><ForgotPasswordPage /></MemoryRouter>);
    expect(screen.queryByLabelText(/actual/i)).toBeNull();
    await user.type(screen.getByLabelText('Correo electrónico'), 'cote@gmail.com');
    await user.click(screen.getByRole('button', { name: /Enviar enlace/ }));

    expect(await screen.findByRole('status')).toHaveTextContent('te enviamos un enlace');
    expect(apiRequest).toHaveBeenCalledWith('auth/forgot-password', expect.objectContaining({
      body: JSON.stringify({ email: 'cote@gmail.com' })
    }));
  });
});

describe('ResetPasswordPage', () => {
  const renderReset = (url) => render(<MemoryRouter initialEntries={[url]}><ResetPasswordPage /></MemoryRouter>);

  it('rechaza contraseñas que no coinciden', async () => {
    const user = userEvent.setup();
    renderReset('/restablecer?token=abc');
    await user.type(screen.getByLabelText('Nueva contraseña'), 'Nueva12345');
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'Otra123456');
    await user.click(screen.getByRole('button', { name: /Guardar contraseña/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('no coinciden');
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it('envía token y nueva contraseña', async () => {
    apiRequest.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderReset('/restablecer?token=abc');
    await user.type(screen.getByLabelText('Nueva contraseña'), 'Nueva12345');
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'Nueva12345');
    await user.click(screen.getByRole('button', { name: /Guardar contraseña/ }));
    expect(await screen.findByRole('status')).toHaveTextContent('Contraseña actualizada');
    expect(apiRequest).toHaveBeenCalledWith('auth/reset-password', expect.objectContaining({
      body: JSON.stringify({ token: 'abc', newPassword: 'Nueva12345' })
    }));
  });

  it('avisa si falta el token', () => {
    renderReset('/restablecer');
    expect(screen.getByRole('alert')).toHaveTextContent('no es válido');
  });
});

describe('Cambiar contraseña dentro del perfil', () => {
  it('envía la contraseña actual y la nueva', async () => {
    apiRequest.mockImplementation(async (path) => path === 'auth/change-password'
      ? { ok: true }
      : { user: { email: 'cote@gmail.com', name: 'maria', telephone: '', region: 'RM', commune: 'X' } });
    const user = userEvent.setup();
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    await screen.findByLabelText('Nombre completo');
    await user.type(screen.getByLabelText('Contraseña actual'), 'Cote1234');
    await user.type(screen.getByLabelText('Nueva contraseña'), 'Nueva12345');
    await user.type(screen.getByLabelText('Confirmar nueva contraseña'), 'Nueva12345');
    await user.click(screen.getByRole('button', { name: /Actualizar contraseña/ }));
    expect(await screen.findByRole('status')).toHaveTextContent('Contraseña actualizada');
    expect(apiRequest).toHaveBeenCalledWith('auth/change-password', expect.objectContaining({
      body: JSON.stringify({ currentPassword: 'Cote1234', newPassword: 'Nueva12345' })
    }));
  });
});

describe('ProfilePage', () => {
  it('carga los datos, permite editarlos y guarda por PUT auth/me', async () => {
    apiRequest.mockImplementation(async (path, options) => {
      if (path === 'auth/me' && options?.method === 'PUT') {
        return { user: { ...JSON.parse(options.body), email: 'cote@gmail.com' } };
      }
      return { user: { email: 'cote@gmail.com', name: 'maria', telephone: '', region: 'RM', commune: 'La Florida' } };
    });
    const user = userEvent.setup();
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);

    const name = await screen.findByLabelText('Nombre completo');
    expect(screen.getByLabelText('Correo electrónico')).toBeDisabled();
    await user.clear(name);
    await user.type(name, 'María Pérez');
    await user.click(screen.getByRole('button', { name: /Guardar cambios/ }));

    expect(await screen.findByRole('status')).toHaveTextContent('Datos actualizados');
    expect(apiRequest).toHaveBeenCalledWith('auth/me', expect.objectContaining({ method: 'PUT' }));
  });
});
