var config = {
    /*在这里配置你的基本信息，所有数据以字符串形式给出*/
    name: "Little_100",
    sex: "男(娘?)",
    age: "2008年的捏",
    phone: "怎么可能告诉你",
    email: "猜猜？",
    address: "在中国山东捏",
    qq: "猜猜？",
    log: "Little_100",
    excpect_work: "我的世界爱好者 业余写写插件",


    /*在这里配置首页的座右铭集合*/
    motto: [
        "明天不一定会更好，但要坚信更好的明天一定会来。",
        "要做的事情总找得出时间和机会，不愿意做的事情也总能找得出借口。",
        "Gor For It!",
        "有智者立长志，无志者长立志。",
        "那些过去的眼泪终将风干在记忆里。",
        "真相，是为了剿灭幻想。",
        "我欲将心向明月，奈何明月照沟渠。",
        "春风得意马蹄疾，一日看尽长安花。",
        "天凉好个秋！",
        "老骥伏枥，志在千里。烈士暮年，壮心不已。",
        "老当益壮，宁移白首之心。穷且益坚，不坠青云之志。",
        "我们必须拿我们所有的， 去换我们所没有的",
        "蒹葭苍苍，白露为霜；所谓伊人，在水一方。",
        "数风流人物，还看今朝！"
    ],


    /*在这里配置首页的见面信息，你可以内嵌HTML标签以调整格式*/
    welcome: "青青子衿，悠悠我心<br>" +
             "但为君故，沉吟至今<br>" +
             "你好，我是Little_100，一名普通的我的世界玩家!<br>" +
             "很高兴见到你!",


    /*在这里配置关于我的信息，你可以内嵌HTML标签以调整格式*/
    about: "<p>你好！我叫Little_100，性别男(娘?)，08年出生。一名14起年我的世界10年老玩家 真爱粉!!!</p>",



    /** 
    * 在这里配置你的技能点
    * ["技能点", 掌握程度, "技能条颜色"]
    */  
    skills: [
        ["Java", 100, "red"],
        ["GoLang", 100, "blue"],
        ["SQL", 100, "#1abc9c"],
        ["HTML5", 100, "rgba(0,0,0)"],
        ["CSS3", 100, "yellow"],
        ["JavaScript", 100, "pink"]
    ],


    /*这里填写你的技能描述，你可以内嵌HTML标签以调整格式*/
    skills_description: "<ul>" +
        "     <li>操作系统、计算机网络等编程基础知识良好。</li>" +
        "     <li>熟练掌握Java基础。</li>" +
        "     <li>熟悉JavaIO、多线程、集合等基础框架。</li>" +
        "     <li>了解JVM原理。</li>" +
        "     <li>熟悉Go语言开发基本知识。</li>" +
        "     <li>熟悉SQL语句编写以及调优。</li>" +
        "     <li>熟悉基本Linux命令操作。</li>" +
        "     <li>熟悉Spring、ibatis、struts等框架的使用，了解其原理与机制。</li>" +
        "     <li>熟悉缓存、消息等机制。</li>" +
        "     <li>了解分布式系统的设计与应用。</li>" +
        "     <li>以上纯属吹牛，实际能力不足以与他人相提并论(✿◡‿◡)。</li>" +
        " </ul>",


    /**
     * 这里填写你的个人作品展示
     * ["img"，"url", "ProjectName", "brief"]
     * img表示您的作品图片链接，url表示您的项目地址，ProjectName表示您的仓库或作品名称，brief是一句简短的介绍
     * 通过查看实际效果以调整字题长度
     */
    portfolio: [
        ["./images/jntm.jpg", "https://github.com/Little100/Minecraft_Player_Mating_Plugin", "我的世界的一个插件", "一个不简单的Minecraft服务端插件"],
        ["./images/jntm.jpg", "https://github.com/Little100/GayMCPack", "我的世界的一个材质包", "尽情欣赏吧！"],
        ["./images/jntm.jpg", "https://github.com/Little100/Liteitemshow", "我的世界的一个服务端插件", "显示物品!"],
    ],


    /**
     * 这里填写您的工作经历
     * ["日期"， "工作"， "介绍"]
     * 你可以内嵌HTML标签以排版格式
     */
    work: [
        //如果您内有工作经历，您可以采取下列写法
        // ["————————", "", "<p>暂无工作经历，期待您的联系。</p>"]

        ["2008 — Now", "<br>没工作",
            "<p><strong>某学校</strong></p>" +
            "<p>不想上学，讨厌学校</p>" +
            "<p>(￢︿̫̿￢☆)</p>"
        ],
    ],


    /**
     * 这里填写你的其他经历
     * ["日期"， "经历"， "介绍"]
     * 建议填写您的校级及以上得奖经历或或其他证书
     */
    others: [
        ["2008-某月,天", "我出生辣！","睁眼看世界！"],
        ["2014-某月,天", "我的世界！","获得成就 这是？工作台！"],
        ["2022-某月,天", "我的世界服务器时代！", "腐竹！"],
        ["2023-Now！", "插件狂热期！(突然高产(❤ ω ❤))","世界很大我想去看看！"]
    ],


    /**
     * 在这里填写您的社交网络平台
     * ["img", "url", "desc"]
     * img是社交平台的图标，在./svg目录下我们已经准备好了 微博、简书、掘金、小红书、知乎、csdn、facebook、github、力扣、CF和qq的图标
     * url是您链接
     * desc是一段描述，将鼠标移入将会显示该描述
     * 建议您放置数量 <= 5
     */
    icon: [
        ["./svg/github.svg", "https://github.com/Little100", "我的GitHub主页"],
        ["./svg/BLBL.svg", "https://space.bilibili.com/1492647738", "我的哔哩哔哩"],
    ],


    //这是一些图片链接，建议您仅更改第二个头像图片
    url: [
        //背景图、头像、作品展示背景、其他经历背景
        "./images/3.jpg",
        "./images/2.jpg",
        "./images/work-bk.png",
        "./images/index_background.jpg"
    ]

}