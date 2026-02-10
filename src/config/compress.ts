import compression, { CompressionOptions } from 'compression';

export const compressConfig: CompressionOptions = {
  threshold: 1 * 1024, // Chỉ nén khi payload > 1KB
  level: 6, // Mức nén (0–9), 6 cân bằng CPU/băng thông
  filter: (req, res) => {
    // Client yêu cầu tắt nén
    if (req.headers['x-no-compress']) {
      return false;
    }

    // SSE (Server-Sent Events) → không nén
    const contentType = res.getHeader('Content-Type')?.toString() || '';
    if (contentType.includes('text/event-stream')) {
      return false;
    }

    // Các loại đã nén sẵn / không có lợi khi nén
    if (/(image|video|pdf|zip|font\/woff2)/i.test(contentType)) {
      return false;
    }

    // Các trường hợp khác thì dùng filter mặc định
    return compression.filter(req, res);
  },
};
