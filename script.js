const { createApp } = window.Vue

const app = createApp({
  data() {
    return {
      config: {
        personal: {
          name: "Little_100",
          signature: "I Love You❤",
          avatar: "https://avatars.githubusercontent.com/u/134726985?v=4",
          github: "https://github.com/Little100",
          githubUsername: "Little100",
          location: "Earth China",
          bio: "Hello~在这呢，我是Little_100，现在是高中生，有什么我可以帮您的嘛？我可是一位较为老的我的世界玩家uwu，你可以联系我的QQ: 2662308929或者加入群聊1032430138~关于插件，目前正在开发[无尽贪婪],[匠魂2],[暮色森林]尽情期待~qwp,有问题先看文档哦~",
        },
        navigation: {
          items: [
            { name: "介绍", id: "intro", icon: "👤" },
            { name: "项目", id: "projects", icon: "💼" },
            { name: "视频", id: "videos", icon: "📹" },
            { name: "评论", id: "comments", icon: "💬" },
            { name: "关于", id: "about", icon: "📧" },
          ],
        },
        starMapConfig: {
          github: {
            id: "github-center",
            x: 200,
            y: 150,
            label: "GitHub",
            type: "center",
            class: "github-center",
            url: "https://github.com/Little100",
          },
          personal: { id: "personal-center", x: 500, y: 150, label: "个人", type: "center", class: "personal-center" },
          bilibili: {
            id: "bilibili-center",
            x: 800,
            y: 150,
            label: "Bilibili",
            type: "center",
            class: "bilibili-center",
          },
          personalNodes: [
            { id: "birth-date", parentId: "personal-center", label: "2008年某月", subLabel: "睁眼看世界", details: "我出生辣", type: "info" },
            { id: "mc-start", parentId: "personal-center", label: "2014年", subLabel: "这是?工作台!", details: "开始游玩我的世界", type: "info" },
            { id: "mc-server", parentId: "personal-center", label: "2022年", subLabel: "好想要多人游玩", details: "我成为了腐竹", type: "info" },
            { id: "mc-plugin", parentId: "personal-center", label: "2023-Now", subLabel: "插件生产队！", details: "我爱插件", type: "info" },
          ],
        },
      },
      isDark: false,
      hoveredNode: null,
      mouseX: 0,
      mouseY: 0,
      displayProjects: [],
      githubProjects: [],
      githubLanguages: {},
      isLoading: true,
      loadingError: null,
      allVideosData: [],
      allDanmakus: [],
      starMap: {
        nodes: [],
        links: [],
      },
      starMapViewBox: { x: 0, y: 0, width: 1000, height: 300 },
      isDragging: false,
      lastMousePosition: { x: 0, y: 0 },
    }
  },
  async mounted() {
    this.trendChartInstance = null
    this.followerChartInstance = null
    this.initTheme()
    await this.loadGithubData()
    await this.loadBilibiliData()
    this.generateStarMap()
    this.updateDisplayProjects()
    this.isLoading = false
    window.closeModal = this.closeModal.bind(this)
    this.loadGiscus()
  },
  methods: {
    loadGiscus() {
      const giscusContainer = document.querySelector('.giscus-container');
      if (!giscusContainer) return;

      while (giscusContainer.firstChild) {
        giscusContainer.removeChild(giscusContainer.firstChild);
      }

      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      script.setAttribute('data-repo', 'Little100/Web_Myself');
      script.setAttribute('data-repo-id', 'R_kgDOPq-ETQ');
      script.setAttribute('data-category', 'General');
      script.setAttribute('data-category-id', 'DIC_kwDOPq-ETc4CvDrJ');
      script.setAttribute('data-mapping', 'pathname');
      script.setAttribute('data-strict', '0');
      script.setAttribute('data-reactions-enabled', '1');
      script.setAttribute('data-emit-metadata', '0');
      script.setAttribute('data-input-position', 'bottom');
      script.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
      script.setAttribute('data-lang', 'zh-CN');
      script.crossOrigin = 'anonymous';
      script.async = true;

      giscusContainer.appendChild(script);
    },
    formatLargeNumber(num) {
      if (num >= 100000000) return `${(num / 100000000).toFixed(2)}亿`
      if (num >= 10000) return `${(num / 10000).toFixed(2)}万`
      return num.toLocaleString()
    },
    async loadGithubData() {
      try {
        const data = window.GITHUB_DATA || {
          projects: [],
          languages: { JavaScript: 45, HTML: 25, CSS: 15, Python: 10, Java: 5 },
        }
        this.githubProjects = data.projects || []
        this.githubLanguages = data.languages || {}
      } catch (error) {
        console.error("Failed to load GitHub data:", error)
        this.loadingError = "无法加载 GitHub 数据。将使用默认值。"
        this.githubProjects = []
        this.githubLanguages = { Java: 45, JavaScript: 25, HTML: 15, CSS: 10, Python: 5 }
      }
    },

    generateStarMap() {
      this.starMap.nodes = []
      this.starMap.links = []
      this.generateGithubNodes()
      this.generatePersonalNodes()
      this.generateBiliNodes()
    },

    generateNodePositions(parent, children, startRadius, endRadius, startAngle = 0) {
      const angleStep = children.length > 1 ? (2 * Math.PI) / children.length : 0
      children.forEach((child, index) => {
        const angle = startAngle + index * angleStep
        const radius = startRadius + Math.random() * (endRadius - startRadius)
        child.x = parent.x + Math.cos(angle) * radius
        child.y = parent.y + Math.sin(angle) * radius
      })
    },

    generateGithubNodes() {
      const { github } = this.config.starMapConfig
      this.starMap.nodes.push(github)

      const languages = [...new Set(this.githubProjects.map((p) => p.language).filter(Boolean))]
      const langNodes = languages.map((lang) => ({
        id: `lang-${lang}`,
        parentId: github.id,
        label: lang,
        type: "language",
        class: `language-node ${lang.toLowerCase()}`,
        data: { language: lang },
      }))

      this.generateNodePositions(github, langNodes, 80, 100)
      this.starMap.nodes.push(...langNodes)
      langNodes.forEach((ln) => this.starMap.links.push({ source: github.id, target: ln.id }))

      langNodes.forEach((langNode) => {
        const projectsOfLang = this.githubProjects.filter((p) => p.language === langNode.data.language).slice(0, 5)
        const projectNodes = projectsOfLang.map((p) => ({
          id: `proj-${p.name}`,
          parentId: langNode.id,
          label: p.name,
          type: "project",
          class: `project-star ${p.language.toLowerCase()}`,
          data: p,
          url: p.url,
        }))

        this.generateNodePositions(langNode, projectNodes, 30, 40)
        this.starMap.nodes.push(...projectNodes)
        projectNodes.forEach((pn) => this.starMap.links.push({ source: langNode.id, target: pn.id }))
      })
    },

    generatePersonalNodes() {
      const { personal, personalNodes } = this.config.starMapConfig
      this.starMap.nodes.push(personal)

      const infoNodes = personalNodes.map((node) => ({
        ...node,
        type: "info",
        class: "personal-node",
      }))

      this.generateNodePositions(personal, infoNodes, 60, 70)
      this.starMap.nodes.push(...infoNodes)
      infoNodes.forEach((infoNode) => this.starMap.links.push({ source: personal.id, target: infoNode.id }))
    },

    generateBiliNodes() {
      if (!this.allVideosData || this.allVideosData.length === 0) return
      const { bilibili } = this.config.starMapConfig
      this.starMap.nodes.push(bilibili)

      const collections = {
        游戏视频: {
          id: "bili-coll-game",
          parentId: bilibili.id,
          label: "游戏视频",
          type: "collection",
          class: "bilibili-collection",
          videos: [],
        },
        开发教程: {
          id: "bili-coll-dev",
          parentId: bilibili.id,
          label: "开发教程",
          type: "collection",
          class: "bilibili-collection",
          videos: [],
        },
        其它: {
          id: "bili-coll-other",
          parentId: bilibili.id,
          label: "其它",
          type: "collection",
          class: "bilibili-collection",
          videos: [],
        },
      }

      this.allVideosData.forEach((video) => {
        if (video.title.includes("游戏") || video.title.includes("我的世界")) {
          collections["游戏视频"].videos.push(video)
        } else if (video.title.includes("教程") || video.title.includes("开发")) {
          collections["开发教程"].videos.push(video)
        } else {
          collections["其它"].videos.push(video)
        }
      })

      const collectionNodes = Object.values(collections).filter((c) => c.videos.length > 0)
      this.generateNodePositions(bilibili, collectionNodes, 80, 100)
      this.starMap.nodes.push(...collectionNodes)
      collectionNodes.forEach((cn) => this.starMap.links.push({ source: bilibili.id, target: cn.id }))

      collectionNodes.forEach((collNode) => {
        const videoNodes = collNode.videos.slice(0, 3).map((v) => ({
          id: `video-${v.aid}`,
          parentId: collNode.id,
          label: v.title,
          type: "video",
          class: "project-star bilibili",
          data: v,
          url: v.url,
        }))
        this.generateNodePositions(collNode, videoNodes, 30, 40)
        this.starMap.nodes.push(...videoNodes)
        videoNodes.forEach((vn) => this.starMap.links.push({ source: collNode.id, target: vn.id }))
      })
    },

    async loadBilibiliData() {
      try {
        const data = window.BILIBILI_DATA
        if (!data) {
          console.error("Bilibili data (window.BILIBILI_DATA) not found.")
          return
        }

        this.allVideosData = data.all_videos || []
        this.allDanmakus = data.all_danmakus || []

        if (data.summary) {
          const summary = data.summary
          const fansEl = document.getElementById("bili-total-fans")
          const viewsEl = document.getElementById("bili-total-views")
          const videosEl = document.getElementById("bili-total-videos")
          const likesEl = document.getElementById("bili-total-likes")

          if (fansEl) fansEl.textContent = summary.total_fans || "0"
          if (viewsEl) viewsEl.textContent = summary.total_views || "0"
          if (videosEl) videosEl.textContent = summary.total_videos || "0"
          if (likesEl) likesEl.textContent = summary.total_likes || "0"
        }

        if (data.trend_chart && data.follower_chart) {
          this.initBiliCharts(data.trend_chart, data.follower_chart)
        }

        if (data.video_performance) {
          this.renderVideoPerformanceList(data.video_performance)
        }

        this.initDanmaku()
        this.updateBiliChartsTheme()
      } catch (error) {
        console.error("加载 Bilibili 数据时出错:", error)
      }
    },

    initBiliCharts(trendData, followerData) {
      const trendCanvas = document.getElementById("trendChart")
      if (trendCanvas && trendData) {
        this.drawBiliLineChart(trendCanvas, trendData)
      }

      const followerCanvas = document.getElementById("followerChart")
      if (followerCanvas && followerData) {
        this.drawBiliBarChart(followerCanvas, followerData)
      }
    },

    drawBiliLineChart(canvas, data) {
      if (!data || !Array.isArray(data.datasets) || data.datasets.length === 0) {
        console.warn("Trend chart data is invalid or empty, skipping render.")
        return
      }
      if (this.trendChartInstance) this.trendChartInstance.destroy()
      const ctx = canvas.getContext("2d")

      const filteredDatasets = data.datasets.filter(
        (ds) => ds.label === "累计播放量" || ds.label === "每月播放量" || ds.label === "累计点赞量",
      )

      this.trendChartInstance = new window.Chart(ctx, {
        type: "line",
        data: {
          labels: data.labels,
          datasets: filteredDatasets.map((ds) => {
            let borderColor, backgroundColor
            if (ds.label.includes("每月播放量")) {
              borderColor = "#f97316"
              backgroundColor = "rgba(249, 115, 22, 0.1)"
            } else if (ds.label.includes("累计播放量")) {
              borderColor = "#14b8a6"
              backgroundColor = "rgba(20, 184, 166, 0.1)"
            } else if (ds.label.includes("累计点赞量")) {
              borderColor = "#ec4899"
              backgroundColor = "rgba(236, 72, 153, 0.1)"
            } else {
              borderColor = "#3b82f6"
              backgroundColor = "rgba(59, 130, 246, 0.1)"
            }
            return {
              ...ds,
              borderColor,
              backgroundColor,
              fill: false,
              tension: 0.4,
              pointRadius: 8,
              pointHoverRadius: 12,
              pointBackgroundColor: borderColor,
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              borderWidth: 3,
            }
          }),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "point", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              position: "nearest",
              xAlign: "center",
              yAlign: "bottom",
              caretPadding: 10,
              cornerRadius: 8,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              borderColor: "#f97316",
              borderWidth: 2,
              displayColors: false,
              padding: 12,
              enabled: true,
              callbacks: {
                title: (context) => `${context[0].label} 月份数据`,
                label: (context) => `${context.dataset.label || ""}: ${this.formatLargeNumber(context.parsed.y)}`,
              },
            },
          },
          scales: {
            x: {
              ticks: { color: this.isDark ? "#d1d5db" : "#374151" },
              grid: { color: this.isDark ? "#374151" : "#e5e7eb" },
            },
            y: {
              ticks: {
                color: this.isDark ? "#d1d5db" : "#374151",
                callback: (value) => this.formatLargeNumber(value),
              },
              grid: { color: this.isDark ? "#374151" : "#e5e7eb" },
            },
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const dataIndex = elements[0].index
              const month = data.labels[dataIndex]
              this.showMonthlyVideoDetails(month)
            }
          },
        },
      })
    },

    drawBiliBarChart(canvas, data) {
      if (!data || !Array.isArray(data.datasets) || data.datasets.length === 0) {
        console.warn("Follower chart data is invalid or empty, skipping render.")
        return
      }
      if (this.followerChartInstance) this.followerChartInstance.destroy()
      const ctx = canvas.getContext("2d")
      this.followerChartInstance = new window.Chart(ctx, {
        type: "bar",
        data: {
          labels: data.labels,
          datasets: data.datasets.map((ds) => ({ ...ds, backgroundColor: "#14b8a6" })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "point", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              position: "nearest",
              xAlign: "center",
              yAlign: "bottom",
              caretPadding: 10,
              cornerRadius: 8,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              borderColor: "#f97316",
              borderWidth: 2,
              displayColors: false,
              padding: 12,
              enabled: true,
              callbacks: {
                title: (context) => `${context[0].label} 月份数据`,
                label: (context) => `${context.dataset.label || ""}: ${this.formatLargeNumber(context.parsed.y)}`,
              },
            },
          },
          scales: {
            x: {
              ticks: { color: this.isDark ? "#d1d5db" : "#374151" },
              grid: { color: this.isDark ? "#374151" : "#e5e7eb" },
            },
            y: {
              ticks: { color: this.isDark ? "#d1d5db" : "#374151" },
              grid: { color: this.isDark ? "#374151" : "#e5e7eb" },
            },
          },
        },
      })
    },

    generateBiliStarMapPositions() {
      if (!this.allVideosData || this.allVideosData.length === 0) return
      const center = this.config.starMap.bilibili.center
      const radius = 70
      const videos = [...this.allVideosData].sort((a, b) => b.view_count - a.view_count).slice(0, 5)

      this.config.starMap.bilibili.videos = videos.map((video, index) => {
        const angle = (index / videos.length) * 2 * Math.PI
        return {
          title: video.title,
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
          views: video.view_count,
          url: video.url,
        }
      })
    },

    showNodeInfo(node) {
      this.hoveredNode = node
    },

    hideNodeInfo() {
      this.hoveredNode = null
    },

    openNodeUrl(node) {
      if (node && node.url) {
        window.open(node.url, "_blank")
      }
    },

    showMonthlyVideoDetails(month) {
      const [year, monthNum] = month.split(".").map(Number)
      const monthKey = `${year}-${String(monthNum).padStart(2, "0")}`
      const monthlyVideos = this.allVideosData.filter((video) => video.publish_time.startsWith(monthKey))
      if (monthlyVideos.length === 0) return
      monthlyVideos.sort((a, b) => new Date(a.publish_time) - new Date(b.publish_time))

      const modal = document.getElementById("chartModal")
      const modalTitle = document.getElementById("modalTitle")
      const modalCanvas = document.getElementById("modalChart")

      if (modal && modalCanvas && modalTitle) {
        if (modal.chartInstance) modal.chartInstance.destroy()
        modalTitle.textContent = `${month} 月度视频播放量详情`
        modal.style.display = "flex"
        const ctx = modalCanvas.getContext("2d")
        modal.chartInstance = new window.Chart(ctx, {
          type: "bar",
          data: {
            labels: monthlyVideos.map((v) => v.title),
            datasets: [{ label: `播放量`, data: monthlyVideos.map((v) => v.view_count), backgroundColor: "#f97316" }],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { ticks: { callback: (value) => this.formatLargeNumber(value) } } },
          },
        })
      }
    },

    closeModal() {
      const modal = document.getElementById("chartModal")
      if (modal) {
        if (modal.chartInstance) modal.chartInstance.destroy()
        modal.style.display = "none"
      }
    },

    updateBiliChartsTheme() {
      if (this.trendChartInstance) {
        const textColor = this.isDark ? "#d1d5db" : "#374151"
        const gridColor = this.isDark ? "#374151" : "#e5e7eb"

        this.trendChartInstance.options.scales.x.ticks.color = textColor
        this.trendChartInstance.options.scales.x.grid.color = gridColor
        this.trendChartInstance.options.scales.y.ticks.color = textColor
        this.trendChartInstance.options.scales.y.grid.color = gridColor
        this.trendChartInstance.update()
      }

      if (this.followerChartInstance) {
        const textColor = this.isDark ? "#d1d5db" : "#374151"
        const gridColor = this.isDark ? "#374151" : "#e5e7eb"

        this.followerChartInstance.options.scales.x.ticks.color = textColor
        this.followerChartInstance.options.scales.x.grid.color = gridColor
        this.followerChartInstance.options.scales.y.ticks.color = textColor
        this.followerChartInstance.options.scales.y.grid.color = gridColor
        this.followerChartInstance.update()
      }
    },

    initDanmaku() {
      const container = document.getElementById("danmaku-container")
      const bilibiliSection = document.querySelector(".bilibili-section")
      if (!container || !bilibiliSection || !this.allDanmakus || this.allDanmakus.length === 0) return

      setInterval(() => {
        const danmakuData = this.allDanmakus[Math.floor(Math.random() * this.allDanmakus.length)]
        if (!danmakuData) return
        const danmaku = document.createElement("div")
        danmaku.className = "danmaku"
        danmaku.textContent = danmakuData.text
        danmaku.title = `来自: ${danmakuData.video_title}`

        const sectionHeight = bilibiliSection.offsetHeight
        const randomTop = Math.random() * (sectionHeight - 50)
        danmaku.style.top = `${randomTop}px`

        const duration = Math.random() * 10 + 8
        danmaku.style.animationDuration = `${duration}s`
        container.appendChild(danmaku)
        setTimeout(() => danmaku.remove(), duration * 1000)
      }, 500)
    },

    renderVideoPerformanceList(videoData) {
      const listContainer = document.getElementById("video-performance-list")
      if (!listContainer) return
      if (!videoData || !Array.isArray(videoData) || videoData.length === 0) {
        listContainer.innerHTML = "<p>暂无符合条件的视频表现数据。</p>"
        return
      }
      listContainer.innerHTML = ""
      const maxRate = Math.max(...videoData.map((v) => v.like_rate), 0)
      videoData.slice(0, 15).forEach((video) => {
        const item = document.createElement("div")
        item.className = "video-perf-item"
        item.innerHTML = `
          <div class="video-perf-title" title="${video.title}">${video.title}</div>
          <div class="video-perf-bar-container">
            <div class="video-perf-bar" style="width: ${maxRate > 0 ? (video.like_rate / maxRate) * 100 : 0}%"></div>
            <div class="video-perf-rate">${video.like_rate.toFixed(2)}%</div>
          </div>
          <div class="video-perf-extra">▶ ${this.formatLargeNumber(video.views)}</div>
          <div class="video-perf-extra">👍 ${this.formatLargeNumber(video.likes)}</div>
        `
        listContainer.appendChild(item)
      })
    },

    initTheme() {
      const savedTheme = localStorage.getItem("theme")
      if (savedTheme) {
        this.isDark = savedTheme === "dark"
      } else {
        this.isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      }
      this.applyTheme()
    },

    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
      localStorage.setItem("theme", this.isDark ? "dark" : "light")
      this.loadGiscus()
    },

    applyTheme() {
      document.body.classList.toggle("dark", this.isDark);
      this.updateBiliChartsTheme()
    },

    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        const offsetTop = element.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    },

    updateDisplayProjects() {
      this.displayProjects = this.githubProjects.slice(0, 5)
    },

    getLanguageColor(language) {
      const colors = {
        Java: "#f89820",
        JavaScript: "#f7df1e",
        HTML: "#e34c26",
        CSS: "#1572b6",
        Python: "#3776ab",
        TypeScript: "#3178c6",
        Vue: "#4fc08d",
        Go: "#00add8",
        Rust: "#dea584",
        C: "#a8b9cc",
        "C++": "#f34b7d",
        Shell: "#89e051",
        Dockerfile: "#384d54",
      }
      return colors[language] || "#64748b"
    },

    updateMousePosition(event) {
      const svgRect = event.currentTarget.getBoundingClientRect()
      this.mouseX = event.clientX - svgRect.left
      this.mouseY = event.clientY - svgRect.top
    },

    openProjectUrl(url) {
      if (url) {
        window.open(url, "_blank")
      }
    },

    getNodeById(id) {
      return this.starMap.nodes.find((n) => n.id === id)
    },

    showAllProjects() {
      const allProjectsUrl = this.config.personal.github + "?tab=repositories"
      window.open(allProjectsUrl, "_blank")
    },

    getProjectStatus(project) {
      const now = new Date()
      const updatedAt = new Date(project.updatedAt)
      const daysSinceUpdate = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24))
      if (daysSinceUpdate < 30) {
        return "活跃开发"
      } else if (daysSinceUpdate < 180) {
        return "维护中"
      } else {
        return "稳定版"
      }
    },

    getStatusClass(status) {
      const statusMap = {
        稳定版: "stable",
        活跃开发: "development",
        开发中: "development",
        维护中: "maintenance",
        模板: "template",
        测试版: "beta",
      }
      return statusMap[status] || "stable"
    },

    generateCurvedPath(link) {
      const start = this.getNodeById(link.source)
      const end = this.getNodeById(link.target)
      if (!start || !end) return ""

      const dx = end.x - start.x
      const dy = end.y - start.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      const angle = Math.atan2(dy, dx)
      const perpAngle = angle + Math.PI / 2

      const curvature1 = 0.3 + Math.sin(angle * 3) * 0.1
      const curvature2 = 0.4 + Math.cos(angle * 2) * 0.15
      const curvature3 = 0.2 + Math.sin(angle * 4) * 0.08

      let curveIntensity = 1
      if (start.type === "center") curveIntensity = 1.5
      if (end.type === "project") curveIntensity = 0.8

      const midX = start.x + dx * 0.5
      const midY = start.y + dy * 0.5

      const control1X = start.x + dx * 0.25 + Math.cos(perpAngle) * distance * curvature1 * curveIntensity
      const control1Y = start.y + dy * 0.25 + Math.sin(perpAngle) * distance * curvature1 * curveIntensity

      const control2X = start.x + dx * 0.75 - Math.cos(perpAngle) * distance * curvature2 * curveIntensity
      const control2Y = start.y + dy * 0.75 - Math.sin(perpAngle) * distance * curvature2 * curveIntensity

      if (distance > 80) {
        const control3X = midX + Math.cos(perpAngle + Math.PI / 4) * distance * curvature3 * curveIntensity
        const control3Y = midY + Math.sin(perpAngle + Math.PI / 4) * distance * curvature3 * curveIntensity

        return `M ${start.x} ${start.y} 
                C ${control1X} ${control1Y}, ${control3X} ${control3Y}, ${midX} ${midY}
                C ${control3X} ${control3Y}, ${control2X} ${control2Y}, ${end.x} ${end.y}`
      }

      return `M ${start.x} ${start.y} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${end.x} ${end.y}`
    },

    handleWheel(event) {
      event.preventDefault()
      event.stopPropagation()

      const zoomFactor = event.deltaY > 0 ? 1.2 : 0.8
      const minWidth = 200
      const maxWidth = 2000

      const newWidth = Math.max(minWidth, Math.min(maxWidth, this.starMapViewBox.width * zoomFactor))
      const newHeight = (newWidth / this.starMapViewBox.width) * this.starMapViewBox.height

      const centerX = this.starMapViewBox.x + this.starMapViewBox.width / 2
      const centerY = this.starMapViewBox.y + this.starMapViewBox.height / 2

      this.starMapViewBox.x = centerX - newWidth / 2
      this.starMapViewBox.y = centerY - newHeight / 2
      this.starMapViewBox.width = newWidth
      this.starMapViewBox.height = newHeight
    },

    handleMouseDown(event) {
      this.isDragging = true
      this.lastMousePosition = { x: event.clientX, y: event.clientY }
      event.currentTarget.style.cursor = "grabbing"
      event.preventDefault()
    },

    handleMouseMove(event) {
      this.updateMousePosition(event)

      if (!this.isDragging) return

      const dx = event.clientX - this.lastMousePosition.x
      const dy = event.clientY - this.lastMousePosition.y

      const scale = this.starMapViewBox.width / 1000

      this.starMapViewBox.x -= dx * scale
      this.starMapViewBox.y -= dy * scale

      this.lastMousePosition = { x: event.clientX, y: event.clientY }
      event.preventDefault()
    },

    handleMouseUp(event) {
      this.isDragging = false
      if (event.currentTarget) {
        event.currentTarget.style.cursor = "grab"
      }
    },

    handleMouseLeave(event) {
      this.isDragging = false
      this.hoveredNode = null
      if (event.currentTarget) {
        event.currentTarget.style.cursor = "grab"
      }
    },
  },
})

app.mount("#app")
