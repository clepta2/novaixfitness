// app/login.js
// Redireciona a rota /login para a raiz / no Expo Router
import { Redirect } from 'expo-router';
import { ErrorBoundary } from '../src/components';

export default function LoginRedirect() {
  return (
    <ErrorBoundary screenName="Login">
      <Redirect href="/" />
    </ErrorBoundary>
  );
}
