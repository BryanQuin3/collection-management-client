import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ request: { cookies, nextUrl } }) {
      const userToken = cookies.get('usertoken');
      if (!userToken) {
        // No hay token, redirige a la página de inicio de sesión
        return false; 
      }

      try {
        const response = await fetch('BASE_URL/user/check-auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: userToken,
          }),
        });
        
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.valid) {
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
              // El usuario está autenticado y puede acceder al dashboard
              return true; 
            } else {
              // Redirige al dashboard si el usuario está autenticado pero no está en el dashboard
              return Response.redirect(new URL('/dashboard', nextUrl));
            }
          } else {
            // El token no es válido, redirige a la página de inicio de sesión
            return false;
          }
        } else {
          // Manejo de errores: redirige a la página de inicio de sesión
          return false;
        }
      } catch (error) {
        console.error('Error al verificar el token:', error);
        // Manejo de errores: redirige a la página de inicio de sesión
        return false; 
      }
    },
  },
  providers: [],
};
