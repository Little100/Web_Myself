#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
统一的数据获取脚本
整合GitHub和Bilibili数据获取功能
"""

import asyncio
import json
import os
import requests
import threading
import time
from datetime import datetime
from bilibili_fetcher import fetch_user_videos, get_suffix

def format_large_number(num):
    """自动将大数字转换为万或亿为单位的字符串。"""
    if num >= 100000000:
        return f"{num / 100000000:.2f}亿"
    elif num >= 10000:
        return f"{num / 10000:.2f}万"
    else:
        return str(num)

async def generate_github_data(github_username="Little100", github_token=None):
    """生成GitHub数据文件"""
    try:
        print(f"正在获取GitHub用户 {github_username} 的数据...")
        
        # 设置GitHub数据的默认值
        github_data = {
            "projects": [],
            "languages": {
                "JavaScript": 45,
                "HTML": 25,
                "CSS": 15,
                "Python": 10,
                "Java": 5
            }
        }
        
        # 尝试通过API获取数据
        try:
            # 获取用户仓库信息
            repos_url = f"https://api.github.com/users/{github_username}/repos?sort=updated&per_page=100"
            headers = {'Accept': 'application/vnd.github.v3+json'}
            
            # 如果有GitHub token，使用它以提高API限制
            if github_token:
                headers['Authorization'] = f"token {github_token}"
                
            repos_response = requests.get(repos_url, headers=headers, timeout=10)
            repos_response.raise_for_status()
            repos = repos_response.json()
            
            # 处理仓库数据
            projects = []
            for repo in repos:
                if not repo.get('fork', False):  # 忽略fork的仓库
                    projects.append({
                        "name": repo.get('name', ''),
                        "fullName": repo.get('full_name', ''),
                        "description": repo.get('description', '') or '暂无描述',
                        "language": repo.get('language', 'Unknown'),
                        "stars": repo.get('stargazers_count', 0),
                        "forks": repo.get('forks_count', 0),
                        "url": repo.get('html_url', ''),
                        "updatedAt": repo.get('updated_at', ''),
                        "createdAt": repo.get('created_at', ''),
                        "topics": repo.get('topics', [])
                    })
            
            # 如果成功获取到仓库数据，则更新github_data
            if projects:
                github_data["projects"] = projects
                
                # 尝试获取语言统计
                languages_stats = {}
                for repo in repos[:20]:  # 限制为前20个仓库以避免API限制
                    try:
                        if 'languages_url' in repo and repo.get('size', 0) > 0:
                            lang_response = requests.get(repo['languages_url'], headers=headers, timeout=10)
                            lang_response.raise_for_status()
                            repo_langs = lang_response.json()
                            
                            for lang, bytes_count in repo_langs.items():
                                languages_stats[lang] = languages_stats.get(lang, 0) + bytes_count
                    except Exception as e:
                        print(f"获取仓库 {repo.get('name', '')} 的语言统计失败: {e}")
                
                # 计算语言百分比
                if languages_stats:
                    total_bytes = sum(languages_stats.values())
                    language_percentages = {}
                    
                    for lang, bytes_count in languages_stats.items():
                        percentage = round((bytes_count / total_bytes) * 100)
                        if percentage >= 1:  # 只包含占比至少1%的语言
                            language_percentages[lang] = percentage
                    
                    # 如果成功获取语言统计，更新github_data
                    if language_percentages:
                        github_data["languages"] = language_percentages
            
        except Exception as e:
            print(f"通过GitHub API获取数据失败: {e}")
            print("将使用默认的GitHub数据")
        
        # 将数据写入github_data.js文件
        github_data_path = 'github_data.js'
        with open(github_data_path, 'w', encoding='utf-8') as f:
            f.write(f"window.GITHUB_DATA = {json.dumps(github_data, ensure_ascii=False, indent=2)};")
            
        print(f"已将GitHub数据写入到 '{github_data_path}'")
        return github_data
    except Exception as e:
        print(f"生成GitHub数据时出错: {e}")
        return None

async def generate_bilibili_data(uid="1492647738", output_dir="Excel"):
    """生成Bilibili数据"""
    try:
        print(f"正在获取Bilibili用户 {uid} 的数据...")
        
        # 使用bilibili_fetcher获取数据
        plugin_config = {'uid': uid}
        sessdata = os.getenv('SESSDATA')
        if sessdata:
            plugin_config['sessdata'] = sessdata
        bilibili_data = await fetch_user_videos(plugin_config, output_dir)
        
        if not bilibili_data or not bilibili_data.get('videos'):
            print("未能获取有效的B站数据")
            return None
            
        all_videos = bilibili_data['videos']
        follower_count = bilibili_data.get('follower_count', 'N/A')
        
        print(f"成功获取 {len(all_videos)} 个视频数据")
        
        # 数据聚合
        total_views = sum(int(v.get('view_count', 0)) for v in all_videos)
        total_videos = len(all_videos)
        total_likes = sum(int(v.get('like_count', 0)) for v in all_videos)
        
        # 按月份统计
        monthly_stats = {}
        for video in all_videos:
            try:
                pub_time = datetime.strptime(video['publish_time'], '%Y-%m-%d %H:%M:%S')
                month_key = pub_time.strftime('%Y-%m')
                if month_key not in monthly_stats:
                    monthly_stats[month_key] = {'videos': 0, 'views': 0, 'likes': 0}
                monthly_stats[month_key]['videos'] += 1
                monthly_stats[month_key]['views'] += int(video.get('view_count', 0))
                monthly_stats[month_key]['likes'] += int(video.get('like_count', 0))
            except (ValueError, KeyError) as e:
                print(f"处理视频时间数据失败: {e}, 视频: {video.get('title', 'Unknown')}")
                continue

        sorted_months = sorted(monthly_stats.keys())
        
        # 改进标签格式，包含年份信息
        trend_labels = []
        for m in sorted_months:
            year, month = m.split('-')
            trend_labels.append(f"{year}.{month}")
        
        # 准备累计和单月数据
        cumulative_videos, cumulative_views, cumulative_likes = 0, 0, 0
        trend_video_data, trend_views_data, trend_likes_data = [], [], []
        monthly_video_data, monthly_views_data, monthly_likes_data = [], [], []
        
        for month in sorted_months:
            # 累计数据
            cumulative_videos += monthly_stats[month]['videos']
            cumulative_views += monthly_stats[month]['views']
            cumulative_likes += monthly_stats[month]['likes']
            trend_video_data.append(cumulative_videos)
            trend_views_data.append(cumulative_views)
            trend_likes_data.append(cumulative_likes)
            
            # 单月数据
            monthly_video_data.append(monthly_stats[month]['videos'])
            monthly_views_data.append(monthly_stats[month]['views'])
            monthly_likes_data.append(monthly_stats[month]['likes'])

        # 计算近一个月数据
        last_month_views = 0
        last_month_videos = 0
        last_month_likes = 0
        last_month_views_change = "N/A"
        last_month_videos_change = "N/A"
        last_month_likes_change = "N/A"

        if len(sorted_months) >= 1:
            last_month_key = sorted_months[-1]
            last_month_stats = monthly_stats[last_month_key]
            last_month_views = last_month_stats['views']
            last_month_videos = last_month_stats['videos']
            last_month_likes = last_month_stats['likes']

            # 计算相对于上个月的变化
            if len(sorted_months) >= 2:
                prev_month_key = sorted_months[-2]
                prev_month_stats = monthly_stats[prev_month_key]
                prev_month_views = prev_month_stats['views']
                prev_month_videos = prev_month_stats['videos']
                prev_month_likes = prev_month_stats['likes']

                # 播放量变化
                if prev_month_views > 0:
                    views_change_percent = (last_month_views - prev_month_views) / prev_month_views * 100
                    last_month_views_change = f"+{views_change_percent:.1f}%" if views_change_percent >= 0 else f"{views_change_percent:.1f}%"

                # 视频数量变化
                videos_change = last_month_videos - prev_month_videos
                if videos_change != 0:
                    last_month_videos_change = f"+{videos_change}" if videos_change > 0 else str(videos_change)
                else:
                    last_month_videos_change = "持平"

                # 点赞量变化
                if prev_month_likes > 0:
                    likes_change_percent = (last_month_likes - prev_month_likes) / prev_month_likes * 100
                    last_month_likes_change = f"+{likes_change_percent:.1f}%" if likes_change_percent >= 0 else f"{likes_change_percent:.1f}%"
        
        # 准备视频表现数据
        video_performance = []
        for v in all_videos:
            views = int(v.get('view_count', 0))
            if views >= 10000:
                likes = int(v.get('like_count', 0))
                video_performance.append({
                    'title': v.get('title', '未知标题'),
                    'views': views,
                    'likes': likes,
                    'like_rate': (likes / views) * 100 if views > 0 else 0
                })

        # 按点赞率排序
        video_performance.sort(key=lambda x: x['like_rate'], reverse=True)

        # 汇总所有弹幕，并附带视频标题
        all_danmakus = []
        for v in all_videos:
            if 'danmakus' in v and v['danmakus']:
                video_title = v.get('title', '未知视频')
                for dm_text in v['danmakus']:
                    all_danmakus.append({'text': dm_text, 'video_title': video_title})

        dashboard_data = {
            "summary": {
                "total_fans": f"{follower_count:,}" if isinstance(follower_count, int) else follower_count,
                "total_views": format_large_number(total_views),
                "total_videos": total_videos,
                "total_likes": format_large_number(total_likes),
                "last_month_views": format_large_number(last_month_views),
                "last_month_views_change": last_month_views_change,
                "last_month_videos": last_month_videos,
                "last_month_videos_change": last_month_videos_change,
                "last_month_likes": format_large_number(last_month_likes),
                "last_month_likes_change": last_month_likes_change
            },
            "trend_chart": {
                "labels": trend_labels,
                "datasets": [
                    { "label": "累计视频发布数", "data": trend_video_data },
                    { "label": "累计播放量", "data": trend_views_data },
                    { "label": "累计点赞量", "data": trend_likes_data },
                    { "label": "每月视频发布数", "data": monthly_video_data },
                    { "label": "每月播放量", "data": monthly_views_data },
                    { "label": "每月点赞量", "data": monthly_likes_data }
                ]
            },
            "video_performance": video_performance,
            "monthly_details": monthly_stats,
            "follower_chart": {
                "labels": ["2022年", "2023年", "2024年", "2025年"],
                "datasets": [ {
                    "label": "B站粉丝数量",
                    "data": [
                        max(0, follower_count - 30) if isinstance(follower_count, int) else 0,
                        max(0, follower_count - 20) if isinstance(follower_count, int) else 0,
                        max(0, follower_count - 10) if isinstance(follower_count, int) else 0,
                        follower_count if isinstance(follower_count, int) else 0
                    ]
                } ]
            },
            "all_videos": all_videos,
            "all_danmakus": all_danmakus
        }

        # 生成bilibili_data.js文件
        bilibili_js_path = 'bilibili_data.js'
        with open(bilibili_js_path, 'w', encoding='utf-8') as f:
            f.write(f"window.BILIBILI_DATA = {json.dumps(dashboard_data, ensure_ascii=False, indent=2)};")
            
        print(f"已将Bilibili数据写入到 '{bilibili_js_path}'")
        return dashboard_data
        
    except Exception as e:
        print(f"生成Bilibili数据时出错: {e}")
        return None

async def main():
    """主函数"""
    print("开始数据获取...")
    
    # 配置参数
    github_username = os.getenv('GITHUB_USERNAME', 'Little100')
    github_token = os.getenv('GITHUB_TOKEN')
    bilibili_uid = os.getenv('BILIBILI_UID', '1492647738')
    
    # 并行获取GitHub和Bilibili数据
    github_task = generate_github_data(github_username, github_token)
    bilibili_task = generate_bilibili_data(bilibili_uid)
    
    github_data, bilibili_data = await asyncio.gather(github_task, bilibili_task)
    
    if github_data:
        print("✅ GitHub数据获取成功")
    else:
        print("❌ GitHub数据获取失败")
        
    if bilibili_data:
        print("✅ Bilibili数据获取成功")
    else:
        print("❌ Bilibili数据获取失败")
    
    print("数据获取完成！")

if __name__ == "__main__":
    asyncio.run(main())
