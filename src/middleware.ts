import { defineMiddleware } from 'astro:middleware';

// defineMiddleware es una función de Astro que envuelve nuestra lógica
// y le da acceso al contexto de cada petición.
export const onRequest = defineMiddleware(({ url, cookies, redirect }, next) => {

    // ─── RUTAS PÚBLICAS ───────────────────────────────────────────
    // Estas rutas no requieren autenticación.
    // Si el usuario no tiene token, igual puede acceder a ellas.
    const rutasPublicas = ['/login'];
    const esPublica = rutasPublicas.some(ruta => url.pathname.startsWith(ruta));

    if (esPublica) {
        // next() le dice a Astro "sigue adelante, renderiza la página normalmente"
        return next();
    }

    // ─── VERIFICACIÓN DEL TOKEN ────────────────────────────────────
    // En Astro el middleware corre en el SERVIDOR, así que no tenemos
    // acceso a localStorage (eso es solo del navegador).
    // La solución es guardar el token en una COOKIE además de localStorage.
    // Las cookies sí viajan con cada petición HTTP al servidor.
    //
    // Cuando el usuario haga login, guardaremos el token en:
    //   - localStorage (para que el JS del navegador lo use en fetch)
    //   - cookie "token" (para que el middleware lo pueda leer)
    const token = cookies.get('token')?.value;

    if (!token) {
        // No hay token → redirigimos al login.
        // redirect() devuelve una respuesta HTTP 302 que el navegador
        // interpreta como "ve a esta otra URL".
        return redirect('/login');
    }

    // Hay token → dejamos pasar al usuario.
    // No verificamos la firma del JWT aquí porque eso requeriría la clave
    // secreta en el frontend, lo cual es un riesgo de seguridad.
    // La verificación real la hace el backend en cada petición protegida.
    return next();
});