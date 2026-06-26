const https = require('https');

// Verificar se a tabela existe
https.get({
  hostname: 'jkoteibpvwlmsilntpof.supabase.co',
  path: '/rest/v1/?select=table_name',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb3RlaWJwdndsbXNpbG50cG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzIyMDksImV4cCI6MjA5NzkwODIwOX0.XLeqNwjjywQ2jjzMUPzaIHbGVR4IgvrOSeeXyDPDSTY'
  }
}, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    console.log('Status:', r.statusCode);
    console.log('Resposta:', d);
  });
});
