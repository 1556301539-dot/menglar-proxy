const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const MENGLAR_AUTH = {
  un: '15286976073',
  ut: '4C3A03D51CE5D240660BC47C83C38E2AF11A42BC8C1C27B8AD7AD42A5AF0A3B5'
};

// 健康检查路径
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 核心计算接口
app.post('/api/menglar/calculate', async (req, res) => {
  const { sku_id, type } = req.body;
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
    const data = await response.json();
    res.json({ success: true, data: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = app;
