// app/login.js
// Redireciona a rota /login para a raiz / no Expo Router
import { Redirect } from 'expo-router';

export default function LoginRedirect() {
  return <Redirect href="/" />;
}
