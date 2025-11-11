/**
 * 暗黑模式主题切换功能
 * 支持本地存储和系统偏好检测
 */

(function () {
  "use strict";

  // 主题切换类
  class ThemeToggle {
    constructor() {
      this.body = document.body;
      this.storageKey = "jd-theme-preference";
      this.init();
    }

    /**
     * 初始化主题
     */
    init() {
      // 创建切换按钮
      this.createToggleButton();

      // 加载用户偏好
      this.loadThemePreference();

      // 监听系统主题变化
      this.watchSystemTheme();
    }

    /**
     * 创建主题切换按钮
     */
    createToggleButton() {
      const button = document.createElement("button");
      button.className = "theme-toggle";
      button.setAttribute("aria-label", "切换主题");
      button.setAttribute("title", "切换明暗主题");
      button.innerHTML = this.getButtonIcon();

      // 点击事件
      button.addEventListener("click", () => {
        this.toggleTheme();
      });

      // 添加到页面
      document.body.appendChild(button);
      this.toggleButton = button;
    }

    /**
     * 获取按钮图标
     */
    getButtonIcon() {
      const isDark = this.body.classList.contains("dark-mode");
      // 暗黑模式显示太阳图标，浅色模式显示月亮图标
      return isDark ? "☀️" : "🌙";
    }

    /**
     * 切换主题
     */
    toggleTheme() {
      const isDark = this.body.classList.contains("dark-mode");

      if (isDark) {
        this.setLightMode();
      } else {
        this.setDarkMode();
      }

      // 更新按钮图标
      this.toggleButton.innerHTML = this.getButtonIcon();
    }

    /**
     * 设置暗黑模式
     */
    setDarkMode() {
      this.body.classList.add("dark-mode");
      this.body.classList.remove("light-mode");
      this.saveThemePreference("dark");
    }

    /**
     * 设置浅色模式
     */
    setLightMode() {
      this.body.classList.remove("dark-mode");
      this.body.classList.add("light-mode");
      this.saveThemePreference("light");
    }

    /**
     * 保存主题偏好到本地存储
     */
    saveThemePreference(theme) {
      try {
        localStorage.setItem(this.storageKey, theme);
      } catch (e) {
        console.warn("无法保存主题偏好:", e);
      }
    }

    /**
     * 加载用户主题偏好
     */
    loadThemePreference() {
      try {
        const savedTheme = localStorage.getItem(this.storageKey);

        if (savedTheme === "dark") {
          this.setDarkMode();
        } else if (savedTheme === "light") {
          this.setLightMode();
        } else {
          // 如果没有保存的偏好，检查系统偏好
          this.applySystemTheme();
          return;
        }

        if (this.toggleButton) {
          this.toggleButton.innerHTML = this.getButtonIcon();
        }
      } catch (e) {
        console.warn("无法读取主题偏好:", e);
        this.applySystemTheme();
      }
    }

    /**
     * 应用系统主题偏好
     */
    applySystemTheme() {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        this.body.classList.add("dark-mode");
      } else {
        this.body.classList.add("light-mode");
      }

      // 更新按钮图标
      if (this.toggleButton) {
        this.toggleButton.innerHTML = this.getButtonIcon();
      }
    }

    /**
     * 监听系统主题变化
     */
    watchSystemTheme() {
      if (window.matchMedia) {
        const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

        // 使用现代 API
        if (darkModeQuery.addEventListener) {
          darkModeQuery.addEventListener("change", (e) => {
            // 只有在用户没有手动设置偏好时才应用系统主题
            const savedTheme = localStorage.getItem(this.storageKey);
            if (!savedTheme) {
              if (e.matches) {
                this.setDarkMode();
              } else {
                this.setLightMode();
              }
              // 更新按钮图标
              this.toggleButton.innerHTML = this.getButtonIcon();
            }
          });
        }
        // 兼容旧浏览器
        else if (darkModeQuery.addListener) {
          darkModeQuery.addListener((e) => {
            const savedTheme = localStorage.getItem(this.storageKey);
            if (!savedTheme) {
              if (e.matches) {
                this.setDarkMode();
              } else {
                this.setLightMode();
              }
              this.toggleButton.innerHTML = this.getButtonIcon();
            }
          });
        }
      }
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      new ThemeToggle();
    });
  } else {
    new ThemeToggle();
  }
})();
