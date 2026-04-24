export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许 POST 请求' });
  }

  const { prompt, size } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: '缺少描述文本' });
  }

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'stabilityai/stable-diffusion-3-5-large',
        prompt: prompt,
        n: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API 请求失败');
    }

    return res.status(200).json({ imageUrl: data.data[0].url });

  } catch (error) {
    console.error('生成错误:', error);
    return res.status(500).json({ error: error.message || '服务器内部错误' });
  }
}
