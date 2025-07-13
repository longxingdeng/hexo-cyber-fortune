// 优化后的量子背景（增加粒子纠缠效果）
class QuantumBackground {
    constructor() {
        this.canvas = document.querySelector('.quantum-bg');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
        this.animate();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // 生成纠缠粒子对
        for(let i = 0; i < 100; i++) {
            const baseX = Math.random() * this.canvas.width;
            const baseY = Math.random() * this.canvas.height;
            this.particles.push(this.createEntangledPair(baseX, baseY));
        }
    }

    createEntangledPair(x, y) {
        return {
            pair: [
                { x, y, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3 },
                { x, y, vx: -this.vx, vy: -this.vy }
            ],
            size: Math.random() * 2,
            color: Math.random() > 0.5 ? '#00F3FF' : '#FF00FF'
        };
    }

    animate() {
        this.ctx.fillStyle = 'rgba(42, 15, 55, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(entangledPair => {
            entangledPair.pair.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // 边界反弹
                if(particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                if(particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

                // 绘制纠缠粒子
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, entangledPair.size, 0, Math.PI*2);
                this.ctx.fillStyle = entangledPair.color;
                this.ctx.fill();
            });

            // 绘制纠缠光束
            const [p1, p2] = entangledPair.pair;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `${entangledPair.color}30`;
            this.ctx.lineWidth = 0.3;
            this.ctx.stroke();
        });

        requestAnimationFrame(() => this.animate());
    }
}
new QuantumBackground();

// 增强极性选择交互
document.querySelectorAll('.quantum-polarity').forEach(container => {
    container.addEventListener('click', () => {
        const currentActive = document.querySelector('.quantum-radio:checked');
        if (currentActive) currentActive.parentElement.classList.remove('active');
        container.querySelector('.quantum-radio').checked = true;
        container.classList.add('active');
    });
});

//Add script tag for lunisolar
const script = document.createElement('script');
script.src = "https://unpkg.com/lunisolar@2.5.1/dist/lunisolar.js";
script.onload = function() {
    const takeSoundScript = document.createElement('script');
    takeSoundScript.src = "https://unpkg.com/@lunisolar/plugin-takesound@0.1.2/dist/index.js";
    document.head.appendChild(takeSoundScript);
};
script.onerror = function() {
    console.error("错误：加载 lunisolar 脚本失败");
};
document.head.appendChild(script);

document.addEventListener('DOMContentLoaded', function() {
    const birthDateInput = document.getElementById('birthDate');
    const birthHourInput = document.getElementById('birthHour');
    const birthMinuteInput = document.getElementById('birthMinute');
    const genderRadios = document.getElementsByName('gender');
    const provinceSelect = document.getElementById('birthProvince');
    const citySelect = document.getElementById('birthCity');
    const generateBtn = document.getElementById('generate-btn');
    const startCalculationBtn = document.getElementById('start-calculation-btn'); // New button
    const copyResultBtn = document.getElementById('copy-result-btn');
    const errorMessage = document.getElementById('error-message');
    const apiErrorMessage = document.getElementById('api-error-message');
    const outputDiv = document.getElementById('output');
    const llmOutputDiv = document.getElementById('llm-output');
    const processingMessageDiv = document.getElementById('processing-message');
    const llmApiUrlInput = document.getElementById('llmApiUrl');
    const llmApiKeyInput = document.getElementById('llmApiKey');
    const llmModelSelect = document.getElementById('llmModel'); // 获取模型选择的元素  **添加了这一行**
    const processingBox = document.getElementById('processing-box');
    const stepsDiv = document.getElementById('processing-steps');




    const locationData = {
        "北京市": { "北京市": { longitude: 116.4 } },
        "天津市": { "天津市": { longitude: 117.2 } },
        "河北省": {
            "石家庄市": { longitude: 114.5 },
            "唐山市": { longitude: 118.2 },
            "秦皇岛市": { longitude: 119.6 },
            "邯郸市": { longitude: 114.5 },
            "邢台市": { longitude: 114.5 },
            "保定市": { longitude: 115.5 },
            "张家口市": { longitude: 114.9 },
            "承德市": { longitude: 117.9 },
            "沧州市": { longitude: 116.8 },
            "廊坊市": { longitude: 116.7 },
            "衡水市": { longitude: 115.7 }
        },
        "山西省": {
            "太原市": { longitude: 112.5 },
            "大同市": { longitude: 113.3 },
            "阳泉市": { longitude: 113.6 },
            "长治市": { longitude: 113.1 },
            "晋城市": { longitude: 112.8 },
            "朔州市": { longitude: 112.4 },
            "晋中市": { longitude: 112.7 },
            "运城市": { longitude: 111.0 },
            "忻州市": { longitude: 112.7 },
            "临汾市": { longitude: 111.5 },
            "吕梁市": { longitude: 111.1 }
        },
        "内蒙古自治区": {
            "呼和浩特市": { longitude: 111.7 },
            "包头市": { longitude: 110.0 },
            "乌海市": { longitude: 118.3 },
            "赤峰市": { longitude: 118.9 },
            "通辽市": { longitude: 122.2 },
            "鄂尔多斯市": { longitude: 109.8 },
            "呼伦贝尔市": { longitude: 119.7 },
            "巴彦淖尔市": { longitude: 107.4 },
            "乌兰察布市": { longitude: 113.2 },
            "兴安盟": { longitude: 122.1 },
            "锡林郭勒盟": { longitude: 116.0 },
            "阿拉善盟": { longitude: 105.7 }
        },
        "辽宁省": {
            "沈阳市": { longitude: 123.4 },
            "大连市": { longitude: 121.6 },
            "鞍山市": { longitude: 122.9 },
            "抚顺市": { longitude: 123.9 },
            "本溪市": { longitude: 123.7 },
            "丹东市": { longitude: 124.3 },
            "锦州市": { longitude: 121.1 },
            "营口市": { longitude: 122.2 },
            "阜新市": { longitude: 121.6 },
            "辽阳市": { longitude: 123.2 },
            "盘锦市": { longitude: 122.0 },
            "铁岭市": { longitude: 123.8 },
            "朝阳市": { longitude: 120.4 },
            "葫芦岛市": { longitude: 120.8 }
        },
        "吉林省": {
            "长春市": { longitude: 125.3 },
            "吉林市": { longitude: 126.5 },
            "四平市": { longitude: 124.3 },
            "辽源市": { longitude: 125.1 },
            "通化市": { longitude: 125.9 },
            "白山市": { longitude: 126.4 },
            "松原市": { longitude: 124.8 },
            "白城市": { longitude: 122.8 },
            "延边朝鲜族自治州": { longitude: 129.5 }
        },
        "黑龙江省": {
            "哈尔滨市": { longitude: 126.6 },
            "齐齐哈尔市": { longitude: 123.9 },
            "鸡西市": { longitude: 130.9 },
            "鹤岗市": { longitude: 130.3 },
            "双鸭山市": { longitude: 131.1 },
            "大庆市": { longitude: 125.1 },
            "伊春市": { longitude: 129.0 },
            "佳木斯市": { longitude: 130.3 },
            "七台河市": { longitude: 130.9 },
            "牡丹江市": { longitude: 129.6 },
            "黑河市": { longitude: 127.5 },
            "绥化市": { longitude: 126.9 },
            "大兴安岭地区": { longitude: 124.7 }
        },
        "上海市": { "上海市": { longitude: 121.4 } },
        "江苏省": {
            "南京市": { longitude: 118.8 },
            "无锡市": { longitude: 120.3 },
            "徐州市": { longitude: 117.2 },
            "常州市": { longitude: 119.9 },
            "苏州市": { longitude: 120.6 },
            "南通市": { longitude: 120.8 },
            "连云港市": { longitude: 119.2 },
            "淮安市": { longitude: 119.0 },
            "盐城市": { longitude: 120.1 },
            "扬州市": { longitude: 119.4 },
            "镇江市": { longitude: 119.4 },
            "泰州市": { longitude: 119.9 },
            "宿迁市": { longitude: 118.3 }
        },
        "浙江省": {
            "杭州市": { longitude: 120.2 },
            "宁波市": { longitude: 121.5 },
            "温州市": { longitude: 120.6 },
            "嘉兴市": { longitude: 120.7 },
            "湖州市": { longitude: 120.1 },
            "绍兴市": { longitude: 120.5 },
            "金华市": { longitude: 119.6 },
            "衢州市": { longitude: 118.8 },
            "舟山市": { longitude: 122.3 },
            "台州市": { longitude: 121.4 },
            "丽水市": { longitude: 119.9 }
        },
        "安徽省": {
            "合肥市": { longitude: 117.3 },
            "芜湖市": { longitude: 118.3 },
            "蚌埠市": { longitude: 117.3 },
            "淮南市": { longitude: 116.7 },
            "马鞍山市": { longitude: 118.5 },
            "淮北市": { longitude: 116.8 },
            "铜陵市": { longitude: 117.8 },
            "安庆市": { longitude: 117.0 },
            "黄山市": { longitude: 118.3 },
            "滁州市": { longitude: 118.3 },
            "阜阳市": { longitude: 115.8 },
            "宿州市": { longitude: 116.9 },
            "六安市": { longitude: 116.5 },
            "亳州市": { longitude: 115.7 },
            "池州市": { longitude: 117.4 },
            "宣城市": { longitude: 118.7 }
        },
        "福建省": {
            "福州市": { longitude: 119.3 },
            "厦门市": { longitude: 118.1 },
            "莆田市": { longitude: 119.0 },
            "三明市": { longitude: 117.6 },
            "泉州市": { longitude: 118.6 },
            "漳州市": { longitude: 117.6 },
            "南平市": { longitude: 118.0 },
            "龙岩市": { longitude: 117.0 },
            "宁德市": { longitude: 119.5 }
        },
        "江西省": {
            "南昌市": { longitude: 115.9 },
            "景德镇市": { longitude: 117.2 },
            "萍乡市": { longitude: 113.8 },
            "九江市": { longitude: 116.0 },
            "新余市": { longitude: 114.9 },
            "鹰潭市": { longitude: 117.0 },
            "赣州市": { longitude: 114.9 },
            "宜春市": { longitude: 114.4 },
            "上饶市": { longitude: 117.9 },
            "吉安市": { longitude: 114.9 },
            "抚州市": { longitude: 116.3 }
        },
        "山东省": {
            "济南市": { longitude: 117.0 },
            "青岛市": { longitude: 120.3 },
            "淄博市": { longitude: 118.0 },
            "枣庄市": { longitude: 117.5 },
            "东营市": { longitude: 118.5 },
            "烟台市": { longitude: 121.4 },
            "潍坊市": { longitude: 119.1 },
            "济宁市": { longitude: 116.5 },
            "泰安市": { longitude: 117.1 },
            "威海市": { longitude: 122.1 },
            "日照市": { longitude: 119.5 },
            "滨州市": { longitude: 118.0 },
            "德州市": { longitude: 116.3 },
            "聊城市": { longitude: 115.9 },
            "临沂市": { longitude: 118.3 },
            "菏泽市": { longitude: 115.4 }
        },
        "河南省": {
            "郑州市": { longitude: 113.6 },
            "开封市": { longitude: 114.3 },
            "洛阳市": { longitude: 112.4 },
            "平顶山市": { longitude: 113.3 },
            "安阳市": { longitude: 114.3 },
            "鹤壁市": { longitude: 114.3 },
            "新乡市": { longitude: 113.9 },
            "焦作市": { longitude: 113.2 },
            "濮阳市": { longitude: 115.0 },
            "许昌市": { longitude: 113.8 },
            "漯河市": { longitude: 114.0 },
            "三门峡市": { longitude: 111.9 },
            "南阳市": { longitude: 112.5 },
            "商丘市": { longitude: 115.6 },
            "信阳市": { longitude: 114.0 },
            "周口市": { longitude: 114.6 },
            "驻马店市": { longitude: 114.0 },
            "济源市": { longitude: 112.6 }
        },
        "湖北省": {
            "武汉市": { longitude: 114.3 },
            "黄石市": { longitude: 114.9 },
            "十堰市": { longitude: 110.7 },
            "宜昌市": { longitude: 111.3 },
            "襄阳市": { longitude: 112.1 },
            "鄂州市": { longitude: 114.8 },
            "荆门市": { longitude: 112.2 },
            "孝感市": { longitude: 113.9 },
            "荆州市": { longitude: 112.2 },
            "黄冈市": { longitude: 114.8 },
            "咸宁市": { longitude: 114.3 },
            "随州市": { longitude: 113.3 },
            "恩施土家族苗族自治州": { longitude: 109.4 },
            "仙桃市": { longitude: 113.4 },
            "潜江市": { longitude: 112.9 },
            "天门市": { longitude: 113.1 },
            "神农架林区": { longitude: 110.3 }
        },
        "湖南省": {
            "长沙市": { longitude: 113.0 },
            "株洲市": { longitude: 113.1 },
            "湘潭市": { longitude: 112.9 },
            "衡阳市": { longitude: 112.6 },
            "邵阳市": { longitude: 111.4 },
            "岳阳市": { longitude: 113.1 },
            "常德市": { longitude: 111.6 },
            "张家界市": { longitude: 110.4 },
            "益阳市": { longitude: 112.3 },
            "郴州市": { longitude: 113.0 },
            "永州市": { longitude: 111.6 },
            "怀化市": { longitude: 110.0 },
            "娄底市": { longitude: 112.0 },
            "湘西土家族苗族自治州": { longitude: 109.7 }
        },
        "广东省": {
            "广州市": { longitude: 113.2 },
            "韶关市": { longitude: 113.6 },
            "深圳市": { longitude: 114.0 },
            "珠海市": { longitude: 113.5 },
            "汕头市": { longitude: 116.6 },
            "佛山市": { longitude: 113.1 },
            "江门市": { longitude: 113.0 },
            "湛江市": { longitude: 110.3 },
            "茂名市": { longitude: 110.8 },
            "肇庆市": { longitude: 112.4 },
            "惠州市": { longitude: 114.4 },
            "梅州市": { longitude: 116.1 },
            "汕尾市": { longitude: 115.3 },
            "河源市": { longitude: 114.6 },
            "阳江市": { longitude: 111.9 },
            "清远市": { longitude: 113.0 },
            "东莞市": { longitude: 113.7 },
            "中山市": { longitude: 113.3 },
            "潮州市": { longitude: 116.6 },
            "揭阳市": { longitude: 116.3 },
            "云浮市": { longitude: 112.0 }
        },
        "广西壮族自治区": {
            "南宁市": { longitude: 108.3 },
            "柳州市": { longitude: 109.4 },
            "桂林市": { longitude: 110.2 },
            "梧州市": { longitude: 111.3 },
            "北海市": { longitude: 109.1 },
            "防城港市": { longitude: 108.3 },
            "钦州市": { longitude: 108.6 },
            "贵港市": { longitude: 109.5 },
            "玉林市": { longitude: 110.1 },
            "百色市": { longitude: 106.6 },
            "贺州市": { longitude: 111.5 },
            "河池市": { longitude: 107.9 },
            "来宾市": { longitude: 109.2 },
            "崇左市": { longitude: 107.3 }
        },
        "海南省": {
            "海口市": { longitude: 110.3 },
            "三亚市": { longitude: 109.5 },
            "三沙市": { longitude: 112.3 },
            "儋州市": { longitude: 109.5 },
            "文昌市": { longitude: 110.7 },
            "琼海市": { longitude: 110.4 },
            "万宁市": { longitude: 110.4 },
            "五指山市": { longitude: 109.5 },
            "东方市": { longitude: 108.6 },
            "定安县": { longitude: 110.3 },
            "屯昌县": { longitude: 109.9 },
            "澄迈县": { longitude: 110.0 },
            "临高县": { longitude: 109.7 },
            "白沙黎族自治县": { longitude: 109.4 },
            "昌江黎族自治县": { longitude: 109.0 },
            "乐东黎族自治县": { longitude: 109.1 },
            "陵水黎族自治县": { longitude: 110.0 },
            "保亭黎族苗族自治县": { longitude: 109.7 },
            "琼中黎族苗族自治县": { longitude: 109.8 }
        },
        "重庆市": { "重庆市": { longitude: 106.5 } },
        "四川省": {
            "成都市": { longitude: 104.0 },
            "自贡市": { longitude: 104.7 },
            "攀枝花市": { longitude: 101.7 },
            "泸州市": { longitude: 105.4 },
            "德阳市": { longitude: 104.3 },
            "绵阳市": { longitude: 104.7 },
            "广元市": { longitude: 105.8 },
            "遂宁市": { longitude: 105.5 },
            "内江市": { longitude: 105.0 },
            "乐山市": { longitude: 103.7 },
            "南充市": { longitude: 106.1 },
            "眉山市": { longitude: 103.8 },
            "宜宾市": { longitude: 104.5 },
            "广安市": { longitude: 106.6 },
            "达州市": { longitude: 107.5 },
            "雅安市": { longitude: 103.0 },
            "巴中市": { longitude: 106.7 },
            "资阳市": { longitude: 104.9 },
            "阿坝藏族羌族自治州": { longitude: 102.2 },
            "甘孜藏族自治州": { longitude: 101.9 },
            "凉山彝族自治州": { longitude: 102.2 }
        },
        "贵州省": {
            "贵阳市": { longitude: 106.7 },
            "六盘水市": { longitude: 104.8 },
            "遵义市": { longitude: 106.9 },
            "安顺市": { longitude: 105.9 },
            "毕节市": { longitude: 105.2 },
            "铜仁市": { longitude: 109.1 },
            "黔东南苗族侗族自治州": { longitude: 107.9 },
            "黔南布依族苗族自治州": { longitude: 107.5 },
            "黔西南布依族苗族自治州": { longitude: 104.9 }
        },
        "云南省": {
            "昆明市": { longitude: 102.7 },
            "曲靖市": { longitude: 103.8 },
            "玉溪市": { longitude: 102.5 },
            "保山市": { longitude: 99.1 },
            "昭通市": { longitude: 103.7 },
            "丽江市": { longitude: 100.2 },
            "普洱市": { longitude: 101.0 },
            "临沧市": { longitude: 99.9 },
            "楚雄彝族自治州": { longitude: 101.5 },
            "红河哈尼族彝族自治州": { longitude: 103.4 },
            "文山壮族苗族自治州": { longitude: 104.2 },
            "西双版纳傣族自治州": { longitude: 100.8 },
            "大理白族自治州": { longitude: 100.2 },
            "德宏傣族景颇族自治州": { longitude: 98.6 },
            "怒江傈僳族自治州": { longitude: 98.8 },
            "迪庆藏族自治州": { longitude: 99.7 }
        },
        "西藏自治区": {
            "拉萨市": { longitude: 91.1 },
            "日喀则市": { longitude: 88.8 },
            "昌都市": { longitude: 97.1 },
            "林芝市": { longitude: 94.3 },
            "山南市": { longitude: 91.7 },
            "那曲市": { longitude: 92.0 },
            "阿里地区": { longitude: 80.1 }
        },
        "陕西省": {
            "西安市": { longitude: 108.9 },
            "铜川市": { longitude: 109.1 },
            "宝鸡市": { longitude: 107.1 },
            "咸阳市": { longitude: 108.7 },
            "渭南市": { longitude: 109.5 },
            "延安市": { longitude: 109.4 },
            "汉中市": { longitude: 107.0 },
            "榆林市": { longitude: 109.7 },
            "安康市": { longitude: 109.0 },
            "商洛市": { longitude: 110.0 }
        },
        "甘肃省": {
            "兰州市": { longitude: 103.7 },
            "嘉峪关市": { longitude: 98.2 },
            "金昌市": { longitude: 102.2 },
            "白银市": { longitude: 104.1 },
            "天水市": { longitude: 105.7 },
            "武威市": { longitude: 102.6 },
            "张掖市": { longitude: 100.4 },
            "平凉市": { longitude: 106.6 },
            "酒泉市": { longitude: 98.5 },
            "庆阳市": { longitude: 107.6 },
            "定西市": { longitude: 104.6 },
            "陇南市": { longitude: 104.9 },
            "临夏回族自治州": { longitude: 103.2 },
            "甘南藏族自治州": { longitude: 102.9 }
        },
        "青海省": {
            "西宁市": { longitude: 101.7 },
            "海东市": { longitude: 102.1 },
            "海北藏族自治州": { longitude: 100.9 },
            "黄南藏族自治州": { longitude: 102.0 },
            "海南藏族自治州": { longitude: 100.6 },
            "果洛藏族自治州": { longitude: 100.2 },
            "玉树藏族自治州": { longitude: 97.0 },
            "海西蒙古族藏族自治州": { longitude: 97.0 }
        },
        "宁夏回族自治区": {
            "银川市": { longitude: 106.2 },
            "石嘴山市": { longitude: 106.3 },
            "吴忠市": { longitude: 106.1 },
            "固原市": { longitude: 106.2 },
            "中卫市": { longitude: 105.1 }
        },
        "新疆维吾尔自治区": {
            "乌鲁木齐市": { longitude: 87.6 },
            "克拉玛依市": { longitude: 84.7 },
            "吐鲁番市": { longitude: 89.2 },
            "哈密市": { longitude: 93.5 },
            "昌吉回族自治州": { longitude: 87.3 },
            "博尔塔拉蒙古自治州": { longitude: 82.0 },
            "巴音郭楞蒙古自治州": { longitude: 86.1 },
            "阿克苏地区": { longitude: 80.3 },
            "克孜勒苏柯尔克孜自治州": { longitude: 76.2 },
            "喀什地区": { longitude: 75.9 },
            "和田地区": { longitude: 79.9 },
            "伊犁哈萨克自治州": { longitude: 81.3 },
            "塔城地区": { longitude: 82.9 },
            "阿勒泰地区": { longitude: 88.1 },
            "石河子市": { longitude: 86.0 },
            "阿拉尔市": { longitude: 81.2 },
            "图木舒克市": { longitude: 79.0 },
            "五家渠市": { longitude: 87.2 }
        },
        "香港特别行政区": { "香港": { longitude: 114.1 } },
        "澳门特别行政区": { "澳门": { longitude: 113.5 } },
        "台湾省": {
            "台北市": { longitude: 121.6 },
            "高雄市": { longitude: 120.3 },
            "新北市": { longitude: 121.5 },
            "桃园市": { longitude: 121.2 },
            "台中市": { longitude: 120.7 },
            "台南市": { longitude: 120.1 },
            "基隆市": { longitude: 121.7 },
            "新竹市": { longitude: 121.9 },
            "嘉义市": { longitude: 120.5 }
        }
    };

    // ======================
    // 初始化省份列表
    // ======================
    function populateProvinces() {
        const provinceSelect = document.getElementById('birthProvince');
        provinceSelect.innerHTML = '<option value="">- 请选择省份 -</option>' + 
            Object.keys(locationData).map(province => 
                `<option value="${province}">${province}</option>`
            ).join('');
    }

    // ======================
    // 初始化城市列表
    // ======================
    function populateCities(province) {
        const citySelect = document.getElementById('birthCity');
        const cities = locationData[province] || {};
        
        citySelect.innerHTML = '<option value="">- 请选择城市 -</option>' + 
            Object.keys(cities).map(city => 
                `<option value="${city}">${city}</option>`
            ).join('');
    }

    function validateForm() {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
        let isValid = true;

        const birthDateValue = birthDateInput.value;
        const birthHourValue = birthHourInput.value;
        const birthMinuteValue = birthMinuteInput.value;

        if (!birthDateValue) {
            errorMessage.textContent += "请填写出生年月日。";
            isValid = false;
        } else {
            const dateParts = birthDateValue.split('-');
            if (dateParts.length !== 3 || isNaN(parseInt(dateParts[0])) || isNaN(parseInt(dateParts[1])) || isNaN(parseInt(dateParts[2]))) {
                errorMessage.textContent += "出生年月日格式不正确，应为 YYYY-MM-DD。";
                isValid = false;
            }
        }

        if (!birthHourValue) {
            errorMessage.textContent += "请选择出生小时。";
            isValid = false;
        }

        if (!birthMinuteValue) {
            errorMessage.textContent += "请选择出生分钟。";
            isValid = false;
        }

        if (!Array.from(genderRadios).some(radio => radio.checked)) {
            errorMessage.textContent += "请选择性别。";
            isValid = false;
        }
        if (!provinceSelect.value) {
            errorMessage.textContent += "请选择出生省份/直辖市。"; // 修改提示信息
            isValid = false;
        }
        if (!citySelect.value) {
            errorMessage.textContent += "请选择出生城市。";
            isValid = false;
        }

        if (!isValid) {
            errorMessage.style.display = 'block';
        }
        return isValid;
    }

    function calculateTrueSolarTime(datetime, longitude) {
        // 1. 计算一年中的第几天
        const startOfYear = new Date(datetime.getFullYear(), 0, 0);
        const diff = datetime - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        // 2. 计算时差（Equation of Time），单位：分钟
        const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
        const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

        // 3. 计算经度时差，单位：分钟
        // 东八区的标准经度是 120°E
        const standardMeridian = 120;
        const longitudeCorrection = (longitude - standardMeridian) * 4;

        // 4. 计算总的时间偏移量（分钟）
        const totalOffsetMinutes = eot + longitudeCorrection;

        // 5. 应用总偏移量
        const trueSolarTime = new Date(datetime.getTime() + totalOffsetMinutes * 60 * 1000);
        
        return trueSolarTime;
    }

function calculateTenGod(dayStem, otherStem) {
    const tenGods = {
        "甲": {
            "甲": "比肩", "乙": "劫财", "丙": "食神", "丁": "伤官",
            "戊": "偏财", "己": "正财", "庚": "七杀", "辛": "正官",
            "壬": "偏印", "癸": "正印"
        },
        "乙": {
            "甲": "劫财", "乙": "比肩", "丙": "伤官", "丁": "食神",
            "戊": "正财", "己": "偏财", "庚": "正官", "辛": "七杀",
            "壬": "正印", "癸": "偏印"
        },
        "丙": {
            "甲": "偏印", "乙": "正印", "丙": "比肩", "丁": "劫财",
            "戊": "食神", "己": "伤官", "庚": "偏财", "辛": "正财",
            "壬": "七杀", "癸": "正官"
        },
        "丁": {
            "甲": "正印", "乙": "偏印", "丙": "劫财", "丁": "比肩",
            "戊": "伤官", "己": "食神", "庚": "正财", "辛": "偏财",
            "壬": "正官", "癸": "七杀"
        },
        "戊": {
            "甲": "七杀", "乙": "正官", "丙": "偏印", "丁": "正印",
            "戊": "比肩", "己": "劫财", "庚": "食神", "辛": "伤官",
            "壬": "偏财", "癸": "正财"
        },
        "己": {
            "甲": "正官", "乙": "七杀", "丙": "正印", "丁": "偏印",
            "戊": "劫财", "己": "比肩", "庚": "伤官", "辛": "食神",
            "壬": "正财", "癸": "偏财"
        },
        "庚": {
            "甲": "偏财", "乙": "正财", "丙": "七杀", "丁": "正官",
            "戊": "偏印", "己": "正印", "庚": "比肩", "辛": "劫财",
            "壬": "食神", "癸": "伤官"
        },
        "辛": {
            "甲": "正财", "乙": "偏财", "丙": "正官", "丁": "七杀",
            "戊": "正印", "己": "偏印", "庚": "劫财", "辛": "比肩",
            "壬": "伤官", "癸": "食神"
        },
        "壬": {
            "甲": "食神", "乙": "伤官", "丙": "偏财", "丁": "正财",
            "戊": "七杀", "己": "正官", "庚": "偏印", "辛": "正印",
            "壬": "比肩", "癸": "劫财"
        },
        "癸": {
            "甲": "伤官", "乙": "食神", "丙": "正财", "丁": "偏财",
            "戊": "正官", "己": "七杀", "庚": "正印", "辛": "偏印",
            "壬": "劫财", "癸": "比肩"
        }
    };

    return tenGods[dayStem][otherStem];
}

function calculateDayun(birthDate, gender, yearStem) {
    // Simple calculation for the demonstration
    // In a real application, this would be more complex using lunisolar's fate calculation
    const isMale = gender === '男';
    const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

    // Get index of year stem
    const stemIndex = stems.indexOf(yearStem);

    // Determine direction based on gender and stem
    const forward = (isMale && stemIndex % 2 === 0) || (!isMale && stemIndex % 2 === 1);

    // Start year is typically around age 10
    const startYear = birthDate.getFullYear() + 10;

    // Generate dayun sequence
    const dayun = [];
    let currentStemIndex = stemIndex;
    let currentBranchIndex = branches.indexOf("寅"); // Example starting branch

    for (let i = 0; i < 8; i++) {
        const direction = forward ? 1 : -1;
        currentStemIndex = (currentStemIndex + direction + 10) % 10;
        currentBranchIndex = (currentBranchIndex + direction + 12) % 12;
        dayun.push(stems[currentStemIndex] + branches[currentBranchIndex]);
    }

    return {
        startYear: startYear,
        dayun: dayun
    };
}

function generateBaziPrompt(char8, gender, birthProvince, birthCity, bigLuck, birthYear, ziwei, addZiWeiDouShu) {
    const yearPillar = char8.year.toString();
    const monthPillar = char8.month.toString();
    const dayPillar = char8.day.toString();
    const hourPillar = char8.hour.toString();

    const dayStem = dayPillar[0];
    const yearTenGod = calculateTenGod(dayStem, yearPillar[0]);
    const monthTenGod = calculateTenGod(dayStem, monthPillar[0]);
    const hourTenGod = calculateTenGod(dayStem, hourPillar[0]);

    let prompt = "";
    prompt += `你是一位对中国传统八字命理学有着深刻理解和丰富经验的专家。你精通《滴天髓》、《子平真诠》、《穷通宝鉴》等经典著作，擅长运用五行生克、十神意象、格局喜忌等理论，对人生命运进行分析和解读。\n\n`;
    prompt += `现在你将面对一个八字命例，请你运用你的专业知识和经验，对该命例进行全面、深入的分析，并给出有价值的建议。请你务必逐步思考、推理，并清晰地展示你的思考过程。\n\n`;

    prompt += `求测者的基本信息如下：\n`;
    prompt += `性别：${gender}\n`;
    prompt += `出生地区：${birthProvince} ${birthCity}\n`;
    prompt += `出生年份：${birthYear}年\n\n`;

    prompt += `其八字命盘如下：\n`;
    // 四柱
    prompt += `年柱：${yearPillar}（${yearTenGod}）\n`;
    prompt += `月柱：${monthPillar}（${monthTenGod}）\n`;
    prompt += `日柱：${dayPillar}（日元）\n`;
    prompt += `时柱：${hourPillar}（${hourTenGod}）\n\n`;

    prompt += `大运信息：从${bigLuck.startYear}年起运，运程顺序为：${bigLuck.dayun.join('、')}\n\n`;

    prompt += `请你从以下几个方面入手，展开你的分析：\n\n`;

    prompt += `1.首先，请你列出命主进行八字排盘,整体审视命局：从五行、阴阳、十神、格局等多个角度入手，对命局的整体特点进行概括性的描述。例如，五行是否均衡？阴阳是否协调？是否存在某种特殊的格局？日元得令、得地、得助吗？\n\n`;

    prompt += `2.分析日元强弱：日元代表命主自身，其强弱直接关系到命主的运势。请你结合月令、地支、天干等因素，综合判断日元的强弱，并说明判断的依据。如果日元偏强，喜什么？忌什么？如果日元偏弱，又该如何取用神？\n\n`;

    prompt += `3.剖析性格特征：性格决定命运。请你结合八字命盘，分析命主的性格特点、优缺点，以及可能的发展方向。例如，是积极进取还是保守稳重？是善于交际还是喜欢独处？是理性思维还是感性思维？这些性格特点对命主的人生有何影响？\n\n`;

    prompt += `4.推断事业发展：事业是人生价值的重要体现。请你结合八字命盘，分析命主的事业运势、适合的职业、发展方向等。例如，适合从事稳定的工作还是具有挑战性的工作？适合自己创业还是在企业中发展？在事业发展过程中需要注意哪些问题？\n\n`;

    prompt += `5.预测财富运势：财富是人生幸福的重要保障。请你结合八字命盘，分析命主的财富状况、财运走势、理财建议等。例如，是正财运旺盛还是偏财运旺盛？适合从事哪些行业的投资？在理财方面需要注意哪些问题？\n\n`;

    prompt += `6.研判婚姻情感：婚姻是人生重要的组成部分。请你结合八字命盘，分析命主的婚姻运势、情感状况、婚恋建议等。例如，是早婚好还是晚婚好？适合找什么样的伴侣？在婚姻中需要注意哪些问题？\n\n`;

    prompt += `7.关注健康状况：健康是幸福人生的基石。请你结合八字命盘，分析命主的健康状况、可能存在的健康隐患、养生建议等。例如，五行失衡可能导致哪些疾病？需要注意哪些方面的保健？\n\n`;

    prompt += `8.洞察六亲关系：六亲是与命主关系最为密切的人。请你结合八字命盘，分析命主与父母、配偶、子女等六亲的关系，以及六亲对命主的影响。例如，与父母的关系如何？配偶对自己有帮助吗？子女是否孝顺？\n\n`;

    prompt += `9.把握大运流年：大运和流年是影响命主运势的重要因素。请你结合大运和流年，分析命主在不同人生阶段的运势变化，为命主提供人生规划建议。例如，哪些年份是机遇期？哪些年份是挑战期？应该如何把握机遇、应对挑战？\n\n`;

    prompt += `10.引用命理典籍的一段话，创作一首谶语诗，对本命主进行概括性的总结和提示。\n\n`;

    // 添加紫微斗数部分
    if (addZiWeiDouShu && ziwei) {
        prompt += `\n\n## 紫微斗数命盘分析\n\n`;
        prompt += `除了八字分析外，以下是命主的紫微斗数命盘信息：\n\n`;
        
        // 安全地访问紫微斗数命盘信息的函数
        const getPalaceInfo = (palace, palaceName) => {
            try {
                if (!palace) return `${palaceName}宫：数据不可用\n`;
                
                let info = `${palaceName}宫：`;
                
                // 尝试获取宫位名称
                if (palace.name) {
                    info += `${palace.name}宫 - `;
                }
                
                // 尝试获取主星
                if (palace.majorStars && Array.isArray(palace.majorStars) && palace.majorStars.length > 0) {
                    info += `主星:`;
                    palace.majorStars.forEach(star => {
                        if (star && star.name) {
                            info += ` ${star.name}`;
                        }
                    });
                } else {
                    info += `无主星`;
                }
                
                return info + `\n`;
            } catch (error) {
                console.error(`获取${palaceName}宫信息出错:`, error);
                return `${palaceName}宫：数据处理错误\n`;
            }
        };
        
        // 尝试获取各宫位信息
        try {
            // 检查palace对象是否存在
            if (ziwei.palace) {
                const palaceNames = [
                    '命宫', '财帛', '福德', '事业', '官禄', 
                    '迁移', '夫妻', '子女', '兄弟', '疾厄', 
                    '田宅', '父母'
                ];
                
                // 遍历所有宫位
                palaceNames.forEach(name => {
                    if (ziwei.palace[name]) {
                        prompt += getPalaceInfo(ziwei.palace[name], name);
                    }
                });
            } else if (ziwei.palaces && Array.isArray(ziwei.palaces)) {
                // 另一种可能的数据结构：宫位数组
                ziwei.palaces.forEach(palace => {
                    if (palace && palace.name) {
                        prompt += getPalaceInfo(palace, palace.name);
                    }
                });
            } else {
                // 如果无法获取宫位信息
                prompt += `无法获取宫位信息，请检查数据结构。\n`;
            }
        } catch (error) {
            console.error('处理紫微斗数宫位信息出错:', error);
            prompt += `处理紫微斗数数据时出错: ${error.message}\n`;
        }
        
        prompt += `\n请结合紫微斗数命盘，对命主进行更全面的分析：\n\n`;
        prompt += `1. 紫微斗数整体格局分析：分析命盘的整体格局、主星分布特点，以及与八字的呼应关系。\n\n`;
        prompt += `2. 命宫分析：详细分析命宫的主星、辅星组合，解读其对命主性格、人生走向的影响。\n\n`;
        prompt += `3. 财富运势：结合财帛宫和八字财运，分析命主的财富获取方式、理财能力和财运起伏。\n\n`;
        prompt += `4. 事业发展：结合事业宫、官禄宫和八字事业特点，分析命主的事业发展路径、适合行业和职业规划。\n\n`;
        prompt += `5. 感情婚姻：结合夫妻宫和八字婚姻分析，解读命主的婚恋特点、配偶类型和婚姻质量。\n\n`;
        prompt += `6. 大运流年：结合紫微斗数流年与八字大运，预测未来一段时期的运势变化和关键时间点。\n\n`;
    }
    
    // 最后部分
    prompt += `在分析过程中，请你充分发挥你的聪明才智，运用你所掌握的命理学知识，结合实际情况，对命例进行深入的剖析和解读，并给出有价值的建议。\n\n`;
    prompt += `请记住，你的目标是帮助求测者更好地了解自己，把握命运，创造幸福的人生。\n\n`;
    prompt += `请开始你的分析吧！`;

    return prompt;
}



    let fullLLMResponse = ''; // 用于存储完整的Markdown响应

    // 合并后的唯一按钮事件
    generateBtn.addEventListener('click', async function() {
        if (!validateForm() || typeof lunisolar === 'undefined') return;

        // 显示处理状态
        const processingBox = document.getElementById('processing-box');
        const stepsDiv = document.getElementById('processing-steps');
        processingBox.style.display = 'block';
        stepsDiv.innerHTML = '';
        processingMessageDiv.textContent = '正在初始化命理参数...';

        try {
             // 初始化状态
            processingBox.style.display = 'block';
            stepsDiv.innerHTML = '';
            llmOutputDiv.innerHTML = ''; // 使用innerHTML，清空
            fullLLMResponse = ''; // 重置响应
            apiErrorMessage.style.display = 'none';
            
            // 验证输入
            if (!validateForm()) throw new Error('请填写完整信息');
            processingMessageDiv.textContent = '正在初始化命理参数...';
            
                                
            // 生成prompt（原逻辑）
            const birthDateValue = birthDateInput.value;
            const hourValue = birthHourInput.value;
            const minuteValue = birthMinuteInput.value;
            const birthDateTimeStr = `${birthDateValue} ${hourValue}:${minuteValue}`;
            const gender = document.querySelector('input[name="gender"]:checked').value;
            const birthProvince = provinceSelect.value;
            const birthCity = citySelect.value;
            const longitude = locationData[birthProvince][birthCity].longitude;

            // 时间调整计算...
            const birthDateTime = new Date(birthDateValue);
            birthDateTime.setHours(parseInt(hourValue));
            birthDateTime.setMinutes(parseInt(minuteValue));
            const trueSolarTime = calculateTrueSolarTime(birthDateTime, longitude);
            const adjustedDateStr = trueSolarTime.toISOString().slice(0, 16).replace('T', ' ');

            // 生成八字信息
            const lsr = lunisolar(birthDateTimeStr);
            const char8 = lsr.char8;
            const genderCode = gender === '男' ? 1 : 0;
            const bigLuck = calculateDayun(birthDateTime, gender, char8.year.stem.toString());

            // 生成紫微斗数命盘
            let ziweiData = null;
            const addZiWeiDouShuOption = document.getElementById('addZiWeiDouShu').checked;
            if (addZiWeiDouShuOption) {
                try {
                    if (typeof iztro === 'undefined') throw new Error('紫微斗数库(iztro)未加载');
                    stepsDiv.innerHTML += `𓀫 正在生成紫微斗数命盘...<br>`;
                    const year = birthDateTime.getFullYear();
                    const month = birthDateTime.getMonth() + 1;
                    const day = birthDateTime.getDate();
                    const hour = birthDateTime.getHours();
                    const genderForZiwei = document.querySelector('input[name="gender"]:checked').id === 'male' ? '男' : '女';
                    const useSolarTime = document.getElementById('useSolarTime').checked;
                    ziweiData = iztro.astro.bySolar(`${year}-${month}-${day}`, Math.floor(hour), genderForZiwei, useSolarTime, 'zh-CN');
                    if (!ziweiData) throw new Error('紫微斗数命盘生成返回空数据');
                    console.log('紫微斗数数据结构:', ziweiData);
                    stepsDiv.innerHTML += `𓀫 紫微斗数命盘生成成功<br>`;
                } catch (error) {
                    console.error('紫微斗数生成错误:', error);
                    stepsDiv.innerHTML += `𓀫 紫微斗数命盘生成失败: ${error.message}<br>`;
                    ziweiData = null;
                }
            }
            if (addZiWeiDouShuOption && (!ziweiData || !ziweiData.palace)) {
                stepsDiv.innerHTML += `𓀫 警告：紫微斗数数据无效，将仅进行八字分析<br>`;
            }

            const prompt = generateBaziPrompt(char8, gender, birthProvince, birthCity, bigLuck, birthDateTime.getFullYear(), ziweiData, addZiWeiDouShuOption);

            const steps = ["正在连接量子服务器...", "初始化神经网络...", "加载命理数据库...", "解析时空坐标...", "构建五行模型...", "进行量子推演...", "生成最终报告..."];
            let currentStep = 0;
            const stepInterval = setInterval(() => {
                if (currentStep < steps.length) {
                    stepsDiv.innerHTML += `𓀫 ${steps[currentStep]}<br>`;
                    processingMessageDiv.textContent = `进度: ${Math.round((currentStep+1)/steps.length*100)}%`;
                    currentStep++;
                } else {
                    clearInterval(stepInterval);
                }
            }, 800);

            const apiKey = llmApiKeyInput.value.trim();
            const apiUrl = llmApiUrlInput.value.trim();
            if (!apiKey) throw new Error('需要API密钥启动量子演算');
            if (!apiUrl) throw new Error('需要API地址才能启动量子演算');
            const modelName = document.getElementById('llmModel').value || 'deepseek-r1';
            
            await callLLMAPI(prompt, apiKey, modelName, apiUrl);
            
        } catch (error) {
            apiErrorMessage.textContent = `𓃣 系统错误: ${error.message}`;
            apiErrorMessage.style.display = 'block';
            console.error('Error:', error);
        } finally {
            // clearInterval(stepInterval); // This might cause issues if interval is not defined
            processingBox.style.display = 'none';
        }
    });

    async function callLLMAPI(prompt, apiKey, modelName, apiUrl) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: modelName,
                    messages: [
                        { role: "system", content: "你是精通中国八字命理学的AI助手，能够用专业术语进行详细分析" },
                        { role: "user", content: prompt }
                    ],
                    stream: true
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API错误 (${response.status}): ${errorData.error?.message || '未知错误'}`);
            }
            
            stepsDiv.innerHTML += `𓀫 命理数据生成完成，正在连接AI模型...<br>`;
            processingMessageDiv.textContent = '正在获取AI分析结果...';    
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            const content = data.choices[0]?.delta?.content || '';
                            if (content) {
                                fullLLMResponse += content;
                                llmOutputDiv.innerHTML = marked.parse(fullLLMResponse);
                            }
                        } catch (e) { /* 忽略解析错误 */ }
                    }
                }
            }
        } catch (error) {
            throw new Error(`API通信失败: ${error.message}`);
        }
        if (llmOutputDiv.textContent.trim().length > 0) {
            copyResultBtn.style.display = 'block';
        }
    }

    script.onload = function() { console.log("Lunisolar库已加载"); };

    document.getElementById('birthProvince').addEventListener('change', function() {
        populateCities(this.value);
    });

    populateProvinces();

    copyResultBtn.addEventListener('click', function() {
        const textArea = document.createElement('textarea');
        textArea.value = fullLLMResponse; // 复制原始Markdown
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            const originalText = copyResultBtn.textContent;
            copyResultBtn.textContent = '复制成功!';
            setTimeout(() => { copyResultBtn.textContent = originalText; }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
        document.body.removeChild(textArea);
    });
});