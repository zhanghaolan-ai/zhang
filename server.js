const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3002;

// 启用CORS
app.use(cors());

// 简单的测试路由
app.get('/test', (req, res) => {
    res.send('服务器正在运行！');
});

// 静态文件服务 - 根目录（用于HTML文件）
app.use(express.static(__dirname));

// 音乐文件服务
app.use('/music_library', express.static('music_library'));

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('可用接口:');
    console.log('  GET /test - 测试服务器是否运行');
    console.log('  GET /{filename} - 访问HTML文件');
    console.log('  GET /music_library/{filename} - 访问音乐文件');
    console.log('  静态文件目录:', __dirname);
});
