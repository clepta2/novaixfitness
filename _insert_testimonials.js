const https = require('https');

const SUPABASE_URL = 'jkoteibpvwlmsilntpof.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb3RlaWJwdndsbXNpbG50cG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzIyMDksImV4cCI6MjA5NzkwODIwOX0.XLeqNwjjywQ2jjzMUPzaIHbGVR4IgvrOSeeXyDPDSTY';

const testimonials = [
  { name: 'Carlos Silva', initials: 'CS', role: 'Aluno ha 3 meses', content: 'Mudei minha rotina completamente. O Coach IA e incrivel e a gamificacao me mantem motivado todos os dias!', rating: 5, approved: true },
  { name: 'Maria Santos', initials: 'MS', role: 'Aluna ha 2 meses', content: 'Finalmente um app que entende meu objetivo. Os treinos sao perfeitos para minha rotina e o cronometro e muito util.', rating: 5, approved: true },
  { name: 'Pedro Lima', initials: 'PL', role: 'Aluno ha 6 meses', content: 'Ja testei varios apps de fitness. O NOVAIX e o unico que conseguiu me manter consistente. Recomendo demais!', rating: 5, approved: true },
];

async function insertTestimonial(t) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(t);
    const options = {
      hostname: SUPABASE_URL,
      path: '/rest/v1/testimonials',
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`${t.name}: ${res.statusCode}`);
        resolve(JSON.parse(body));
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('Inserindo depoimentos...\n');
  for (const t of testimonials) {
    await insertTestimonial(t);
  }
  console.log('\nPronto! Depoimentos inseridos.');
}

main();
