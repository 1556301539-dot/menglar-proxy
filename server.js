const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// ⚠️ 把这里改成你的 Menglar Cookie
const MENGLAR_AUTH = {
  un: '15286976073',
  ut: '4C3A03D51CE5D240660BC47C83C38E2AF11A42BC8C1C27B8AD7AD42A5AF0A3B5'
};

console.log('🔑 Menglar 认证信息已配置');

// 代理 Menglar API
app.post('/api/menglar/calculate', async (req, res) => {
  const { sku_id, type } = req.body;

  console.log('📥 收到请求，SKU:', sku_id);

  if (!sku_id) {
    return res.status(400).json({ error: '缺少 sku_id 参数' });
  }

  try {
    const response = await fetch('https://ozon.menglar.com/tools//api/ozon/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'https://ozon.menglar.com/tools//pricing_old?',
        'Origin': 'https://ozon.menglar.com',
        'X-Requested-With': 'XMLHttpRequest',
        'un': MENGLAR_AUTH.un,
        'ut': MENGLAR_AUTH.ut
      },
      body: JSON.stringify({ sku_id, type: type || 0 })
    });

    console.log('📡 Menglar 响应状态:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ 数据获取成功');

    res.json({
      success: true,
      data: data,
      source: 'Menglar'
    });

  } catch (err) {
    console.error('❌ 代理失败:', err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 服务器运行在端口 ${PORT}`);
});