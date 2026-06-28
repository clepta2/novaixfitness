const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { validateBody, sanitizeString } = require('../middleware/validate');

// Criar novo usuário (Administrador, Gerente ou Funcionário cadastrando alguém)
router.post('/users', authenticate, requireRole(['admin', 'manager', 'employee']), validateBody({
  email: { required: true, type: 'email' },
  password: { required: true, type: 'password' },
  name: { required: true, type: 'string', minLength: 2, maxLength: 100 },
  role: { enum: ['admin', 'manager', 'employee', 'user'] },
  subscription_plan: { enum: ['free', 'basic', 'intermediate', 'premium', 'ultra'] }
}), async (req, res) => {
  const { email, password, name, role = 'user', subscription_plan = 'free' } = req.body;
  const creatorRole = req.userRole;

  // Enforçar restrições de hierarquia de cargos
  if (creatorRole === 'manager' && (role === 'admin' || role === 'manager')) {
    return res.status(403).json({ error: 'Gerentes só podem criar cargos de Funcionário ou Usuário comum.' });
  }
  if (creatorRole === 'employee' && role !== 'user') {
    return res.status(403).json({ error: 'Funcionários só podem cadastrar novos alunos (Usuários).' });
  }

  try {
    // Cadastrar na tabela de autenticação auth.users (necessita Service Role no backend)
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { name: sanitizeString(name), role }
    });

    if (authError || !authUser?.user) {
      throw new Error(authError?.message || 'Falha ao criar credenciais de acesso.');
    }

    const userId = authUser.user.id;

    // Atualizar plano de assinatura e status de pagamento no perfil (o perfil é inserido automaticamente via Trigger DB)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_plan,
        subscription_status: subscription_plan === 'free' ? 'free' : 'active',
        updated_at: new Date()
      })
      .eq('id', userId)
      .select()
      .single();

    if (profileError) {
      console.error('Erro ao atualizar plano do novo perfil:', profileError.message);
    }

    res.status(201).json({
      message: 'Conta criada com sucesso!',
      user: {
        id: userId,
        email,
        name,
        role,
        subscription_plan,
        profile
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Modificar dados e permissões de uma conta
router.put('/users/:id', authenticate, requireRole(['admin', 'manager']), validateBody({
  name: { type: 'string', minLength: 2, maxLength: 100 },
  email: { type: 'email' },
  role: { enum: ['admin', 'manager', 'employee', 'user'] },
  subscription_plan: { enum: ['free', 'basic', 'intermediate', 'premium', 'ultra'] },
  subscription_status: { enum: ['free', 'active', 'cancelled', 'past_due'] }
}), async (req, res) => {
  const { id } = req.params;
  const { name, email, role, subscription_plan, subscription_status } = req.body;
  const creatorRole = req.userRole;

  try {
    // 1. Obter o perfil do usuário alvo para checar permissão hierárquica
    const { data: targetUser, error: getError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', id)
      .single();

    if (getError || !targetUser) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Gerente não pode modificar administradores
    if (creatorRole === 'manager' && targetUser.role === 'admin') {
      return res.status(403).json({ error: 'Gerentes não possuem permissão para alterar contas de Administrador.' });
    }
    // Gerente não pode promover alguém a administrador
    if (creatorRole === 'manager' && role === 'admin') {
      return res.status(403).json({ error: 'Gerentes não podem atribuir o cargo de Administrador.' });
    }

    // 2. Atualizar perfil no banco de dados public.profiles
    const updates = {};
    if (name !== undefined) updates.name = sanitizeString(name);
    if (email !== undefined) updates.email = email.toLowerCase();
    if (role !== undefined) updates.role = role;
    if (subscription_plan !== undefined) updates.subscription_plan = subscription_plan;
    if (subscription_status !== undefined) updates.subscription_status = subscription_status;
    updates.updated_at = new Date();

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 3. Se email ou role mudou, atualizar também na tabela de auth
    const authUpdates = {};
    if (email) authUpdates.email = email;
    if (name || role) {
      authUpdates.user_metadata = {
        ...(name && { name }),
        ...(role && { role })
      };
    }

    if (Object.keys(authUpdates).length > 0) {
      await supabase.auth.admin.updateUserById(id, authUpdates);
    }

    res.json({
      message: 'Conta atualizada com sucesso!',
      profile: updatedProfile
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar conta (Somente Administrador Master)
router.delete('/users/:id', authenticate, requireRole(['admin']), async (req, res) => {
  const { id } = req.params;

  try {
    // Deletar da autenticação do Supabase (os perfis e dados vinculados serão deletados via CASCADE)
    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) throw error;

    res.json({ message: 'Conta excluída com sucesso!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
