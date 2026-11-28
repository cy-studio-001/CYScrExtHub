(function(Scratch) {
    "use strict";

    // 检查是否是CCW平台
    const isCCW = typeof window.Blockly !== "undefined" && window.Blockly.getMainWorkspace && 
                  (window.location.href.includes("ccw.site") || window.location.href.includes("cocrea.world"));

    // 引入Scratch常量
    const BlockType = Scratch.BlockType;
    const ArgumentType = Scratch.ArgumentType;

    const EXTENSION_ID = "theTomsBetterPopupTW";
    const EXTENSION_ICON = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1My4xNjAxOSIgaGVpZ2h0PSI0My4zMjE2OSIgdmlld0JveD0iMCwwLDUzLjE2MDE5LDQzLjMyMTY5Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgeDE9IjI5NC43MDA1IiB5MT0iMTYzLjE0ODk4IiB4Mj0iMzQ1LjQ0NjQzIiB5Mj0iMTYzLjE0ODk4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzQyMDBmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2NlMDBmZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yOTMuNTUzNTcsLTE1OC40MTI5NCkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjk0LjcwMDUsMTY3LjAzMjZ2LTcuNzY3MjNjMCwwIDM0LjA0MzY5LDAgNDIuNjY4MDEsMGMzLjc1MjUyLDAgOC4wNzc5Miw3Ljc2NzIzIDguMDc3OTIsNy43NjcyM3oiIGZpbGw9InVybCgjY29sb3ItMSkiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yOTQuMjg2MjUsMTkwLjY0NDk5YzAsLTYuMDk5NjMgMCwtMjIuOTkxMDEgMCwtMjIuOTkxMDFoNTAuOTUzMDV2MzMuMDM2NjRjMCwwIC0zMS4zOTYzMiwwIC00MC40OTMxOCwwYy00LjYyMzQyLDAgLTEwLjQ1OTg4LC02LjAxMzY5IC0xMC40NTk4OCwtMTAuMDQ1NjJ6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTI5NC41NTM1NywxOTEuMTAzMjZ2LTMxLjY5MDMyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMzAyLjgzODYyLDIwMC43MzQ2Mmg0Mi44NzUxMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTMwNC4zODgyLDIwMC43MDY1MWMtMC4yMzc5MSwwLjAxODYyIC0wLjQ3ODM4LDAuMDI4MTEgLTAuNzIxMDcsMC4wMjgxMWMtNS4wMzMyOCwwIC05LjExMzU2LC00LjA4MDI4IC05LjExMzU2LC05LjExMzU1YzAsLTAuMTI4ODQgMC4wMDI2OCwtMC4yNTcwNSAwLjAwNzk3LC0wLjM4NDU5IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjwvZz48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0zNDUuNzEzNzYsMTY5LjA0NDMxdjMxLjY5MDMyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMzM3LjQyODcsMTU5LjQxMjk0aC00Mi44NzUxMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTMzNS44NzkxMywxNTkuNDQxMDVjMC4yMzc5MSwtMC4wMTg2MiAwLjQ3ODM4LC0wLjAyODExIDAuNzIxMDcsLTAuMDI4MTFjNS4wMzMyOCwwIDkuMTEzNTUsNC4wODAyOCA5LjExMzU1LDkuMTEzNTZjMCwwLjEyODg0IC0wLjAwMjY4LDAuMjU3MDUgLTAuMDA3OTcsMC4zODQ1OCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48L2c+PHBhdGggZD0iTTM0NS4xOTU5NCwxNjcuNDQ2ODVoLTQ5LjgxMzg2IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxnIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCI+PHBhdGggZD0iTTMxNi4xNjg1OSwxODMuNTM2MWMwLC0yLjE5NzA1IDEuNzgxMDYsLTMuOTc4MTIgMy45NzgxMiwtMy45NzgxMmMyLjE5NzA1LDAgMy45NzgxMiwxLjc4MTA2IDMuOTc4MTIsMy45NzgxMmMwLDIuMTk3MDUgLTEuNzgxMDYsMy45NzgxMiAtMy45NzgxMiwzLjk3ODEyYy0yLjE5NzA1LDAgLTMuOTc4MTIsLTEuNzgxMDYgLTMuOTc4MTIsLTMuOTc4MTJ6Ii8+PHBhdGggZD0iTTMwMS42MTQ1MiwxODMuNTM2MWMwLC0yLjE5NzA1IDEuNzgxMDYsLTMuOTc4MTIgMy45NzgxMiwtMy45NzgxMmMyLjE5NzA1LDAgMy45NzgxMiwxLjc4MTA2IDMuOTc4MTIsMy45NzgxMmMwLDIuMTk3MDUgLTEuNzgxMDYsMy45NzgxMiAtMy45NzgxMiwzLjk3ODEyYy0yLjE5NzA1LDAgLTMuOTc4MTIsLTEuNzgxMDYgLTMuOTc4MTIsLTMuOTc4MTJ6Ii8+PHBhdGggZD0iTTMzNC40MDczNywxODcuNTE0MjJjLTIuMTk3MDUsMCAtMy45NzgxMiwtMS43ODEwNiAtMy45NzgxMiwtMy45NzgxMmMwLC0yLjE5NzA1IDEuNzgxMDYsLTMuOTc4MTIgMy45NzgxMiwtMy45NzgxMmMyLjE5NzA1LDAgMy45NzgxMiwxLjc4MTA2IDMuOTc4MTIsMy45NzgxMmMwLDIuMTk3MDUgLTEuNzgxMDYsMy45NzgxMiAtMy45NzgxMiwzLjk3ODEyeiIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aW5kZXgmcXVvdDs6bnVsbH0iLz48L2c+PC9nPjwvZz48L3N2Zz4=";
    const EXTENSION_PICTURE = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2NjAuNSIgaGVpZ2h0PSIzNzciIHZpZXdCb3g9IjAsMCw2NjAuNSwzNzciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0iNjUwLjI1IiB5MT0iMTgwIiB4Mj0iLTEwLjI1IiB5Mj0iMTgwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzQyMDBmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2NlMDBmZiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSI4MS44NDA2IiB5MT0iMTI5LjgzNzcyIiB4Mj0iMjQxLjYyMjAzIiB5Mj0iMTI5LjgzNzcyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTIiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzQyMDBmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2NlMDBmZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwLjI1LDguNSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNLTEwLjI1LDM2OC41di0zNzdoNjYwLjV2Mzc3eiIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aW5kZXgmcXVvdDs6bnVsbH0iIGZpbGw9InVybCgjY29sb3ItMSkiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxnPjxwYXRoIGQ9Ik04MS44NDA2LDE0Mi4wNjU5di0yNC40NTYzM2MwLDAgMTA3LjE5MTg0LDAgMTM0LjM0Njg0LDBjMTEuODE1MzksMCAyNS40MzQ1OCwyNC40NTYzMyAyNS40MzQ1OCwyNC40NTYzM3oiIGZpbGw9InVybCgjY29sb3ItMikiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik04MC41MzYyNywyMTYuNDEzMTdjMCwtMTkuMjA1NjMgMCwtNzIuMzkwNzYgMCwtNzIuMzkwNzZoMTYwLjQzMzU4djEwNC4wMjA5OGMwLDAgLTk4Ljg1NjE4LDAgLTEyNy40OTkwNiwwYy0xNC41NTc1NSwwIC0zMi45MzQ1NSwtMTguOTM1MDQgLTMyLjkzNDU1LC0zMS42MzAxOXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI4Ij48cGF0aCBkPSJNODEuMzc3OTcsMjE3Ljg1NjExdi05OS43ODE4OSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTEwNy40NjQ3MywyNDguMTgxOTRoMTM0Ljk5ODk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMTEyLjM0MzgzLDI0OC4wOTM0M2MtMC43NDkxLDAuMDU4NjMgLTEuNTA2MjUsMC4wODg1MSAtMi4yNzA0LDAuMDg4NTFjLTE1Ljg0ODA2LDAgLTI4LjY5NTQ2LC0xMi44NDczOSAtMjguNjk1NDYsLTI4LjY5NTQzYzAsLTAuNDA1NjcgMC4wMDg0NCwtMC44MDkzNiAwLjAyNTA5LC0xLjIxMDk0IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjwvZz48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjgiPjxwYXRoIGQ9Ik0yNDIuNDYzNzYsMTQ4LjQwMDA4djk5Ljc4MTg5IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjE2LjM3Njk2LDExOC4wNzQyMmgtMTM0Ljk5ODk5IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjExLjQ5NzksMTE4LjE2MjczYzAuNzQ5MSwtMC4wNTg2MyAxLjUwNjI1LC0wLjA4ODUxIDIuMjcwNCwtMC4wODg1MWMxNS44NDgwNiwwIDI4LjY5NTQzLDEyLjg0NzM5IDI4LjY5NTQzLDI4LjY5NTQ2YzAsMC40MDU2NyAtMC4wMDg0NCwwLjgwOTM2IC0wLjAyNTA5LDEuMjEwOTEiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PC9nPjxwYXRoIGQ9Ik04Mi4xNjY2OCwxNDMuMzcwMjNoMTU2Ljg0NjY2IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTUuMjQ5MzQsMjA0LjM4ODAyKSBzY2FsZSgzLjk5MDY3LDMuOTkwNjcpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjMDAwMDAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0iU2FucyBTZXJpZiIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgdGV4dC1hbmNob3I9InN0YXJ0IiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHRzcGFuIHg9IjAiIGR5PSIwIj4uLi48L3RzcGFuPjwvdGV4dD48L2c+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzM4Ljc3NzM0LDE2NS42Njg3NSkgc2NhbGUoMS41Mzg3OCwxLjgwNTUzKSIgZm9udC1zaXplPSI0MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgZmlsbD0iI2ZmODFlNSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9IiNmZjgxZTUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9IlNhbnMgU2VyaWYiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjx0c3BhbiB4PSIwIiBkeT0iMCI+QkVUVEVSPC90c3Bhbj48dHNwYW4geD0iMCIgZHk9IjQ2LjE1cHgiPlBPUFVQPC90c3Bhbj48L3RleHQ+PC9nPjwvZz48L3N2Zz4=";

    // 弹窗样式
    const STYLES = `
        .better-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.2s ease;
        }
        
        .better-popup {
            background: white;
            border-radius: 16px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        }
        
        .better-popup-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 12px;
            color: #333;
        }
        
        .better-popup-content {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        
        .better-popup-input {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 16px;
            box-sizing: border-box;
        }
        
        .better-popup-textarea {
            resize: vertical;
            min-height: 80px;
            font-family: inherit;
        }
        
        .better-popup-input:focus {
            outline: none;
            border-color: #4c97ff;
        }
        
        .better-popup-buttons {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        
        .better-popup-btn {
            padding: 10px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .better-popup-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .better-popup-btn-primary {
            background: #4c97ff;
            color: white;
        }
        
        .better-popup-btn-secondary {
            background: #e0e0e0;
            color: #333;
        }
        
        .better-popup-btn-danger {
            background: #ff6b6b;
            color: white;
        }
        
        .better-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        }
        
        .better-toast-icon {
            display: inline-block;
            margin-right: 8px;
            font-size: 20px;
        }
        
        .better-toast-success { border-left: 4px solid #51cf66; }
        .better-toast-error { border-left: 4px solid #ff6b6b; }
        .better-toast-warning { border-left: 4px solid #ffd43b; }
        .better-toast-info { border-left: 4px solid #4c97ff; }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        /* 弹窗动画 */
        .better-popup-fade {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        .better-popup-slide {
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .better-popup-bounce {
            animation: bounceIn 0.5s ease;
        }
        
        @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.3); }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
        }
        
        .better-popup-zoom {
            animation: zoomIn 0.3s ease;
        }
        
        @keyframes zoomIn {
            from { opacity: 0; transform: scale(0); }
            to { opacity: 1; transform: scale(1); }
        }
    `;

    // 注入样式
    if (!document.getElementById('better-popup-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'better-popup-styles';
        styleElement.textContent = STYLES;
        document.head.appendChild(styleElement);
    }

    // 当前活动的弹窗
    let activePopup = null;
    let popupResolve = null;
    let _lastResult = false;
    let _lastInputValue = '';
    let _lastOptionsResult = '';
    
    // 自定义面板构建器状态
    let _customPanel = null;
    let _lastPanelResult = {};
    
    // 文件导入状态
    let _lastFileImportResult = {};
    let _lastFileContent = '';
    
    // 进度条状态
    let _progressPopup = null;
    let _currentProgress = 0;
    let _progressCancelCallback = null;
    
    // 上传文件状态
    let _lastUploadedFile = null;
    
    // 舞台菜单状态
    let _stageMenuOverlay = null;
    let _stageMenuResult = '';
    
    // 动画设置
    let _popupAnimation = 'fade';
    
    // 效果函数和按钮绑定状态
    let _buttonBindings = {};
    let _eventTriggers = [];
    
    // 按钮→广播映射: {buttonValue: broadcastName}
    let _buttonBroadcasts = {};
    
    // 保存runtime引用
    let _savedRuntime = null;

    // 翻译系统
    if (Scratch.translate && Scratch.translate.setup) {
        Scratch.translate.setup({
            zh: {
                'extensionName': 'BETTER弹窗',   
                'popup.normal': '💬 普通',
                'popup.success': '✓ 成功',
                'popup.error': '✗ 错误',
                'popup.warning': '⚠ 警告',
                'popup.info': 'ℹ 信息',
                'input.text': '📝 单行文本',
                'input.textarea': '📄 多行文本',
                'input.password': '🔒 密码',
                'input.url': '🔗 链接',
                'input.email': '📧 邮箱',
                'input.time': '⏰ 时间',
                'input.address': '📍 地址',
                'format.html': 'HTML',
                'format.bbcode': 'BBCode',
                'format.markdown': 'Markdown',
                'format.text': '纯文本',
                'toast.success': '✓ 成功',
                'toast.error': '✗ 错误',
                'toast.warning': '⚠ 警告',
                'toast.info': 'ℹ 信息',
                'block.showAlert': '显示弹窗 [TYPE] 标题[TITLE] 内容[CONTENT] 并 [WAIT]',
                'block.showAlertAutoClose': '显示弹窗 [TYPE] 标题[TITLE] 内容[CONTENT] [TIME]秒后关闭',
                'block.showConfirm': '显示确认弹窗 [TYPE] 标题[TITLE] 内容[CONTENT] 并 [WAIT]',
                'block.getConfirmResult': '获取最后的确认结果',
                'block.showInput': '显示输入弹窗 [INPUTTYPE] 标题[TITLE] 提示[PLACEHOLDER] 并 [WAIT]',
                'block.getInputResult': '获取最后的输入结果',
                'block.showInputAndWait': '获取输入弹窗 [INPUTTYPE] 标题[TITLE] 提示[PLACEHOLDER] 并返回',
                'block.showConfirmAndWait': '获取确认弹窗 [TYPE] 标题[TITLE] 内容[CONTENT] 并返回',
                'block.setPopupStyle': '设置面板属性 [CSS] 应用于 [TYPE] 类型的弹窗',
                'block.clearAllStyles': '删除所有自定义CSS',
                'block.sanitizeContent': '⚙️ 过滤 [TYPE] [CONTENT] 的危险字符',
                'block.showToast': '显示Toast [TYPE] 内容[CONTENT] [TIME]秒后关闭',
                'block.showCustomHTML': '显示自定义内容 [FORMAT] 内容[CONTENT] 并 [WAIT]',
                'block.closePopup': '关闭当前弹窗',
                'validation.url': '请输入有效的URL地址（例如：https://example.com）',
                'validation.email': '请输入有效的邮箱地址（例如：user@example.com）',
                'validation.time': '请选择日期和时间',
                'style.type.all': '所有弹窗',
                'style.type.confirm': '确认弹窗',
                'style.type.input': '输入弹窗',
                'style.custom': '自定义',
                'style.warning': '⚠ 已屏蔽不安全的CSS属性',
                'sanitize.html': 'HTML',
                'sanitize.bbcode': 'BBCode',
                'sanitize.markdown': 'Markdown',
                'sanitize.css': 'CSS',
                'sanitize.success': '✅ 已过滤危险字符',
                'section.popup': '📦 弹窗',
                'section.custom': '🎨 自定义',
                'section.tool': '🔧 工具',
                'block.setPopupColor': '设置弹窗 [TYPE] 颜色为 [COLOR]',
                'block.generateGradient': '⚙️ 生成 [DIRECTION] 的渐变色 [COLOR1] [COLOR2]',
                
                // 用户行为追踪
                'block.enableTracking': '开启行为追踪 [MODE]',
                'block.getButtonClickCount': '获取按钮 [BUTTON] 的点击次数',
                'block.getInputLength': '获取输入框 [INPUT_ID] 的输入长度',
                'block.getPopupDisplayTime': '获取弹窗已显示的时间(秒)',
                'block.getTrackingData': '获取追踪数据 [FORMAT]',
                'block.clearTrackingData': '清空追踪数据',
                'block.getLastAction': '获取最后一次用户操作',
                'block.getActionsByType': '获取所有 [ACTION_TYPE] 操作',
                'block.showOptions': '显示选项弹窗 [MODE] 标题[TITLE] 选项[OPTIONS] 并 [WAIT]',
                'block.showOptionsAndWait': '获取选项弹窗 [MODE] 标题[TITLE] 选项[OPTIONS] 并返回',
                'block.getOptionsResult': '获取最后的选项结果',
                'block.addColorPicker': '添加颜色选取 ID [ID] 默认颜色 [COLOR]',
                'block.addCheckbox': '添加勾选框 ID [ID] 默认勾选 [DEFAULT]',
                'block.addSlider': '添加滑杆 ID [ID] 默认 [DEFAULT] 最小 [MIN] 最大 [MAX] 模式 [MODE]',
                'tooltip.addColorPicker': '添加一个颜色选取元素到自定义面板，返回颜色值',
                'tooltip.addCheckbox': '添加一个勾选框元素到自定义面板，返回布尔值（true/false）',
                'tooltip.addSlider': '添加一个滑杆输入元素到自定义面板，可设置默认值、最小值、最大值和交互模式',
                'block.addCoordinatePicker': '增加坐标选取元素 ID [ID] 宽[WIDTH] 高[HEIGHT]',
                'block.addTrajectoryDrawer': '增加轨迹绘制元素 ID [ID] 宽[WIDTH] 高[HEIGHT]',
                'tooltip.addCoordinatePicker': '添加一个坐标选取元素到自定义面板，点击选取位置，返回[x,y]数组',
                'tooltip.addTrajectoryDrawer': '添加一个轨迹绘制元素到自定义面板，拖拽绘制轨迹，返回位置数组',
                'panel.coordinatePickerAdded': '坐标选取已添加',
                'panel.trajectoryDrawerAdded': '轨迹绘制已添加',
                'block.addCustomHTML': '增加自定义元素 ID [ID] 内容[HTML]',
                'tooltip.addCustomHTML': '添加自定义HTML元素到面板，可通过ID收集input/textarea/select的值',
                'slider.mode.both': '可以输入或滑杆',
                'slider.mode.slider': '只能使用滑杆',
                'panel.colorPickerAdded': '颜色选取已添加',
                'panel.checkboxAdded': '勾选框已添加',
                'panel.sliderAdded': '滑杆已添加',
                'options.mode.dropdown': '下拉菜单',
                'options.mode.radio': '直接展示(单选)',
                'options.mode.checkbox': '直接展示(多选)',
                'options.selected': '已选择',
                'gradient.top': '由上往下',
                'gradient.left': '由左往右',
                'gradient.center': '由里往外',
                'btn.confirm': '确定',
                'btn.cancel': '取消',
                'btn.ok': '确认',
                'wait.yes': '等待',
                'wait.no': '不等待',
                'placeholder.url': 'https://example.com',
                'placeholder.email': 'user@example.com',
                'placeholder.time': '',
                'placeholder.address': '请输入地址...',
                'placeholder.text': '在这里输入...',
                'placeholder.password': '请输入密码...',
                'default.title.alert': '提示',
                'default.content.alert': '这是一个提示',
                'default.title.confirm': '确认',
                'default.content.confirm': '你确定要继续吗？',
                'default.title.input': '请输入',
                'default.content.custom': '[b]粗体[/b] [i]斜体[/i] [color=red]红色[/color]',
                'default.content.toast': '操作成功！',
                'block.getCss': '获取当前[TYPE]的CSS',

                // 菜单翻译
                'menu.trackingMode.all': '全部追踪',
                'menu.trackingMode.button': '只追踪按钮',
                'menu.trackingMode.input': '只追踪输入',
                'menu.trackingMode.time': '只追踪时间',
                'menu.trackingFormat.json': 'JSON格式',
                'menu.trackingFormat.simple': '简化格式',
                'menu.trackingFormat.csv': 'CSV格式',
                'menu.actionType.button': '按钮点击',
                'menu.actionType.input': '输入操作',
                'menu.actionType.popup': '弹窗操作',
                'menu.actionType.all': '全部类型',

                // tooltip
                'tooltip.showAlert': '显示一个弹窗，可选择类型、标题和内容',
                'tooltip.showAlertAutoClose': '显示一个弹窗，指定时间后自动关闭',
                'tooltip.showConfirm': '显示一个确认弹窗，用户可以选择确定或取消',
                'tooltip.getConfirmResult': '获取最后一个确认弹窗的结果（确定=true，取消=false）',
                'tooltip.showInput': '显示一个输入弹窗，用户可以输入文本',
                'tooltip.getInputResult': '获取最后一个输入弹窗的内容',
                'tooltip.showInputAndWait': '显示输入弹窗并等待，直接返回用户输入的内容',
                'tooltip.showConfirmAndWait': '显示确认弹窗并等待，直接返回用户的选择（确定=true，取消=false）',
                'tooltip.setPopupStyle': '设置弹窗的CSS样式，可针对不同类型弹窗设置不同样式',
                'tooltip.clearAllStyles': '删除所有已设置的自定义CSS样式',
                'tooltip.sanitizeContent': '过滤HTML、BBCode、Markdown或CSS中的危险字符，防止XSS攻击',
                'tooltip.showToast': '显示一个Toast通知，支持成功、错误、警告、信息四种类型',
                'tooltip.showCustomHTML': '显示自定义格式的内容，支持HTML、BBCode、Markdown和纯文本',
                'tooltip.closePopup': '关闭当前正在显示的弹窗',
                'tooltip.setPopupColor': '设置弹窗的背景颜色，支持纯色和渐变色',
                'tooltip.generateGradient': '生成CSS渐变色代码，支持三种方向：由上往下、由左往右、由里往外',
                'tooltip.showOptions': '显示选项弹窗，支持下拉菜单、单选和多选三种模式',
                'tooltip.showOptionsAndWait': '显示选项弹窗并等待，直接返回用户选择的选项',
                'tooltip.getOptionsResult': '获取最后一个选项弹窗的选择结果（多选返回JSON数组）',
                'tooltip.showProgress': '显示一个进度条弹窗，可动态更新进度',
                'tooltip.updateProgress': '更新进度条的进度百分比和消息',
                'tooltip.closeProgress': '关闭当前显示的进度条弹窗',
                'tooltip.showFileImport': '显示文件导入弹窗，支持拖拽和点击上传',
                'tooltip.getFileImportResult': '显示文件导入弹窗并返回文件内容',
                'tooltip.getLastFileContent': '获取最后一次导入的文件内容',
                'tooltip.setPopupAnimation': '设置所有弹窗的动画效果',
                'tooltip.downloadFile': '下载文件到本地，支持任意文件类型',
                'tooltip.uploadAndRead': '选择并上传文件，可读取为文本、Base64或Blob URL',
                'tooltip.showStageMenu': '在舞台指定坐标显示菜单，支持嵌套子菜单，返回点击路径',
                'tooltip.createPanel': '创建一个自定义面板，可添加各种元素',
                'tooltip.addButton': '向自定义面板添加按钮',
                'tooltip.addInput': '向自定义面板添加输入框',
                'tooltip.addText': '向自定义面板添加文本',
                'tooltip.addImage': '向自定义面板添加图片',
                'tooltip.addFileImport': '向自定义面板添加文件导入元素',
                'tooltip.addOptions': '向自定义面板添加选项组',
                'tooltip.showPanel': '显示自定义面板，可等待用户操作',
                'tooltip.getPanelResult': '获取自定义面板的操作结果（JSON格式）',
                'tooltip.bindButton': '绑定按钮点击事件到自定义事件',
                'tooltip.startEvent': '触发执行一个自定义事件',
                'tooltip.whenEventStarts': '当自定义事件被触发时执行',
                'tooltip.debugPanel': '获取当前面板的调试信息',
                'block.createPanel': '创建自定义面板 标题[TITLE]',
                'block.addButton': '添加按钮 [LABEL] 值[VALUE] 颜色[COLOR]',
                'block.addInput': '添加输入框 ID[ID] 类型[TYPE] 提示[PLACEHOLDER]',
                'block.addOptions': '添加选项组 ID[ID] [MODE] 选项[OPTIONS] 默认[DEFAULT]',
                'block.showPanel': '显示自定义面板 标题[TITLE] 并 [WAIT]',
                'block.getPanelResult': '获取面板结果',
                'tooltip.getCss': '获取当前指定类型弹窗的CSS样式',
                'panel.inputType.text': '单行文本',
                'panel.inputType.number': '数字',
                'panel.inputType.password': '密码',
                'panel.inputType.email': '邮箱',
                'panel.inputType.url': '链接',
                'panel.inputType.textarea': '多行文本',
                'panel.optionsMode.radio': '单选',
                'panel.optionsMode.checkbox': '多选',
                'panel.result.button': '按钮',
                'panel.result.input': '输入',
                'panel.result.options': '选项',
                'panel.created': '面板已创建',
                'panel.buttonAdded': '按钮已添加',
                'panel.inputAdded': '输入框已添加',
                'panel.imageAdded': '图片已添加',
                'panel.fileImportAdded': '文件导入元素已添加',
                'fileImport.mode.both': '拖拽或点击上传',
                'fileImport.mode.drop': '拖拽',
                'fileImport.mode.click': '点击上传',
                'fileImport.dropHere': '拖拽文件到这里',
                'fileImport.clickToUpload': '点击上传文件',
                'fileImport.dropOrClick': '拖拽或点击上传文件',
                'panel.optionsAdded': '选项组已添加',
                'progress.creating': '创建中...',
                'progress.complete': '完成',
                'animation.fade': '淡入淡出',
                'animation.slide': '滑入滑出',
                'animation.bounce': '弹跳效果',
                'animation.zoom': '缩放效果',
                'animation.none': '无动画',
                'download.start': '开始下载',
                'download.complete': '下载完成',
                'upload.title': '选择文件上传',
                'upload.select': '选择文件',
                'upload.cancel': '取消',
                'progress.cancel': '取消',
                'stageMenu.showing': '显示菜单...',
                'stageMenu.invalid': '无效的菜单数据',
                'stageMenu.path': '菜单路径',
                'theme.light': '亮色主题',
                'theme.dark': '暗色主题',



                'block.bindButton': '绑定按钮 [BUTTON] 事件 [EVENT]',
                'block.startEvent': '启动事件 [EVENT]',
                'block.whenEventStarts': '当事件 [EVENT] 启动时',
                'block.debugPanel': '⚙️ 调试面板状态',
                'block.addText': '添加文本 [TEXT]',
                'block.addImage': '添加图片 ID[ID] [IMAGE]',
                'block.addFileImport': '添加文件导入元素 ID[ID] 类型[MODE]',
                'block.showFileImport': '显示文件导入弹窗 类型[MODE] 并 [WAIT]',
                'block.getFileImportResult': '显示文件导入并返回内容 类型[MODE] 并 [WAIT]',
                'block.getLastFileContent': '获取最后导入的文件内容',
                'block.showProgress': '显示进度条弹窗 标题[TITLE] 进度[PROGRESS] 消息[MESSAGE]',
                'block.updateProgress': '更新进度条 进度[PROGRESS] 消息[MESSAGE]',
                'block.closeProgress': '关闭进度条',
                'block.setPopupAnimation': '设置弹窗动画 [ANIMATION]',
                'block.pythonPopup': '用Python代码 [CODE] 生成弹窗并返回',
                'tooltip.pythonPopup': '解析Python代码中的print/input/select等语句生成弹窗，返回用户输入结果(JSON)',
                'block.popupFilePopup': '用Popup代码 [CODE] 生成弹窗并返回',
                'tooltip.popupFilePopup': '解析类HTML标签生成弹窗，返回用户输入结果(JSON)',
                'block.downloadFile': '下载文件 文件名[FILENAME] 内容[CONTENT] 类型[TYPE]',
                'block.uploadAndRead': '上传类型 [EXT] 的文件并读取为 [FORMAT]',
                'block.showStageMenu': '显示菜单在舞台的 x:[X] y:[Y], 内容为 [ITEMS] 并返回',
                'block.bindBroadcast': '绑定按钮 [BUTTON] 广播 [BROADCAST_OPTION]',
                'effect.action.close': '关闭弹窗',
                'effect.action.delete': '删除属性',
                'effect.action.run': '运行函数',
                'popupEvent.open': '开启时',
                'popupEvent.close': '关闭时',
                'broadcast.bound': '广播已绑定',
                'broadcast.triggered': '触发广播',
                'panel.effectDefined': '效果函数已定义',
                'panel.buttonBound': '按钮已绑定',
                'panel.buttonClicked': '按钮被点击',
                'block.docsButton': '📖 打开文档',
                'block.showCodeEditor': '显示代码编辑器 ID [ID] 标题 [TITLE] 语言 [LANGUAGE] 代码 [CODE]',
                'block.hideCodeEditor': '隐藏代码编辑器 [ID]',
                'block.minimizeCodeEditor': '最小化代码编辑器 [ID]',
                'block.maximizeCodeEditor': '最大化代码编辑器 [ID]',
                'block.restoreCodeEditor': '恢复代码编辑器 [ID]',
                'block.getEditorText': '获取代码编辑器 [ID] 的内容',
                'block.setEditorText': '设置代码编辑器 [ID] 的内容为 [TEXT]',
                'block.isCodeEditorVisible': '代码编辑器 [ID] 显示中?',
                'block.styleEditor': '样式编辑器',
                'block.pythonSyntax': 'Python语法',
                'block.popupSyntax': 'Popup语法',
                'default.progress.title': '进度',
                'default.progress.content': '处理中...',
                'default.options.placeholder': '请选择',
                'default.codeEditor.title': '我的代码',
                'default.codeEditor.code': '// 在这里输入代码',
                'default.button.text': '确定',
                'default.input.placeholder': '请输入...',
                'fileFormat.utf8': 'UTF-8 文本'
            },
            en: {
                'extensionName': 'Better Popup',   
                'popup.normal': '💬 Normal',
                'popup.success': '✓ Success',
                'popup.error': '✗ Error',
                'popup.warning': '⚠ Warning',
                'popup.info': 'ℹ Info',
                'input.text': '📝 Single Line',
                'input.textarea': '📄 Multi Line',
                'input.password': '🔒 Password',
                'input.url': '🔗 URL',
                'input.email': '📧 Email',
                'input.time': '⏰ Time',
                'input.address': '📍 Address',
                'format.html': 'HTML',
                'format.bbcode': 'BBCode',
                'format.markdown': 'Markdown',
                'format.text': 'Plain Text',
                'toast.success': '✓ Success',
                'toast.error': '✗ Error',
                'toast.warning': '⚠ Warning',
                'toast.info': 'ℹ Info',
                'block.showAlert': 'Show Popup [TYPE] Title[TITLE] Content[CONTENT] And [WAIT]',
                'block.showAlertAutoClose': 'Show Popup [TYPE] Title[TITLE] Content[CONTENT] Close after [TIME]s',
                'block.showConfirm': 'Show Confirm [TYPE] Title[TITLE] Content[CONTENT] And [WAIT]',
                'block.getConfirmResult': 'Get The Last Confirm Result',
                'block.showInput': 'Show Input [INPUTTYPE] Title[TITLE] Hint[PLACEHOLDER] And [WAIT]',
                'block.getInputResult': 'Get The Last Input Result',
                'block.showInputAndWait': 'Get Input From [INPUTTYPE] Title[TITLE] Hint[PLACEHOLDER] And Return',
                'block.showConfirmAndWait': 'Get Confirm From [TYPE] Title[TITLE] Content[CONTENT] And Return',
                'block.setPopupStyle': 'Set Panel Style [CSS] Apply To [TYPE] Popup',
                'block.clearAllStyles': 'Clear All Custom CSS',
                'block.sanitizeContent': '⚙️ Sanitize [TYPE] [CONTENT] Dangerous Characters',
                'block.showToast': 'Show Toast [TYPE] Content[CONTENT] Close after [TIME]s',
                'block.showCustomHTML': 'Show Custom [FORMAT] Content[CONTENT] And [WAIT]',
                'block.closePopup': 'Close Current Popup',
                'validation.url': 'Please enter a valid URL (e.g., https://example.com)',
                'validation.email': 'Please enter a valid email (e.g., user@example.com)',
                'validation.time': 'Please select date and time',
                'style.type.all': 'All Popups',
                'style.type.confirm': 'Confirm Popup',
                'style.type.input': 'Input Popup',
                'style.custom': 'Custom',
                'style.warning': '⚠ Blocked unsafe CSS properties',
                'sanitize.html': 'HTML',
                'sanitize.bbcode': 'BBCode',
                'sanitize.markdown': 'Markdown',
                'sanitize.css': 'CSS',
                'sanitize.success': '✅ Dangerous characters filtered',
                'section.popup': '📦 Popup',
                'section.custom': '🎨 Custom',
                'section.tool': '🔧 Tool',
                'block.setPopupColor': 'Set Popup [TYPE] Color To [COLOR]',
                'block.generateGradient': '⚙️ Generate [DIRECTION] Gradient [COLOR1] [COLOR2]',
                
                // User Behavior Tracking
                'block.enableTracking': 'Enable Behavior Tracking [MODE]',
                'block.getButtonClickCount': 'Get Button [BUTTON] Click Count',
                'block.getInputLength': 'Get Input [INPUT_ID] Length',
                'block.getPopupDisplayTime': 'Get Popup Display Time(seconds)',
                'block.getTrackingData': 'Get Tracking Data [FORMAT]',
                'block.clearTrackingData': 'Clear Tracking Data',
                'block.getLastAction': 'Get Last User Action',
                'block.getActionsByType': 'Get All [ACTION_TYPE] Actions',
                'block.showOptions': 'Show Options Popup [MODE] Title[TITLE] Options[OPTIONS] And [WAIT]',
                'block.showOptionsAndWait': 'Get Options From [MODE] Title[TITLE] Options[OPTIONS] And Return',
                'block.getOptionsResult': 'Get The Last Options Result',
                'block.addColorPicker': 'Add Color Picker ID [ID] Default Color [COLOR]',
                'block.addCheckbox': 'Add Checkbox ID [ID] Default Checked [DEFAULT]',
                'block.addSlider': 'Add Slider ID [ID] Default [DEFAULT] Min [MIN] Max [MAX] Mode [MODE]',
                'tooltip.addColorPicker': 'Add a color picker to custom panel',
                'tooltip.addCheckbox': 'Add a checkbox to custom panel, returns boolean',
                'tooltip.addSlider': 'Add a slider to custom panel with range and mode',
                'block.addCoordinatePicker': 'add coordinate picker ID [ID] width [WIDTH] height [HEIGHT]',
                'block.addTrajectoryDrawer': 'add trajectory drawer ID [ID] width [WIDTH] height [HEIGHT]',
                'tooltip.addCoordinatePicker': 'Add a coordinate picker to custom panel, click to pick position, returns [x,y] array',
                'tooltip.addTrajectoryDrawer': 'Add a trajectory drawer to custom panel, drag to draw path, returns position array',
                'panel.coordinatePickerAdded': 'Coordinate picker added',
                'panel.trajectoryDrawerAdded': 'Trajectory drawer added',
                'block.addCustomHTML': 'add custom element ID [ID] content [HTML]',
                'tooltip.addCustomHTML': 'Add custom HTML element to panel, collects value of input/textarea/select by ID',
                'slider.mode.both': 'Input or Slider',
                'slider.mode.slider': 'Slider Only',
                'panel.colorPickerAdded': 'Color picker added',
                'panel.checkboxAdded': 'Checkbox added',
                'panel.sliderAdded': 'Slider added',
                'options.mode.dropdown': 'Dropdown',
                'options.mode.radio': 'Radio (Single)',
                'options.mode.checkbox': 'Checkbox (Multiple)',
                'options.selected': 'Selected',
                'gradient.top': 'Top to Bottom',
                'gradient.left': 'Left to Right',
                'gradient.center': 'Center to Outside',
                'btn.confirm': 'OK',
                'btn.cancel': 'Cancel',
                'btn.ok': 'Confirm',
                'wait.yes': 'Wait',
                'wait.no': "Don't wait",
                'placeholder.url': 'https://example.com',
                'placeholder.email': 'user@example.com',
                'placeholder.time': '',
                'placeholder.address': 'Enter address...',
                'placeholder.text': 'Enter here...',
                'placeholder.password': 'Enter password...',
                'default.title.alert': 'Alert',
                'default.content.alert': 'This is an alert',
                'default.title.confirm': 'Confirm',
                'default.content.confirm': 'Are you sure you want to continue?',
                'default.title.input': 'Please Input',
                'default.content.custom': '[b]Bold[/b] [i]Italic[/i] [color=red]Red[/color]',
                'default.content.toast': 'Operation successful!',
                'block.getCss': 'Get the CSS of [TYPE]',
                
                // Menu Translations
                'menu.trackingMode.all': 'Track All',
                'menu.trackingMode.button': 'Track Buttons Only',
                'menu.trackingMode.input': 'Track Inputs Only',
                'menu.trackingMode.time': 'Track Time Only',
                'menu.trackingFormat.json': 'JSON Format',
                'menu.trackingFormat.simple': 'Simple Format',
                'menu.trackingFormat.csv': 'CSV Format',
                'menu.actionType.button': 'Button Click',
                'menu.actionType.input': 'Input Operation',
                'menu.actionType.popup': 'Popup Operation',
                'menu.actionType.all': 'All Types',
                
                // tooltip
                'tooltip.showAlert': 'Show a popup with customizable type, title and content',
                'tooltip.showAlertAutoClose': 'Show a popup that automatically closes after specified time',
                'tooltip.showConfirm': 'Show a confirm popup where user can choose OK or Cancel',
                'tooltip.getConfirmResult': 'Get the result of the last confirm popup (OK=true, Cancel=false)',
                'tooltip.showInput': 'Show an input popup where user can enter text',
                'tooltip.getInputResult': 'Get the content from the last input popup',
                'tooltip.showInputAndWait': 'Show input popup and wait, directly return user input',
                'tooltip.showConfirmAndWait': 'Show confirm popup and wait, directly return user choice (OK=true, Cancel=false)',
                'tooltip.setPopupStyle': 'Set CSS styles for popups, can set different styles for different popup types',
                'tooltip.clearAllStyles': 'Clear all custom CSS styles that have been set',
                'tooltip.sanitizeContent': 'Filter dangerous characters in HTML, BBCode, Markdown or CSS to prevent XSS attacks',
                'tooltip.showToast': 'Show a Toast notification, supports success, error, warning, and info types',
                'tooltip.showCustomHTML': 'Display custom formatted content, supports HTML, BBCode, Markdown and plain text',
                'tooltip.closePopup': 'Close the currently displayed popup',
                'tooltip.setPopupColor': 'Set popup background color, supports solid colors and gradients',
                'tooltip.generateGradient': 'Generate CSS gradient code, supports three directions: top to bottom, left to right, center to outside',
                'tooltip.showOptions': 'Show options popup, supports dropdown, radio and checkbox modes',
                'tooltip.showOptionsAndWait': 'Show options popup and wait, directly return user selected options',
                'tooltip.getOptionsResult': 'Get the result of the last options popup (checkbox returns JSON array)',
                'tooltip.showProgress': 'Show a progress bar popup that can be dynamically updated',
                'tooltip.updateProgress': 'Update the progress percentage and message of the progress bar',
                'tooltip.closeProgress': 'Close the currently displayed progress bar popup',
                'tooltip.showFileImport': 'Show file import popup with drag & drop and click upload',
                'tooltip.getFileImportResult': 'Show file import popup and return file content',
                'tooltip.getLastFileContent': 'Get the content of the last imported file',
                'tooltip.setPopupAnimation': 'Set animation effect for all popups',
                'tooltip.downloadFile': 'Download file to local, supports any file type',
                'tooltip.uploadAndRead': 'Select and upload file, can read as text, Base64 or Blob URL',
                'tooltip.showStageMenu': 'Show menu at stage coordinates, supports nested submenus, returns click path',
                'tooltip.createPanel': 'Create a custom panel that can add various elements',
                'tooltip.addButton': 'Add a button to the custom panel',
                'tooltip.addInput': 'Add an input field to the custom panel',
                'tooltip.addText': 'Add text to the custom panel',
                'tooltip.addImage': 'Add an image to the custom panel',
                'tooltip.addFileImport': 'Add a file import element to the custom panel',
                'tooltip.addOptions': 'Add an options group to the custom panel',
                'tooltip.showPanel': 'Show the custom panel, can wait for user action',
                'tooltip.getPanelResult': 'Get the custom panel result (JSON format)',
                'tooltip.bindButton': 'Bind button click event to custom event',
                'tooltip.startEvent': 'Trigger and execute a custom event',
                'tooltip.whenEventStarts': 'When custom event is triggered, execute',
                'tooltip.debugPanel': 'Get debug information of the current panel',
                'tooltip.getCss': 'Get the CSS style of the popup',
                'block.createPanel': 'Create Custom Panel Title[TITLE]',
                'block.addButton': 'Add Button [LABEL] Value[VALUE] Color[COLOR]',
                'block.addInput': 'Add Input Type[TYPE] Placeholder[PLACEHOLDER]',
                'block.addOptions': 'Add Options Group [MODE] Options[OPTIONS] Default[DEFAULT]',
                'block.showPanel': 'Show Custom Panel Title[TITLE] And [WAIT]',
                'block.getPanelResult': 'Get Panel Result',
                'panel.inputType.text': 'Single Line',
                'panel.inputType.number': 'Number',
                'panel.inputType.password': 'Password',
                'panel.inputType.email': 'Email',
                'panel.inputType.url': 'URL',
                'panel.inputType.textarea': 'Multi Line',
                'panel.optionsMode.radio': 'Radio',
                'panel.optionsMode.checkbox': 'Checkbox',
                'panel.result.button': 'Button',
                'panel.result.input': 'Input',
                'panel.result.options': 'Options',
                'panel.created': 'Panel created',
                'panel.buttonAdded': 'Button added',
                'panel.inputAdded': 'Input added',
                'panel.imageAdded': 'Image added',
                'panel.fileImportAdded': 'File import element added',
                'fileImport.mode.both': 'Drop or Click',
                'fileImport.mode.drop': 'Drop',
                'fileImport.mode.click': 'Click to Upload',
                'fileImport.dropHere': 'Drop files here',
                'fileImport.clickToUpload': 'Click to upload files',
                'fileImport.dropOrClick': 'Drop or click to upload files',
                'panel.optionsAdded': 'Options added',
                'progress.creating': 'Creating...',
                'progress.complete': 'Complete',
                'animation.fade': 'Fade',
                'animation.slide': 'Slide',
                'animation.bounce': 'Bounce',
                'animation.zoom': 'Zoom',
                'animation.none': 'None',
                'download.start': 'Start Download',
                'download.complete': 'Download Complete',
                'upload.title': 'Select File to Upload',
                'upload.select': 'Select File',
                'upload.cancel': 'Cancel',
                'progress.cancel': 'Cancel',
                'stageMenu.showing': 'Showing Menu...',
                'stageMenu.invalid': 'Invalid menu data',
                'stageMenu.path': 'Menu Path',
                'theme.light': 'Light Theme',
                'theme.dark': 'Dark Theme',



                'block.bindButton': 'Bind Button [BUTTON] Event [EVENT]',
                'block.startEvent': 'Start Event [EVENT]',
                'block.whenEventStarts': 'When Event [EVENT] Starts',
                'block.debugPanel': '⚙️ Debug Panel Status',
                'block.addText': 'Add Text [TEXT]',
                'block.addImage': 'Add Image ID[ID] [IMAGE]',
                'block.addFileImport': 'Add File Import Element ID[ID] Type[MODE]',
                'block.showFileImport': 'Show File Import Popup Type[MODE] And [WAIT]',
                'block.getFileImportResult': 'Show File Import And Return Content Type[MODE] And [WAIT]',
                'block.getLastFileContent': 'Get Last Imported File Content',
                'block.showProgress': 'Show Progress Bar Title[TITLE] Progress[PROGRESS] Message[MESSAGE]',
                'block.updateProgress': 'Update Progress Bar Progress[PROGRESS] Message[MESSAGE]',
                'block.closeProgress': 'Close Progress Bar',
                'block.setPopupAnimation': 'Set Popup Animation [ANIMATION]',
                'block.pythonPopup': 'generate popup from Python code [CODE] and return',
                'tooltip.pythonPopup': 'Parse print/input/select statements in Python code to generate popup, return user input as JSON',
                'block.popupFilePopup': 'generate popup from Popup code [CODE] and return',
                'tooltip.popupFilePopup': 'Parse HTML-like tags to generate popup, return user input as JSON',
                'block.downloadFile': 'Download File Filename[FILENAME] Content[CONTENT] Type[TYPE]',
                'block.uploadAndRead': 'Upload File Type [EXT] And Read As [FORMAT]',
                'block.showStageMenu': 'Show Menu At Stage x:[X] y:[Y] Items[ITEMS] And Return',
                'block.bindBroadcast': 'Bind Button [BUTTON] Broadcast [BROADCAST_OPTION]',
                'effect.action.close': 'Close Popup',
                'effect.action.delete': 'Delete Property',
                'effect.action.run': 'Run Function',
                'popupEvent.open': 'On Open',
                'popupEvent.close': 'On Close',
                'broadcast.bound': 'Broadcast bound',
                'broadcast.triggered': 'Trigger broadcast',
                'panel.effectDefined': 'Effect function defined',
                'panel.buttonBound': 'Button bound',
                'panel.buttonClicked': 'Button clicked',
                'block.docsButton': '📖 Open Docs',
                'block.showCodeEditor': 'Show Code Editor ID [ID] Title [TITLE] Language [LANGUAGE] Code [CODE]',
                'block.hideCodeEditor': 'Hide Code Editor [ID]',
                'block.minimizeCodeEditor': 'Minimize Code Editor [ID]',
                'block.maximizeCodeEditor': 'Maximize Code Editor [ID]',
                'block.restoreCodeEditor': 'Restore Code Editor [ID]',
                'block.getEditorText': 'Get Code Editor [ID] Content',
                'block.setEditorText': 'Set Code Editor [ID] Content To [TEXT]',
                'block.isCodeEditorVisible': 'Code Editor [ID] Visible?',
                'block.styleEditor': 'Style Editor',
                'block.pythonSyntax': 'Python Syntax',
                'block.popupSyntax': 'Popup Syntax',
                'default.progress.title': 'Progress',
                'default.progress.content': 'Processing...',
                'default.options.placeholder': 'Please select',
                'default.codeEditor.title': 'My Code',
                'default.codeEditor.code': '// Enter code here',
                'default.button.text': 'OK',
                'default.input.placeholder': 'Please input...',
                'fileFormat.utf8': 'UTF-8 Text'
            }
        });
    }

    // TW平台本地翻译回退数据
    const _translationData = {
        zh: {
            'extensionName': 'BETTER弹窗',
            'block.pythonPopup': '用Python代码 [CODE] 生成弹窗并返回',
            'tooltip.pythonPopup': '解析Python代码中的print/input/select等语句生成弹窗，返回用户输入结果(JSON)',
            'block.popupFilePopup': '用Popup代码 [CODE] 生成弹窗并返回',
            'tooltip.popupFilePopup': '解析类HTML标签生成弹窗，返回用户输入结果(JSON)'
        },
        en: {
            'extensionName': 'Better Popup',
            'block.pythonPopup': 'generate popup from Python code [CODE] and return',
            'tooltip.pythonPopup': 'Parse print/input/select statements in Python code to generate popup, return user input as JSON',
            'block.popupFilePopup': 'generate popup from Popup code [CODE] and return',
            'tooltip.popupFilePopup': 'Parse HTML-like tags to generate popup, return user input as JSON'
        }
    };

    // 翻译函数
    function translate(key) {
        if (Scratch.translate) {
            try {
                const result = Scratch.translate({id: key});
                // 如果TW返回了key本身，说明没有翻译，使用本地回退
                if (result !== key) return result;
            } catch (e) {}
        }
        // TW平台回退：从本地翻译数据中查找
        const lang = (navigator.language || 'zh').toLowerCase().startsWith('zh') ? 'zh' : 'en';
        if (_translationData[lang] && _translationData[lang][key]) {
            return _translationData[lang][key];
        }
        return key;
    }

    // BBCode转HTML
    function parseBBCode(text) {
        return text
            .replace(/\[b\](.*?)\[\/b\]/gi, '<strong>$1</strong>')
            .replace(/\[i\](.*?)\[\/i\]/gi, '<em>$1</em>')
            .replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>')
            .replace(/\[s\](.*?)\[\/s\]/gi, '<s>$1</s>')
            .replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<span style="color:$1">$2</span>')
            .replace(/\[size=(\d+)\](.*?)\[\/size\]/gi, '<span style="font-size:$1px">$2</span>')
            .replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, '<a href="$1" target="_blank">$2</a>')
            .replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" style="max-width:100%" />')
            .replace(/\[code\](.*?)\[\/code\]/gi, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:4px">$1</code>')
            .replace(/\n/g, '<br>');
    }

    // Markdown转HTML（简化版）
    function parseMarkdown(text) {
        return text
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/~~(.*?)~~/g, '<s>$1</s>')
            .replace(/`(.*?)`/g, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:4px">$1</code>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/\n/g, '<br>');
    }

    // 安全HTML过滤
    function sanitizeHTML(html) {
        // 移除危险标签
        const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select'];
        let safe = html;
            
        dangerousTags.forEach(tag => {
            const regex = new RegExp(`<${tag}[^>]*>.*?<\\/${tag}>`, 'gi');
            safe = safe.replace(regex, '');
            const selfCloseRegex = new RegExp(`<${tag}[^>]*\\/?>`, 'gi');
            safe = safe.replace(selfCloseRegex, '');
        });
    
        // 移除危险属性
        const dangerousAttrs = ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'javascript:'];
        dangerousAttrs.forEach(attr => {
            const regex = new RegExp(`${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
            safe = safe.replace(regex, '');
            const regex2 = new RegExp(`${attr}\\s*=\\s*[^\\s>]+`, 'gi');
            safe = safe.replace(regex2, '');
        });
    
        return safe;
    }

    // 自定义HTML元素专用安全过滤（保留表单元素）
    function sanitizeCustomHTML(html) {
        let safe = html;
        // 移除真正危险的标签（保留 input/textarea/select/button/label）
        const dangerousTags = ['script', 'iframe', 'object', 'embed', 'link', 'meta', 'style'];
        dangerousTags.forEach(tag => {
            const regex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
            safe = safe.replace(regex, '');
            const selfCloseRegex = new RegExp(`<${tag}[^>]*\\/?>`, 'gi');
            safe = safe.replace(selfCloseRegex, '');
        });
        // 移除所有 on* 事件属性
        safe = safe.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, '');
        // 移除 javascript: URL
        safe = safe.replace(/javascript\s*:/gi, '');
        // 移除 data: URL（防止通过data URI执行脚本）
        safe = safe.replace(/data\s*:\s*text\/html/gi, '');
        return safe;
    }
    
    // 安全CSS过滤
    function sanitizeCSS(css) {
        // 只屏蔽真正危险的属性，保留常用CSS
        const dangerousPatterns = [
            /behavior\s*:/gi,           // IE behavior
            /expression\s*\(/gi,        // CSS expression
            /-moz-binding\s*:/gi,       // Firefox binding
            /javascript\s*:/gi,         // javascript: 协议
            /vbscript\s*:/gi,           // vbscript: 协议
            /@import/gi,                // @import
        ];
            
        let safe = css;
        let hasBlocked = false;
            
        dangerousPatterns.forEach(pattern => {
            if (pattern.test(safe)) {
                hasBlocked = true;
                safe = safe.replace(pattern, '/* blocked */');
            }
        });
            
        return {
            css: safe,
            hasBlocked: hasBlocked
        };
    }
    
    // 存储自定义样式
    const customStyles = {
        all: '',
        confirm: '',
        input: '',
        custom: ''
    };

    class BetterPopup {
        constructor(runtime) {
            this.runtime = runtime;
            _savedRuntime = runtime; // 保存全局引用
            
            // 初始化代码编辑器
            this.editors = new Map();
            this._currentZIndex = 10000;
            this._createEditorLayer();
            this._addEditorStyles();
            
            // 用户行为追踪（默认开启）
            this.trackingEnabled = true;         // 是否开启追踪
            this.trackingMode = 'all';           // 追踪模式：all/button/input/time
            this.trackingData = {
                buttonClicks: {},                // 按钮点击次数 {buttonName: count}
                inputActions: {},                // 输入操作 {inputId: {length: 0, changes: 0, lastValue: ''}}
                popupOpenTime: null,             // 弹窗打开时间戳
                actions: [],                     // 所有操作记录 [{type, detail, timestamp}]
                lastAction: null                 // 最后一次操作
            };
            console.log('📊 用户行为追踪已默认开启');
        }
        
        // 打开文档
        docs() {
            let a = document.createElement('a');
            a.href = 'https://learn.ccw.site/article/02c5dde6-7abf-4db8-9374-33510a315385';  // TODO: 替换为你的文档链接
            a.rel = 'noopener noreferrer';        
            a.target = '_blank';        
            a.click();
        }

        docs2() {
            let a = document.createElement('a');
            a.href = 'https://tomlct2015.github.io/theTomsBetterPopup/styleEditor/'; 
            a.rel = 'noopener noreferrer';        
            a.target = '_blank';        
            a.click();
        }

        docs3() {
            let a = document.createElement('a');
            a.href = 'https://tomlct2015.github.io/theTomsBetterPopup/how-to-use-Python-file-to-create-popup/'; 
            a.rel = 'noopener noreferrer';        
            a.target = '_blank';        
            a.click();
        }

        docs4() {
            let a = document.createElement('a');
            a.href = 'https://tomlct2015.github.io/theTomsBetterPopup/how-to-use-Popup-file/'; 
            a.rel = 'noopener noreferrer';        
            a.target = '_blank';        
            a.click();
        }

        // ========== 代码编辑器功能 ==========
        
        // 创建编辑器层
        _createEditorLayer() {
            if (document.getElementById('better-popup-editor-layer')) {
                this._editorLayer = document.getElementById('better-popup-editor-layer');
            } else {
                this._editorLayer = document.createElement('div');
                this._editorLayer.id = 'better-popup-editor-layer';
                this._editorLayer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10000;';
                document.body.appendChild(this._editorLayer);
            }
        }

        // 添加编辑器样式
        _addEditorStyles() {
            if (document.getElementById('better-popup-editor-styles')) return;
            const style = document.createElement('style');
            style.id = 'better-popup-editor-styles';
            style.textContent = `
                .bp-editor-window{pointer-events:auto;position:fixed;border-radius:12px;z-index:10000;display:none;flex-direction:column;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:rgba(30,30,30,0.85);backdrop-filter:blur(20px)saturate(180%);border:1px solid rgba(255,255,255,0.1);box-shadow:0 10px 40px rgba(0,0,0,0.4);overflow:hidden;min-width:400px;min-height:300px;resize:both;}
                .bp-editor-window.dragging{transition:none;box-shadow:0 20px 60px rgba(0,0,0,0.6);opacity:0.95;}
                .bp-editor-title-bar{height:40px;display:flex;align-items:center;padding:0 12px;font-weight:500;cursor:grab;user-select:none;justify-content:space-between;background:rgba(40,40,40,0.6);border-bottom:1px solid rgba(255,255,255,0.08);font-size:13px;color:#e0e0e0;}
                .bp-editor-title-bar:active{cursor:grabbing;}
                .bp-editor-controls{display:flex;align-items:center;gap:8px;}
                .bp-editor-control{width:12px;height:12px;border-radius:50%;cursor:pointer;transition:all 0.2s ease;border:none;}
                .bp-editor-control:hover{transform:scale(1.15);}
                .bp-editor-close{background:#ff5f56;}.bp-editor-close:hover{background:#ff3b30;}
                .bp-editor-minimize{background:#ffbd2e;}.bp-editor-minimize:hover{background:#ffa500;}
                .bp-editor-maximize{background:#27c93f;}.bp-editor-maximize:hover{background:#00c300;}
                .bp-editor-content{display:flex;width:100%;height:calc(100% - 64px);position:relative;}
                .bp-editor-content.minimized{display:none;}
                .bp-editor-line-numbers{width:50px;padding:12px 8px;overflow-y:auto;text-align:right;font-family:'Consolas','Monaco','Courier New',monospace;font-size:14px;line-height:1.6;user-select:none;flex-shrink:0;background:rgba(0,0,0,0.2);color:#666;border-right:1px solid rgba(255,255,255,0.05);scrollbar-width:none;}
                .bp-editor-line-numbers::-webkit-scrollbar{display:none;}
                .bp-editor-textarea{flex:1;border:none;padding:12px;resize:none;background:transparent;font-family:'Consolas','Monaco','Courier New',monospace;font-size:14px;line-height:1.6;outline:none;color:#d4d4d4;white-space:pre;overflow:auto;tab-size:4;}
                .bp-editor-textarea::placeholder{color:#666;}
                .bp-editor-language-select{background:rgba(60,60,60,0.8);color:#e0e0e0;border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:4px 8px;font-size:12px;cursor:pointer;outline:none;}
                .bp-editor-status-bar{height:24px;display:flex;align-items:center;padding:0 12px;font-size:11px;color:#888;background:rgba(30,30,30,0.6);border-top:1px solid rgba(255,255,255,0.05);justify-content:space-between;}
                .bp-editor-window.minimized{resize:none;height:40px!important;min-height:40px!important;}
                .bp-editor-window.maximized{resize:none;border-radius:0;border:none;top:0!important;left:0!important;width:100vw!important;height:100vh!important;}
            `;
            document.head.appendChild(style);
        }

        // 创建或获取编辑器
        _getOrCreateEditor(id) {
            if (this.editors.has(id)) return this.editors.get(id);
            const editor = {
                id, container: null, textarea: null, lineNumbers: null, titleElement: null,
                languageSelect: null, statusBar: null, content: null,
                isVisible: false, isMaximized: false, isMinimized: false,
                position: { x: 100, y: 100 }, size: { width: 700, height: 500 },
                originalPosition: null, originalSize: null, language: 'javascript',
                zIndex: this._currentZIndex++
            };
            this._createEditorUI(editor);
            this.editors.set(id, editor);
            return editor;
        }

        // 创建编辑器UI
        _createEditorUI(editor) {
            editor.container = document.createElement('div');
            editor.container.className = 'bp-editor-window';
            editor.container.dataset.editorId = editor.id;
            editor.container.style.cssText = `position:fixed;top:${editor.position.y}px;left:${editor.position.x}px;width:${editor.size.width}px;height:${editor.size.height}px;display:none;z-index:${editor.zIndex};`;

            editor.titleBar = document.createElement('div');
            editor.titleBar.className = 'bp-editor-title-bar';

            const controls = document.createElement('div');
            controls.className = 'bp-editor-controls';
            const controlButtons = [
                { class: 'bp-editor-close', action: () => this.hideCodeEditor({ ID: editor.id }) },
                { class: 'bp-editor-minimize', action: () => this._toggleMinimizeEditor(editor) },
                { class: 'bp-editor-maximize', action: () => this._toggleMaximizeEditor(editor) }
            ];
            controlButtons.forEach(btn => {
                const button = document.createElement('div');
                button.className = `bp-editor-control ${btn.class}`;
                button.onclick = (e) => { e.stopPropagation(); this._bringEditorToFront(editor.id); btn.action(); };
                controls.appendChild(button);
            });

            editor.titleElement = document.createElement('div');
            editor.titleElement.style.cssText = 'flex:1;text-align:center;padding:0 80px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
            editor.titleElement.textContent = `代码编辑器 - ${editor.id}`;

            editor.languageSelect = document.createElement('select');
            editor.languageSelect.className = 'bp-editor-language-select';
            ['javascript','python','html','css','json','xml','markdown','sql','cpp','java'].forEach(lang => {
                const option = document.createElement('option');
                option.value = lang; option.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
                editor.languageSelect.appendChild(option);
            });
            editor.languageSelect.value = editor.language;
            editor.languageSelect.onchange = (e) => { 
                editor.language = e.target.value; 
                this._updateStatusBar(editor);
            };

            editor.titleBar.appendChild(controls);
            editor.titleBar.appendChild(editor.titleElement);
            editor.titleBar.appendChild(editor.languageSelect);

            editor.content = document.createElement('div');
            editor.content.className = 'bp-editor-content';
            editor.lineNumbers = document.createElement('div');
            editor.lineNumbers.className = 'bp-editor-line-numbers';
            editor.textarea = document.createElement('textarea');
            editor.textarea.className = 'bp-editor-textarea';
            editor.textarea.placeholder = '在这里输入代码...';
            editor.textarea.spellcheck = false;
            editor.content.appendChild(editor.lineNumbers);
            editor.content.appendChild(editor.textarea);

            editor.statusBar = document.createElement('div');
            editor.statusBar.className = 'bp-editor-status-bar';
            editor.statusBar.innerHTML = '<span>就绪</span><span>行: 1, 列: 1</span>';

            editor.container.appendChild(editor.titleBar);
            editor.container.appendChild(editor.content);
            editor.container.appendChild(editor.statusBar);

            this._makeEditorDraggable(editor);
            this._setupEditorTextarea(editor);
            this._editorLayer.appendChild(editor.container);
        }

        // 使编辑器可拖动
        _makeEditorDraggable(editor) {
            let isDragging = false, startX, startY, initialX, initialY;
            const startDrag = (e) => {
                if (e.target.classList.contains('bp-editor-control') || e.target.classList.contains('bp-editor-language-select')) return;
                this._bringEditorToFront(editor.id);
                if (editor.isMaximized) {
                    this.restoreCodeEditor({ ID: editor.id });
                    const boundedX = Math.max(10, Math.min(e.clientX - (editor.size.width / 2), window.innerWidth - editor.size.width - 10));
                    const boundedY = Math.max(10, Math.min(e.clientY - 20, window.innerHeight - 100));
                    editor.container.style.left = boundedX + 'px'; editor.container.style.top = boundedY + 'px';
                    editor.position.x = boundedX; editor.position.y = boundedY;
                    startX = e.clientX; startY = e.clientY; initialX = boundedX; initialY = boundedY;
                } else {
                    startX = e.clientX; startY = e.clientY;
                    const rect = editor.container.getBoundingClientRect();
                    initialX = rect.left; initialY = rect.top;
                }
                isDragging = true; editor.container.classList.add('dragging'); editor.container.style.transition = 'none';
                const onDrag = (e) => {
                    if (!isDragging) return;
                    let newX = Math.max(10, Math.min(initialX + e.clientX - startX, window.innerWidth - editor.size.width - 10));
                    let newY = Math.max(10, Math.min(initialY + e.clientY - startY, window.innerHeight - 100));
                    editor.container.style.left = newX + 'px'; editor.container.style.top = newY + 'px';
                    editor.position.x = newX; editor.position.y = newY;
                };
                const stopDrag = () => {
                    isDragging = false; editor.container.classList.remove('dragging'); editor.container.style.transition = '';
                    document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag);
                };
                document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', stopDrag);
            };
            editor.titleBar.addEventListener('mousedown', startDrag);
        }

        // 设置文本区事件
        _setupEditorTextarea(editor) {
            editor.textarea.addEventListener('input', () => { 
                this._updateLineNumbers(editor); 
                this._updateStatusBar(editor);
            });
            editor.textarea.addEventListener('scroll', () => { editor.lineNumbers.scrollTop = editor.textarea.scrollTop; });
            editor.textarea.addEventListener('click', () => this._updateStatusBar(editor));
            editor.textarea.addEventListener('keyup', () => this._updateStatusBar(editor));
            editor.textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = editor.textarea.selectionStart, end = editor.textarea.selectionEnd;
                    editor.textarea.value = editor.textarea.value.substring(0, start) + '    ' + editor.textarea.value.substring(end);
                    editor.textarea.selectionStart = editor.textarea.selectionEnd = start + 4;
                    this._updateLineNumbers(editor);
                }
            });
            this._updateLineNumbers(editor);
        }

        // 更新行号
        _updateLineNumbers(editor) {
            const lines = editor.textarea.value.split('\n');
            editor.lineNumbers.innerHTML = '';
            for (let i = 1; i <= lines.length; i++) {
                const lineNum = document.createElement('div');
                lineNum.textContent = i; editor.lineNumbers.appendChild(lineNum);
            }
            editor.lineNumbers.scrollTop = editor.textarea.scrollTop;
        }

        // 更新状态栏
        _updateStatusBar(editor) {
            const text = editor.textarea.value, pos = editor.textarea.selectionStart;
            const lines = text.substring(0, pos).split('\n');
            const line = lines.length, col = lines[lines.length - 1].length + 1;
            const totalLines = text.split('\n').length;
            editor.statusBar.innerHTML = `<span>${editor.language.toUpperCase()} | ${totalLines} 行</span><span>行: ${line}, 列: ${col}</span>`;
        }

        // 语法高亮（简化版 - 暂时禁用覆盖层方式）
        _updateSyntaxHighlighting(editor) {
            // 暂时不实现复杂高亮，只做基本的语言标识
            // 后续可以集成专业的代码高亮库如Prism.js或highlight.js
            this._updateStatusBar(editor);
        }
        
        // 应用高亮覆盖层
        _applyHighlightOverlay(editor, highlighted) {
            // 创建或获取高亮层
            if (!editor.highlightOverlay) {
                editor.highlightOverlay = document.createElement('div');
                editor.highlightOverlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 50px;
                    right: 0;
                    bottom: 0;
                    padding: 12px;
                    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                    font-size: 14px;
                    line-height: 1.6;
                    white-space: pre;
                    overflow: auto;
                    pointer-events: none;
                    tab-size: 4;
                    z-index: 1;
                `;
                editor.content.insertBefore(editor.highlightOverlay, editor.textarea);
                
                // 让textarea背景透明
                editor.textarea.style.cssText += `
                    position: relative;
                    z-index: 2;
                    background: transparent !important;
                    color: transparent;
                    caret-color: #d4d4d4;
                    -webkit-text-fill-color: transparent;
                `;
            }
            
            // 设置高亮内容
            editor.highlightOverlay.innerHTML = highlighted + '\n';
            
            // 同步滚动
            const syncScroll = () => {
                if (editor.highlightOverlay) {
                    editor.highlightOverlay.scrollTop = editor.textarea.scrollTop;
                    editor.highlightOverlay.scrollLeft = editor.textarea.scrollLeft;
                }
            };
            editor.textarea.addEventListener('scroll', syncScroll);
        }

        // 将编辑器置于顶层
        _bringEditorToFront(editorId) {
            const editor = this.editors.get(editorId);
            if (!editor) return;
            this._currentZIndex++; editor.container.style.zIndex = this._currentZIndex;
        }

        // 切换最小化
        _toggleMinimizeEditor(editor) {
            if (editor.isMinimized) this.restoreCodeEditor({ ID: editor.id });
            else this.minimizeCodeEditor({ ID: editor.id });
        }

        // 切换最大化
        _toggleMaximizeEditor(editor) {
            if (editor.isMaximized) this.restoreCodeEditor({ ID: editor.id });
            else this.maximizeCodeEditor({ ID: editor.id });
        }

        // 显示代码编辑器
        showCodeEditor(args) {
            const id = Scratch.Cast.toString(args.ID || 'editor1');
            const title = Scratch.Cast.toString(args.TITLE || '代码编辑器');
            const language = Scratch.Cast.toString(args.LANGUAGE || 'javascript');
            const code = Scratch.Cast.toString(args.CODE || '');
            const editor = this._getOrCreateEditor(id);
            if (title) editor.titleElement.textContent = title;
            if (language && editor.languageSelect) { editor.language = language; editor.languageSelect.value = language; }
            if (code) { editor.textarea.value = code; this._updateLineNumbers(editor); }
            editor.container.style.display = 'flex'; editor.isVisible = true;
            this._bringEditorToFront(id);
            setTimeout(() => editor.textarea.focus(), 100);
        }

        // 隐藏代码编辑器
        hideCodeEditor(args) {
            const id = Scratch.Cast.toString(args.ID || 'editor1');
            const editor = this.editors.get(id);
            if (editor) { editor.container.style.display = 'none'; editor.isVisible = false; }
        }

        // 最小化代码编辑器
        minimizeCodeEditor(args) {
            const id = Scratch.Cast.toString(args.ID || 'editor1');
            const editor = this.editors.get(id);
            if (editor && !editor.isMinimized) {
                editor.originalSize = { ...editor.size }; editor.originalPosition = { ...editor.position };
                editor.container.classList.add('minimized'); editor.content.classList.add('minimized');
                editor.isMinimized = true; editor.isMaximized = false;
            }
        }

        // 最大化代码编辑器
        maximizeCodeEditor(args) {
            const id = Scratch.Cast.toString(args.ID || 'editor1');
            const editor = this.editors.get(id);
            if (editor && !editor.isMaximized) {
                editor.originalPosition = { ...editor.position }; editor.originalSize = { ...editor.size };
                editor.container.classList.add('maximized'); editor.isMaximized = true; editor.isMinimized = false;
            }
        }

        // 恢复代码编辑器
        restoreCodeEditor(args) {
            const id = Scratch.Cast.toString(args.ID || 'editor1');
            const editor = this.editors.get(id);
            if (editor) {
                editor.container.classList.remove('maximized', 'minimized'); editor.content.classList.remove('minimized');
                if ((editor.isMaximized || editor.isMinimized) && editor.originalPosition) {
                    editor.container.style.left = editor.originalPosition.x + 'px'; editor.container.style.top = editor.originalPosition.y + 'px';
                    editor.container.style.width = editor.originalSize.width + 'px'; editor.container.style.height = editor.originalSize.height + 'px';
                    editor.position = { ...editor.originalPosition }; editor.size = { ...editor.originalSize };
                }
                editor.isMaximized = false; editor.isMinimized = false;
            }
        }

        // 获取编辑器文本
        getEditorText(args) {
            const id = Scratch.Cast.toString(args.ID || 'editor1');
            const editor = this.editors.get(id);
            return editor ? editor.textarea.value : '';
        }

        // 设置编辑器文本
        setEditorText(args) {
            const id = Scratch.Cast.toString(args.ID || 'editor1');
            const text = Scratch.Cast.toString(args.TEXT || '');
            const editor = this.editors.get(id);
            if (editor) { editor.textarea.value = text; this._updateLineNumbers(editor); }
        }

        // 检查编辑器是否可见
        isCodeEditorVisible(args) {
            const id = Scratch.Cast.toString(args.ID || 'editor1');
            const editor = this.editors.get(id);
            return editor ? editor.isVisible : false;
        }

        getInfo() {
            return {
                id: EXTENSION_ID,
                name: translate('extensionName'),
                color1: '#ce00ff',
                color2: '#383037',
                color3: '#383038',
                menuIconURI: EXTENSION_ICON,
                blocks: [
                    // 打开文档按钮
                    {
                        opcode: 'docsButton',
                        blockType: BlockType.BUTTON,
                        text: translate('block.docsButton'),
                        func: 'docs'
                    },
                    
                    // ========== 📦 弹窗板块 ==========
                    {
                        blockType: BlockType.LABEL,
                        text: translate('section.popup')
                    },
                    
                    {
                        opcode: 'showAlert',
                        blockType: BlockType.COMMAND,
                        text: translate('block.showAlert'),
                        tooltip: translate('tooltip.showAlert'),
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'popupTypeMenu',
                                defaultValue: 'normal'
                            },
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.title.alert')
                            },
                            CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.content.alert')
                            },
                            WAIT: {
                                type: ArgumentType.STRING,
                                menu: 'waitMenu',
                                defaultValue: 'wait'
                            }
                        }
                    },
                    {
                        opcode: 'showAlertAutoClose',
                        blockType: BlockType.COMMAND,
                        text: translate('block.showAlertAutoClose'),
                        tooltip: translate('tooltip.showAlertAutoClose'),
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'popupTypeMenu',
                                defaultValue: 'normal'
                            },
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.title.alert')
                            },
                            CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.content.alert')
                            },
                            TIME: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 3
                            }
                        }
                    },
                    '---',
                    // 进度条弹窗
                    {
                        opcode: 'showProgress',
                        blockType: BlockType.COMMAND,
                        text: translate('block.showProgress'),
                        tooltip: translate('tooltip.showProgress'),
                        arguments: {
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.progress.title')
                            },
                            PROGRESS: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            MESSAGE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.progress.content')
                            }
                        }
                    },
                    {
                        opcode: 'updateProgress',
                        blockType: BlockType.COMMAND,
                        text: translate('block.updateProgress'),
                        tooltip: translate('tooltip.updateProgress'),
                        arguments: {
                            PROGRESS: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 50
                            },
                            MESSAGE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.progress.content')
                            }
                        }
                    },
                    {
                        opcode: 'closeProgress',
                        blockType: BlockType.COMMAND,
                        text: translate('block.closeProgress'),
                        tooltip: translate('tooltip.closeProgress')
                    },
                    '---',
                    
                    // 确认弹窗
                    {
                        opcode: 'showConfirm',
                        blockType: BlockType.COMMAND,
                        text: translate('block.showConfirm'),
                        tooltip: translate('tooltip.showConfirm'),
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'popupTypeMenu',
                                defaultValue: 'normal'
                            },
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.title.confirm')
                            },
                            CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.content.confirm')
                            },
                            WAIT: {
                                type: ArgumentType.STRING,
                                menu: 'waitMenu',
                                defaultValue: 'wait'
                            }
                        }
                    },
                    
                    // 输入弹窗
                    {
                        opcode: 'showInput',
                        blockType: BlockType.COMMAND,
                        text: translate('block.showInput'),
                        tooltip: translate('tooltip.showInput'),
                        arguments: {
                            INPUTTYPE: {
                                type: ArgumentType.STRING,
                                menu: 'inputTypeMenu',
                                defaultValue: 'text'
                            },
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.title.input')
                            },
                            PLACEHOLDER: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('placeholder.text')
                            },
                            WAIT: {
                                type: ArgumentType.STRING,
                                menu: 'waitMenu',
                                defaultValue: 'wait'
                            }
                        }
                    },
                    
                    // 选项弹窗
                    {
                        opcode: 'showOptions',
                        blockType: BlockType.COMMAND,
                        text: translate('block.showOptions'),
                        tooltip: translate('tooltip.showOptions'),
                        arguments: {
                            MODE: {
                                type: ArgumentType.STRING,
                                menu: 'optionsModeMenu',
                                defaultValue: 'dropdown'
                            },
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.options.placeholder')
                            },
                            OPTIONS: {
                                type: ArgumentType.STRING,
                                defaultValue: '["选项1","选项2","选项3"]'
                            },
                            WAIT: {
                                type: ArgumentType.STRING,
                                menu: 'waitMenu',
                                defaultValue: 'wait'
                            }
                        }
                    },
                    
                    // 文件导入弹窗
                    {
                        opcode: 'showFileImport',
                        blockType: BlockType.COMMAND,
                        text: translate('block.showFileImport'),
                        tooltip: translate('tooltip.showFileImport'),
                        arguments: {
                            MODE: {
                                type: ArgumentType.STRING,
                                menu: 'fileImportModeMenu',
                                defaultValue: 'both'
                            },
                            WAIT: {
                                type: ArgumentType.STRING,
                                menu: 'waitMenu',
                                defaultValue: 'wait'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'getInputResult',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        text: translate('block.getInputResult'),
                        tooltip: translate('tooltip.getInputResult')
                    },
                    {
                        opcode: 'showInputAndWait',
                        blockType: BlockType.REPORTER,
                        text: translate('block.showInputAndWait'),
                        tooltip: translate('tooltip.showInputAndWait'),
                        arguments: {
                            INPUTTYPE: {
                                type: ArgumentType.STRING,
                                menu: 'inputTypeMenu',
                                defaultValue: 'text'
                            },
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.title.input')
                            },
                            PLACEHOLDER: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('placeholder.text')
                            }
                        }
                    },
                    {
                        opcode: 'getOptionsResult',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        text: translate('block.getOptionsResult'),
                        tooltip: translate('tooltip.getOptionsResult')
                    },
                    {
                        opcode: 'showOptionsAndWait',
                        blockType: BlockType.REPORTER,
                        text: translate('block.showOptionsAndWait'),
                        tooltip: translate('tooltip.showOptionsAndWait'),
                        arguments: {
                            MODE: {
                                type: ArgumentType.STRING,
                                menu: 'optionsModeMenu',
                                defaultValue: 'dropdown'
                            },
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.options.placeholder')
                            },
                            OPTIONS: {
                                type: ArgumentType.STRING,
                                defaultValue: '["选项1","选项2","选项3"]'
                            }
                        }
                    },
                    {
                        opcode: 'getConfirmResult',
                        blockType: BlockType.BOOLEAN,
                        disableMonitor: true,
                        text: translate('block.getConfirmResult'),
                        tooltip: translate('tooltip.getConfirmResult')
                    },
                    {
                        opcode: 'showConfirmAndWait',
                        blockType: BlockType.BOOLEAN,
                        text: translate('block.showConfirmAndWait'),
                        tooltip: translate('tooltip.showConfirmAndWait'),
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'popupTypeMenu',
                                defaultValue: 'normal'
                            },
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.title.confirm')
                            },
                            CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.content.confirm')
                            }
                        }
                    },
                    {
                        opcode: 'getLastFileContent',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        text: translate('block.getLastFileContent'),
                        tooltip: translate('tooltip.getLastFileContent')
                    },
                    {
                        opcode: 'getFileImportResult',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        text: translate('block.getFileImportResult'),
                        arguments: {
                            MODE: {
                                type: ArgumentType.STRING,
                                menu: 'fileImportModeMenu',
                                defaultValue: 'both'
                            },
                            WAIT: {
                                type: ArgumentType.STRING,
                                menu: 'waitMenu',
                                defaultValue: 'wait'
                            }
                        }
                    },
                    
                    // ========== 📝 代码编辑器 ==========
                    '---',
                    {
                        opcode: 'showCodeEditor',
                        blockType: BlockType.COMMAND,
                        text: translate('block.showCodeEditor'),
                        arguments: {
                            ID: { type: ArgumentType.STRING, defaultValue: 'editor1' },
                            TITLE: { type: ArgumentType.STRING, defaultValue: translate('default.codeEditor.title') },
                            LANGUAGE: { type: ArgumentType.STRING, menu: 'languageMenu', defaultValue: 'javascript' },
                            CODE: { type: ArgumentType.STRING, defaultValue: translate('default.codeEditor.code') }
                        }
                    },
                    {
                        opcode: 'hideCodeEditor',
                        blockType: BlockType.COMMAND,
                        text: translate('block.hideCodeEditor'),
                        arguments: { ID: { type: ArgumentType.STRING, defaultValue: 'editor1' } }
                    },
                    {
                        opcode: 'minimizeCodeEditor',
                        blockType: BlockType.COMMAND,
                        text: translate('block.minimizeCodeEditor'),
                        arguments: { ID: { type: ArgumentType.STRING, defaultValue: 'editor1' } }
                    },
                    {
                        opcode: 'maximizeCodeEditor',
                        blockType: BlockType.COMMAND,
                        text: translate('block.maximizeCodeEditor'),
                        arguments: { ID: { type: ArgumentType.STRING, defaultValue: 'editor1' } }
                    },
                    {
                        opcode: 'restoreCodeEditor',
                        blockType: BlockType.COMMAND,
                        text: translate('block.restoreCodeEditor'),
                        arguments: { ID: { type: ArgumentType.STRING, defaultValue: 'editor1' } }
                    },
                    {
                        opcode: 'getEditorText',
                        blockType: BlockType.REPORTER,
                        text: translate('block.getEditorText'),
                        arguments: { ID: { type: ArgumentType.STRING, defaultValue: 'editor1' } }
                    },
                    {
                        opcode: 'setEditorText',
                        blockType: BlockType.COMMAND,
                        text: translate('block.setEditorText'),
                        arguments: {
                            ID: { type: ArgumentType.STRING, defaultValue: 'editor1' },
                            TEXT: { type: ArgumentType.STRING, defaultValue: '' }
                        }
                    },
                    {
                        opcode: 'isCodeEditorVisible',
                        blockType: BlockType.BOOLEAN,
                        text: translate('block.isCodeEditorVisible'),
                        arguments: { ID: { type: ArgumentType.STRING, defaultValue: 'editor1' } }
                    },
                    '---',
                    
                    // Toast通知
                    {
                        opcode: 'showToast',
                        blockType: BlockType.COMMAND,
                        text: translate('block.showToast'),
                        tooltip: translate('tooltip.showToast'),
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'toastTypeMenu',
                                defaultValue: 'success'
                            },
                            CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.content.toast')
                            },
                            TIME: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 3
                            },
                            THEME: {
                                type: ArgumentType.STRING,
                                menu: 'themeMenu',
                                defaultValue: 'light'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'showStageMenu',
                        blockType: BlockType.REPORTER,
                        text: translate('block.showStageMenu'),
                        tooltip: translate('tooltip.showStageMenu'),
                        arguments: {
                            X: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            ITEMS: {
                                type: ArgumentType.STRING,
                                defaultValue: '[{"type": "Button", "value": "1"}, {"type": "Button", "value": "2"}, {"type": "Text", "value": "这是文本"}, {"type": "Line"}, {"type": "SubMenu", "value": "3", "children": [{"type": "Button", "value": "子1"}]}]'
                            },
                            THEME: {
                                type: ArgumentType.STRING,
                                menu: 'themeMenu',
                                defaultValue: 'light'
                            }
                        }
                    },
                    '---',
                    
                    // ========== 🎨 自定义板块 ==========
                    {
                        blockType: BlockType.LABEL,
                        text: translate('section.custom')
                    },
                    
                    // 自定义内容
                    {
                        opcode: 'showCustomHTML',
                        blockType: BlockType.COMMAND,
                        text: translate('block.showCustomHTML'),
                        tooltip: translate('tooltip.showCustomHTML'),
                        arguments: {
                            FORMAT: {
                                type: ArgumentType.STRING,
                                menu: 'formatMenu',
                                defaultValue: 'bbcode'
                            },
                            CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.content.custom')
                            },
                            WAIT: {
                                type: ArgumentType.STRING,
                                menu: 'waitMenu',
                                defaultValue: 'wait'
                            }
                        }
                    },
                    {
                        opcode: 'closePopup',
                        blockType: BlockType.COMMAND,
                        text: translate('block.closePopup'),
                        tooltip: translate('tooltip.closePopup')
                    },
                    '---',
                    // 设置面板样式
                    {
                        opcode: 'docsButton2',
                        blockType: BlockType.BUTTON,
                        text: translate('block.styleEditor'),
                        func: 'docs2'
                    },
                    {
                        opcode: 'setPopupStyle',
                        blockType: BlockType.COMMAND,
                        text: translate('block.setPopupStyle'),
                        tooltip: translate('tooltip.setPopupStyle'),
                        arguments: {
                            CSS: {
                                type: ArgumentType.STRING,
                                defaultValue: 'background-color: #f0f0f0; border-radius: 10px;'
                            },
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'styleTypeMenu',
                                defaultValue: 'all'
                            }
                        }
                    },
                    {
                        opcode: 'getCss',
                        blockType: BlockType.REPORTER,
                        text: translate('block.getCss'),
                        tooltip: translate('tooltip.getCss'),
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'styleTypeMenu',
                                defaultValue: 'all'
                            }
                        }
                    },
                    {
                        opcode: 'clearAllStyles',
                        blockType: BlockType.COMMAND,
                        text: translate('block.clearAllStyles'),
                        tooltip: translate('tooltip.clearAllStyles')
                    },
                    {
                        opcode: 'setPopupAnimation',
                        blockType: BlockType.COMMAND,
                        text: translate('block.setPopupAnimation'),
                        tooltip: translate('tooltip.setPopupAnimation'),
                        arguments: {
                            ANIMATION: {
                                type: ArgumentType.STRING,
                                menu: 'animationMenu',
                                defaultValue: 'fade'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'docsButton3',
                        blockType: BlockType.BUTTON,
                        text: translate('block.pythonSyntax'),
                        func: 'docs3'
                    },
                    {
                        opcode: 'pythonPopup',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        text: translate('block.pythonPopup'),
                        tooltip: translate('tooltip.pythonPopup'),
                        arguments: {
                            CODE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'print("Hello!")\nname = input("What is your name?")\nprint("Hi, " + name)'
                            }
                        }
                    },
                    {
                        opcode: 'docsButton4',
                        blockType: BlockType.BUTTON,
                        text: translate('block.popupSyntax'),
                        func: 'docs4'
                    },
                    {
                        opcode: 'popupFilePopup',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        text: translate('block.popupFilePopup'),
                        tooltip: translate('tooltip.popupFilePopup'),
                        arguments: {
                            CODE: {
                                type: ArgumentType.STRING,
                                defaultValue: '<title>My Popup</title>\n<text>Hello World!</text>\n<input id="name" placeholder="Enter name">'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'setPopupColor',
                        blockType: BlockType.COMMAND,
                        text: translate('block.setPopupColor'),
                        tooltip: translate('tooltip.setPopupColor'),
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'popupColorTypeMenu',
                                defaultValue: 'all'
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#4c97ff'
                            }
                        }
                    },
                    '---',
                    
                    // ========== 📊 用户行为追踪 ==========
                    {
                        opcode: 'enableTracking',
                        blockType: BlockType.COMMAND,
                        text: translate('block.enableTracking'),
                        arguments: {
                            MODE: {
                                type: ArgumentType.STRING,
                                menu: 'trackingModeMenu',
                                defaultValue: 'all'
                            }
                        }
                    },
                    {
                        opcode: 'getButtonClickCount',
                        blockType: BlockType.REPORTER,
                        text: translate('block.getButtonClickCount'),
                        disableMonitor: true,
                        arguments: {
                            BUTTON: {
                                type: ArgumentType.STRING,
                                defaultValue: 'confirm'
                            }
                        }
                    },
                    {
                        opcode: 'getInputLength',
                        blockType: BlockType.REPORTER,
                        text: translate('block.getInputLength'),
                        disableMonitor: true,
                        arguments: {
                            INPUT_ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'input_1'
                            }
                        }
                    },
                    {
                        opcode: 'getPopupDisplayTime',
                        blockType: BlockType.REPORTER,
                        text: translate('block.getPopupDisplayTime'),
                        disableMonitor: true
                    },
                    {
                        opcode: 'getTrackingData',
                        blockType: BlockType.REPORTER,
                        text: translate('block.getTrackingData'),
                        disableMonitor: true,
                        arguments: {
                            FORMAT: {
                                type: ArgumentType.STRING,
                                menu: 'trackingFormatMenu',
                                defaultValue: 'json'
                            }
                        }
                    },
                    {
                        opcode: 'clearTrackingData',
                        blockType: BlockType.COMMAND,
                        text: translate('block.clearTrackingData')
                    },
                    {
                        opcode: 'getLastAction',
                        blockType: BlockType.REPORTER,
                        text: translate('block.getLastAction'),
                        disableMonitor: true
                    },
                    {
                        opcode: 'getActionsByType',
                        blockType: BlockType.REPORTER,
                        text: translate('block.getActionsByType'),
                        disableMonitor: true,
                        arguments: {
                            ACTION_TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'actionTypeMenu',
                                defaultValue: 'button'
                            }
                        }
                    },
                    '---',
                    
                    // 自定义面板构建器
                    {
                        opcode: 'createPanel',
                        blockType: BlockType.COMMAND,
                        text: translate('block.createPanel'),
                        tooltip: translate('tooltip.createPanel'),
                        arguments: {
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'custom1'
                            }
                        }
                    },
                    {
                        opcode: 'addButton',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addButton'),
                        tooltip: translate('tooltip.addButton'),
                        arguments: {
                            LABEL: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.button.text')
                            },
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'confirm'
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#4c97ff'
                            }
                        }
                    },
                    {
                        opcode: 'addInput',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addInput'),
                        tooltip: translate('tooltip.addInput'),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'input_1'
                            },
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'panelInputTypeMenu',
                                defaultValue: 'text'
                            },
                            PLACEHOLDER: {
                                type: ArgumentType.STRING,
                                defaultValue: translate('default.input.placeholder')
                            }
                        }
                    },
                    {
                        opcode: 'addText',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addText'),
                        tooltip: translate('tooltip.addText'),
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: 'content'
                            }
                        }
                    },
                    {
                        opcode: 'addImage',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addImage'),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'image_1'
                            },
                            IMAGE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'https://example.com/image.png'
                            }
                        }
                    },
                    {
                        opcode: 'addFileImport',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addFileImport'),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'file_1'
                            },
                            MODE: {
                                type: ArgumentType.STRING,
                                menu: 'fileImportModeMenu',
                                defaultValue: 'both'
                            }
                        }
                    },
                    {
                        opcode: 'addOptions',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addOptions'),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'options_1'
                            },
                            MODE: {
                                type: ArgumentType.STRING,
                                menu: 'panelOptionsModeMenu',
                                defaultValue: 'radio'
                            },
                            OPTIONS: {
                                type: ArgumentType.STRING,
                                defaultValue: '["选项1","选项2","选项3"]'
                            },
                            DEFAULT: {
                                type: ArgumentType.STRING,
                                defaultValue: '0'
                            }
                        }
                    },
                    {
                        opcode: 'addColorPicker',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addColorPicker'),
                        tooltip: translate('tooltip.addColorPicker'),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'color_1'
                            },
                            COLOR: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#ff0000'
                            }
                        }
                    },
                    {
                        opcode: 'addCheckbox',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addCheckbox'),
                        tooltip: translate('tooltip.addCheckbox'),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'check_1'
                            },
                            DEFAULT: {
                                type: ArgumentType.STRING,
                                menu: 'checkboxDefaultMenu',
                                defaultValue: 'false'
                            }
                        }
                    },
                    {
                        opcode: 'addSlider',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addSlider'),
                        tooltip: translate('tooltip.addSlider'),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'slider_1'
                            },
                            DEFAULT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 50
                            },
                            MIN: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            MAX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            MODE: {
                                type: ArgumentType.STRING,
                                menu: 'sliderModeMenu',
                                defaultValue: 'both'
                            }
                        }
                    },
                    {
                        opcode: 'addCoordinatePicker',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addCoordinatePicker'),
                        tooltip: translate('tooltip.addCoordinatePicker'),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'coord_1'
                            },
                            WIDTH: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 300
                            },
                            HEIGHT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 200
                            }
                        }
                    },
                    {
                        opcode: 'addTrajectoryDrawer',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addTrajectoryDrawer'),
                        tooltip: translate('tooltip.addTrajectoryDrawer'),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'path_1'
                            },
                            WIDTH: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 300
                            },
                            HEIGHT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 200
                            }
                        }
                    },
                    {
                        opcode: 'addCustomHTML',
                        blockType: BlockType.COMMAND,
                        text: translate('block.addCustomHTML'),
                        tooltip: translate('tooltip.addCustomHTML'),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: 'custom_1'
                            },
                            HTML: {
                                type: ArgumentType.STRING,
                                defaultValue: '<input type="range" min="0" max="100" value="50">'
                            }
                        }
                    },
                    {
                        opcode: 'showPanel',
                        blockType: BlockType.COMMAND,
                        text: translate('block.showPanel'),
                        arguments: {
                            TITLE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'custom1'
                            },
                            WAIT: {
                                type: ArgumentType.STRING,
                                menu: 'waitMenu',
                                defaultValue: 'wait'
                            }
                        }
                    },
                    {
                        opcode: 'getPanelResult',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        text: translate('block.getPanelResult')
                    },
                    
                    // 事件系统
                    // {
                    //     opcode: 'bindButton',
                    //     blockType: BlockType.COMMAND,
                    //     text: translate('block.bindButton'),
                    //     arguments: {
                    //         BUTTON: {
                    //             type: ArgumentType.STRING,
                    //             defaultValue: 'confirm'
                    //         },
                    //         EVENT: {
                    //             type: ArgumentType.STRING,
                    //             defaultValue: 'event1'
                    //         }
                    //     }
                    // },
                    // {
                    //     opcode: 'startEvent',
                    //     blockType: BlockType.COMMAND,
                    //     text: translate('block.startEvent'),
                    //     arguments: {
                    //         EVENT: {
                    //             type: ArgumentType.STRING,
                    //             defaultValue: 'event1'
                    //         }
                    //     }
                    // },
                    // {
                    //     opcode: 'whenEventStarts',
                    //     blockType: 'hat',
                    //     isEdgeActivated: false,
                    //     shouldRestartExistingThreads: false,
                    //     text: translate('block.whenEventStarts'),
                    //     arguments: {
                    //         EVENT: {
                    //             type: ArgumentType.STRING,
                    //             defaultValue: 'event1'
                    //         },
                    //     }
                    // },
                    // '---',
                    // {
                    //     opcode: 'bindBroadcast',
                    //     blockType: BlockType.COMMAND,
                    //     text: translate('block.bindBroadcast'),
                    //     arguments: {
                    //         BUTTON: {
                    //             type: ArgumentType.STRING,
                    //             defaultValue: 'confirm'
                    //         },
                    //     }
                    // },
                    // 有BUG, 不能用
                    {
                        opcode: 'debugPanel',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        text: translate('block.debugPanel')
                    },
                    '---',
                    
                    // ========== 🔧 工具板块 ==========
                    {
                        blockType: BlockType.LABEL,
                        text: translate('section.tool')
                    },
                    
                    // 内容过滤工具
                    {
                        opcode: 'sanitizeContent',
                        blockType: BlockType.REPORTER,
                        text: translate('block.sanitizeContent'),
                        tooltip: translate('tooltip.sanitizeContent'),
                        arguments: {
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'sanitizeTypeMenu',
                                defaultValue: 'html'
                            },
                            CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: '<script>alert("xss")</script>'
                            }
                        }
                    },
                    {
                        opcode: 'generateGradient',
                        blockType: BlockType.REPORTER,
                        text: translate('block.generateGradient'),
                        tooltip: translate('tooltip.generateGradient'),
                        arguments: {
                            DIRECTION: {
                                type: ArgumentType.STRING,
                                menu: 'gradientDirectionMenu',
                                defaultValue: 'top'
                            },
                            COLOR1: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#667eea'
                            },
                            COLOR2: {
                                type: ArgumentType.COLOR,
                                defaultValue: '#764ba2'
                            }
                        }
                    },
                    
                    {
                        opcode: 'downloadFile',
                        blockType: BlockType.COMMAND,
                        text: translate('block.downloadFile'),
                        arguments: {
                            FILENAME: {
                                type: ArgumentType.STRING,
                                defaultValue: 'file.txt'
                            },
                            CONTENT: {
                                type: ArgumentType.STRING,
                                defaultValue: 'content'
                            },
                            TYPE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'text/plain'
                            }
                        }
                    },
                    {
                        opcode: 'uploadAndRead',
                        blockType: BlockType.REPORTER,
                        text: translate('block.uploadAndRead'),
                        arguments: {
                            EXT: {
                                type: ArgumentType.STRING,
                                defaultValue: '.txt'
                            },
                            FORMAT: {
                                type: ArgumentType.STRING,
                                menu: 'fileFormatMenu',
                                defaultValue: 'utf-8'
                            }
                        }
                    },
                ],
                menus: {
                    themeMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate('theme.light'), value: 'light' },
                            { text: translate('theme.dark'), value: 'dark' }
                        ]
                    },
                    popupTypeMenu: {
                        items: [
                            { text: translate('popup.normal'), value: 'normal' },
                            { text: translate('popup.success'), value: 'success' },
                            { text: translate('popup.error'), value: 'error' },
                            { text: translate('popup.warning'), value: 'warning' },
                            { text: translate('popup.info'), value: 'info' },
                            { text: translate('style.type.all'), value: 'all' }
                        ]
                    },
                    inputTypeMenu: {
                        items: [
                            { text: translate('input.text'), value: 'text' },
                            { text: translate('input.textarea'), value: 'textarea' },
                            { text: translate('input.password'), value: 'password' },
                            { text: translate('input.url'), value: 'url' },
                            { text: translate('input.email'), value: 'email' },
                            { text: translate('input.time'), value: 'time' },
                            { text: translate('input.address'), value: 'address' }
                        ]
                    },
                    formatMenu: {
                        items: [
                            { text: translate('format.html'), value: 'html' },
                            { text: translate('format.bbcode'), value: 'bbcode' },
                            { text: translate('format.markdown'), value: 'markdown' },
                            { text: translate('format.text'), value: 'text' }
                        ]
                    },
                    toastTypeMenu: {
                        items: [
                            { text: translate('toast.success'), value: 'success' },
                            { text: translate('toast.error'), value: 'error' },
                            { text: translate('toast.warning'), value: 'warning' },
                            { text: translate('toast.info'), value: 'info' }
                        ]
                    },
                    waitMenu: {
                        items: [
                            { text: translate('wait.yes'), value: 'wait' },
                            { text: translate('wait.no'), value: 'nowait' }
                        ]
                    },
                    styleTypeMenu: {
                        items: [
                            { text: translate('style.type.all'), value: 'all' },
                            { text: translate('style.type.confirm'), value: 'confirm' },
                            { text: translate('style.type.input'), value: 'input' },
                            { text: translate('style.custom'), value: 'custom' }
                        ]
                    },
                    sanitizeTypeMenu: {
                        items: [
                            { text: translate('sanitize.html'), value: 'html' },
                            { text: translate('sanitize.bbcode'), value: 'bbcode' },
                            { text: translate('sanitize.markdown'), value: 'markdown' },
                            { text: translate('sanitize.css'), value: 'css' }
                        ]
                    },
                    gradientDirectionMenu: {
                        items: [
                            { text: translate('gradient.top'), value: 'top' },
                            { text: translate('gradient.left'), value: 'left' },
                            { text: translate('gradient.center'), value: 'center' }
                        ]
                    },
                    popupColorTypeMenu: {
                        items: [
                            { text: translate('style.type.all'), value: 'all' },
                            { text: translate('style.type.confirm'), value: 'confirm' },
                            { text: translate('style.type.input'), value: 'input' },
                            { text: translate('style.custom'), value: 'custom' }
                        ]
                    },
                    trackingModeMenu: {
                        items: [
                            { text: translate('menu.trackingMode.all'), value: 'all' },
                            { text: translate('menu.trackingMode.button'), value: 'button' },
                            { text: translate('menu.trackingMode.input'), value: 'input' },
                            { text: translate('menu.trackingMode.time'), value: 'time' }
                        ]
                    },
                    trackingFormatMenu: {
                        items: [
                            { text: translate('menu.trackingFormat.json'), value: 'json' },
                            { text: translate('menu.trackingFormat.simple'), value: 'simple' },
                            { text: translate('menu.trackingFormat.csv'), value: 'csv' }
                        ]
                    },
                    actionTypeMenu: {
                        items: [
                            { text: translate('menu.actionType.button'), value: 'button' },
                            { text: translate('menu.actionType.input'), value: 'input' },
                            { text: translate('menu.actionType.popup'), value: 'popup' },
                            { text: translate('menu.actionType.all'), value: 'all' }
                        ]
                    },
                    optionsModeMenu: {
                        items: [
                            { text: translate('options.mode.dropdown'), value: 'dropdown' },
                            { text: translate('options.mode.radio'), value: 'radio' },
                            { text: translate('options.mode.checkbox'), value: 'checkbox' }
                        ]
                    },
                    panelInputTypeMenu: {
                        items: [
                            { text: translate('panel.inputType.text'), value: 'text' },
                            { text: translate('panel.inputType.number'), value: 'number' },
                            { text: translate('panel.inputType.password'), value: 'password' },
                            { text: translate('panel.inputType.email'), value: 'email' },
                            { text: translate('panel.inputType.url'), value: 'url' },
                            { text: translate('panel.inputType.textarea'), value: 'textarea' }
                        ]
                    },
                    panelOptionsModeMenu: {
                        items: [
                            { text: translate('panel.optionsMode.radio'), value: 'radio' },
                            { text: translate('panel.optionsMode.checkbox'), value: 'checkbox' }
                        ]
                    },
                    sliderModeMenu: {
                        items: [
                            { text: translate('slider.mode.both'), value: 'both' },
                            { text: translate('slider.mode.slider'), value: 'slider' }
                        ]
                    },
                    checkboxDefaultMenu: {
                        acceptReporters: false,
                        items: [
                            { text: '✓', value: 'true' },
                            { text: '✗', value: 'false' }
                        ]
                    },
                    fileImportModeMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate('fileImport.mode.both'), value: 'both' },
                            { text: translate('fileImport.mode.drop'), value: 'drop' },
                            { text: translate('fileImport.mode.click'), value: 'click' }
                        ]
                    },
                    animationMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate('animation.fade'), value: 'fade' },
                            { text: translate('animation.slide'), value: 'slide' },
                            { text: translate('animation.bounce'), value: 'bounce' },
                            { text: translate('animation.zoom'), value: 'zoom' },
                            { text: translate('animation.none'), value: 'none' }
                        ]
                    },
                    fileExtMenu: {
                        acceptReporters: true,
                        items: [
                            { text: 'All', value: '' },
                            { text: '.txt', value: '.txt' },
                            { text: '.cpp', value: '.cpp' },
                            { text: '.js', value: '.js' },
                            { text: '.json', value: '.json' },
                            { text: '.csv', value: '.csv' },
                            { text: '.html', value: '.html' }
                        ]
                    },
                    fileFormatMenu: {
                        acceptReporters: false,
                        items: [
                            { text: translate('fileFormat.utf8'), value: 'utf-8' },
                            { text: 'Base64', value: 'base64' },
                            { text: 'Blob URL', value: 'blob' }
                        ]
                    },
                    languageMenu: {
                        acceptReporters: true,
                        items: [
                            { text: 'JavaScript', value: 'javascript' },
                            { text: 'Python', value: 'python' },
                            { text: 'HTML', value: 'html' },
                            { text: 'CSS', value: 'css' },
                            { text: 'JSON', value: 'json' },
                            { text: 'XML', value: 'xml' },
                            { text: 'Markdown', value: 'markdown' },
                            { text: 'SQL', value: 'sql' },
                            { text: 'C++', value: 'cpp' },
                            { text: 'Java', value: 'java' }
                        ]
                    },
                }
            };
        }

        // ========== 基础提示弹窗 ==========
        
        showAlert(args, util) {
            const waitMode = Scratch.Cast.toString(args.WAIT);
            
            if (waitMode === 'wait') {
                // 等待模式：返回Promise，等待弹窗关闭
                return this._showModal({
                    type: Scratch.Cast.toString(args.TYPE),
                    title: Scratch.Cast.toString(args.TITLE),
                    content: Scratch.Cast.toString(args.CONTENT),
                    showInput: false,
                    showConfirm: true,
                    showCancel: false
                });
            } else {
                // 不等待模式：立即返回
                this._showModal({
                    type: Scratch.Cast.toString(args.TYPE),
                    title: Scratch.Cast.toString(args.TITLE),
                    content: Scratch.Cast.toString(args.CONTENT),
                    showInput: false,
                    showConfirm: true,
                    showCancel: false
                });
            }
        }

        showAlertAutoClose(args) {
            const time = Scratch.Cast.toNumber(args.TIME) * 1000;
            this._showModal({
                type: Scratch.Cast.toString(args.TYPE),
                title: Scratch.Cast.toString(args.TITLE),
                content: Scratch.Cast.toString(args.CONTENT),
                showInput: false,
                showConfirm: true,
                showCancel: false,
                autoClose: time
            });
        }

        // ========== 确认弹窗 ==========
        
        showConfirm(args, util) {
            const waitMode = Scratch.Cast.toString(args.WAIT);
            
            if (waitMode === 'wait') {
                // 等待模式：返回Promise，等待弹窗关闭
                return this._showModal({
                    type: Scratch.Cast.toString(args.TYPE),
                    title: Scratch.Cast.toString(args.TITLE),
                    content: Scratch.Cast.toString(args.CONTENT),
                    showInput: false,
                    showConfirm: true,
                    showCancel: true,
                    isConfirm: true
                });
            } else {
                // 不等待模式：立即返回
                this._showModal({
                    type: Scratch.Cast.toString(args.TYPE),
                    title: Scratch.Cast.toString(args.TITLE),
                    content: Scratch.Cast.toString(args.CONTENT),
                    showInput: false,
                    showConfirm: true,
                    showCancel: true,
                    isConfirm: true
                });
            }
        }

        getConfirmResult() {
            return this._lastResult || false;
        }

        // 显示确认弹窗并返回结果（始终等待）
        showConfirmAndWait(args, util) {
            const self = this;
            return new Promise((resolve) => {
                self._showModal({
                    type: Scratch.Cast.toString(args.TYPE),
                    title: Scratch.Cast.toString(args.TITLE),
                    content: Scratch.Cast.toString(args.CONTENT),
                    showInput: false,
                    showConfirm: true,
                    showCancel: true,
                    isConfirm: true,
                    _onClose: () => resolve(self._lastResult || false)
                });
            });
        }

        // ========== 输入弹窗 ==========
        
        showInput(args, util) {
            const waitMode = Scratch.Cast.toString(args.WAIT);
            
            if (waitMode === 'wait') {
                // 等待模式：返回Promise，等待弹窗关闭
                return this._showModal({
                    inputType: Scratch.Cast.toString(args.INPUTTYPE),
                    title: Scratch.Cast.toString(args.TITLE),
                    content: Scratch.Cast.toString(args.PLACEHOLDER),
                    showInput: true,
                    showConfirm: true,
                    showCancel: true,
                    isInput: true
                });
            } else {
                // 不等待模式：立即返回
                this._showModal({
                    inputType: Scratch.Cast.toString(args.INPUTTYPE),
                    title: Scratch.Cast.toString(args.TITLE),
                    content: Scratch.Cast.toString(args.PLACEHOLDER),
                    showInput: true,
                    showConfirm: true,
                    showCancel: true,
                    isInput: true
                });
            }
        }

        getInputResult() {
            return this._lastInputValue || '';
        }

        // 显示输入弹窗并返回结果（始终等待）
        showInputAndWait(args, util) {
            const self = this;
            return new Promise((resolve) => {
                self._showModal({
                    inputType: Scratch.Cast.toString(args.INPUTTYPE),
                    title: Scratch.Cast.toString(args.TITLE),
                    content: Scratch.Cast.toString(args.PLACEHOLDER),
                    showInput: true,
                    showConfirm: true,
                    showCancel: true,
                    isInput: true,
                    _onClose: () => resolve(self._lastInputValue || '')
                });
            });
        }

        // ========== Toast通知 ==========
        
        showToast(args) {
            const type = Scratch.Cast.toString(args.TYPE);
            const content = Scratch.Cast.toString(args.CONTENT);
            const time = Scratch.Cast.toNumber(args.TIME) * 1000;

            const icons = {
                success: '✓',
                error: '✗',
                warning: '⚠',
                info: 'ℹ'
            };

            const toast = document.createElement('div');
            toast.className = `better-toast better-toast-${type}`;
            toast.innerHTML = `
                <span class="better-toast-icon">${icons[type] || 'ℹ'}</span>
                <span>${this._escapeHtml(content)}</span>
            `;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'fadeIn 0.2s ease reverse';
                setTimeout(() => toast.remove(), 200);
            }, time);
        }

        // ========== 自定义弹窗 ==========
        
        // 选项弹窗
        showOptions(args, util) {
            const waitMode = Scratch.Cast.toString(args.WAIT);
            const mode = Scratch.Cast.toString(args.MODE);
            const title = Scratch.Cast.toString(args.TITLE);
            const optionsStr = Scratch.Cast.toString(args.OPTIONS);
            
            // 解析选项（支持JSON数组或逗号分隔）
            const options = this._parseOptions(optionsStr);
            
            if (waitMode === 'wait') {
                // 等待模式：返回Promise
                return this._showOptionsModal({
                    mode: mode,
                    title: title,
                    options: options
                });
            } else {
                // 不等待模式：立即返回
                this._showOptionsModal({
                    mode: mode,
                    title: title,
                    options: options
                });
            }
        }
        
        // 选项弹窗（等待并返回）
        showOptionsAndWait(args, util) {
            const mode = Scratch.Cast.toString(args.MODE);
            const title = Scratch.Cast.toString(args.TITLE);
            const optionsStr = Scratch.Cast.toString(args.OPTIONS);
            const self = this;
            
            // 解析选项（支持JSON数组或逗号分隔）
            const options = this._parseOptions(optionsStr);
            
            return new Promise((resolve) => {
                self._showOptionsModal({
                    mode: mode,
                    title: title,
                    options: options,
                    _onClose: () => {
                        if (mode === 'checkbox' && Array.isArray(self._lastOptionsResult)) {
                            resolve(JSON.stringify(self._lastOptionsResult));
                        } else {
                            resolve(self._lastOptionsResult || '');
                        }
                    }
                });
            });
        }
        
        // 获取最后的选项结果
        getOptionsResult() {
            // 多选模式返回JSON数组
            if (Array.isArray(this._lastOptionsResult)) {
                return JSON.stringify(this._lastOptionsResult);
            }
            return this._lastOptionsResult;
        }
        
        // 创建自定义面板
        createPanel(args) {
            const title = Scratch.Cast.toString(args.TITLE);
            _customPanel = {
                title: title,
                elements: []
            };
            console.log(translate('panel.created') + ': ' + title);
        }
        
        // 添加按钮
        addButton(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const label = Scratch.Cast.toString(args.LABEL);
            const value = Scratch.Cast.toString(args.VALUE);
            const color = Scratch.Cast.toString(args.COLOR);
            
            _customPanel.elements.push({
                type: 'button',
                label: label,
                value: value,
                color: color
            });
            console.log(translate('panel.buttonAdded') + ': ' + label);
        }
        
        // 添加输入框
        addInput(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const id = Scratch.Cast.toString(args.ID);
            const inputType = Scratch.Cast.toString(args.TYPE);
            const placeholder = Scratch.Cast.toString(args.PLACEHOLDER);
            
            _customPanel.elements.push({
                type: 'input',
                id: id,
                inputType: inputType,
                placeholder: placeholder
            });
            console.log(translate('panel.inputAdded') + ': ' + inputType + ' (ID: ' + id + ')');
        }
        
        // 添加文本
        addText(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const text = Scratch.Cast.toString(args.TEXT);
            
            _customPanel.elements.push({
                type: 'text',
                text: text
            });
            console.log('文本已添加: ' + text);
        }
        
        // 添加图片
        addImage(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const id = Scratch.Cast.toString(args.ID);
            const image = Scratch.Cast.toString(args.IMAGE);
            
            _customPanel.elements.push({
                type: 'image',
                id: id,
                image: image
            });
            console.log('图片已添加 (ID: ' + id + '): ' + image);
        }
        
        // 添加文件导入元素
        addFileImport(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const id = Scratch.Cast.toString(args.ID);
            const mode = Scratch.Cast.toString(args.MODE);
            
            _customPanel.elements.push({
                type: 'fileImport',
                id: id,
                mode: mode
            });
            console.log(translate('panel.fileImportAdded') + ' (ID: ' + id + ', Mode: ' + mode + ')');
        }
        
        // 添加选项组
        addOptions(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const id = Scratch.Cast.toString(args.ID);
            const mode = Scratch.Cast.toString(args.MODE);
            const optionsStr = Scratch.Cast.toString(args.OPTIONS);
            const defaultIdx = Scratch.Cast.toString(args.DEFAULT);
            
            // 解析选项
            const options = this._parseOptions(optionsStr);
            
            _customPanel.elements.push({
                type: 'options',
                id: id,
                mode: mode,
                options: options,
                defaultIdx: parseInt(defaultIdx) || 0
            });
            console.log(translate('panel.optionsAdded') + ': ' + mode + ' (ID: ' + id + ')');
        }
        
        // 添加颜色选取元素
        addColorPicker(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const id = Scratch.Cast.toString(args.ID);
            const color = Scratch.Cast.toString(args.COLOR);
            
            _customPanel.elements.push({
                type: 'colorPicker',
                id: id,
                color: color
            });
            console.log(translate('panel.colorPickerAdded') + ' (ID: ' + id + ')');
        }
        
        // 添加勾选元素
        addCheckbox(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const id = Scratch.Cast.toString(args.ID);
            const defaultChecked = Scratch.Cast.toString(args.DEFAULT) === 'true';
            
            _customPanel.elements.push({
                type: 'checkbox',
                id: id,
                checked: defaultChecked
            });
            console.log(translate('panel.checkboxAdded') + ' (ID: ' + id + ')');
        }
        
        // 添加滑杆输入元素
        addSlider(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const id = Scratch.Cast.toString(args.ID);
            const defaultVal = Scratch.Cast.toNumber(args.DEFAULT);
            const min = Scratch.Cast.toNumber(args.MIN);
            const max = Scratch.Cast.toNumber(args.MAX);
            const mode = Scratch.Cast.toString(args.MODE);
            
            _customPanel.elements.push({
                type: 'slider',
                id: id,
                value: defaultVal,
                min: min,
                max: max,
                mode: mode
            });
            console.log(translate('panel.sliderAdded') + ' (ID: ' + id + ')');
        }

        // 添加坐标选取元素
        addCoordinatePicker(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const id = Scratch.Cast.toString(args.ID);
            const width = Scratch.Cast.toNumber(args.WIDTH) || 300;
            const height = Scratch.Cast.toNumber(args.HEIGHT) || 200;
            
            _customPanel.elements.push({
                type: 'coordinatePicker',
                id: id,
                width: width,
                height: height
            });
            console.log(translate('panel.coordinatePickerAdded') + ' (ID: ' + id + ')');
        }

        // 添加轨迹绘制元素
        addTrajectoryDrawer(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const id = Scratch.Cast.toString(args.ID);
            const width = Scratch.Cast.toNumber(args.WIDTH) || 300;
            const height = Scratch.Cast.toNumber(args.HEIGHT) || 200;
            
            _customPanel.elements.push({
                type: 'trajectoryDrawer',
                id: id,
                width: width,
                height: height
            });
            console.log(translate('panel.trajectoryDrawerAdded') + ' (ID: ' + id + ')');
        }

        // 添加自定义HTML元素
        addCustomHTML(args) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            const id = Scratch.Cast.toString(args.ID);
            const html = Scratch.Cast.toString(args.HTML);
            
            _customPanel.elements.push({
                type: 'customHTML',
                id: id,
                html: html
            });
            console.log('自定义元素已添加 (ID: ' + id + ')');
        }

        // 显示自定义面板
        showPanel(args, util) {
            if (!_customPanel) {
                console.warn('请先创建面板');
                return;
            }
            
            const title = Scratch.Cast.toString(args.TITLE);
            const waitMode = Scratch.Cast.toString(args.WAIT);
            
            const panelConfig = {
                title: title || _customPanel.title,
                elements: _customPanel.elements
            };
            
            if (waitMode === 'wait') {
                const self = this;
                return new Promise((resolve) => {
                    self._showCustomPanel(Object.assign({}, panelConfig, {
                        _onClose: () => resolve(JSON.stringify(_lastPanelResult))
                    }));
                });
            } else {
                this._showCustomPanel(panelConfig);
            }
        }
        
        // 获取面板结果
        getPanelResult() {
            return JSON.stringify(_lastPanelResult);
        }
        
        // 显示文件导入弹窗
        showFileImport(args, util) {
            const mode = Scratch.Cast.toString(args.MODE);
            const waitMode = Scratch.Cast.toString(args.WAIT);
            
            const self = this;
            
            const popupConfig = {
                type: 'normal',
                title: translate('fileImport.dropOrClick'),
                content: '',
                isFileImport: true,
                fileImportMode: mode
            };
            
            if (waitMode === 'wait') {
                const self = this;
                return new Promise((resolve) => {
                    self._showFileImportPopup(Object.assign({}, popupConfig, {
                        _onClose: () => resolve(JSON.stringify(_lastFileImportResult))
                    }));
                });
            } else {
                this._showFileImportPopup(popupConfig);
            }
        }
        
        // 显示文件导入并返回内容（支持等待模式选择）
        getFileImportResult(args, util) {
            const mode = Scratch.Cast.toString(args.MODE);
            const waitMode = Scratch.Cast.toString(args.WAIT);
            
            const popupConfig = {
                type: 'normal',
                title: translate('fileImport.dropOrClick'),
                content: '',
                isFileImport: true,
                fileImportMode: mode
            };
            
            if (waitMode === 'wait') {
                // 等待模式：返回Promise，等待弹窗关闭后返回文件内容
                const self = this;
                return new Promise((resolve) => {
                    self._showFileImportPopup(Object.assign({}, popupConfig, {
                        _onClose: () => resolve(_lastFileContent || '')
                    }));
                });
            } else {
                // 不等待模式：显示弹窗后立即返回空字符串
                this._showFileImportPopup(popupConfig);
                return _lastFileContent || '';
            }
        }
        
        // 获取最后导入的文件内容
        getLastFileContent() {
            return _lastFileContent;
        }
        
        // 定义效果函数（C型积木）
        defineEffect(args, util) {
            const name = Scratch.Cast.toString(args.NAME);
            
            // 保存C型槽的util引用到_effectFunctions
            // 这样后面可以通过按钮绑定来调用
            if (util && util.startBranch) {
                _effectFunctions[name] = util;
                console.log('✓ ' + translate('panel.effectDefined') + ': ' + name);
            }
            
            // 重要：不要在这里调用startBranch！
            // defineEffect只是一个“定义”积木，不应该执行C型槽内容
            // C型槽的内容只在按钮点击时通过_effectFunctions[name].startBranch(1, false)执行
        }
        
        // 绑定按钮
        bindButton(args) {
            const button = Scratch.Cast.toString(args.BUTTON);
            const event = Scratch.Cast.toString(args.EVENT);
            
            _buttonBindings[button] = {
                event: event
            };
            
            console.log('按钮已绑定: ' + button + ' -> ' + event);
        }
        
        // 启动事件
        startEvent(args) {
            const event = Scratch.Cast.toString(args.EVENT);
            console.log('[事件] 启动事件: ' + event);
            
            // 使用startHatsWithParams直接触发Hat积木
            if (this.runtime && typeof this.runtime.startHatsWithParams === 'function') {
                console.log('[事件] 调用startHatsWithParams');
                this.runtime.startHatsWithParams(`${EXTENSION_ID}_whenEventStarts`, {
                    parameters: { EVENT: event },
                    fields: {}
                });
                console.log('[事件] ✓ startHatsWithParams调用完成');
            } else {
                console.warn('[事件] ✗ startHatsWithParams不可用');
            }
        }
        
        // Hat积木：当事件启动时
        whenEventStarts(args, util) {
            // args.EVENT是用户在积木上输入的事件名
            // 同时也是startHatsWithParams传出的值
            // 如果这个值存在，说明匹配了，直接触发
            if (args.EVENT) {
                console.log('[事件Hat] ✓ 触发事件:', args.EVENT);
                return true;
            }
            return false;
        }
        
        // 绑定按钮广播
        bindBroadcast(args) {
            const button = Scratch.Cast.toString(args.BUTTON);
            const broadcast = Scratch.Cast.toString(args.BROADCAST);
            _buttonBroadcasts[button] = broadcast;
        }
        
        // 发送广播到Scratch默认广播系统
        _sendBroadcast(bcName) {
            if (!bcName) return;
            const runtimeToUse = _savedRuntime || this.runtime;
            if (!runtimeToUse) return;
            // 直接发送到原版广播系统（触发所有 "当收到广播" 积木）
            runtimeToUse.startHats('event_whenbroadcastreceived', { BROADCAST_OPTION: bcName });
        }
        
        // Hat积木：当按钮被点击
        // 调试面板状态
        debugPanel() {
            const status = {
                customPanel: _customPanel ? '已创建' : '未创建',
                panelElements: _customPanel ? _customPanel.elements.length : 0,
                buttonBindings: Object.keys(_buttonBindings).length,
                eventTriggers: _eventTriggers.length,
                currentTarget: this._currentTarget ? '是' : '否',
                bindings: _buttonBindings,
                events: _eventTriggers
            };
            console.log('面板调试信息:', status);
            console.log('运行时API', this.runtime)
            return JSON.stringify(status);
        }
        
        // 触发按钮点击事件
        _triggerButtonClicked(buttonValue) {
            // 存储到target上
            let targetToUse = this._currentTarget;
            if (!targetToUse && this.runtime && this.runtime.editingTarget) {
                targetToUse = this.runtime.editingTarget;
            }
            if (targetToUse) {
                targetToUse._lastButtonClicked = { value: buttonValue };
            }
            
            // 触发whenButtonClicked Hat
            const self = this;
            if (self.runtime && typeof self.runtime.startHatsWithParams === 'function' && isCCW) {
                self.runtime.startHatsWithParams(`${EXTENSION_ID}_whenButtonClicked`, {
                    parameters: { button: buttonValue },
                    fields: {}
                });
            } else if (self.runtime) {
                self.runtime.startHats(`${EXTENSION_ID}_whenButtonClicked`);
            }
            
            // 发送按钮绑定的广播
            if (_buttonBroadcasts[buttonValue]) {
                self._sendBroadcast(_buttonBroadcasts[buttonValue]);
            }
        }
        
        // 执行按钮绑定效果
        _executeButtonEffect(buttonValue) {
            console.log('[按钮效果] 执行按钮: ' + buttonValue);
            console.log('[按钮效果] 当前所有绑定:', JSON.stringify(_buttonBindings));
            
            const binding = _buttonBindings[buttonValue];
            if (!binding) {
                console.log('[按钮效果] ✗ 按钮没有绑定事件: ' + buttonValue);
                return;
            }
            
            const event = binding.event;
            console.log('[按钮效果] ✓ 执行按钮事件: ' + buttonValue + ' -> ' + event);
            
            // 启动绑定的事件
            this.startEvent({EVENT: event});
        }
        
        // 显示自定义面板的内部方法
        _showCustomPanel(panelConfig) {
            return this._showModal({
                title: panelConfig.title,
                content: '',
                showInput: false,
                showConfirm: false,
                showCancel: false,
                isCustomPanel: true,
                panelElements: panelConfig.elements,
                _onClose: panelConfig._onClose
            });
        }
        
        // 显示文件导入弹窗的内部方法
        _showFileImportPopup(popupConfig) {
            const self = this;
            const callerOnClose = popupConfig._onClose;
            
            return this._showModal({
                title: popupConfig.title,
                content: '',
                showInput: false,
                showConfirm: true,
                confirmText: '✓ 确认',
                showCancel: true,
                isFileImport: true,
                fileImportMode: popupConfig.fileImportMode,
                _onClose: () => {
                    // 收集文件导入结果
                    if (window._fileImportResult && Object.keys(window._fileImportResult).length > 0) {
                        _lastFileImportResult = window._fileImportResult;
                        const firstFileId = Object.keys(window._fileImportResult)[0];
                        if (window._fileImportResult[firstFileId] && window._fileImportResult[firstFileId].content) {
                            _lastFileContent = window._fileImportResult[firstFileId].content;
                        }
                        window._fileImportResult = {};
                    }
                    if (callerOnClose) callerOnClose();
                }
            });
        }
        
        // 显示选项弹窗的内部方法
        _showOptionsModal(options) {
            return this._showModal({
                title: options.title,
                content: '',
                showInput: false,
                showConfirm: true,
                showCancel: true,
                isOptions: true,
                optionsMode: options.mode,
                optionsList: options.options,
                _onClose: options._onClose
            });
        }
        
        // 解析选项（支持JSON数组或逗号分隔）
        _parseOptions(optionsStr) {
            // 尝试解析JSON数组
            if (optionsStr.trim().startsWith('[')) {
                try {
                    const parsed = JSON.parse(optionsStr);
                    if (Array.isArray(parsed)) {
                        return parsed.map(opt => String(opt).trim()).filter(opt => opt);
                    }
                } catch (e) {
                    // JSON解析失败，使用逗号分隔
                }
            }
            
            // 逗号分隔
            return optionsStr.split(',').map(opt => opt.trim()).filter(opt => opt);
        }
        
        showCustomHTML(args, util) {
            const waitMode = Scratch.Cast.toString(args.WAIT);
            const format = Scratch.Cast.toString(args.FORMAT);
            let content = Scratch.Cast.toString(args.CONTENT);
            
            // 根据格式转换
            if (format === 'bbcode') {
                content = parseBBCode(content);
            } else if (format === 'markdown') {
                content = parseMarkdown(content);
            } else if (format === 'html') {
                // HTML格式直接输出，只进行安全过滤
            } else {
                // 纯文本需要转义
                content = this._escapeHtml(content);
            }
            
            // 安全过滤（只对HTML/BBCode/Markdown）
            if (format !== 'text') {
                content = sanitizeHTML(content);
            }
            
            if (waitMode === 'wait') {
                // 等待模式：返回Promise，等待弹窗关闭
                return this._showModal({
                    title: '',
                    content: content,
                    showInput: false,
                    showConfirm: true,
                    showCancel: false,
                    isHTML: true
                });
            } else {
                // 不等待模式：立即返回
                this._showModal({
                    title: '',
                    content: content,
                    showInput: false,
                    showConfirm: true,
                    showCancel: false,
                    isHTML: true
                });
            }
        }

        closePopup() {
            if (activePopup) {
                // 获取弹窗类型
                const popupType = activePopup.dataset.popupType || 'all';
                
                // 追踪弹窗关闭
                this._trackPopupAction('close', {
                    type: popupType,
                    displayTime: this.getPopupDisplayTime()
                });
                
                // 先关闭弹窗
                activePopup.remove();
                activePopup = null;
                
                if (popupResolve) {
                    popupResolve();
                    popupResolve = null;
                }
            }
        }

        // ========== 进度条弹窗 ==========
        
        // 显示进度条弹窗
        showProgress(args) {
            const title = Scratch.Cast.toString(args.TITLE);
            const progress = Scratch.Cast.toNumber(args.PROGRESS);
            const message = Scratch.Cast.toString(args.MESSAGE);
            
            // 关闭之前的进度条
            if (_progressPopup) {
                _progressPopup.remove();
            }
            
            _currentProgress = progress;
            _progressCancelCallback = null;
            
            // 创建进度条弹窗
            const overlay = document.createElement('div');
            overlay.className = 'better-popup-overlay';
            overlay.style.zIndex = '10002';
            
            const popup = document.createElement('div');
            popup.className = 'better-popup better-popup-' + _popupAnimation;
            
            let html = '';
            html += `<div class="better-popup-header" style="padding:20px 20px 0">
                <h2 style="margin:0;font-size:18px;color:#333">${this._escapeHtml(title)}</h2>
            </div>`;
            html += `<div class="better-popup-content" style="padding:20px">
                <div style="margin-bottom:12px;color:#666;font-size:14px">${this._escapeHtml(message)}</div>
                <div style="background:#e0e0e0;border-radius:10px;overflow:hidden;height:24px;position:relative">
                    <div id="better-progress-bar" style="background:linear-gradient(90deg, #4c97ff, #5bc0de);height:100%;width:${progress}%;transition:width 0.3s;border-radius:10px"></div>
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:12px;font-weight:bold;color:#333">${progress}%</div>
                </div>
            </div>`;
            html += `<div class="better-popup-buttons" style="display:flex;justify-content:flex-end;gap:12px;padding:0 20px 20px">
                <button id="better-progress-cancel" style="padding:10px 24px;border:none;border-radius:8px;background:#e0e0e0;color:#333;font-size:14px;font-weight:bold;cursor:pointer;transition:all 0.2s">${translate('progress.cancel')}</button>
            </div>`;
            
            popup.innerHTML = html;
            overlay.appendChild(popup);
            document.body.appendChild(overlay);
            
            _progressPopup = overlay;
            
            // 绑定取消按钮事件
            setTimeout(() => {
                const cancelBtn = document.getElementById('better-progress-cancel');
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => {
                        if (_progressCancelCallback) {
                            _progressCancelCallback();
                        }
                        this.closeProgress();
                    });
                    
                    cancelBtn.addEventListener('mouseenter', () => {
                        cancelBtn.style.background = '#ff6b6b';
                        cancelBtn.style.color = 'white';
                    });
                    
                    cancelBtn.addEventListener('mouseleave', () => {
                        cancelBtn.style.background = '#e0e0e0';
                        cancelBtn.style.color = '#333';
                    });
                }
            }, 50);
        }
        
        // 更新进度条
        updateProgress(args) {
            if (!_progressPopup) {
                console.warn('请先显示进度条');
                return;
            }
            
            const progress = Scratch.Cast.toNumber(args.PROGRESS);
            const message = Scratch.Cast.toString(args.MESSAGE);
            
            _currentProgress = progress;
            
            // 更新进度条
            const progressBar = document.getElementById('better-progress-bar');
            if (progressBar) {
                progressBar.style.width = progress + '%';
                // 更新百分比文本
                const percentText = progressBar.parentElement.querySelector('div:last-child');
                if (percentText) {
                    percentText.textContent = progress + '%';
                }
                // 更新消息
                const messageDiv = progressBar.parentElement.parentElement.querySelector('div:first-child');
                if (messageDiv) {
                    messageDiv.textContent = message;
                }
            }
        }
        
        // 关闭进度条
        closeProgress() {
            if (_progressPopup) {
                _progressPopup.remove();
                _progressPopup = null;
                _currentProgress = 0;
                _progressCancelCallback = null;
            }
        }
        
        // 设置进度条取消回调
        setProgressCancelCallback(callback) {
            _progressCancelCallback = callback;
        }
        
        // ========== 动画和下载 ==========
        
        // 设置弹窗动画
        setPopupAnimation(args) {
            _popupAnimation = Scratch.Cast.toString(args.ANIMATION);
            console.log('弹窗动画已设置为: ' + _popupAnimation);
        }

        // 用Python代码生成弹窗并返回结果
        pythonPopup(args, util) {
            const pyCode = Scratch.Cast.toString(args.CODE);
            if (!pyCode) return '{}';

            const self = this;

            return new Promise((resolve) => {
                try {
                    // 解析Python代码
                    const parsed = self._parsePythonPopup(pyCode);

                    // 构建弹窗配置
                    const options = {
                        title: parsed.title || '',
                        content: parsed.text || '',
                        showInput: false,
                        showConfirm: true,
                        showCancel: false,
                        isCustomPanel: true,
                        panelElements: parsed.elements
                    };

                    // 显示弹窗并等待结果
                    self._showModal(options);

                    // 监听弹窗关闭
                    const checkInterval = setInterval(() => {
                        if (!activePopup) {
                            clearInterval(checkInterval);
                            resolve(JSON.stringify(_lastPanelResult));
                        }
                    }, 100);

                } catch (e) {
                    console.error('Python弹窗执行失败:', e);
                    resolve('{}');
                }
            });
        }

        // 解析Python弹窗代码
        _parsePythonPopup(code) {
            const result = {
                title: '',
                text: '',
                elements: []
            };

            const lines = code.split('\n');

            for (let line of lines) {
                line = line.trim();
                if (!line || line.startsWith('#')) continue;

                // 解析 print("...") - 弹窗文字内容
                const printMatch = line.match(/print\s*\(\s*["'](.+?)["']\s*\)/);
                if (printMatch) {
                    result.text += printMatch[1] + '\n';
                    continue;
                }

                // 解析 id = input("placeholder") - 输入框
                const inputMatch = line.match(/(\w+)\s*=\s*input\s*\(\s*["'](.+?)["']\s*\)/);
                if (inputMatch) {
                    const id = inputMatch[1];
                    const placeholder = inputMatch[2];
                    result.elements.push({
                        type: 'input',
                        id: id,
                        inputType: 'text',
                        placeholder: placeholder
                    });
                    continue;
                }

                // 解析 id = BetterPopup.select("opt1", "opt2", ...) - 选择器
                const selectMatch = line.match(/(\w+)\s*=\s*BetterPopup\.select\s*\((.+)\)/);
                if (selectMatch) {
                    const id = selectMatch[1];
                    const argsStr = selectMatch[2];
                    const options = [];
                    const optRegex = /["']([^"']+)["']/g;
                    let optMatch;
                    while ((optMatch = optRegex.exec(argsStr)) !== null) {
                        options.push(optMatch[1]);
                    }
                    result.elements.push({
                        type: 'options',
                        id: id,
                        mode: 'dropdown',
                        options: options,
                        default: options[0] || ''
                    });
                    continue;
                }

                // 解析 id = BetterPopup.input2("placeholder", type) - 带类型的输入框
                const input2Match = line.match(/(\w+)\s*=\s*BetterPopup\.input2\s*\(\s*["'](.+?)["']\s*,\s*(\w+)\s*\)/);
                if (input2Match) {
                    const id = input2Match[1];
                    const placeholder = input2Match[2];
                    const inputType = input2Match[3].toLowerCase();
                    const typeMap = {
                        'int': 'number',
                        'float': 'number',
                        'str': 'text',
                        'string': 'text',
                        'password': 'password',
                        'email': 'email',
                        'url': 'url'
                    };
                    result.elements.push({
                        type: 'input',
                        id: id,
                        inputType: typeMap[inputType] || 'text',
                        placeholder: placeholder
                    });
                    continue;
                }

                // 解析 id = BetterPopup.importFile() - 文件导入
                const importMatch = line.match(/(\w+)\s*=\s*BetterPopup\.importFile\s*\(\s*\)/);
                if (importMatch) {
                    const id = importMatch[1];
                    result.elements.push({
                        type: 'fileImport',
                        id: id,
                        mode: 'both'
                    });
                    continue;
                }

                // 解析 id = BetterPopup.custom('html') - 自定义HTML
                const customMatch = line.match(/(\w+)\s*=\s*BetterPopup\.custom\s*\(\s*['"](.+?)['"]\s*\)/);
                if (customMatch) {
                    const id = customMatch[1];
                    const html = customMatch[2];
                    result.elements.push({
                        type: 'customHTML',
                        id: id,
                        html: html
                    });
                    continue;
                }
            }

            result.text = result.text.trim();
            return result;
        }

        // ========== Popup 代码支持 ==========

        // 用 Popup 代码生成弹窗并返回
        popupFilePopup(args, util) {
            const popupCode = Scratch.Cast.toString(args.CODE);
            if (!popupCode) return '{}';
            const self = this;

            return new Promise((resolve) => {
                try {
                    const parsed = self._parsePopupFile(popupCode);

                    const options = {
                        title: parsed.title || '',
                        content: parsed.text || '',
                        showInput: false,
                        showConfirm: true,
                        showCancel: false,
                        isCustomPanel: true,
                        panelElements: parsed.elements
                    };

                    self._showModal(options);

                    const checkInterval = setInterval(() => {
                        if (!activePopup) {
                            clearInterval(checkInterval);
                            resolve(JSON.stringify(_lastPanelResult));
                        }
                    }, 100);
                } catch (e) {
                    console.error('Popup代码执行失败:', e);
                    resolve('{}');
                }
            });
        }

        // 解析 .popup 文件
        _parsePopupFile(code) {
            const result = { title: '', text: '', elements: [] };

            // 解析 <title>...</title>
            const titleMatch = code.match(/<title>([\s\S]*?)<\/title>/i);
            if (titleMatch) result.title = titleMatch[1].trim();

            // 解析 <text>...</text>（可多个，合并为弹窗文字）
            const textRegex = /<text>([\s\S]*?)<\/text>/gi;
            let tm;
            while ((tm = textRegex.exec(code)) !== null) {
                result.text += tm[1].trim() + '\n';
            }
            result.text = result.text.trim();

            // 解析 <input id="..." placeholder="..." type="...">
            const inputRegex = /<input\s+([^>]*?)\/?>/gi;
            let im;
            while ((im = inputRegex.exec(code)) !== null) {
                const attrs = this._parsePopupAttrs(im[1]);
                const typeMap = {
                    'text': 'text', 'number': 'number', 'int': 'number',
                    'float': 'number', 'password': 'password',
                    'email': 'email', 'url': 'url', 'color': 'text'
                };
                result.elements.push({
                    type: 'input',
                    id: attrs.id || 'input_' + result.elements.length,
                    inputType: typeMap[(attrs.type || 'text').toLowerCase()] || 'text',
                    placeholder: attrs.placeholder || ''
                });
            }

            // 解析 <select id="..."><option>A</option><option>B</option></select>
            const selectRegex = /<select\s+([^>]*?)>([\s\S]*?)<\/select>/gi;
            let sm;
            while ((sm = selectRegex.exec(code)) !== null) {
                const attrs = this._parsePopupAttrs(sm[1]);
                const options = [];
                const optRegex = /<option>([\s\S]*?)<\/option>/gi;
                let om;
                while ((om = optRegex.exec(sm[2])) !== null) {
                    options.push(om[1].trim());
                }
                if (options.length > 0) {
                    result.elements.push({
                        type: 'options',
                        id: attrs.id || 'select_' + result.elements.length,
                        mode: 'dropdown',
                        options: options,
                        default: options[0]
                    });
                }
            }

            // 解析 <button label="..." value="..." color="...">
            const btnRegex = /<button\s+([^>]*?)\/?>/gi;
            let bm;
            while ((bm = btnRegex.exec(code)) !== null) {
                const attrs = this._parsePopupAttrs(bm[1]);
                result.elements.push({
                    type: 'button',
                    id: attrs.id || attrs.value || 'btn',
                    label: attrs.label || '按钮',
                    value: attrs.value || attrs.label || 'btn',
                    color: attrs.color || '#4c97ff'
                });
            }

            // 解析 <file id="..." mode="...">
            const fileRegex = /<file\s+([^>]*?)\/?>/gi;
            let fm;
            while ((fm = fileRegex.exec(code)) !== null) {
                const attrs = this._parsePopupAttrs(fm[1]);
                result.elements.push({
                    type: 'fileImport',
                    id: attrs.id || 'file_' + result.elements.length,
                    mode: attrs.mode || 'both'
                });
            }

            // 解析 <custom id="...">HTML内容</custom>
            const customRegex = /<custom\s+([^>]*?)>([\s\S]*?)<\/custom>/gi;
            let cm;
            while ((cm = customRegex.exec(code)) !== null) {
                const attrs = this._parsePopupAttrs(cm[1]);
                result.elements.push({
                    type: 'customHTML',
                    id: attrs.id || 'custom_' + result.elements.length,
                    html: cm[2].trim()
                });
            }

            // 解析 <slider id="..." min="..." max="..." value="...">
            const sliderRegex = /<slider\s+([^>]*?)\/?>/gi;
            let slm;
            while ((slm = sliderRegex.exec(code)) !== null) {
                const attrs = this._parsePopupAttrs(slm[1]);
                result.elements.push({
                    type: 'slider',
                    id: attrs.id || 'slider_' + result.elements.length,
                    min: parseFloat(attrs.min) || 0,
                    max: parseFloat(attrs.max) || 100,
                    value: parseFloat(attrs.value) || 50,
                    step: parseFloat(attrs.step) || 1,
                    mode: attrs.mode || 'both'
                });
            }

            // 解析 <color id="..." value="...">
            const colorRegex = /<color\s+([^>]*?)\/?>/gi;
            let clm;
            while ((clm = colorRegex.exec(code)) !== null) {
                const attrs = this._parsePopupAttrs(clm[1]);
                result.elements.push({
                    type: 'colorPicker',
                    id: attrs.id || 'color_' + result.elements.length,
                    color: attrs.value || attrs.color || '#4c97ff'
                });
            }

            // 解析 <image src="..." width="..." height="...">
            const imgRegex = /<image\s+([^>]*?)\/?>/gi;
            let imgm;
            while ((imgm = imgRegex.exec(code)) !== null) {
                const attrs = this._parsePopupAttrs(imgm[1]);
                result.elements.push({
                    type: 'image',
                    id: attrs.id || 'img_' + result.elements.length,
                    image: attrs.src || '',
                    width: attrs.width || '',
                    height: attrs.height || ''
                });
            }

            return result;
        }

        // 解析 popup 标签属性
        _parsePopupAttrs(attrStr) {
            const attrs = {};
            const regex = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
            let m;
            while ((m = regex.exec(attrStr)) !== null) {
                attrs[m[1]] = m[2] !== undefined ? m[2] : m[3];
            }
            return attrs;
        }
        
        downloadFile(args) {
            const filename = Scratch.Cast.toString(args.FILENAME);
            const content = Scratch.Cast.toString(args.CONTENT);
            const type = Scratch.Cast.toString(args.TYPE);
            
            // 创建Blob对象
            const blob = new Blob([content], { type: type });
            
            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            
            // 清理
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log('文件已下载: ' + filename);
        }
        
        // 上传文件并读取
        uploadAndRead(args) {
            const ext = Scratch.Cast.toString(args.EXT);
            const format = Scratch.Cast.toString(args.FORMAT);
            
            const self = this;
            
            return new Promise((resolve) => {
                // 创建文件选择器
                const input = document.createElement('input');
                input.type = 'file';
                
                // 设置文件类型过滤
                if (ext) {
                    input.accept = ext;
                }
                
                // 文件选择事件
                input.onchange = function(e) {
                    const file = e.target.files[0];
                    if (!file) {
                        resolve('');
                        return;
                    }
                    
                    _lastUploadedFile = file;
                    
                    // 根据格式读取文件
                    if (format === 'utf-8') {
                        // 读取为UTF-8文本
                        const reader = new FileReader();
                        reader.onload = function(ev) {
                            resolve(ev.target.result || '');
                        };
                        reader.readAsText(file, 'UTF-8');
                    } else if (format === 'base64') {
                        // 读取为Base64
                        const reader = new FileReader();
                        reader.onload = function(ev) {
                            resolve(ev.target.result || '');
                        };
                        reader.readAsDataURL(file);
                    } else if (format === 'blob') {
                        // 返回Blob URL
                        const url = URL.createObjectURL(file);
                        resolve(url);
                    } else {
                        resolve('');
                    }
                };
                
                // 取消选择
                input.oncancel = function() {
                    resolve('');
                };
                
                // 触发文件选择
                input.click();
            });
        }
        
        // 显示舞台菜单
        showStageMenu(args) {
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);
            const itemsStr = Scratch.Cast.toString(args.ITEMS);
            const theme = Scratch.Cast.toString(args.THEME);
            
            const self = this;
            
            return new Promise((resolve) => {
                // 关闭之前的菜单
                if (_stageMenuOverlay) {
                    _stageMenuOverlay.remove();
                    _stageMenuOverlay = null;
                }
                
                _stageMenuResult = '';
                
                // 解析菜单项
                let items = [];
                try {
                    items = JSON.parse(itemsStr);
                    // 支持数组格式: [["文本", "类型"], ...]
                    if (!Array.isArray(items)) {
                        throw new Error('Not an array');
                    }
                } catch (e) {
                    console.warn(translate('stageMenu.invalid'));
                    resolve('');
                    return;
                }
                
                if (items.length === 0) {
                    resolve('');
                    return;
                }
                
                // 创建菜单容器
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10003;
                `;
                
                // 转换Scratch坐标到屏幕坐标
                // Scratch舞台中心是(0,0)，范围约-240到240
                const stageWidth = window.innerWidth;
                const stageHeight = window.innerHeight;
                const screenX = (x / 480 + 0.5) * stageWidth;
                const screenY = (0.5 - y / 360) * stageHeight;
                
                const position = {
                    left: Math.min(Math.max(screenX, 160), stageWidth - 160),
                    top: Math.min(Math.max(screenY, 100), stageHeight - 100)
                };
                
                // 创建主菜单
                const mainMenu = self._createMenu(items, overlay, resolve, 0, position, [], theme);
                
                overlay.appendChild(mainMenu);
                document.body.appendChild(overlay);
                
                _stageMenuOverlay = overlay;
                
                // 点击外部关闭菜单
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        overlay.remove();
                        _stageMenuOverlay = null;
                        resolve('');
                    }
                });
            });
        }
        
        // 创建菜单（支持新JSON格式和主题）
        _createMenu(items, overlay, resolve, depth, position, parentPath, theme) {
            const isDark = theme === 'dark';
            
            const menu = document.createElement('div');
            menu.className = 'better-popup better-popup-' + _popupAnimation;
            menu.style.cssText = `
                position: absolute;
                padding: 8px 0;
                background: ${isDark ? '#2d2d2d' : 'white'};
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,${isDark ? '0.5' : '0.3'});
                min-width: 150px;
                max-width: 300px;
            `;
            
            // 设置位置
            if (position) {
                menu.style.left = position.left + 'px';
                menu.style.top = position.top + 'px';
            } else if (depth > 0) {
                menu.style.left = '160px';
                menu.style.top = '0px';
            }
            
            // 如果是对象，转为数组保持顺序
            let itemsArray = [];
            if (!Array.isArray(items)) {
                // 使用Object.entries保持插入顺序
                itemsArray = Object.entries(items);
            } else {
                itemsArray = items;
            }
            
            // 遍历菜单项
            itemsArray.forEach((item) => {
                // 新格式: {"type": "Button", "value": "文本", "children": [...]}
                const type = item.type || 'Button';
                const value = item.value || '';
                const children = item.children || [];
                
                // 根据类型创建不同元素
                if (type === 'Line') {
                    // 分割线
                    const divider = document.createElement('div');
                    divider.style.cssText = `height: 1px; background: ${isDark ? '#555' : '#e0e0e0'}; margin: 6px 0;`;
                    menu.appendChild(divider);
                } else if (type === 'Text') {
                    // 纯文本
                    const textItem = document.createElement('div');
                    textItem.style.cssText = `
                        padding: 8px 20px;
                        font-size: 13px;
                        color: ${isDark ? '#999' : '#666'};
                        cursor: default;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    `;
                    textItem.textContent = value;
                    menu.appendChild(textItem);
                } else if (type === 'SubMenu') {
                    // 子菜单（嵌套对象）
                    const menuItem = document.createElement('div');
                    menuItem.style.cssText = `
                        padding: 10px 20px;
                        cursor: pointer;
                        font-size: 14px;
                        color: ${isDark ? '#e0e0e0' : '#333'};
                        background: ${isDark ? '#2d2d2d' : 'white'};
                        transition: all 0.2s;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        position: relative;
                    `;
                    menuItem.innerHTML = this._escapeHtml(value) + ` <span style="color:${isDark ? '#666' : '#999'};font-size:12px;float:right">▶</span>`;
                    
                    let subMenu = null;
                    let isHovering = false;
                    let hideTimeout = null;
                    
                    // 悬停显示子菜单
                    menuItem.addEventListener('mouseenter', () => {
                        isHovering = true;
                        menuItem.style.background = isDark ? '#404040' : '#4c97ff';
                        menuItem.style.color = 'white';
                        
                        if (hideTimeout) {
                            clearTimeout(hideTimeout);
                            hideTimeout = null;
                        }
                        
                        // 关闭其他子菜单
                        const otherSubMenus = overlay.querySelectorAll('.better-popup[data-depth]');
                        otherSubMenus.forEach(sm => {
                            if (sm !== subMenu) {
                                sm.remove();
                            }
                        });
                        
                        // 创建或重新显示子菜单
                        if (!subMenu || !subMenu.parentNode) {
                            if (subMenu && !subMenu.parentNode) {
                                subMenu = null;
                            }
                            
                            const currentPath = parentPath ? [...parentPath, value] : [value];
                            subMenu = this._createMenu(children, overlay, resolve, depth + 1, null, currentPath, theme);
                            subMenu.setAttribute('data-depth', depth + 1);
                            
                            // 给子菜单添加事件
                            subMenu.addEventListener('mouseenter', () => {
                                if (hideTimeout) {
                                    clearTimeout(hideTimeout);
                                    hideTimeout = null;
                                }
                            });
                            
                            subMenu.addEventListener('mouseleave', () => {
                                hideTimeout = setTimeout(() => {
                                    if (subMenu && subMenu.parentNode) {
                                        subMenu.remove();
                                    }
                                }, 200);
                            });
                            
                            // 定位子菜单
                            setTimeout(() => {
                                if (subMenu && subMenu.parentNode) {
                                    const rect = menuItem.getBoundingClientRect();
                                    const menuRect = subMenu.getBoundingClientRect();
                                    
                                    let left = rect.right - 10;
                                    let top = rect.top;
                                    
                                    if (left + menuRect.width > window.innerWidth) {
                                        left = rect.left - menuRect.width + 10;
                                    }
                                    
                                    if (top + menuRect.height > window.innerHeight) {
                                        top = window.innerHeight - menuRect.height - 10;
                                    }
                                    
                                    subMenu.style.left = left + 'px';
                                    subMenu.style.top = top + 'px';
                                }
                            }, 0);
                            
                            overlay.appendChild(subMenu);
                        }
                    });
                    
                    menuItem.addEventListener('mouseleave', () => {
                        isHovering = false;
                        menuItem.style.background = isDark ? '#2d2d2d' : 'white';
                        menuItem.style.color = isDark ? '#e0e0e0' : '#333';
                        
                        hideTimeout = setTimeout(() => {
                            if (subMenu && subMenu.parentNode) {
                                subMenu.remove();
                            }
                        }, 300);
                    });
                    
                    menuItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                    
                    menu.appendChild(menuItem);
                } else if (type === 'Button') {
                    // 按钮
                    const menuItem = document.createElement('div');
                    menuItem.style.cssText = `
                        padding: 10px 20px;
                        cursor: pointer;
                        font-size: 14px;
                        color: ${isDark ? '#e0e0e0' : '#333'};
                        background: ${isDark ? '#2d2d2d' : 'white'};
                        transition: all 0.2s;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    `;
                    menuItem.textContent = value;
                    
                    menuItem.addEventListener('mouseenter', () => {
                        menuItem.style.background = isDark ? '#404040' : '#4c97ff';
                        menuItem.style.color = 'white';
                    });
                    
                    menuItem.addEventListener('mouseleave', () => {
                        menuItem.style.background = isDark ? '#2d2d2d' : 'white';
                        menuItem.style.color = isDark ? '#e0e0e0' : '#333';
                    });
                    
                    menuItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                        overlay.remove();
                        _stageMenuOverlay = null;
                        
                        // 返回路径
                        if (parentPath && parentPath.length > 0) {
                            const fullPath = [...parentPath, value];
                            resolve(JSON.stringify(fullPath));
                        } else {
                            resolve(value);
                        }
                    });
                    
                    menu.appendChild(menuItem);
                }
            });
            
            return menu;
        }

        // ========== 设置面板样式 ==========
        
        setPopupStyle(args) {
            const css = Scratch.Cast.toString(args.CSS);
            const type = Scratch.Cast.toString(args.TYPE);
            
            // 安全过滤
            const result = sanitizeCSS(css);
            
            // 保存样式
            customStyles[type] = result.css;
            
            // 如果有被屏蔽的内容，显示警告
            if (result.hasBlocked) {
                console.warn(translate('style.warning'));
            }
            
            // 如果有活动的弹窗，立即应用样式
            if (activePopup) {
                this._applyCustomStyles(type);
            }
            
            console.log('✅ 样式已保存，类型:', type);
            console.log('📝 CSS:', result.css);
        }

        // 获取当前主题的CSS
        getCss(args) {
            const type = Scratch.Cast.toString(args.TYPE);
            return customStyles[type];
        }
        
        // 删除所有自定义CSS
        clearAllStyles() {
            customStyles.all = '';
            customStyles.confirm = '';
            customStyles.input = '';
            customStyles.custom = '';
            console.log('🗑️ 已删除所有自定义CSS');
        }
        
        // 设置弹窗颜色
        setPopupColor(args) {
            const type = Scratch.Cast.toString(args.TYPE);
            const color = Scratch.Cast.toString(args.COLOR);
            
            // 生成CSS背景样式
            const css = `background: ${color};`;
            
            // 保存到customStyles
            customStyles[type] = css;
            
            // 如果有活动的弹窗，立即应用
            if (activePopup) {
                const popupType = activePopup.querySelector('.better-popup') ? 
                    (activePopup.dataset.popupType || 'all') : 'all';
                this._applyCustomStyles(popupType);
            }
            
            console.log('🎨 已设置', type, '弹窗颜色:', color);
        }
        
        // ========== 用户行为追踪 ==========
        
        // 开启行为追踪
        enableTracking(args) {
            const mode = Scratch.Cast.toString(args.MODE);
            this.trackingEnabled = true;
            this.trackingMode = mode;
            
            // 重置追踪数据
            this.trackingData = {
                buttonClicks: {},
                inputActions: {},
                popupOpenTime: this.trackingData.popupOpenTime,
                actions: [],
                lastAction: null
            };
            
            console.log('📊 已开启行为追踪，模式:', mode);
            console.log('💡 提示：追踪已默认开启，此积木用于重置数据或切换模式');
        }
        
        // 记录按钮点击
        _trackButtonClick(buttonName) {
            if (!this.trackingEnabled) {
                console.log('⚠️ 追踪未开启，忽略按钮点击:', buttonName);
                return;
            }
            if (this.trackingMode !== 'all' && this.trackingMode !== 'button') return;
            
            // 记录点击次数
            if (!this.trackingData.buttonClicks[buttonName]) {
                this.trackingData.buttonClicks[buttonName] = 0;
            }
            this.trackingData.buttonClicks[buttonName]++;
            
            // 记录操作
            const action = {
                type: 'button',
                detail: buttonName,
                timestamp: Date.now()
            };
            this.trackingData.actions.push(action);
            this.trackingData.lastAction = action;
            
            console.log('👆 [追踪] 按钮点击 -', buttonName, '(共' + this.trackingData.buttonClicks[buttonName] + '次)');
        }
        
        // 记录输入操作
        _trackInputAction(inputId, value) {
            if (!this.trackingEnabled) {
                console.log('⚠️ 追踪未开启，忽略输入操作:', inputId);
                return;
            }
            if (this.trackingMode !== 'all' && this.trackingMode !== 'input') return;
            
            // 记录输入状态
            if (!this.trackingData.inputActions[inputId]) {
                this.trackingData.inputActions[inputId] = {
                    length: 0,
                    changes: 0,
                    lastValue: ''
                };
            }
            
            const input = this.trackingData.inputActions[inputId];
            input.length = value ? value.length : 0;
            input.changes++;
            input.lastValue = value;
            
            // 记录操作
            const action = {
                type: 'input',
                detail: { id: inputId, length: input.length, value: value },
                timestamp: Date.now()
            };
            this.trackingData.actions.push(action);
            this.trackingData.lastAction = action;
            
            console.log('⌨️ [追踪] 输入操作 -', inputId, '长度:', input.length, '(修改' + input.changes + '次)');
        }
        
        // 记录弹窗操作
        _trackPopupAction(actionType, detail) {
            if (!this.trackingEnabled) {
                console.log('⚠️ 追踪未开启，忽略弹窗操作:', actionType);
                return;
            }
            if (this.trackingMode !== 'all' && this.trackingMode !== 'time') return;
            
            const action = {
                type: 'popup',
                detail: { action: actionType, ...detail },
                timestamp: Date.now()
            };
            this.trackingData.actions.push(action);
            this.trackingData.lastAction = action;
            
            if (actionType === 'open') {
                this.trackingData.popupOpenTime = Date.now();
                console.log('📦 [追踪] 弹窗打开 -', detail.type || 'unknown');
            } else if (actionType === 'close') {
                console.log('📦 [追踪] 弹窗关闭 - 显示时间:', detail.displayTime || 0, '秒');
            } else {
                console.log('📦 [追踪] 弹窗操作 -', actionType);
            }
        }
        
        // 获取按钮点击次数
        getButtonClickCount(args) {
            const button = Scratch.Cast.toString(args.BUTTON);
            return this.trackingData.buttonClicks[button] || 0;
        }
        
        // 获取输入长度
        getInputLength(args) {
            const inputId = Scratch.Cast.toString(args.INPUT_ID);
            if (this.trackingData.inputActions[inputId]) {
                return this.trackingData.inputActions[inputId].length;
            }
            return 0;
        }
        
        // 获取弹窗显示时间
        getPopupDisplayTime() {
            if (!this.trackingData.popupOpenTime) return 0;
            const elapsed = (Date.now() - this.trackingData.popupOpenTime) / 1000;
            return Math.round(elapsed * 10) / 10; // 保留一位小数
        }
        
        // 获取追踪数据
        getTrackingData(args) {
            const format = Scratch.Cast.toString(args.FORMAT);
            
            if (format === 'json') {
                return JSON.stringify(this.trackingData, null, 2);
            } else if (format === 'simple') {
                return JSON.stringify({
                    buttonClicks: this.trackingData.buttonClicks,
                    totalActions: this.trackingData.actions.length,
                    displayTime: this.getPopupDisplayTime()
                });
            } else if (format === 'csv') {
                let csv = 'type,detail,timestamp\n';
                this.trackingData.actions.forEach(action => {
                    const detail = typeof action.detail === 'object' ? JSON.stringify(action.detail) : action.detail;
                    csv += `${action.type},${detail},${action.timestamp}\n`;
                });
                return csv;
            }
            
            return JSON.stringify(this.trackingData);
        }
        
        // 清空追踪数据
        clearTrackingData() {
            this.trackingData = {
                buttonClicks: {},
                inputActions: {},
                popupOpenTime: null,
                actions: [],
                lastAction: null
            };
            console.log('🗑️ 已清空追踪数据');
        }
        
        // 获取最后一次操作
        getLastAction() {
            if (!this.trackingData.lastAction) return '无操作';
            return JSON.stringify(this.trackingData.lastAction);
        }
        
        // 获取指定类型的操作
        getActionsByType(args) {
            const actionType = Scratch.Cast.toString(args.ACTION_TYPE);
            
            let filtered;
            if (actionType === 'all') {
                filtered = this.trackingData.actions;
            } else {
                filtered = this.trackingData.actions.filter(a => a.type === actionType);
            }
            
            return JSON.stringify(filtered, null, 2);
        }
        
        // 生成渐变色
        generateGradient(args) {
            const direction = Scratch.Cast.toString(args.DIRECTION);
            const color1 = Scratch.Cast.toString(args.COLOR1);
            const color2 = Scratch.Cast.toString(args.COLOR2);
            
            let gradient;
            
            switch (direction) {
                case 'top':
                    // 由上往下
                    gradient = `linear-gradient(to bottom, ${color1}, ${color2})`;
                    break;
                case 'left':
                    // 由左往右
                    gradient = `linear-gradient(to right, ${color1}, ${color2})`;
                    break;
                case 'center':
                    // 由里往外（径向渐变）
                    gradient = `radial-gradient(circle, ${color1}, ${color2})`;
                    break;
                default:
                    gradient = `linear-gradient(to bottom, ${color1}, ${color2})`;
            }
            
            console.log('🌈 生成渐变色:', gradient);
            return gradient;
        }
        
        // 过滤危险字符
        sanitizeContent(args) {
            const type = Scratch.Cast.toString(args.TYPE);
            const content = Scratch.Cast.toString(args.CONTENT);
            
            let sanitized = content;
            
            switch (type) {
                case 'html':
                    // HTML过滤：移除script标签和危险属性
                    sanitized = content
                        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                        .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
                        .replace(/javascript\s*:/gi, '')
                        .replace(/vbscript\s*:/gi, '')
                        .replace(/data\s*:/gi, '')
                        .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
                        .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '')
                        .replace(/<embed[^>]*>[\s\S]*?<\/embed>/gi, '')
                        .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '');
                    break;
                    
                case 'bbcode':
                    // BBCode过滤：移除可能嵌入脚本的标签
                    sanitized = content
                        .replace(/\[url\s*=\s*javascript:[^\]]*\]/gi, '[url=blocked]')
                        .replace(/\[url\s*=\s*vbscript:[^\]]*\]/gi, '[url=blocked]')
                        .replace(/\[img\s*=\s*javascript:[^\]]*\]/gi, '[img=blocked]')
                        .replace(/\[iframe\b[^\]]*\]/gi, '')
                        .replace(/\[\s*\/\s*iframe\s*\]/gi, '');
                    break;
                    
                case 'markdown':
                    // Markdown过滤：移除HTML标签和危险链接
                    sanitized = content
                        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/\[([^\]]*)\]\s*\(\s*javascript:[^)]*\)/gi, '[xss]')
                        .replace(/\[([^\]]*)\]\s*\(\s*vbscript:[^)]*\)/gi, '[xss]')
                        .replace(/\[([^\]]*)\]\s*\(\s*data:[^)]*\)/gi, '[xss]')
                        .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
                        .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '')
                        .replace(/<embed[^>]*>[\s\S]*?<\/embed>/gi, '');
                    break;
                    
                case 'css':
                    // CSS过滤：使用sanitizeCSS函数
                    const result = sanitizeCSS(content);
                    sanitized = result.css;
                    if (result.hasBlocked) {
                        console.warn('⚠️ 已屏蔽不安全的CSS属性');
                    }
                    break;
                    
                default:
                    sanitized = content;
            }
            
            console.log('✅ 已过滤', type, '内容');
            return sanitized;
        }
        
        // 应用自定义样式
        _applyCustomStyles(type) {
            if (!activePopup) return;
            
            const popup = activePopup.querySelector('.better-popup');
            if (!popup) return;
            
            // 应用所有弹窗样式
            if (customStyles.all) {
                this._applyCSSString(popup, customStyles.all);
            }
            
            // 应用特定类型样式
            if (type === 'confirm' && customStyles.confirm) {
                this._applyCSSString(popup, customStyles.confirm);
            }
            
            if (type === 'input' && customStyles.input) {
                this._applyCSSString(popup, customStyles.input);
            }
            
            if (type === 'custom' && customStyles.custom) {
                this._applyCSSString(popup, customStyles.custom);
            }
        }
        
        // 应用CSS字符串
        _applyCSSString(element, cssString) {
            if (!cssString || !cssString.trim()) return;
            
            const styles = cssString.split(';').filter(s => s.trim());
            styles.forEach(style => {
                const colonIndex = style.indexOf(':');
                if (colonIndex > 0) {
                    const prop = style.substring(0, colonIndex).trim();
                    const value = style.substring(colonIndex + 1).trim();
                    if (prop && value) {
                        // 使用cssText直接设置，更可靠
                        element.style.cssText += prop + ':' + value + ';';
                    }
                }
            });
        }

        // ========== 内部方法 ==========
        
        _showModal(options) {
            // 关闭之前的弹窗
            this.closePopup();
            
            // 保存当前target引用（用于Hat积木触发）
            try {
                if (this._currentThread && this._currentThread.target) {
                    this._currentTarget = this._currentThread.target;
                    console.log('✓ Current target saved from _currentThread');
                } else if (this.runtime && this.runtime.editingTarget) {
                    this._currentTarget = this.runtime.editingTarget;
                    console.log('✓ Using runtime.editingTarget');
                } else if (this._currentTarget) {
                    console.log('✓ Using existing _currentTarget');
                } else {
                    console.warn('⚠ No target available, Hat triggers may not work');
                }
            } catch (e) {
                console.warn('⚠ Error getting target:', e);
            }

            const overlay = document.createElement('div');
            overlay.className = 'better-popup-overlay';

            const popup = document.createElement('div');
            popup.className = 'better-popup better-popup-' + _popupAnimation;

            let html = '';
            
            // 类型图标
            const typeIcons = {
                normal: '',
                success: '✓ ',
                error: '✗ ',
                warning: '⚠ ',
                info: 'ℹ '
            };
            
            if (options.title) {
                const icon = typeIcons[options.type] || '';
                html += `<div class="better-popup-title">${icon}${this._escapeHtml(options.title)}</div>`;
            }

            if (options.isHTML) {
                html += `<div class="better-popup-content">${options.content}</div>`;
            } else {
                html += `<div class="better-popup-content">${this._escapeHtml(options.content)}</div>`;
            }

            if (options.showInput) {
                const inputType = options.inputType || 'text';
                
                // 根据输入类型创建不同的输入框
                if (inputType === 'textarea') {
                    html += `<textarea class="better-popup-input better-popup-textarea" placeholder="${this._escapeHtml(options.content)}" id="better-popup-input" rows="4"></textarea>`;
                } else if (inputType === 'password') {
                    html += `<input type="password" class="better-popup-input" placeholder="${this._escapeHtml(options.content)}" id="better-popup-input" />`;
                } else if (inputType === 'url') {
                    html += `<input type="url" class="better-popup-input" placeholder="https://example.com" id="better-popup-input" />`;
                } else if (inputType === 'email') {
                    html += `<input type="email" class="better-popup-input" placeholder="user@example.com" id="better-popup-input" />`;
                } else if (inputType === 'time') {
                    html += `<input type="datetime-local" class="better-popup-input" id="better-popup-input" />`;
                } else if (inputType === 'address') {
                    html += `<input type="text" class="better-popup-input" placeholder="请输入地址..." id="better-popup-input" />`;
                } else {
                    html += `<input type="text" class="better-popup-input" placeholder="${this._escapeHtml(options.content)}" id="better-popup-input" />`;
                }
                
                // 添加验证消息容器
                html += '<div id="better-popup-validation" style="color:#ff6b6b;font-size:12px;margin-top:-12px;margin-bottom:12px;display:none"></div>';
            }
            
            // 选项弹窗
            if (options.isOptions && options.optionsList) {
                html += '<div class="better-popup-options" style="margin-bottom:16px">';
                
                if (options.optionsMode === 'dropdown') {
                    // 下拉菜单
                    html += '<select class="better-popup-input" id="better-popup-options-select">';
                    options.optionsList.forEach((opt, idx) => {
                        html += `<option value="${idx}">${this._escapeHtml(opt)}</option>`;
                    });
                    html += '</select>';
                } else if (options.optionsMode === 'radio') {
                    // 单选
                    options.optionsList.forEach((opt, idx) => {
                        html += `<label style="display:block;margin:8px 0;cursor:pointer">`;
                        html += `<input type="radio" name="better-popup-option" value="${idx}" style="margin-right:8px" ${idx === 0 ? 'checked' : ''}>`;
                        html += `${this._escapeHtml(opt)}`;
                        html += `</label>`;
                    });
                } else if (options.optionsMode === 'checkbox') {
                    // 多选
                    options.optionsList.forEach((opt, idx) => {
                        html += `<label style="display:block;margin:8px 0;cursor:pointer">`;
                        html += `<input type="checkbox" name="better-popup-option" value="${idx}" style="margin-right:8px">`;
                        html += `${this._escapeHtml(opt)}`;
                        html += `</label>`;
                    });
                }
                
                html += '</div>';
            }
            
            // 自定义面板
            if (options.isCustomPanel && options.panelElements) {
                html += '<div class="better-panel-elements" style="margin-bottom:16px">';
                
                options.panelElements.forEach((element, idx) => {
                    if (element.type === 'button') {
                        // 自定义按钮
                        html += `<button class="better-panel-btn" data-panel-idx="${idx}" data-panel-value="${this._escapeHtml(element.value)}" style="background:${element.color};color:white;border:none;padding:10px 20px;border-radius:8px;margin:4px;cursor:pointer;font-size:14px">${this._escapeHtml(element.label)}</button>`;
                    } else if (element.type === 'text') {
                        // 文本元素
                        html += `<div class="better-panel-text" style="margin:8px 0;font-size:14px;color:#333">${this._escapeHtml(element.text)}</div>`;
                    } else if (element.type === 'image') {
                        // 图片元素
                        const imgSrc = this._escapeHtml(element.image);
                        const imgId = this._escapeHtml(element.id);
                        html += `<div class="better-panel-image" data-panel-id="${imgId}" style="margin:8px 0;text-align:center">
                            <img src="${imgSrc}" alt="${imgId}" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)" loading="lazy" onerror="this.style.display='none'">
                        </div>`;
                    } else if (element.type === 'fileImport') {
                        // 文件导入元素
                        const fileId = this._escapeHtml(element.id);
                        const mode = element.mode;
                        let placeholder = '';
                        
                        if (mode === 'both') {
                            placeholder = translate('fileImport.dropOrClick');
                        } else if (mode === 'drop') {
                            placeholder = translate('fileImport.dropHere');
                        } else {
                            placeholder = translate('fileImport.clickToUpload');
                        }
                        
                        html += `<div class="better-panel-file-import" data-panel-id="${fileId}" data-panel-mode="${mode}" style="margin:8px 0;padding:20px;border:2px dashed #ccc;border-radius:8px;text-align:center;cursor:pointer;transition:all 0.3s">
                            <div style="font-size:24px;margin-bottom:8px">📁</div>
                            <div style="color:#666;font-size:14px">${placeholder}</div>
                            <input type="file" style="display:none" data-panel-id="${fileId}" data-panel-mode="${mode}">
                        </div>`;
                    } else if (element.type === 'input') {
                        // 自定义输入框
                        const inputType = element.inputType === 'textarea' ? 'textarea' : 'input';
                        if (inputType === 'textarea') {
                            html += `<textarea class="better-popup-input better-panel-input" data-panel-id="${this._escapeHtml(element.id)}" data-panel-idx="${idx}" data-panel-type="input" placeholder="${this._escapeHtml(element.placeholder)}" style="margin:8px 0;min-height:80px"></textarea>`;
                        } else {
                            const typeMap = {
                                'text': 'text',
                                'number': 'number',
                                'password': 'password',
                                'email': 'email',
                                'url': 'url'
                            };
                            const inputHtmlType = typeMap[element.inputType] || 'text';
                            html += `<input type="${inputHtmlType}" class="better-popup-input better-panel-input" data-panel-id="${this._escapeHtml(element.id)}" data-panel-idx="${idx}" data-panel-type="input" placeholder="${this._escapeHtml(element.placeholder)}" style="margin:8px 0">`;
                        }
                    } else if (element.type === 'options') {
                        // 自定义选项组
                        html += `<div class="better-panel-options" data-panel-id="${this._escapeHtml(element.id)}" data-panel-idx="${idx}" style="margin:8px 0">`;
                        if (element.mode === 'radio') {
                            element.options.forEach((opt, optIdx) => {
                                html += `<label style="display:block;margin:6px 0;cursor:pointer">`;
                                html += `<input type="radio" name="panel-option-${idx}" value="${optIdx}" data-panel-idx="${idx}" data-panel-type="options" style="margin-right:8px" ${optIdx === element.defaultIdx ? 'checked' : ''}>`;
                                html += `${this._escapeHtml(opt)}`;
                                html += `</label>`;
                            });
                        } else if (element.mode === 'checkbox') {
                            element.options.forEach((opt, optIdx) => {
                                html += `<label style="display:block;margin:6px 0;cursor:pointer">`;
                                html += `<input type="checkbox" name="panel-option-${idx}" value="${optIdx}" data-panel-idx="${idx}" data-panel-type="options" style="margin-right:8px">`;
                                html += `${this._escapeHtml(opt)}`;
                                html += `</label>`;
                            });
                        }
                        html += '</div>';
                    } else if (element.type === 'colorPicker') {
                        // 颜色选取元素
                        html += `<div class="better-panel-color-picker" data-panel-id="${this._escapeHtml(element.id)}" data-panel-idx="${idx}" style="margin:8px 0;display:flex;align-items:center;gap:8px">`;
                        html += `<input type="color" value="${this._escapeHtml(element.color || '#ff0000')}" data-panel-id="${this._escapeHtml(element.id)}" data-panel-type="colorPicker" style="width:50px;height:35px;border:none;cursor:pointer;border-radius:4px">`;
                        html += `<span class="color-value" style="color:#666;font-size:13px">${this._escapeHtml(element.color || '#ff0000')}</span>`;
                        html += `</div>`;
                    } else if (element.type === 'checkbox') {
                        // 勾选元素
                        const checkedAttr = element.checked ? 'checked' : '';
                        html += `<div class="better-panel-checkbox" data-panel-id="${this._escapeHtml(element.id)}" data-panel-idx="${idx}" style="margin:8px 0;display:flex;align-items:center;gap:8px;cursor:pointer">`;
                        html += `<input type="checkbox" data-panel-id="${this._escapeHtml(element.id)}" data-panel-type="checkbox" ${checkedAttr} style="width:18px;height:18px;cursor:pointer">`;
                        html += `<span style="font-size:14px;color:#333">${this._escapeHtml(element.id)}</span>`;
                        html += `</div>`;
                    } else if (element.type === 'slider') {
                        // 滑杆输入元素
                        const sliderId = this._escapeHtml(element.id);
                        const sliderMin = element.min !== undefined ? element.min : 0;
                        const sliderMax = element.max !== undefined ? element.max : 100;
                        const sliderVal = element.value !== undefined ? element.value : 50;
                        const showInput = element.mode !== 'slider';
                        html += `<div class="better-panel-slider" data-panel-id="${sliderId}" data-panel-idx="${idx}" style="margin:8px 0;display:flex;align-items:center;gap:8px">`;
                        if (showInput) {
                            html += `<input type="number" class="better-panel-slider-number" data-panel-id="${sliderId}" data-panel-type="slider-number" value="${sliderVal}" min="${sliderMin}" max="${sliderMax}" style="width:60px;padding:4px;border:1px solid #ddd;border-radius:4px;font-size:13px;text-align:center">`;
                        }
                        html += `<input type="range" data-panel-id="${sliderId}" data-panel-type="slider" value="${sliderVal}" min="${sliderMin}" max="${sliderMax}" style="flex:1;cursor:pointer">`;
                        if (!showInput) {
                            html += `<span class="slider-value" style="min-width:35px;text-align:center;font-size:13px;color:#666">${sliderVal}</span>`;
                        }
                        html += '</div>';
                    } else if (element.type === 'colorPicker') {
                        // 颜色选取元素
                        html += this._renderColorPicker(element, idx);
                    } else if (element.type === 'checkbox') {
                        // 勾选元素
                        html += this._renderCheckbox(element, idx);
                    } else if (element.type === 'slider') {
                        // 滑杆输入元素
                        html += this._renderSlider(element, idx);
                    } else if (element.type === 'coordinatePicker') {
                        // 坐标选取元素
                        const cpId = this._escapeHtml(element.id);
                        const cpW = element.width || 300;
                        const cpH = element.height || 200;
                        html += `<div class="better-panel-coord-picker" data-panel-id="${cpId}" data-panel-idx="${idx}" style="margin:8px 0">`;
                        html += `<div style="font-size:13px;color:#666;margin-bottom:4px">📍 ${cpId}</div>`;
                        html += `<canvas class="better-coord-canvas" data-panel-id="${cpId}" width="${cpW}" height="${cpH}" style="border:1px solid #ddd;border-radius:8px;cursor:crosshair;background:#fafafa;display:block"></canvas>`;
                        html += `<div class="better-coord-display" data-panel-id="${cpId}" style="font-size:12px;color:#4c97ff;margin-top:4px">x: 0, y: 0</div>`;
                        html += `</div>`;
                    } else if (element.type === 'trajectoryDrawer') {
                        // 轨迹绘制元素
                        const tdId = this._escapeHtml(element.id);
                        const tdW = element.width || 300;
                        const tdH = element.height || 200;
                        html += `<div class="better-panel-traj-drawer" data-panel-id="${tdId}" data-panel-idx="${idx}" style="margin:8px 0">`;
                        html += `<div style="font-size:13px;color:#666;margin-bottom:4px">✏️ ${tdId} <button class="better-traj-clear-btn" data-panel-id="${tdId}" style="float:right;font-size:11px;padding:2px 8px;border:1px solid #ddd;border-radius:4px;background:#fff;cursor:pointer">✕ 清除</button></div>`;
                        html += `<canvas class="better-traj-canvas" data-panel-id="${tdId}" width="${tdW}" height="${tdH}" style="border:1px solid #ddd;border-radius:8px;cursor:crosshair;background:#fafafa;display:block"></canvas>`;
                        html += `<div class="better-traj-count" data-panel-id="${tdId}" style="font-size:12px;color:#4c97ff;margin-top:4px">0 个点</div>`;
                        html += `</div>`;
                    } else if (element.type === 'customHTML') {
                        // 自定义HTML元素（安全过滤）
                        const chId = this._escapeHtml(element.id);
                        const safeHtml = sanitizeCustomHTML(element.html);
                        html += `<div class="better-panel-custom-html" data-panel-id="${chId}" data-panel-idx="${idx}" style="margin:8px 0">${safeHtml}</div>`;
                    }
                });
                            
                html += '</div>';
            }
            
            // 文件导入弹窗
            if (options.isFileImport) {
                const mode = options.fileImportMode || 'both';
                let placeholder = '';
                
                if (mode === 'both') {
                    placeholder = translate('fileImport.dropOrClick');
                } else if (mode === 'drop') {
                    placeholder = translate('fileImport.dropHere');
                } else {
                    placeholder = translate('fileImport.clickToUpload');
                }
                
                html += `<div class="better-file-import" id="better-file-drop-zone" style="margin:16px 0;padding:30px;border:2px dashed #ccc;border-radius:12px;text-align:center;cursor:pointer;transition:all 0.3s;background:#fafafa">
                    <div style="font-size:48px;margin-bottom:12px">📁</div>
                    <div style="color:#666;font-size:16px;margin-bottom:8px">${placeholder}</div>
                    <div id="better-file-info" style="color:#4c97ff;font-size:14px;display:none"></div>
                    <input type="file" id="better-file-input" style="display:none">
                </div>`;
            }

            html += '<div class="better-popup-buttons">';
            
            if (options.showCancel) {
                html += `<button class="better-popup-btn better-popup-btn-secondary" id="better-popup-cancel">${translate('btn.cancel')}</button>`;
            }
            
            if (options.showConfirm) {
                const confirmText = options.isConfirm ? translate('btn.confirm') : translate('btn.ok');
                const confirmClass = options.isConfirm ? 'better-popup-btn-primary' : 'better-popup-btn-primary';
                html += `<button class="better-popup-btn ${confirmClass}" id="better-popup-confirm" data-panel-value="confirm">${confirmText}</button>`;
            }
            
            // 自定义面板：如果没有按钮，自动添加默认的"确认"按钮
            if (options.isCustomPanel && !options.showConfirm && !options.showCancel) {
                const hasButtonElement = options.panelElements && options.panelElements.some(el => el.type === 'button');
                if (!hasButtonElement) {
                    // 自动添加默认的确认按钮
                    html += `<button class="better-popup-btn better-popup-btn-primary" id="better-popup-confirm" data-panel-value="confirm">${translate('btn.ok')}</button>`;
                }
            }
            
            html += '</div>';

            popup.innerHTML = html;
            overlay.appendChild(popup);
            document.body.appendChild(overlay);

            activePopup = overlay;
            
            // 保存弹窗类型
            const popupType = options.isConfirm ? 'confirm' : (options.isInput ? 'input' : 'all');
            overlay.dataset.popupType = popupType;
            
            // 追踪弹窗打开
            this._trackPopupAction('open', {
                type: popupType,
                title: options.title || ''
            });
            
            // 用于保存resolve函数
            let popupResolve = null;
            
            // 延迟应用自定义样式、绑定按钮事件和触发广播，确俜DOM已完全渲染
            const self = this;
            setTimeout(() => {
                self._applyCustomStyles(popupType);
                
                // 绑定文件导入事件
                if (options.isFileImport) {
                    const dropZone = document.getElementById('better-file-drop-zone');
                    const fileInput = document.getElementById('better-file-input');
                    const fileInfo = document.getElementById('better-file-info');
                    
                    if (dropZone && fileInput) {
                        // 点击上传
                        dropZone.addEventListener('click', () => {
                            fileInput.click();
                        });
                        
                        // 文件选择事件
                        fileInput.addEventListener('change', (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = function(ev) {
                                    window._fileImportResult = window._fileImportResult || {};
                                    window._fileImportResult['file'] = {
                                        name: file.name,
                                        size: file.size,
                                        type: file.type,
                                        content: ev.target.result
                                    };
                                    if (fileInfo) {
                                        fileInfo.style.display = 'block';
                                        fileInfo.textContent = '✅ ' + file.name + ' (' + (file.size/1024).toFixed(1) + ' KB)';
                                    }
                                };
                                reader.readAsDataURL(file);
                            }
                        });
                        
                        // 拖拽事件
                        dropZone.addEventListener('dragover', (e) => {
                            e.preventDefault();
                            dropZone.style.borderColor = '#4c97ff';
                            dropZone.style.background = '#f0f7ff';
                        });
                        
                        dropZone.addEventListener('dragleave', (e) => {
                            dropZone.style.borderColor = '#ccc';
                            dropZone.style.background = '#fafafa';
                        });
                        
                        dropZone.addEventListener('drop', (e) => {
                            e.preventDefault();
                            dropZone.style.borderColor = '#ccc';
                            dropZone.style.background = '#fafafa';
                            
                            const file = e.dataTransfer.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = function(ev) {
                                    window._fileImportResult = window._fileImportResult || {};
                                    window._fileImportResult['file'] = {
                                        name: file.name,
                                        size: file.size,
                                        type: file.type,
                                        content: ev.target.result
                                    };
                                    if (fileInfo) {
                                        fileInfo.style.display = 'block';
                                        fileInfo.textContent = '✅ ' + file.name + ' (' + (file.size/1024).toFixed(1) + ' KB)';
                                    }
                                };
                                reader.readAsDataURL(file);
                            }
                        });
                    }
                }
                            
                // 绑定滑杆联动事件
                if (options.isCustomPanel && options.panelElements) {
                    const sliders = document.querySelectorAll('.better-panel-slider');
                    sliders.forEach(sliderDiv => {
                        const id = sliderDiv.getAttribute('data-panel-id');
                        const rangeInput = sliderDiv.querySelector('input[type="range"]');
                        const numberInput = sliderDiv.querySelector('.better-panel-slider-number');
                        const valueSpan = sliderDiv.querySelector('.slider-value');
                        if (rangeInput && numberInput) {
                            rangeInput.addEventListener('input', () => { numberInput.value = rangeInput.value; });
                            numberInput.addEventListener('input', () => { rangeInput.value = numberInput.value; });
                        }
                        if (rangeInput && valueSpan) {
                            rangeInput.addEventListener('input', () => { valueSpan.textContent = rangeInput.value; });
                        }
                    });
                    // 颜色选取联动
                    const colorPickers = document.querySelectorAll('.better-panel-color-picker');
                    colorPickers.forEach(cp => {
                        const colorInput = cp.querySelector('input[type="color"]');
                        const colorValue = cp.querySelector('.color-value');
                        if (colorInput && colorValue) {
                            colorInput.addEventListener('input', () => { colorValue.textContent = colorInput.value; });
                        }
                    });

                    // 坐标选取事件绑定
                    const coordCanvases = document.querySelectorAll('.better-coord-canvas');
                    coordCanvases.forEach(canvas => {
                        const cpId = canvas.getAttribute('data-panel-id');
                        const display = canvas.parentElement.querySelector('.better-coord-display');
                        // 绘制网格
                        const ctx = canvas.getContext('2d');
                        const drawGrid = () => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.strokeStyle = '#e8e8e8';
                            ctx.lineWidth = 1;
                            for (let x = 0; x <= canvas.width; x += 20) {
                                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
                            }
                            for (let y = 0; y <= canvas.height; y += 20) {
                                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
                            }
                            // 中心十字线
                            ctx.strokeStyle = '#ccc';
                            ctx.beginPath(); ctx.moveTo(canvas.width/2, 0); ctx.lineTo(canvas.width/2, canvas.height); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(0, canvas.height/2); ctx.lineTo(canvas.width, canvas.height/2); ctx.stroke();
                        };
                        drawGrid();
                        // 点击选取坐标
                        canvas.addEventListener('click', (e) => {
                            const rect = canvas.getBoundingClientRect();
                            const x = Math.round(e.clientX - rect.left);
                            const y = Math.round(e.clientY - rect.top);
                            // 绘制标记点
                            drawGrid();
                            ctx.fillStyle = '#4c97ff';
                            ctx.beginPath();
                            ctx.arc(x, y, 5, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.strokeStyle = '#3373cc';
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            // 更新显示
                            if (display) display.textContent = 'x: ' + x + ', y: ' + y;
                            // 存储结果
                            _lastPanelResult[cpId] = [x, y];
                        });
                    });

                    // 轨迹绘制事件绑定
                    const trajCanvases = document.querySelectorAll('.better-traj-canvas');
                    trajCanvases.forEach(canvas => {
                        const tdId = canvas.getAttribute('data-panel-id');
                        const countDisplay = canvas.parentElement.querySelector('.better-traj-count');
                        const ctx = canvas.getContext('2d');
                        let points = [];
                        let isDrawing = false;
                        // 清除按钮
                        const clearBtn = canvas.parentElement.querySelector('.better-traj-clear-btn');
                        if (clearBtn) {
                            clearBtn.addEventListener('click', () => {
                                points = [];
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                if (countDisplay) countDisplay.textContent = '0 个点';
                                _lastPanelResult[tdId] = [];
                            });
                        }
                        const drawPath = () => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            if (points.length < 2) {
                                if (points.length === 1) {
                                    ctx.fillStyle = '#4c97ff';
                                    ctx.beginPath();
                                    ctx.arc(points[0][0], points[0][1], 3, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                                return;
                            }
                            ctx.strokeStyle = '#4c97ff';
                            ctx.lineWidth = 2;
                            ctx.lineCap = 'round';
                            ctx.lineJoin = 'round';
                            ctx.beginPath();
                            ctx.moveTo(points[0][0], points[0][1]);
                            for (let i = 1; i < points.length; i++) {
                                ctx.lineTo(points[i][0], points[i][1]);
                            }
                            ctx.stroke();
                            // 绘制端点
                            ctx.fillStyle = '#3373cc';
                            ctx.beginPath(); ctx.arc(points[0][0], points[0][1], 4, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = '#ff6680';
                            ctx.beginPath(); ctx.arc(points[points.length-1][0], points[points.length-1][1], 4, 0, Math.PI * 2); ctx.fill();
                        };
                        canvas.addEventListener('mousedown', (e) => {
                            isDrawing = true;
                            const rect = canvas.getBoundingClientRect();
                            const x = Math.round(e.clientX - rect.left);
                            const y = Math.round(e.clientY - rect.top);
                            points = [[x, y]];
                            drawPath();
                        });
                        canvas.addEventListener('mousemove', (e) => {
                            if (!isDrawing) return;
                            const rect = canvas.getBoundingClientRect();
                            const x = Math.round(e.clientX - rect.left);
                            const y = Math.round(e.clientY - rect.top);
                            points.push([x, y]);
                            drawPath();
                            if (countDisplay) countDisplay.textContent = points.length + ' 个点';
                        });
                        canvas.addEventListener('mouseup', () => {
                            isDrawing = false;
                            _lastPanelResult[tdId] = points.slice();
                        });
                        canvas.addEventListener('mouseleave', () => {
                            if (isDrawing) {
                                isDrawing = false;
                                _lastPanelResult[tdId] = points.slice();
                            }
                        });
                    });
                }
                
                // 绑定自定义面板按钮事件
                if (options.isCustomPanel && options.panelElements) {
                    const panelButtons = document.querySelectorAll('.better-panel-btn');
                    console.log('[按钮] 找到按钮数量:', panelButtons.length);
                                
                    panelButtons.forEach(btn => {
                        console.log('[按钮] 绑定点击事件到按钮:', btn.getAttribute('data-panel-value'));
                                    
                        btn.addEventListener('click', (e) => {
                            console.log('[按钮] 点击事件触发!');
                            const value = e.target.getAttribute('data-panel-value');
                            console.log('[按钮] 按钮值:', value);
                                        
                            _lastPanelResult['button'] = value;
                            
                            // 收集其他非按钮元素的值
                            console.log('[按钮] 开始收集非按钮元素...');
                            
                            // 输入框 - 通过ID获取值
                            const panelInputs = document.querySelectorAll('.better-panel-input');
                            panelInputs.forEach(input => {
                                const id = input.getAttribute('data-panel-id');
                                if (id) {
                                    _lastPanelResult[id] = input.value;
                                    console.log(`[按钮] 收集输入框 ${id}:`, input.value);
                                }
                            });
                            
                            // 选项组 - 通过ID获取值
                            const panelOptionGroups = document.querySelectorAll('.better-panel-options');
                            panelOptionGroups.forEach(group => {
                                const id = group.getAttribute('data-panel-id');
                                const radios = group.querySelectorAll('input[type="radio"]:checked');
                                const checkboxes = group.querySelectorAll('input[type="checkbox"]:checked');
                                
                                if (radios.length > 0) {
                                    const idx = parseInt(radios[0].value);
                                    const panelEl = options.panelElements.find(el => el.id === id);
                                    if (panelEl && panelEl.options) {
                                        _lastPanelResult[id] = panelEl.options[idx];
                                        console.log(`[按钮] 收集单选 ${id}:`, panelEl.options[idx]);
                                    }
                                } else if (checkboxes.length > 0) {
                                    const results = [];
                                    checkboxes.forEach(cb => {
                                        const idx = parseInt(cb.value);
                                        const panelEl = options.panelElements.find(el => el.id === id);
                                        if (panelEl && panelEl.options) {
                                            results.push(panelEl.options[idx]);
                                        }
                                    });
                                    _lastPanelResult[id] = results;
                                    console.log(`[按钮] 收集多选 ${id}:`, results);
                                }
                            });
                            
                            // 文件导入 - 通过ID获取值
                            const fileImports = document.querySelectorAll('.better-panel-file-import');
                            fileImports.forEach(fileImport => {
                                const id = fileImport.getAttribute('data-panel-id');
                                if (window._fileImportResult && window._fileImportResult[id]) {
                                    _lastPanelResult[id] = window._fileImportResult[id];
                                    console.log(`[按钮] 收集文件 ${id}:`, window._fileImportResult[id].name);
                                }
                            });
                            
                            // 颜色选取
                            document.querySelectorAll('.better-panel-color-picker').forEach(cp => {
                                const id = cp.getAttribute('data-panel-id');
                                const ci = cp.querySelector('input[type="color"]');
                                if (id && ci) _lastPanelResult[id] = ci.value;
                            });
                            // 勾选框
                            document.querySelectorAll('.better-panel-checkbox').forEach(cb => {
                                const id = cb.getAttribute('data-panel-id');
                                const ci = cb.querySelector('input[type="checkbox"]');
                                if (id && ci) _lastPanelResult[id] = ci.checked;
                            });
                            // 滑杆
                            document.querySelectorAll('.better-panel-slider').forEach(sl => {
                                const id = sl.getAttribute('data-panel-id');
                                const ri = sl.querySelector('input[type="range"]');
                                if (id && ri) _lastPanelResult[id] = Number(ri.value);
                            });
                            // 自定义HTML元素
                            document.querySelectorAll('.better-panel-custom-html').forEach(ch => {
                                const id = ch.getAttribute('data-panel-id');
                                if (!id) return;
                                const inputs = ch.querySelectorAll('input, textarea, select');
                                if (inputs.length === 1) {
                                    const el = inputs[0];
                                    _lastPanelResult[id] = el.type === 'number' || el.type === 'range' ? Number(el.value) : el.value;
                                } else if (inputs.length > 1) {
                                    const obj = {};
                                    inputs.forEach((el, i) => {
                                        const key = el.name || el.id || ('v' + i);
                                        obj[key] = el.type === 'number' || el.type === 'range' ? Number(el.value) : (el.type === 'checkbox' ? el.checked : el.value);
                                    });
                                    _lastPanelResult[id] = obj;
                                }
                            });
                            
                            console.log('[按钮] 最终面板结果:', JSON.stringify(_lastPanelResult));
                                        
                            console.log('[按钮] 面板按钮点击: ' + value);
                            console.log('[按钮] 当前绑定:', JSON.stringify(_buttonBindings));
                                        
                            // 执行按钮绑定效果
                            self._executeButtonEffect(value);
                            
                            // 关闭弹窗并resolve Promise
                            self.closePopup();
                            if (options._onClose) options._onClose();
                            else if (popupResolve) popupResolve(true);
                        });
                    });
                }
                
                // 绑定自定义面板文件导入事件
                if (options.isCustomPanel && options.panelElements) {
                    const fileImportElements = document.querySelectorAll('.better-panel-file-import');
                    
                    fileImportElements.forEach(dropZone => {
                        const fileId = dropZone.getAttribute('data-panel-id');
                        const fileInput = dropZone.querySelector('input[type="file"]');
                        
                        if (dropZone && fileInput) {
                            // 点击上传
                            dropZone.addEventListener('click', () => {
                                fileInput.click();
                            });
                            
                            // 文件选择事件
                            fileInput.addEventListener('change', (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = function(ev) {
                                        window._fileImportResult = window._fileImportResult || {};
                                        window._fileImportResult[fileId] = {
                                            name: file.name,
                                            size: file.size,
                                            type: file.type,
                                            content: ev.target.result
                                        };
                                    };
                                    reader.readAsDataURL(file);
                                }
                            });
                            
                            // 拖拽事件
                            dropZone.addEventListener('dragover', (e) => {
                                e.preventDefault();
                                dropZone.style.borderColor = '#4c97ff';
                                dropZone.style.background = '#f0f7ff';
                            });
                            
                            dropZone.addEventListener('dragleave', (e) => {
                                dropZone.style.borderColor = '#ccc';
                                dropZone.style.background = '';
                            });
                            
                            dropZone.addEventListener('drop', (e) => {
                                e.preventDefault();
                                dropZone.style.borderColor = '#ccc';
                                dropZone.style.background = '';
                                
                                const file = e.dataTransfer.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = function(ev) {
                                        window._fileImportResult = window._fileImportResult || {};
                                        window._fileImportResult[fileId] = {
                                            name: file.name,
                                            size: file.size,
                                            type: file.type,
                                            content: ev.target.result
                                        };
                                    };
                                    reader.readAsDataURL(file);
                                }
                            });
                        }
                    });
                }
            }, 100);

            // 自动关闭
            if (options.autoClose) {
                setTimeout(() => this.closePopup(), options.autoClose);
            }

            // 获取验证消息元素
            const validationMsg = document.getElementById('better-popup-validation');

            // 焦点管理
            const input = document.getElementById('better-popup-input');
            if (input) {
                input.focus();
                
                // 输入时清除验证错误
                input.addEventListener('input', () => {
                    // 追踪输入操作
                    this._trackInputAction('main_input', input.value);
                    
                    if (validationMsg) {
                        validationMsg.style.display = 'none';
                    }
                });
            }

            // 事件绑定
            return new Promise((resolve) => {
                // 保存resolve函数供setTimeout使用
                popupResolve = resolve;
                
                const confirmBtn = document.getElementById('better-popup-confirm');
                const cancelBtn = document.getElementById('better-popup-cancel');

                // 验证函数
                const validateInput = (value, type) => {
                    if (!validationMsg) return true;
                    
                    if (type === 'url') {
                        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                        if (!urlPattern.test(value)) {
                            validationMsg.textContent = translate('validation.url');
                            validationMsg.style.display = 'block';
                            return false;
                        }
                    } else if (type === 'email') {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(value)) {
                            validationMsg.textContent = translate('validation.email');
                            validationMsg.style.display = 'block';
                            return false;
                        }
                    } else if (type === 'time') {
                        if (!value) {
                            validationMsg.textContent = translate('validation.time');
                            validationMsg.style.display = 'block';
                            return false;
                        }
                    }
                    
                    validationMsg.style.display = 'none';
                    return true;
                };

                if (confirmBtn) {
                    confirmBtn.addEventListener('click', () => {
                        // 追踪按钮点击
                        this._trackButtonClick('confirm');
                        
                        // 验证输入
                        if (options.isInput && input) {
                            const value = input.value;
                            const inputType = options.inputType || 'text';
                            
                            if (!validateInput(value, inputType)) {
                                return; // 验证失败，不关闭弹窗
                            }
                            
                            this._lastInputValue = value;
                        }
                        
                        // 获取选项结果
                        if (options.isOptions) {
                            if (options.optionsMode === 'dropdown') {
                                // 下拉菜单
                                const select = document.getElementById('better-popup-options-select');
                                if (select && options.optionsList) {
                                    const idx = parseInt(select.value);
                                    this._lastOptionsResult = options.optionsList[idx] || '';
                                }
                            } else if (options.optionsMode === 'radio') {
                                // 单选
                                const selected = document.querySelector('input[name="better-popup-option"]:checked');
                                if (selected && options.optionsList) {
                                    const idx = parseInt(selected.value);
                                    this._lastOptionsResult = options.optionsList[idx] || '';
                                }
                            } else if (options.optionsMode === 'checkbox') {
                                // 多选 - 返回数组
                                const checked = document.querySelectorAll('input[name="better-popup-option"]:checked');
                                if (options.optionsList) {
                                    const results = [];
                                    checked.forEach(cb => {
                                        const idx = parseInt(cb.value);
                                        results.push(options.optionsList[idx]);
                                    });
                                    this._lastOptionsResult = results; // 返回数组
                                }
                            }
                        }
                        
                        // 获取自定义面板结果
                        if (options.isCustomPanel && options.panelElements) {
                            // 不重置 _lastPanelResult，保留坐标选取/轨迹绘制等实时存储的值
                            
                            // 收集输入框值
                            const panelInputs = document.querySelectorAll('.better-panel-input');
                            panelInputs.forEach(input => {
                                const id = input.getAttribute('data-panel-id');
                                if (id) {
                                    _lastPanelResult[id] = input.value;
                                }
                            });
                            
                            // 选项组 - 通过ID获取值
                            const panelOptionGroups = document.querySelectorAll('.better-panel-options');
                            panelOptionGroups.forEach(group => {
                                const id = group.getAttribute('data-panel-id');
                                const radios = group.querySelectorAll('input[type="radio"]:checked');
                                const checkboxes = group.querySelectorAll('input[type="checkbox"]:checked');
                                
                                if (radios.length > 0) {
                                    const optIdx = parseInt(radios[0].value);
                                    // 需要从panelElements中获取选项列表
                                    const idx = parseInt(group.getAttribute('data-panel-idx'));
                                    const element = options.panelElements[idx];
                                    if (element && element.options && id) {
                                        _lastPanelResult[id] = element.options[optIdx];
                                    }
                                } else if (checkboxes.length > 0) {
                                    const results = [];
                                    checkboxes.forEach(cb => {
                                        const optIdx = parseInt(cb.value);
                                        const idx = parseInt(group.getAttribute('data-panel-idx'));
                                        const element = options.panelElements[idx];
                                        if (element && element.options) {
                                            results.push(element.options[optIdx]);
                                        }
                                    });
                                    if (id) {
                                        _lastPanelResult[id] = results;
                                    }
                                }
                            });
                            
                            // 文件导入 - 通过ID获取值
                            if (window._fileImportResult) {
                                Object.keys(window._fileImportResult).forEach(id => {
                                    _lastPanelResult[id] = window._fileImportResult[id];
                                });
                                window._fileImportResult = {};
                            }
                            
                            // 颜色选取
                            document.querySelectorAll('.better-panel-color-picker').forEach(cp => {
                                const id = cp.getAttribute('data-panel-id');
                                const ci = cp.querySelector('input[type="color"]');
                                if (id && ci) _lastPanelResult[id] = ci.value;
                            });
                            // 勾选框
                            document.querySelectorAll('.better-panel-checkbox').forEach(cb => {
                                const id = cb.getAttribute('data-panel-id');
                                const ci = cb.querySelector('input[type="checkbox"]');
                                if (id && ci) _lastPanelResult[id] = ci.checked;
                            });
                            // 滑杆
                            document.querySelectorAll('.better-panel-slider').forEach(sl => {
                                const id = sl.getAttribute('data-panel-id');
                                const ri = sl.querySelector('input[type="range"]');
                                if (id && ri) _lastPanelResult[id] = Number(ri.value);
                            });
                            // 自定义HTML元素
                            document.querySelectorAll('.better-panel-custom-html').forEach(ch => {
                                const id = ch.getAttribute('data-panel-id');
                                if (!id) return;
                                const inputs = ch.querySelectorAll('input, textarea, select');
                                if (inputs.length === 1) {
                                    const el = inputs[0];
                                    _lastPanelResult[id] = el.type === 'number' || el.type === 'range' ? Number(el.value) : el.value;
                                } else if (inputs.length > 1) {
                                    const obj = {};
                                    inputs.forEach((el, i) => {
                                        const key = el.name || el.id || ('v' + i);
                                        obj[key] = el.type === 'number' || el.type === 'range' ? Number(el.value) : (el.type === 'checkbox' ? el.checked : el.value);
                                    });
                                    _lastPanelResult[id] = obj;
                                }
                            });
                        }
                        
                        if (options.isConfirm) {
                            this._lastResult = true;
                        }
                        this.closePopup();
                        if (options._onClose) options._onClose();
                        else resolve(true);
                    });
                }

                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => {
                        // 追踪按钮点击
                        this._trackButtonClick('cancel');
                        
                        console.log('[取消] 取消按钮被点击');
                        
                        // 确认弹窗：设置为false
                        if (options.isConfirm) {
                            this._lastResult = false;
                        }
                        
                        // 输入弹窗：清空输入值
                        if (options.isInput) {
                            this._lastInputValue = '';
                            console.log('[取消] 已清空输入值');
                        }
                        
                        // 选项弹窗：清空结果
                        if (options.isOptions) {
                            this._lastOptionsResult = '';
                        }
                        
                        // 自定义面板：清空结果
                        if (options.isCustomPanel) {
                            _lastPanelResult = {};
                        }
                        
                        this.closePopup();
                        if (options._onClose) options._onClose();
                        else resolve(false);
                    });
                }

                // 点击遮罩关闭
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        if (options.isConfirm) {
                            this._lastResult = false;
                        }
                        this.closePopup();
                        if (options._onClose) options._onClose();
                        else resolve(false);
                    }
                });
            });
        }

        _renderColorPicker(element, idx) {
            const id = this._escapeHtml(element.id);
            const color = this._escapeHtml(element.color || '#ff0000');
            let html = `<div class="better-panel-color-picker" data-panel-id="${id}" data-panel-idx="${idx}" style="margin:8px 0;display:flex;align-items:center;gap:8px">`;
            html += `<input type="color" value="${color}" data-panel-id="${id}" data-panel-type="colorPicker" style="width:50px;height:35px;border:none;cursor:pointer;border-radius:4px">`;
            html += `<span class="color-value" style="color:#666;font-size:13px">${color}</span>`;
            html += `</div>`;
            return html;
        }

        _renderCheckbox(element, idx) {
            const id = this._escapeHtml(element.id);
            const checkedAttr = element.checked ? 'checked' : '';
            let html = `<div class="better-panel-checkbox" data-panel-id="${id}" data-panel-idx="${idx}" style="margin:8px 0;display:flex;align-items:center;gap:8px;cursor:pointer">`;
            html += `<input type="checkbox" data-panel-id="${id}" data-panel-type="checkbox" ${checkedAttr} style="width:18px;height:18px;cursor:pointer">`;
            html += `<span style="font-size:14px;color:#333">${id}</span>`;
            html += `</div>`;
            return html;
        }

        _renderSlider(element, idx) {
            const id = this._escapeHtml(element.id);
            const min = element.min !== undefined ? element.min : 0;
            const max = element.max !== undefined ? element.max : 100;
            const val = element.value !== undefined ? element.value : 50;
            const showInput = element.mode !== 'slider';
            let html = `<div class="better-panel-slider" data-panel-id="${id}" data-panel-idx="${idx}" style="margin:8px 0;display:flex;align-items:center;gap:8px">`;
            if (showInput) {
                html += `<input type="number" class="better-panel-slider-number" data-panel-id="${id}" data-panel-type="slider-number" value="${val}" min="${min}" max="${max}" style="width:60px;padding:4px;border:1px solid #ddd;border-radius:4px;font-size:13px;text-align:center">`;
            }
            html += `<input type="range" data-panel-id="${id}" data-panel-type="slider" value="${val}" min="${min}" max="${max}" style="flex:1;cursor:pointer">`;
            if (!showInput) {
                html += `<span class="slider-value" style="min-width:35px;text-align:center;font-size:13px;color:#666">${val}</span>`;
            }
            html += `</div>`;
            return html;
        }

        _escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }

    // 注册扩展
    Scratch.extensions.register(new BetterPopup(Scratch.runtime));
})(Scratch);