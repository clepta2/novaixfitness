// admin/src/components/ProductModal.jsx
// Modal de criacao/edicao de produto - NOVAIX FITNESS

import { useState } from 'react';

const STOCK_TYPES = [
  { value: 'physical', label: 'Fisico (link afiliado)' },
  { value: 'digital', label: 'Digital (pagamento)' },
  { value: 'coupon', label: 'Cupom/Parceria' },
];

export default function ProductModal({ product, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    original_price: product?.original_price || '',
    brand: product?.brand || '',
    image_url: product?.image_url || '',
    affiliate_url: product?.affiliate_url || '',
    category_id: product?.category_id || '',
    stock_type: product?.stock_type || 'physical',
    is_featured: product?.is_featured || false,
    is_active: product?.is_active !== false,
    tags: product?.tags?.join(', ') || '',
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: form.price ? parseFloat(form.price) : null,
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ background: '#1E232A', borderRadius: 16, padding: 24, width: 500, maxHeight: '80vh', overflow: 'auto' }}>
        <h3 style={{ margin: '0 0 16px' }}>{product ? 'Editar Produto' : 'Novo Produto'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input placeholder="Nome *" value={form.name} onChange={e => set('name', e.target.value)} required style={inputStyle} />
          <textarea placeholder="Descricao" value={form.description} onChange={e => set('description', e.target.value)} rows={3} style={inputStyle} />
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="Preco *" type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required style={{ ...inputStyle, flex: 1 }} />
            <input placeholder="Preco original" type="number" step="0.01" value={form.original_price} onChange={e => set('original_price', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          </div>
          <input placeholder="Marca" value={form.brand} onChange={e => set('brand', e.target.value)} style={inputStyle} />
          <select value={form.category_id} onChange={e => set('category_id', e.target.value)} style={inputStyle}>
            <option value="">Selecione a categoria</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={form.stock_type} onChange={e => set('stock_type', e.target.value)} style={inputStyle}>
            {STOCK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <input placeholder="URL da imagem" value={form.image_url} onChange={e => set('image_url', e.target.value)} style={inputStyle} />
          <input placeholder="URL do afiliado/compra" value={form.affiliate_url} onChange={e => set('affiliate_url', e.target.value)} style={inputStyle} />
          <input placeholder="Tags (separadas por virgula)" value={form.tags} onChange={e => set('tags', e.target.value)} style={inputStyle} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} /> Produto em destaque
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} /> Produto ativo
          </label>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button type="submit" style={{ flex: 1, padding: 10, background: '#CCFF00', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Salvar</button>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: 10, background: '#333', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { padding: '8px 12px', background: '#252B34', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 14 };
