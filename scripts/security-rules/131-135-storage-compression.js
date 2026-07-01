// ============================================
// REGRAS 131-135: ARMAZENAMENTO E COMPRESSÃO
// ============================================
// Nível: ALTO | Tipo: WARNING

/**
 * Regras 131-135:
 * 131. Compressão no lado do cliente
 * 132. Transcodificação de vídeo
 * 133. Limites de tamanho por tipo
 * 134. UUID para nomes de arquivo
 * 135. Cache de CDN
 */

module.exports = {
  name: 'Storage & Compression',
  rules: [
    {
      id: 'R131_CLIENT_COMPRESSION',
      check: (fp, content) => {
        if (!content.includes('upload') || !content.includes('image')) return null;
        const hasCompression = content.includes('compress') || content.includes('resize') || content.includes('webp');
        if (!hasCompression) return { msg: 'Uploads devem ter compressão no lado do cliente', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R132_VIDEO_TRANSCODING',
      check: (fp, content) => {
        if (!content.includes('video') || !content.includes('upload')) return null;
        const hasTranscoding = content.includes('ffmpeg') || content.includes('transcode') || content.includes('compress');
        if (!hasTranscoding) return { msg: 'Vídeos devem ser transcodificados (720p/1080p max)', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R133_FILE_SIZE_LIMITS',
      check: (fp, content) => {
        if (!content.includes('upload') || !content.includes('file')) return null;
        const hasLimit = content.includes('size') || content.includes('limit') || content.includes('max');
        if (!hasLimit) return { msg: 'Uploads devem ter limites de tamanho por tipo', severity: 'WARNING' };
        return null;
      },
    },
    {
      id: 'R134_UUID_FILENAMES',
      check: (fp, content) => {
        if (!content.includes('upload') || !content.includes('storage')) return null;
        const hasUUID = content.includes('uuid') || content.includes('Date.now()');
        if (!hasUUID) return { msg: 'Arquivos devem usar UUID para nomes (anti-IDOR)', severity: 'BLOCK' };
        return null;
      },
    },
    {
      id: 'R135_CDN_CACHE',
      check: (fp, content) => {
        if (!content.includes('image') || !content.includes('cdn')) return null;
        const hasCache = content.includes('cache') || content.includes('ttl') || content.includes('expire');
        if (!hasCache) return { msg: 'Assets estáticos devem usar cache de CDN', severity: 'WARNING' };
        return null;
      },
    },
  ],
};
