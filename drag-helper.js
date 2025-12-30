// 拖拽助手脚本
(function() {
    const cards = document.querySelectorAll('.hero-card');
    let activeCard = null;
    let offsetX, offsetY;
    
    // 创建坐标显示面板
    const panel = document.createElement('div');
    panel.id = 'drag-panel';
    panel.innerHTML = `
        <div style="position: fixed; top: 10px; right: 10px; background: #1a1a1a; border: 2px solid #00BF4B; border-radius: 8px; padding: 16px; z-index: 10000; font-family: monospace; color: white; min-width: 280px;">
            <h3 style="margin: 0 0 12px 0; color: #00BF4B;">🎯 卡片位置调试器</h3>
            <div id="card-positions"></div>
            <button onclick="copyPositions()" style="margin-top: 12px; padding: 8px 16px; background: #00BF4B; border: none; border-radius: 4px; cursor: pointer; color: black; font-weight: bold;">复制 CSS</button>
        </div>
    `;
    document.body.appendChild(panel);
    
    // 更新位置显示
    function updatePanel() {
        const posDiv = document.getElementById('card-positions');
        let html = '';
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const parent = card.parentElement.getBoundingClientRect();
            const name = card.className.replace('hero-card hero-card-', '').toUpperCase();
            const left = Math.round(rect.left - parent.left);
            const top = Math.round(rect.top - parent.top);
            html += `<div style="margin: 8px 0; padding: 8px; background: #333; border-radius: 4px;">
                <strong style="color: #00BF4B;">${name}:</strong><br>
                left: ${left}px, top: ${top}px
            </div>`;
        });
        posDiv.innerHTML = html;
    }
    
    // 复制 CSS 到剪贴板
    window.copyPositions = function() {
        let css = '';
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const parent = card.parentElement.getBoundingClientRect();
            const name = card.className.replace('hero-card ', '');
            const left = Math.round(rect.left - parent.left);
            const top = Math.round(rect.top - parent.top);
            css += `.${name} { left: ${left}px; top: ${top}px; }\n`;
        });
        navigator.clipboard.writeText(css);
        alert('CSS 已复制到剪贴板！');
    };
    
    cards.forEach(card => {
        card.style.cursor = 'move';
        card.style.position = 'absolute';
        
        card.addEventListener('mousedown', (e) => {
            activeCard = card;
            const rect = card.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            card.style.zIndex = 1000;
            e.preventDefault();
        });
    });
    
    document.addEventListener('mousemove', (e) => {
        if (activeCard) {
            const parent = activeCard.parentElement.getBoundingClientRect();
            activeCard.style.left = (e.clientX - parent.left - offsetX) + 'px';
            activeCard.style.top = (e.clientY - parent.top - offsetY) + 'px';
            activeCard.style.right = 'auto';
            activeCard.style.bottom = 'auto';
            updatePanel();
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (activeCard) {
            activeCard.style.zIndex = '';
            activeCard = null;
        }
    });
    
    updatePanel();
    console.log('🎯 拖拽助手已启用！直接拖动卡片调整位置。');
})();
