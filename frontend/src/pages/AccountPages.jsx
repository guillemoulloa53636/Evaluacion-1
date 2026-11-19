import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest, clearAuth } from '../lib/api.js';
import { imageUrl } from '../data/catalog.js';
import PurchaseHistory from '../components/PurchaseHistory.jsx';

const DEFAULT_GOOGLE_CLIENT_ID = '25065180497-5qa2tf845vbhk57gjav0iht24jkre8ft.apps.googleusercontent.com';

function getRoleHome(role) {
  if (['admin', 'administrador'].includes(role)) return '/admin';
  if (['seller', 'vendedor'].includes(role)) return '/vendedor';
  return '/menu';
}

export function LoginPage() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();
  const googleButton = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleClientId) return undefined;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      if (!window.google || !googleButton.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          try {
            const { user } = await apiRequest('auth/google', { method: 'POST', body: JSON.stringify({ credential }) });
            navigate(getRoleHome(user.role));
          } catch (requestError) {
            setError(requestError.message);
          }
        }
      });
      window.google.accounts.id.renderButton(googleButton.current, { theme: 'outline', size: 'large', width: 320 });
    };
    document.body.appendChild(script);
    return () => script.remove();
  }, [googleClientId, navigate]);

  function toggleLoginMode() {
    setIsAdminLogin((current) => !current);
    setError('');
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const { user } = await apiRequest('auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (isAdminLogin && !['admin', 'administrador'].includes(user.role)) {
        try {
          await apiRequest('auth/logout', { method: 'POST' });
        } catch (logoutError) {
          clearAuth();
          setError(`Esta cuenta no tiene acceso al menú de administración. No se pudo revocar la sesión: ${logoutError.message}`);
          return;
        }
        clearAuth();
        setError('Esta cuenta no tiene acceso al menú de administración.');
        return;
      }
      navigate(getRoleHome(user.role));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return <section className="account-page container">
    <div className="account-aside"><span className="eyebrow">PRÓXIMA PARADA</span><h1>Hay mucho Chile por conocer.</h1><p>Guarda tus rutas y prepara tu próximo viaje.</p><img src={imageUrl('Valdi.JPG')} alt="Paisaje del sur de Chile" /></div>
    <div className="account-form-wrap">
      <button type="button" className="admin-login-toggle" onClick={toggleLoginMode}>
        {isAdminLogin ? 'Volver al inicio de sesión' : 'Ingresar como administrador'}
      </button>
      <span className="eyebrow">{isAdminLogin ? 'ACCESO ADMINISTRADOR' : 'BIENVENIDO DE VUELTA'}</span><h2>{isAdminLogin ? 'Inicia sesión como administrador' : 'Inicia sesión'}</h2><p className="muted">{isAdminLogin ? 'Ingresa tus credenciales de administrador para acceder al menú.' : 'Accede para gestionar tus pasajes.'}</p>{params.get('registro') === 'exitoso' && !isAdminLogin && <div className="form-success" role="status">Cuenta creada. Ya puedes iniciar sesión.</div>}
      <form className="stack-form" onSubmit={submit}><label>Correo electrónico<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Contraseña<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark w-100">{isAdminLogin ? 'Ingresar al menú administrador' : 'Ingresar a mi cuenta'} <i className="bi bi-arrow-right" /></button></form>
      {googleClientId && <div ref={googleButton} className="google-signin" />}
      <p className="account-switch">¿No tienes una cuenta? <Link to="/registro">Regístrate</Link></p>
      <p className="account-switch"><Link to="/olvide-contrasena">¿Olvidaste tu contraseña?</Link></p>
      <p className="demo-note">Tus datos se validan en la base MariaDB local.</p>
    </div>
  </section>;
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSent(false);
    try {
      await apiRequest('auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
      setSent(true);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return <section className="container narrow-page page-section"><span className="eyebrow">TU CUENTA</span><h1>¿Olvidaste tu contraseña?</h1>
    <p className="muted">Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.</p>
    <form className="stack-form form-panel" onSubmit={submit}>
      <label>Correo electrónico<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      {sent && <div className="form-success" role="status">Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña.</div>}
      <button className="button button-dark">Enviar enlace</button>
    </form>
    <p className="account-switch"><Link to="/">Volver al inicio de sesión</Link></p>
  </section>;
}

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [form, setForm] = useState({ newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (form.newPassword !== form.confirm) return setError('Las contraseñas no coinciden.');
    try {
      await apiRequest('auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword: form.newPassword }) });
      setDone(true);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (!token) return <section className="container narrow-page page-section"><p className="form-error" role="alert">El enlace no es válido. Solicita uno nuevo.</p><Link to="/olvide-contrasena">Solicitar enlace</Link></section>;
  return <section className="container narrow-page page-section"><span className="eyebrow">TU CUENTA</span><h1>Crea tu nueva contraseña</h1>
    {done ? <div className="form-success" role="status">Contraseña actualizada. <Link to="/">Inicia sesión</Link></div>
      : <form className="stack-form form-panel" onSubmit={submit}>
        <label>Nueva contraseña<input type="password" name="newPassword" value={form.newPassword} onChange={update} autoComplete="new-password" minLength="8" required /></label>
        <label>Confirmar contraseña<input type="password" name="confirm" value={form.confirm} onChange={update} autoComplete="new-password" minLength="8" required /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-dark">Guardar contraseña</button>
      </form>}
  </section>;
}

function ChangePasswordForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError('');
    setDone(false);
    if (form.newPassword !== form.confirm) return setError('Las contraseñas nuevas no coinciden.');
    try {
      await apiRequest('auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      });
      setDone(true);
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return <form className="stack-form form-panel" onSubmit={submit} aria-label="Cambiar contraseña">
    <h2>Cambiar contraseña</h2>
    <label>Contraseña actual<input type="password" name="currentPassword" value={form.currentPassword} onChange={update} autoComplete="current-password" required /></label>
    <label>Nueva contraseña<input type="password" name="newPassword" value={form.newPassword} onChange={update} autoComplete="new-password" minLength="8" required /></label>
    <label>Confirmar nueva contraseña<input type="password" name="confirm" value={form.confirm} onChange={update} autoComplete="new-password" minLength="8" required /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    {done && <div className="form-success" role="status">Contraseña actualizada.</div>}
    <button className="button button-dark">Actualizar contraseña</button>
  </form>;
}

export function ProfilePage() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest('auth/me')
      .then(({ user }) => setForm({
        email: user.email, name: user.name || '', telephone: user.telephone || '',
        region: user.region || '', commune: user.commune || ''
      }))
      .catch(() => navigate('/'));
  }, [navigate]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSaved(false);
    try {
      const { user } = await apiRequest('auth/me', {
        method: 'PUT',
        body: JSON.stringify({ name: form.name, telephone: form.telephone, region: form.region, commune: form.commune })
      });
      globalThis.localStorage?.setItem('viajes.user', JSON.stringify(user));
      setSaved(true);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (!form) return <section className="container narrow-page page-section"><p className="muted">Cargando tus datos…</p></section>;
  return <section className="container narrow-page page-section"><span className="eyebrow">TU CUENTA</span><h1>Mis datos</h1>
    <form className="stack-form form-panel" onSubmit={submit}>
      <label>Correo electrónico<input value={form.email} disabled readOnly /></label>
      <label>Nombre completo<input name="name" value={form.name} onChange={update} required /></label>
      <label>Teléfono<input name="telephone" type="tel" value={form.telephone} onChange={update} /></label>
      <div className="form-two"><label>Región<input name="region" value={form.region} onChange={update} required /></label><label>Comuna<input name="commune" value={form.commune} onChange={update} required /></label></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {saved && <div className="form-success" role="status">Datos actualizados.</div>}
      <button className="button button-dark">Guardar cambios</button>
    </form>
    <ChangePasswordForm />
    <PurchaseHistory />
  </section>;
}

export function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', correo: '', confirmarCorreo: '', password: '', confirmarPassword: '', telefono: '', region: '', comuna: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    const correo = form.correo.trim().toLowerCase();
    if (correo !== form.confirmarCorreo.trim().toLowerCase()) return setError('Los correos electrónicos no coinciden.');
    if (form.password !== form.confirmarPassword) return setError('Las contraseñas no coinciden.');
    setError('');
    try {
      await apiRequest('auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: form.nombre.trim(), email: correo, password: form.password,
          telephone: form.telefono.trim(), region: form.region, commune: form.comuna
        })
      });
      navigate('/?registro=exitoso');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return <section className="container narrow-page page-section"><span className="eyebrow">TU CUENTA</span><h1>Crea tu cuenta</h1><p className="muted">Guarda tus datos y prepara tus próximos viajes.</p>
    <form className="stack-form form-panel" onSubmit={submit}>
      <label>Nombre completo<input name="nombre" value={form.nombre} onChange={update} autoComplete="name" required /></label>
      <div className="form-two"><label>Correo electrónico<input type="email" name="correo" value={form.correo} onChange={update} autoComplete="email" required /></label><label>Confirmar correo<input type="email" name="confirmarCorreo" value={form.confirmarCorreo} onChange={update} required /></label></div>
      <div className="form-two"><label>Contraseña<input type="password" name="password" value={form.password} onChange={update} autoComplete="new-password" minLength="8" required /></label><label>Confirmar contraseña<input type="password" name="confirmarPassword" value={form.confirmarPassword} onChange={update} minLength="8" required /></label></div>
      <label>Teléfono <span className="muted">(opcional)</span><input name="telefono" type="tel" value={form.telefono} onChange={update} autoComplete="tel" /></label>
      <div className="form-two"><label>Región<select name="region" value={form.region} onChange={update} required><option value="">Seleccionar</option><option>Región Metropolitana</option><option>Región de la Araucanía</option><option>Región de Ñuble</option></select></label><label>Comuna<input name="comuna" value={form.comuna} onChange={update} required /></label></div>
      {error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark">Crear cuenta <i className="bi bi-arrow-right" /></button>
    </form>
    <p className="demo-note">La contraseña se guarda cifrada con hash en MariaDB. Usa una clave distinta de tus contraseñas personales.</p>
  </section>;
}

export function ServicePage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    setError('');
    try {
      await apiRequest('contact-messages', {
        method: 'POST',
        body: JSON.stringify({ name: formData.get('nombre'), email: formData.get('correo'), message: formData.get('mensaje'), isComplaint: formData.get('reclamo') === 'on' })
      });
      setSent(true);
      formElement.reset();
    } catch (requestError) {
      setError(requestError.message);
    }
  }
  return <section className="container contact-page page-section"><div><span className="eyebrow">ESTAMOS PARA AYUDAR</span><h1>Hablemos de tu viaje.</h1><p className="muted">Cuéntanos cómo podemos ayudarte. Nuestro equipo revisará tu consulta.</p><div className="contact-detail"><i className="bi bi-envelope" /><span>Atención en línea<br /><strong>Respuesta dentro de 1 día hábil</strong></span></div></div><form className="stack-form form-panel" onSubmit={submit}><label>Nombre completo<input name="nombre" autoComplete="name" required /></label><label>Correo electrónico<input type="email" name="correo" autoComplete="email" required /></label><label>Mensaje<textarea name="mensaje" rows="5" required /></label><label style={{ display: 'flex', alignItems: 'center', gap: 10 }}><input type="checkbox" name="reclamo" style={{ width: 'auto', minHeight: 'auto' }} />Este mensaje es un reclamo</label>{error && <p className="form-error" role="alert">{error}</p>}{sent && <div className="form-success" role="status">Mensaje guardado en la base de datos.</div>}<button className="button button-dark">Enviar mensaje <i className="bi bi-arrow-right" /></button></form></section>;
}

const AccountPages = { LoginPage, RegisterPage, ServicePage, ForgotPasswordPage, ResetPasswordPage, ProfilePage };
export default AccountPages;