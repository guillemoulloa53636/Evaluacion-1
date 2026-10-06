import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

function readUsers() {
  try {
    const value = JSON.parse(localStorage.getItem('usuariosDB') || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function LoginPage() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    const user = readUsers().find((account) => account.correo === email.trim().toLowerCase() && account.password === password);
    if (!user) {
      setError('El correo o la contraseña no son correctos.');
      return;
    }
    localStorage.setItem('usuarioActivo', JSON.stringify({ nombre: user.nombre, correo: user.correo }));
    navigate('/menu');
  }

  return <section className="account-page container">
    <div className="account-aside"><span className="eyebrow">PRÓXIMA PARADA</span><h1>Hay mucho Chile por conocer.</h1><p>Guarda tus rutas y prepara tu próximo viaje.</p><img src="/Img/Valdi.JPG" alt="Paisaje del sur de Chile" /></div>
    <div className="account-form-wrap"><span className="eyebrow">BIENVENIDO DE VUELTA</span><h2>Inicia sesión</h2><p className="muted">Accede para gestionar tus pasajes.</p>{params.get('registro') === 'exitoso' && <div className="form-success" role="status">Cuenta creada. Ya puedes iniciar sesión.</div>}
      <form className="stack-form" onSubmit={submit}><label>Correo electrónico<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Contraseña<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark w-100">Ingresar a mi cuenta <i className="bi bi-arrow-right" /></button></form>
      <p className="account-switch">¿No tienes una cuenta? <Link to="/registro">Regístrate</Link></p>
      <p className="demo-note">Prototipo local: las cuentas se almacenan en este navegador; no uses contraseñas reales.</p>
    </div>
  </section>;
}

export function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', correo: '', confirmarCorreo: '', password: '', confirmarPassword: '', telefono: '', region: '', comuna: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submit(event) {
    event.preventDefault();
    const correo = form.correo.trim().toLowerCase();
    if (correo !== form.confirmarCorreo.trim().toLowerCase()) return setError('Los correos electrónicos no coinciden.');
    if (form.password !== form.confirmarPassword) return setError('Las contraseñas no coinciden.');
    const users = readUsers();
    if (users.some((user) => user.correo?.toLowerCase() === correo)) return setError('Ya existe una cuenta con ese correo.');
    users.push({ nombre: form.nombre.trim(), correo, password: form.password, telefono: form.telefono.trim(), region: form.region, comuna: form.comuna });
    localStorage.setItem('usuariosDB', JSON.stringify(users));
    navigate('/?registro=exitoso');
  }

  return <section className="container narrow-page page-section"><span className="eyebrow">TU CUENTA</span><h1>Crea tu cuenta</h1><p className="muted">Guarda tus datos y prepara tus próximos viajes.</p>
    <form className="stack-form form-panel" onSubmit={submit}>
      <label>Nombre completo<input name="nombre" value={form.nombre} onChange={update} autoComplete="name" required /></label>
      <div className="form-two"><label>Correo electrónico<input type="email" name="correo" value={form.correo} onChange={update} autoComplete="email" required /></label><label>Confirmar correo<input type="email" name="confirmarCorreo" value={form.confirmarCorreo} onChange={update} required /></label></div>
      <div className="form-two"><label>Contraseña<input type="password" name="password" value={form.password} onChange={update} autoComplete="new-password" minLength="6" required /></label><label>Confirmar contraseña<input type="password" name="confirmarPassword" value={form.confirmarPassword} onChange={update} minLength="6" required /></label></div>
      <label>Teléfono <span className="muted">(opcional)</span><input name="telefono" type="tel" value={form.telefono} onChange={update} autoComplete="tel" /></label>
      <div className="form-two"><label>Región<select name="region" value={form.region} onChange={update} required><option value="">Seleccionar</option><option>Región Metropolitana</option><option>Región de la Araucanía</option><option>Región de Ñuble</option></select></label><label>Comuna<input name="comuna" value={form.comuna} onChange={update} required /></label></div>
      {error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark">Crear cuenta <i className="bi bi-arrow-right" /></button>
    </form>
    <p className="demo-note">Demostración frontend: la contraseña se conserva en localStorage. Para producción se requiere autenticación y almacenamiento en servidor.</p>
  </section>;
}

export function ServicePage() {
  const [sent, setSent] = useState(false);
  function submit(event) { event.preventDefault(); setSent(true); event.currentTarget.reset(); }
  return <section className="container contact-page page-section"><div><span className="eyebrow">ESTAMOS PARA AYUDAR</span><h1>Hablemos de tu viaje.</h1><p className="muted">Cuéntanos cómo podemos ayudarte. Nuestro equipo revisará tu consulta.</p><div className="contact-detail"><i className="bi bi-envelope" /><span>Atención en línea<br /><strong>Respuesta dentro de 1 día hábil</strong></span></div></div><form className="stack-form form-panel" onSubmit={submit}><label>Nombre completo<input name="nombre" autoComplete="name" required /></label><label>Correo electrónico<input type="email" name="correo" autoComplete="email" required /></label><label>Mensaje<textarea name="mensaje" rows="5" required /></label>{sent && <div className="form-success" role="status">La demo validó tu mensaje, pero no lo envía a un servidor.</div>}<button className="button button-dark">Enviar mensaje <i className="bi bi-arrow-right" /></button></form></section>;
}

const AccountPages = { LoginPage, RegisterPage, ServicePage };
export default AccountPages;