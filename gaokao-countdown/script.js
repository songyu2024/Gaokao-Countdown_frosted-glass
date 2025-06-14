const targetDate = new Date("2026-06-07T00:00:00");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 简化的一言加载函数，使用多个备用API
function loadHitokoto() {
  // 定义一言API数组 - 按优先级排序
  const apiList = [
    // 官方一言API
    { 
      url: "https://v1.hitokoto.cn/",
      handler: (data) => data.hitokoto
    },
    // 备用API1 - vvhan的yiyan接口
    { 
      url: "international.v1.hitokoto.cn",
      handler: (data) => typeof data === 'string' ? data : (data.data || "今天也要加油鸭！")
    },
    // 备用API2 - oick.cn接口
    { 
      url: "https://api.oick.cn/yiyan/api.php",
      handler: (data) => data
    },
    // 备用API3 - 句子API
    { 
      url: "https://saying.api.azwcl.com/saying/get",
      handler: (data) => data.data.content
    }
  ];
  
  // 递归尝试API
  function tryApi(index) {
    if (index >= apiList.length) {
      // 所有API都失败了，显示默认消息
      document.getElementById("quote").textContent = "今天也要加油鸭！";
      return;
    }
    
    const api = apiList[index];
    console.log(`尝试获取一言 (${index + 1}/${apiList.length}): ${api.url}`);
    
    fetch(api.url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`API响应错误: ${response.status}`);
        }
        // 检查响应类型，有些API返回纯文本而不是JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then(data => {
        try {
          // 如果返回的是字符串但需要JSON，尝试解析
          if (typeof data === 'string' && data.trim().startsWith('{')) {
            data = JSON.parse(data);
          }
          
          const quote = api.handler(data);
          if (quote) {
            document.getElementById("quote").textContent = quote;
          } else {
            throw new Error("无法从响应中获取一言");
          }
        } catch (err) {
          console.error("解析一言数据失败:", err);
          // 尝试下一个API
          tryApi(index + 1);
        }
      })
      .catch(err => {
        console.error(`API (${index + 1}/${apiList.length}) 失败:`, err.message);
        // 尝试下一个API
        tryApi(index + 1);
      });
  }
  
  // 开始尝试第一个API
  tryApi(0);
}

// 加载一言
loadHitokoto();

// 背景图API状态跟踪
let currentBackgroundApi = "fj"; // 默认使用"fj" API

// 天气卡片点击时的API列表
const weatherBackgroundApis = ["pc", "moe", "moez"];

// 从数组中随机获取一个元素的辅助函数
function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// 节流控制 - 记录上次操作时间
let lastBackgroundChange = 0;
let lastQuoteChange = 0;
const THROTTLE_DELAY = 2000; // 2秒内不重复操作

// 点击更新背景图片
function refreshBackground(apiType) {
  const now = new Date().getTime();
  if (now - lastBackgroundChange < THROTTLE_DELAY) {
    console.log("操作太频繁，请稍后再试");
    return; // 时间间隔太短，不执行操作
  }
  
  // 记录本次操作时间
  lastBackgroundChange = now;
  
  const bgImage = document.getElementById('bg');
  const api = apiType || currentBackgroundApi; // 如果未指定API类型，则使用当前API
  
  // 更新当前API状态
  currentBackgroundApi = api;
  
  // 添加时间戳参数，确保每次请求都是新的
  bgImage.src = `https://t.alcy.cc/${api}?timestamp=${new Date().getTime()}`;
}

// 为毛玻璃卡片添加点击事件
document.addEventListener('DOMContentLoaded', function() {
  // 为倒计时卡片添加点击事件 - 切换回fj背景
  const glassCard = document.querySelector('.glass-card');
  if (glassCard) {
    glassCard.style.cursor = 'pointer'; // 添加指针样式，提示可点击
    glassCard.addEventListener('click', function() {
      refreshBackground('fj');
    });
  }
  
  // 为天气卡片添加点击事件 - 从三个API中随机选择
  const weatherCard = document.querySelector('.weather-card');
  if (weatherCard) {
    weatherCard.style.cursor = 'pointer'; // 添加指针样式，提示可点击
    weatherCard.addEventListener('click', function() {
      // 从三个API中随机选择一个
      const randomApi = getRandomElement(weatherBackgroundApis);
      refreshBackground(randomApi);
    });
  }
  
  // 为一言卡片添加点击事件 - 刷新一言内容
  const quoteCard = document.querySelector('.quote-card');
  if (quoteCard) {
    quoteCard.style.cursor = 'pointer'; // 添加指针样式，提示可点击
    quoteCard.addEventListener('click', function() {
      // 显示加载中文本
      document.getElementById('quote').textContent = "加载中...";
      // 重新加载一言
      loadHitokoto();
    });
  }
});

// 天气获取和显示功能
function fetchWeather() {
  fetch('https://api.vvhan.com/api/weather')
    .then(response => {
      if (!response.ok) {
        throw new Error(`天气API响应错误: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('天气数据:', data);
      
      // 检查是否有天气数据
      if (data && data.data) {
        // 获取天气类型
        const weatherType = data.data.type || '未知';
        
        // 获取温度（最高温/最低温）
        const highTemp = data.data.high || '--';
        const lowTemp = data.data.low || '--';
        
        // 更新显示
        document.getElementById('weather-type').textContent = weatherType;
        document.getElementById('weather-temp').textContent = `${highTemp}/${lowTemp}`;
      } else {
        throw new Error('无法获取天气数据');
      }
    })
    .catch(error => {
      console.error('获取天气失败:', error.message);
      document.getElementById('weather-type').textContent = '获取失败';
      document.getElementById('weather-temp').textContent = '--°C/--°C';
    });
}

// 初始加载天气数据
fetchWeather();

// 设置2分钟刷新一次天气
setInterval(fetchWeather, 2 * 60 * 1000);

// 为 Wallpaper Engine 添加支持
if (window.wallpaperRegisterAudioListener) {
  // 支持 Wallpaper Engine 音频可视化
  window.wallpaperRegisterAudioListener && window.wallpaperRegisterAudioListener(audioArray => {
    // 这里可以根据音频数据添加效果
    // audioArray 包含音频频谱数据
  });
}

// 添加全屏适配支持
window.addEventListener('resize', function() {
  // 页面调整大小时重新计算布局
  // 可以在这里添加代码调整元素大小或位置
});

// Wallpaper Engine 专用点击处理
(function() {
  // 全局点击事件 - 适用于 Wallpaper Engine
  let isWallpaperEngine = false;

  // 检测是否在 Wallpaper Engine 环境中
  if (window.wallpaperRegisterAudioListener || 
      window.wallpaperPropertyListener || 
      window.wallpaperRegisterClickEvent) {
    isWallpaperEngine = true;
    console.log("检测到 Wallpaper Engine 环境");
  }

  // 在页面完全加载后执行
  window.onload = function() {
    // 获取元素引用
    const glassCard = document.querySelector('.glass-card');
    const weatherCard = document.querySelector('.weather-card');
    const quoteCard = document.querySelector('.quote-card');
    
    console.log("页面加载完成，元素状态:", {
      glassCard: !!glassCard,
      weatherCard: !!weatherCard,
      quoteCard: !!quoteCard,
      isWallpaperEngine: isWallpaperEngine
    });

    // 如果在 Wallpaper Engine 中，注册全局点击处理
    if (isWallpaperEngine && window.wallpaperRegisterClickEvent) {
      console.log("注册 Wallpaper Engine 点击事件");
      
      try {
        window.wallpaperRegisterClickEvent(function(x, y) {
          console.log("Wallpaper Engine 点击事件触发:", x, y);
          
          // 检查点击位置并执行相应操作
          if (isClickedOn(x, y, glassCard)) {
            console.log("点击了倒计时卡片");
            refreshBackground('fj');
          } 
          else if (isClickedOn(x, y, weatherCard)) {
            console.log("点击了天气卡片");
            const randomApi = getRandomElement(weatherBackgroundApis);
            refreshBackground(randomApi);
          }
          else if (isClickedOn(x, y, quoteCard)) {
            console.log("点击了一言卡片");
            document.getElementById('quote').textContent = "加载中...";
            loadHitokoto();
          }
        });
      } catch (e) {
        console.error("注册 Wallpaper Engine 点击事件失败:", e);
      }
    }
    
    // 保留普通网页的点击事件（用于测试）
    glassCard?.addEventListener('click', function() {
      console.log("普通点击 - 倒计时卡片");
      refreshBackground('fj');
    });
    
    weatherCard?.addEventListener('click', function() {
      console.log("普通点击 - 天气卡片");
      const randomApi = getRandomElement(weatherBackgroundApis);
      refreshBackground(randomApi);
    });
    
    quoteCard?.addEventListener('click', function() {
      console.log("普通点击 - 一言卡片");
      document.getElementById('quote').textContent = "加载中...";
      loadHitokoto();
    });
  };
  
  // 辅助函数：检查点击是否在元素上
  function isClickedOn(x, y, element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      x >= rect.left && 
      x <= rect.right && 
      y >= rect.top && 
      y <= rect.bottom
    );
  }
})();

// 添加键盘快捷键支持（在 Wallpaper Engine 中也有效）
document.addEventListener('keydown', function(event) {
  // 按1键刷新背景 (fj)
  if (event.key === '1') {
    console.log("按键 1 - 刷新标准背景");
    refreshBackground('fj');
  }
  
  // 按2键刷新背景 (随机天气API)
  if (event.key === '2') {
    console.log("按键 2 - 刷新随机背景");
    const randomApi = getRandomElement(weatherBackgroundApis);
    refreshBackground(randomApi);
  }
  
  // 按3键刷新一言
  if (event.key === '3') {
    console.log("按键 3 - 刷新一言");
    document.getElementById('quote').textContent = "加载中...";
    loadHitokoto();
  }
});

// 自动刷新功能 - 添加在文件末尾

// 自动刷新壁纸（每10分钟）
setInterval(function() {
  console.log("自动刷新壁纸（10分钟定时器）");
  
  // 从所有可用API中随机选择一个
  const allApis = ['fj'].concat(weatherBackgroundApis);
  const randomApi = getRandomElement(allApis);
  
  // 刷新背景
  refreshBackground(randomApi);
}, 10 * 60 * 1000); // 10分钟 = 600000毫秒

// 自动刷新一言（每2分钟）
setInterval(function() {
  console.log("自动刷新一言（2分钟定时器）");
  
  // 更新加载状态
  document.getElementById('quote').textContent = "加载中...";
  
  // 加载新一言
  loadHitokoto();
}, 2 * 60 * 1000); // 2分钟 = 120000毫秒
