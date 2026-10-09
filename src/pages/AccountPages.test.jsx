import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { LoginPage, RegisterPage, ServicePage } from './AccountPages.jsx';
import { apiRequest } from '../lib/api.js';

vi.mock('../lib/api.js', () => ({ apiRequest: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

function renderRoutes(page, nextPath = '/menu') {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <LocationProbe />
      <Routes>
        <Route path="/" element={page} />
        <Route path={nextPath} element={<p>Página de destino</p>} />
      </Routes>
    </MemoryRouter>
  );
}

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="ubicación actual">{location.pathname}{location.search}</output>;
}

describe('LoginPage', () => {
  it('inicia sesión y navega según el rol recibido', async () => {
    apiRequest.mockResolvedValue({ user: { role: 'admin' } });
    const user = userEvent.setup();
    renderRoutes(<LoginPage />, '/admin');

    await user.type(screen.getByLabelText('Correo electrónico'), 'admin@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'secreto123');
    await user.click(screen.getByRole('button', { name: /Ingresar a mi cuenta/ }));

    expect(await screen.findByText('Página de destino')).toBeInTheDocument();
    expect(apiRequest).toHaveBeenCalledWith('auth.php?action=login', expect.objectContaining({ method: 'POST' }));
  });

  it('no permite que una cuenta cliente use el acceso de administrador', async () => {
    apiRequest.mockResolvedValue({ user: { role: 'customer' } });
    const user = userEvent.setup();
    renderRoutes(<LoginPage />, '/admin');

    await user.click(screen.getByRole('button', { name: 'Ingresar como administrador' }));
    await user.type(screen.getByLabelText('Correo electrónico'), 'cliente@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'secreto123');
    await user.click(screen.getByRole('button', { name: /Ingresar al menú administrador/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Esta cuenta no tiene acceso');
    expect(screen.queryByText('Página de destino')).not.toBeInTheDocument();
  });

  it('muestra errores de autenticación de la API', async () => {
    apiRequest.mockRejectedValue(new Error('Credenciales incorrectas.'));
    const user = userEvent.setup();
    renderRoutes(<LoginPage />);

    await user.type(screen.getByLabelText('Correo electrónico'), 'user@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta');
    await user.click(screen.getByRole('button', { name: /Ingresar a mi cuenta/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales incorrectas.');
  });
});

describe('RegisterPage', () => {
  it('detiene el registro si las contraseñas no coinciden', async () => {
    const user = userEvent.setup();
    renderRoutes(<RegisterPage />);

    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez');
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com');
    await user.type(screen.getByLabelText('Confirmar correo'), 'ana@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'secreto123');
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'otra-clave');
    await user.selectOptions(screen.getByLabelText('Región'), 'Región Metropolitana');
    await user.type(screen.getByLabelText('Comuna'), 'Santiago');
    await user.click(screen.getByRole('button', { name: /Crear cuenta/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Las contraseñas no coinciden.');
    expect(apiRequest).not.toHaveBeenCalled();
  });

  it('envía los datos normalizados y confirma el registro exitoso', async () => {
    apiRequest.mockResolvedValue({ created: true });
    const user = userEvent.setup();
    renderRoutes(<RegisterPage />);

    await user.type(screen.getByLabelText('Nombre completo'), ' Ana Pérez ');
    await user.type(screen.getByLabelText('Correo electrónico'), ' ANA@EXAMPLE.COM ');
    await user.type(screen.getByLabelText('Confirmar correo'), 'ana@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'secreto123');
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'secreto123');
    await user.type(screen.getByLabelText('Teléfono (opcional)'), ' 912345678 ');
    await user.selectOptions(screen.getByLabelText('Región'), 'Región Metropolitana');
    await user.type(screen.getByLabelText('Comuna'), 'Santiago');
    await user.click(screen.getByRole('button', { name: /Crear cuenta/ }));

    expect(await screen.findByLabelText('ubicación actual')).toHaveTextContent('/?registro=exitoso');
    expect(apiRequest).toHaveBeenCalledWith('auth.php?action=register', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        name: 'Ana Pérez',
        email: 'ana@example.com',
        password: 'secreto123',
        telephone: '912345678',
        region: 'Región Metropolitana',
        commune: 'Santiago'
      })
    }));
  });
});

describe('ServicePage', () => {
  it('envía el formulario de contacto y muestra la confirmación', async () => {
    apiRequest.mockResolvedValue({ sent: true });
    const user = userEvent.setup();
    render(<MemoryRouter><ServicePage /></MemoryRouter>);

    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez');
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com');
    await user.type(screen.getByLabelText('Mensaje'), 'Necesito información de una ruta.');
    await user.click(screen.getByRole('button', { name: /Enviar mensaje/ }));

    expect(await screen.findByRole('status')).toHaveTextContent('Mensaje guardado');
    expect(apiRequest).toHaveBeenCalledWith('contact.php', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        name: 'Ana Pérez',
        email: 'ana@example.com',
        message: 'Necesito información de una ruta.'
      })
    }));
  });

  it('muestra un error cuando no se puede guardar el mensaje', async () => {
    apiRequest.mockRejectedValue(new Error('No se pudo guardar el mensaje.'));
    const user = userEvent.setup();
    render(<MemoryRouter><ServicePage /></MemoryRouter>);

    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez');
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com');
    await user.type(screen.getByLabelText('Mensaje'), 'Consulta');
    await user.click(screen.getByRole('button', { name: /Enviar mensaje/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar el mensaje.');
  });
});
