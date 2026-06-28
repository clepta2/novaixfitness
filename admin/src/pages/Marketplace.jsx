// admin/src/pages/Marketplace.jsx
// Admin: gestao de produtos do marketplace - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductModal from '../components/ProductModal';

const COLUMNS = ['Imagem', 'Nome', 'Categoria', 'Marca', 'Preco', 'Destaque', 'Ativo', 'Acoes'];

export default function Marketplace({ loggedInUserRole }) {
  if (loggedInUserRole !== 'admin' && loggedInUserRole !== 'manager') {
    return <p style={{ color: '#FF1744' }}>Acesso negado. Somente administradores.</p>;
  }

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const [pRes, cRes] = await Promise.all([
      supabase.from('marketplace_products').select('*, marketplace_categories(name)').order('created_at', { ascending: false }),
      supabase.from('marketplace_categories').select('*').order('sort_order'),
    ]);
    if (pRes.error) setError('Erro ao carregar produtos: ' + pRes.error.message);
    else setProducts(pRes.data || []);
    if (!cRes.error) setCategories(cRes.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (product) => {
    setError(null);
    let res;
    if (editing) {
      res = await supabase.from('marketplace_products').update(product).eq('id', editing.id).select().single();
    } else {
      res = await supabase.from('marketplace_products').insert(product).select().single();
    }
    if (res.error) {
      setError('Erro ao salvar: ' + res.error.message);
      return;
    }
    setShowModal(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover este produto permanentemente?')) return;
    setError(null);
    const { error } = await supabase.from('marketplace_products').delete().eq('id', id);
    if (error) setError('Erro ao excluir: ' + error.message);
    else load();
  };

  const toggleFeatured = async (id, current) => {
    const { error } = await supabase.from('marketplace_products').update({ is_featured: !current }).eq('id', id);
    if (error) setError('Erro ao atualizar: ' + error.message);
    else load();
  };

  const toggleActive = async (id, current) => {
    const { error } = await supabase.from('marketplace_products').update({ is_active: !current }).eq('id', id);
    if (error) setError('Erro ao atualizar: ' + error.message);
    else load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Marketplace ({products.length} produtos)</h2>
        <button onClick={() => { setEditing(null); setShowModal(true); }} style={{ padding: '8px 16px', backgroundColor: '#CCFF00', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>+ Novo Produto</button>
      </div>

      {error && <p style={{ color: '#FF1744', padding: '8px 12px', background: '#FF174415', borderRadius: 8, marginBottom: 12 }}>{error}</p>}

      {loading ? <p>Carregando...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{COLUMNS.map(c => <th key={c} style={{ textAlign: 'left', padding: 8, borderBottom: '2px solid #333' }}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: 8 }}>{p.image_url ? <img src={p.image_url} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} /> : '-'}</td>
                <td style={{ padding: 8, fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: 8 }}>{p.marketplace_categories?.name || '-'}</td>
                <td style={{ padding: 8 }}>{p.brand || '-'}</td>
                <td style={{ padding: 8 }}>R$ {p.price?.toFixed(2)}</td>
                <td style={{ padding: 8 }}><button onClick={() => toggleFeatured(p.id, p.is_featured)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: p.is_featured ? '#CCFF00' : '#666', fontSize: 18 }}>{p.is_featured ? '\u2605' : '\u2606'}</button></td>
                <td style={{ padding: 8 }}><button onClick={() => toggleActive(p.id, p.is_active)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: p.is_active ? '#00E676' : '#FF1744', fontWeight: 600 }}>{p.is_active ? 'Ativo' : 'Inativo'}</button></td>
                <td style={{ padding: 8, display: 'flex', gap: 4 }}>
                  <button onClick={() => { setEditing(p); setShowModal(true); }} style={{ cursor: 'pointer', background: '#333', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: 4 }}>Editar</button>
                  <button onClick={() => handleDelete(p.id)} style={{ cursor: 'pointer', background: '#FF1744', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: 4 }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && <ProductModal product={editing} categories={categories} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />}
    </div>
  );
}
