(function(Scratch) {
  'use strict';

  if (!Scratch) {
    throw new Error('Scratch 环境未找到，请确保在 Scratch 编辑器中加载此扩展。');
  }

  // ==================== 图片资源配置 ====================
  const BLOCK_ICON_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNDQuMjU1ODMiIGhlaWdodD0iMTQ0LjI1NTgzIiB2aWV3Qm94PSIwLDAsMTQ0LjI1NTgzLDE0NC4yNTU4MyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI0Ny44NzIxMSwtMTA3Ljg3MjEpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PGcgc3Ryb2tlPSIjNjMzYzEyIiBzdHJva2Utd2lkdGg9IjEyIj48cGF0aCBkPSJNMjYzLjU5NjU4LDE0Ny4yNjUzMXYtMTEuODgwNTZoNzEuNTY2M3YxMS44ODA1NnoiIGZpbGw9IiNhMGEwYTAiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTI2My41OTY1OCwyMDEuMjkzNjR2LTU0LjkwNzY0aDcxLjU2NjN2NTQuOTA3NjR6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxwYXRoIGQ9Ik0yNjYuMTc2NDksMTQzLjg3MDg2di02LjIyMzE1aDEyLjcyOTE5djYuMjIzMTV6IiBmaWxsPSIjNDllNDdiIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxnIGZpbGw9IiNmZmZmZmYiPjxnIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjgyLjMxMzksMTY3LjM5MTYxYy0yLjUwMTY3LC0yLjk2NDQxIC0xLjM5MTU5LC03LjA2MDE3IC0xLjM5MTU5LC03LjA2MDE3YzEuNjIxMzYsMi42OTY3MiA0LjAyNDg1LDMuMDI0OTEgNC4wMjQ4NSwzLjAyNDkxYzAsMCAtMi42MjA5OSw0LjAwNDEyIC0yLjYzMzI1LDQuMDM1MjZ6Ii8+PHBhdGggZD0iTTI4Mi4xNjUzNSwxNjcuNzUwNDFjMC44MDY4MiwtMS45MTk4OSAxLjY1NTg5LC0zLjM2MjYyIDIuOTYxMTQsLTQuNTc1MjRsMS4xNTM2LDAuNDY4OTJjLTEuNDQzOCwxLjM0NTExIC0yLjU0MTQ2LDMuMDM1MjggLTMuMjAxODEsNC45MTIxNGwtMC45MTI5MywtMC44MDU4MXoiLz48L2c+PGcgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0zMDYuMDM3NDMsMTY1LjI5MDkxdjBjLTAuMDE3NTUsLTAuMDI4NSAtMy4zMDEzNiwtMy41MDk3NiAtMy4zMDEzNiwtMy41MDk3NmMwLDAgMi4zMDg0MiwtMC43NDU0MiAzLjQzMDY5LC0zLjY4NTA5Yy0wLjAxNDkxLDAuMDAxMzIgMS43OTc1OSwzLjgzODI4IC0wLjEyOTMzLDcuMTk0ODR6Ii8+PHBhdGggZD0iTTMwNi4yNDY3NSwxNjUuNjE4MDJsLTAuNzU3MTIsMC45NTM2OWMtMC45Nzk4NywtMS43MzE2MiAtMi4zNzIzNiwtMy4yMDEyOSAtNC4wMTUxNSwtNC4yNzMwOWwxLjA1MzI1LC0wLjY2NDMyYzEuNDk4MDMsMC45NjQ0IDIuNTg3NCwyLjIzNTQ4IDMuNzE5MDMsMy45ODM3MnoiLz48L2c+PHBhdGggZD0iTTI4My44NTIzMSwxNzguMzE2bC0xLjQ2MzE1LC0wLjIzMTExYzAsMCAtMS4wOTYzNiwtMS4xODAzIC0xLjUwOTM5LC0zLjYzODM4Yy0wLjM1OTQzLC0yLjE5MjMyIDAuMjgwMzMsLTMuOTYyMTYgMC4yODAzMywtMy45NjIxNmwxLjU0NjI1LC0wLjUyNzY0YzAsMCAtMC4zNjU3LDEuNjQwMzcgLTAuMTI5MzYsNC4zMDk0NmMwLjE5NTQxLDIuMjA2ODQgMS4yNzUzMSw0LjA0OTgzIDEuMjc1MzEsNC4wNDk4M3oiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zMDYuODgyMDYsMTcyLjExMzk5Yy0wLjIzNjM0LC0yLjY2OTA5IC0wLjg4NDYsLTQuMjE5NjggLTAuODg0NiwtNC4yMTk2OGwxLjYxNDkxLDAuMjQ3NzNjMCwwIDAuOTI1OSwxLjYzMTIgMC45NTcyOSwzLjg1MjU3YzAuMDI1MzQsMi40OTI0MSAtMC44NDY1NywzLjg0NyAtMC44NDY1NywzLjg0N2wtMS40MTQ2OSwwLjQ4NTk0YzAsMCAwLjc1NDE2LC0yLjAwNTM5IDAuNTczNjYsLTQuMjEzNTV6IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMjgzLjEzOTIyLDE2OC41NjU4NmMwLjk1NjkzLC0yLjk0MDA2IDMuMjAxODEsLTQuOTEyMTQgMy4yMDE4MSwtNC45MTIxNGMwLjg1OTc5LC0wLjgxMjUgMS44NjU2NiwtMS41MDI2OSAyLjk0NTcsLTIuMDM0MTRjMC4zMTYxNiwtMC4xNjMyNSAwLjY0OTg4LC0wLjI5OCAwLjk4MzU5LC0wLjQzMjc0YzAsMCAxLjcxMDI3LC0wLjU0MjE3IDMuMzIwNjYsLTAuNjg0NzdjMS43NzQ0MiwtMC4xNTcxMiAzLjM4OTMzLDAuMDkwNjEgMy4zODkzMywwLjA5MDYxYzAuMzUwODgsMC4wNTkxIDAuNjg4MTYsMC4xMzQ0MyAxLjAyODA5LDAuMjM5NTh2MGMxLjE3MTUzLDAuMzMyMDggMi4yNjgxMiwwLjgzNjA5IDMuMjcyMjIsMS40ODM1NWMxLjY0Mjc5LDEuMDcxOCAzLjAzNTI4LDIuNTQxNDcgNC4wMTUxNSw0LjI3MzA5YzAuMjQ4MzcsMC40Mjg4NSAwLjQ1MjAxLDAuODYxNjYgMC42NDIwNCwxLjMxMDdjMC40NzQ0NCwxLjExNTE0IDAuNzc3ODgsMi4zMzU2IDAuODkwMTEsMy42MDMwNGMwLjE0OTIsMS42ODQ5NSAtMC4wNTI0OCwzLjMxMDgxIC0wLjU0OTM1LDQuODI3NTVjLTEuMDk3NTcsMy4zODgzMiAtMy42MzI5OCw2LjE1MjU2IC02Ljk1MjU2LDcuNTI4NTJjLTEuMTE2NDYsMC40NTk1MyAtMi4zMjIwMSwwLjc2MTY1IC0zLjU4OTQ1LDAuODczODhjLTEuMjY3NDQsMC4xMTIyMyAtMi41MDczMSwwLjAyNjY1IC0zLjY4NzE2LC0wLjIyOTU1Yy01LjA3Mjg5LC0xLjExMzcxIC05LjA1OTU0LC01LjQwNDM1IC05LjU0MTQ3LC0xMC44NDY5Yy0wLjE1NzEyLC0xLjc3NDQyIDAuMTExMTksLTMuNDk2MzQgMC42MzEyOCwtNS4wOTAyOHoiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTI5NS43NTI4MiwxODQuNzQ2MTdjLTEuODc4OCwwLjE2NjM3IC0zLjY4NzE2LC0wLjIyOTU1IC0zLjY4NzE2LC0wLjIyOTU1bDAuMzc2ODEsLTEuMTc1NDljMS4wMTg0NiwwLjMwMDU0IDIuMDg2MzksMC4zMTExOCAzLjIwNDcyLDAuMjEyMTVjMS4xMTgzMywtMC4wOTkwMyAyLjE2Nzc3LC0wLjI5NzE1IDMuMTE3NTgsLTAuNzcxOThsMC41Nzc1LDEuMDkwOThjMCwwIC0xLjcxMDY1LDAuNzA3NTIgLTMuNTg5NDUsMC44NzM4OHoiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PGcgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjk3LjgyMTU1LDE2MC43NTg2bDAuNzEzMDIsMS4wOTQwMmMwLjA4MzE4LDAuOTM5NCAtMS45NjU5MiwyLjA2NzYxIC00LjYwNTE4LDIuMzAxMzJjLTIuNjM5MjYsMC4yMzM3IC00Ljg1NDczLC0wLjUxNjg4IC00LjkzNzkxLC0xLjQ1NjI4bDAuNTExMDEsLTEuMTg3MzhsLTAuMDQ3NzYsMC4xMzk0OGMwLjA3MjYyLDAuODIwMTEgMi4wMjY2OCwxLjUwMzY4IDQuMzUyODEsMS4yOTc3YzIuMzI2MTMsLTAuMjA1OTggNC4xMjk2NiwtMS4yMjIyOCA0LjA1NzA0LC0yLjA0MjM5Yy0wLjAxNDkxLDAuMDAxMzIgLTAuMDQzMDMsLTAuMTQ2NDcgLTAuMDQzMDMsLTAuMTQ2NDd6Ii8+PHBhdGggZD0iTTI5Ni4xMzYyNiwxNTkuODg1OTJjMS4wMDc5LDAuMTgxMjYgMS42ODczNywwLjU1NjkgMS43Mjk2MiwxLjAzNDA2YzAuMDcyNjIsMC44MjAxMSAtMS43MzA5MSwxLjgzNjQxIC00LjA1NzA1LDIuMDQyMzhjLTIuMzI2MTMsMC4yMDU5OCAtNC4yODAxOSwtMC40Nzc1OSAtNC4zNTI4MSwtMS4yOTc3Yy0wLjA0MzU3LC0wLjQ5MjA3IDAuNTU5MzEsLTAuOTgxMjcgMS41MzQ1OSwtMS4zMzgxM3YwIi8+PHBhdGggZD0iTTI5NS4yNjM4MywxNTguMDA5NTZsMS43MTUxOSwyLjU2ODE5djBjMC4wNTk0MiwwLjY3MSAtMS4zODE1MiwxLjM2OTY2IC0zLjI0NTQxLDEuNTM0NzFjLTEuODYzODksMC4xNjUwNSAtMy40MDUxNywtMC4yNjk1NSAtMy40NjQ1OSwtMC45NDA1NHYwbDEuMjM3MjEsLTIuODI5NjIiLz48cGF0aCBkPSJNMjkxLjQ4OTYyLDE1OC40OTQwNWMtMC4wMzM1NCwtMC4zNzg4MiAwLjc5Mzc4LC0wLjc2MTU3IDEuODQ3ODgsLTAuODU0OTFjMS4wNTQxLC0wLjA5MzM0IDEuOTM1ODEsMC4xMzgwOCAxLjk2OTM2LDAuNTE2OWMwLjAzMzU0LDAuMzc4ODIgLTAuNzkzNzgsMC43NjE1OCAtMS44NDc4OCwwLjg1NDkyYy0xLjA1NDEsMC4wOTMzNCAtMS45MzU4MSwtMC4xMzgwOCAtMS45NjkzNSwtMC41MTY5eiIvPjwvZz48L2c+PHBhdGggZD0iTTI4MC42MDE0NiwxNDMuODY5NDR2LTYuMjIzMTVoMTIuNzI5MTl2Ni4yMjMxNXoiIGZpbGw9IiNmZmQyMzciIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTI5NS4wMjY0NiwxNDMuODY4di02LjIyMzE1aDEyLjcyOTE4djYuMjIzMTV6IiBmaWxsPSIjZTk5NTk1IiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxwYXRoIGQ9Ik0zMTcuMjIxMzYsMjA1LjUwNTk2YzAsMCAtNy41MTY2MiwtNy4wNjMxMiAtMTAuNzcwNzksLTExLjQ3MjdjLTIuOTMwNjcsLTMuOTcxMjQgLTcuODg1NTEsLTEzLjgwNzcgLTcuODg1NTEsLTEzLjgwNzdjMCwwIDkuOTIxMiwzLjIzNjAzIDE1LjQxMTIyLDMuNTQ1MTljNy4wNjExOCwwLjM5NzY1IDIzLjQ0MTI0LC0xLjM1NzI2IDIzLjQ0MTI0LC0xLjM1NzI2IiBmaWxsPSIjZWVlZWVlIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48ZyBmaWxsPSIjZmZmZmZmIj48ZyBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTMyMy4xMTU3OCwxODQuMTAxMDVjLTMuODYyLC03Ljg1ODc2IDAuODA0ODQsLTE2LjIyNDU3IDAuODA0ODQsLTE2LjIyNDU3YzIuMDc5ODIsNi43OTE5NiA3LjE2NTQ4LDguODIyNTUgNy4xNjU0OCw4LjgyMjU1YzAsMCAtNy45MjY0NSw3LjM0MDUxIC03Ljk3MDMyLDcuNDAyMDJ6Ii8+PHBhdGggZD0iTTMyMi41OTQ1NiwxODQuODA1OTFjMi44MTUwOSwtMy43NjUxNCA1LjQ2MjMzLC02LjQ2MjAyIDguOTgzMjUsLTguNDA1OWwyLjI3MSwxLjY1NjcyYy0zLjg5NjcxLDIuMTU4NDggLTcuMjIzNTIsNS4yNjE2OSAtOS42OTQzLDkuMDEyNTJsLTEuNTU5OTYsLTIuMjYzMzR6Ii8+PC9nPjxnIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMzc2LjIyODA2LDE5Mi40NDY3djBjLTAuMDIyODksLTAuMDcyMDEgLTUuMzE2MDgsLTkuNDg5NzUgLTUuMzE2MDgsLTkuNDg5NzVjMCwwIDUuNDYzMzUsLTAuMzcyOTkgOS41MjU5OCwtNi4xOTk3OGMtMC4wMzMzOCwtMC4wMDUyNSAxLjg0MjgzLDkuMzg4NjkgLTQuMjA5OSwxNS42ODk1MnoiLz48cGF0aCBkPSJNMzc2LjUwODAxLDE5My4yNzc0NWwtMi4xNzg5MywxLjY3NTg0Yy0xLjIwMTM1LC00LjMyNzg0IC0zLjQ0OTQ5LC04LjMwNzA1IC02LjQ2MzA0LC0xMS41NTEzN2wyLjY2OTY2LC0wLjg4MDM4YzIuNzU1MDcsMi45MzAwMyA0LjQ0NzYyLDYuMzA4ODQgNS45NzIzMSwxMC43NTU5eiIvPjwvZz48cGF0aCBkPSJNMzIwLjUyMzYzLDIwOC44NzAyMmwtMy4wNzg4NiwtMS4zMDQ3NmMwLDAgLTEuNzU3NDEsLTMuMTgzNzUgLTEuMzIwNjMsLTguNzkzNTJjMC40MDkxMywtNC45OTgzNyAyLjc3NjQyLC04LjUyNjAyIDIuNzc2NDIsLTguNTI2MDJsMy42NzQ5OCwtMC4zMTE5M2MwLDAgLTEuNjk2MywzLjM5MzYyIC0yLjYzNTI1LDkuMzY5MTdjLTAuNzc2MzQsNC45NDA2NyAwLjU4MzM0LDkuNTY3MDUgMC41ODMzNCw5LjU2NzA1eiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTM3NC4zNTQ0OCwyMDcuODUzNGMwLjkzODk1LC01Ljk3NTU0IDAuMzY1MjEsLTkuNzI1ODcgMC4zNjUyMSwtOS43MjU4N2wzLjQwMjIxLDEuNDIzOThjMCwwIDEuMTM3OTIsNC4wNzg0MyAtMC4wMDU2Myw4Ljk2MTRjLTEuMzA0NzMsNS40NzMzNyAtMy45NTM4OCw3Ljk2NDcyIC0zLjk1Mzg4LDcuOTY0NzJsLTMuMzY0MDQsMC4yOTIzN2MwLDAgMi43NDY0MSwtMy45ODExNyAzLjU1NjEzLC04LjkxNjZ6IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMzI0LjI4MjgxLDE4Ny4xMjM2MmMzLjcwMDY3LC01LjkxNzg3IDkuNjk0MjksLTkuMDEyNTMgOS42OTQyOSwtOS4wMTI1M2MyLjMyNjc4LC0xLjMxMDU0IDQuOTA2NzksLTIuMjczNDIgNy41NjI2MiwtMi44NDgxMWMwLjc4MTY0LC0wLjE4NTA0IDEuNTg2MTYsLTAuMjk4MDggMi4zOTA2OSwtMC40MTExMWMwLDAgNC4wNDIxOSwtMC4yNTQyMyA3LjY0NzU0LDAuMzEyMjljMy45NzI1NywwLjYyNDIyIDcuMzc0NzgsMi4wNDgyIDcuMzc0NzgsMi4wNDgyYzAuNzM2MzMsMC4zMjA5NSAxLjQzNDA0LDAuNjcwMDMgMi4xMjEyNiwxLjA4NTg4djBjMi4zODQ5OCwxLjM2Njc3IDQuNTExOTYsMy4wNjkyNyA2LjM1ODA2LDUuMDM1NWMzLjAxMzU2LDMuMjQ0MzEgNS4yNjE2OSw3LjIyMzUyIDYuNDYzMDQsMTEuNTUxMzdjMC4zMSwxLjA3NDkzIDAuNTE5ODUsMi4xMzQxMiAwLjY5MTA2LDMuMjIxNDRjMC40MzA2NywyLjcwMTYyIDAuNDI5MjYsNS41NDA2IC0wLjAxNjYxLDguMzc4MTVjLTAuNTkyNzUsMy43NzIyNyAtMS45MjE4Myw3LjIyMzYgLTMuODM3OTcsMTAuMjc0ODFjLTQuMjUzMzgsNi44MjMwMyAtMTEuMzE1NzMsMTEuNDk0MzIgLTE5LjMzODEsMTIuNjk2NjZjLTIuNjk2MzgsMC4zOTcyOCAtNS41MDE5OCwwLjQwMTEzIC04LjMzOTUzLC0wLjA0NDc0Yy0yLjgzNzU1LC0wLjQ0NTg3IC01LjUwNjc2LC0xLjMwOTk5IC03Ljk1MTM1LC0yLjUxNTA5Yy0xMC41MDQyMiwtNS4yMDgxIC0xNi44OTUyNSwtMTYuNzgyMzUgLTE0Ljk4MDYyLC0yOC45NjcxM2MwLjYyNDIyLC0zLjk3MjU3IDIuMTUxNjksLTcuNTk3OTYgNC4xNjA4MywtMTAuODA1NnoiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTM0My4wODIxLDIyOS40NTAwNmMtNC4yMDYyNSwtMC42NjA5NCAtNy45NTEzNSwtMi41MTUwOSAtNy45NTEzNSwtMi41MTUwOWwxLjQ2NjkxLC0yLjM2OTI0YzIuMDY2ODksMS4yMTQxNiA0LjQwMDM3LDEuODIwMjggNi45MDQwOCwyLjIxMzY5YzIuNTAzNzIsMC4zOTM0MiA0LjkxMDYzLDAuNTMyMTcgNy4yNTAyOCwwLjAxMDQybDAuNjY5NTksMi43MDQ5NmMwLDAgLTQuMTMzMjcsMC42MTYyIC04LjMzOTUyLC0wLjA0NDc0eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48ZyBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0zNjAuNzA0ODgsMTc4LjAzNDk5bDAuOTY0NzksMi43ODU1NWMtMC4zMzA0NywyLjEwMzEyIC01LjQzNDY5LDMuNDU2MTQgLTExLjM0MzQ4LDIuNTI3NjhjLTUuOTA4NzgsLTAuOTI4NDYgLTEwLjM1MjA3LC0zLjc4MTcgLTEwLjAyMTYsLTUuODg0ODNsMS43NjczNiwtMi4zMjIwNGwtMC4xODA3NCwwLjI3OTQ2Yy0wLjI4ODUsMS44MzYwNiAzLjYxODc1LDQuMzk5ODMgOC44MjY0OSw1LjIxODEzYzUuMjA3NzQsMC44MTgzIDkuNzEyOTgsLTAuNDIzNTkgMTAuMDAxNDksLTIuMjU5NjVjLTAuMDMzMzgsLTAuMDA1MjUgLTAuMDE0MzEsLTAuMzQ0MzIgLTAuMDE0MzEsLTAuMzQ0MzJ6Ii8+PHBhdGggZD0iTTM1Ny40ODk2LDE3NS4yMDM2OGMyLjEwODg1LDAuOTQ3MSAzLjM5MjIsMi4xNDA3NiAzLjIyNDM0LDMuMjA5MDJjLTAuMjg4NSwxLjgzNjA2IC00Ljc5Mzc1LDMuMDc3OTUgLTEwLjAwMTQ5LDIuMjU5NjVjLTUuMjA3NzQsLTAuODE4MyAtOS4xMTQ5OSwtMy4zODIwNyAtOC44MjY0OSwtNS4yMTgxM2MwLjE3MzEsLTEuMTAxNjQgMS43NjA2OSwtMS44NDQxOSA0LjA5MTc3LC0yLjA5MzYzdjAiLz48cGF0aCBkPSJNMzU2LjYwMjUyLDE3MC42MTczNmwyLjM1NTQ3LDYuNTYxNjJ2MGMtMC4yMzYwNSwxLjUwMjIzIC0zLjc3MzY3LDIuMjQ2MjMgLTcuOTQ2NTQsMS41OTA1NGMtNC4xNzI4NywtMC42NTU2OSAtNy4zMTE4MywtMi40NDg4IC03LjA3NTc4LC0zLjk1MTAzdjBsNC4yNTQzNSwtNS41MjMiLz48cGF0aCBkPSJNMzQ4LjA3MDc5LDE2OS42MTg4M2MwLjEzMzI2LC0wLjg0ODEgMi4xNTQzOSwtMS4yMzUgNC41MTQzLC0wLjg2NDE4YzIuMzU5OTIsMC4zNzA4MiA0LjE2NDk4LDEuMzU4OTQgNC4wMzE3MiwyLjIwNzA0Yy0wLjEzMzI2LDAuODQ4MSAtMi4xNTQzOSwxLjIzNSAtNC41MTQzMSwwLjg2NDE4Yy0yLjM1OTkyLC0wLjM3MDgyIC00LjE2NDk4LC0xLjM1ODk0IC00LjAzMTcyLC0yLjIwNzA0eiIvPjwvZz48L2c+PC9nPjxwYXRoIGQ9Ik0yNDcuODcyMTIsMjUyLjEyNzkzdi0xNDQuMjU1ODNoMTQ0LjI1NTgzdjE0NC4yNTU4M3oiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxnPjxwYXRoIGQ9Ik0yNjMuNTk2NTksMTQ3LjI2NTMxdi0xMS44ODA1Nmg3MS41NjYzdjExLjg4MDU2eiIgZmlsbD0iI2EwYTBhMCIgc3Ryb2tlPSIjY2FiOGE1IiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjYzLjU5NjU5LDIwMS4yOTM2NXYtNTQuOTA3NjRoNzEuNTY2M3Y1NC45MDc2NHoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2NhYjhhNSIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTI2Ni4xNzY1LDE0My44NzA4NnYtNi4yMjMxNWgxMi43MjkxOXY2LjIyMzE1eiIgZmlsbD0iIzQ5ZTQ3YiIgc3Ryb2tlPSIjY2FiOGE1IiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PGcgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyLjUiPjxnIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjgyLjMxMzksMTY3LjM5MTYyYy0yLjUwMTY3LC0yLjk2NDQxIC0xLjM5MTU5LC03LjA2MDE3IC0xLjM5MTU5LC03LjA2MDE3YzEuNjIxMzYsMi42OTY3MiA0LjAyNDg1LDMuMDI0OTEgNC4wMjQ4NSwzLjAyNDkxYzAsMCAtMi42MjA5OSw0LjAwNDEyIC0yLjYzMzI1LDQuMDM1MjZ6IiBzdHJva2U9IiNlMGNkYjgiLz48cGF0aCBkPSJNMjgyLjE2NTM1LDE2Ny43NTA0MWMwLjgwNjgyLC0xLjkxOTg5IDEuNjU1ODksLTMuMzYyNjIgMi45NjExNCwtNC41NzUyNGwxLjE1MzYsMC40Njg5MmMtMS40NDM4LDEuMzQ1MTEgLTIuNTQxNDYsMy4wMzUyOCAtMy4yMDE4MSw0LjkxMjE0bC0wLjkxMjkzLC0wLjgwNTgxeiIgc3Ryb2tlLW9wYWNpdHk9IjAuMzA1ODgiIHN0cm9rZT0iI2M5YjhhNSIvPjwvZz48ZyBzdHJva2U9IiNlMGNkYjgiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMzA2LjAzNzQzLDE2NS4yOTA5MXYwYy0wLjAxNzU1LC0wLjAyODUgLTMuMzAxMzYsLTMuNTA5NzYgLTMuMzAxMzYsLTMuNTA5NzZjMCwwIDIuMzA4NDIsLTAuNzQ1NDIgMy40MzA2OSwtMy42ODUwOWMtMC4wMTQ5MSwwLjAwMTMyIDEuNzk3NTksMy44MzgyOCAtMC4xMjkzMyw3LjE5NDg0eiIvPjxwYXRoIGQ9Ik0zMDYuMjQ2NzYsMTY1LjYxODAybC0wLjc1NzEyLDAuOTUzNjljLTAuOTc5ODcsLTEuNzMxNjIgLTIuMzcyMzYsLTMuMjAxMjkgLTQuMDE1MTUsLTQuMjczMDlsMS4wNTMyNSwtMC42NjQzMmMxLjQ5ODAzLDAuOTY0NCAyLjU4NzQsMi4yMzU0OCAzLjcxOTAzLDMuOTgzNzJ6Ii8+PC9nPjxwYXRoIGQ9Ik0yODMuODUyMzEsMTc4LjMxNjAxbC0xLjQ2MzE1LC0wLjIzMTExYzAsMCAtMS4wOTYzNiwtMS4xODAzIC0xLjUwOTM5LC0zLjYzODM4Yy0wLjM1OTQzLC0yLjE5MjMyIDAuMjgwMzMsLTMuOTYyMTYgMC4yODAzMywtMy45NjIxNmwxLjU0NjI1LC0wLjUyNzY0YzAsMCAtMC4zNjU3LDEuNjQwMzcgLTAuMTI5MzYsNC4zMDk0NmMwLjE5NTQxLDIuMjA2ODQgMS4yNzUzMSw0LjA0OTgzIDEuMjc1MzEsNC4wNDk4M3oiIHN0cm9rZT0iI2UwY2RiOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTMwNi44ODIwNywxNzIuMTE0Yy0wLjIzNjM0LC0yLjY2OTA5IC0wLjg4NDYsLTQuMjE5NjggLTAuODg0NiwtNC4yMTk2OGwxLjYxNDkxLDAuMjQ3NzNjMCwwIDAuOTI1OSwxLjYzMTIgMC45NTcyOSwzLjg1MjU3YzAuMDI1MzQsMi40OTI0MSAtMC44NDY1NywzLjg0NyAtMC44NDY1NywzLjg0N2wtMS40MTQ2OSwwLjQ4NTk0YzAsMCAwLjc1NDE2LC0yLjAwNTM5IDAuNTczNjYsLTQuMjEzNTV6IiBzdHJva2U9IiNlMGNkYjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yODMuMTM5MjMsMTY4LjU2NTg2YzAuOTU2OTMsLTIuOTQwMDYgMy4yMDE4MSwtNC45MTIxNCAzLjIwMTgxLC00LjkxMjE0YzAuODU5NzksLTAuODEyNSAxLjg2NTY2LC0xLjUwMjY5IDIuOTQ1NywtMi4wMzQxNGMwLjMxNjE2LC0wLjE2MzI1IDAuNjQ5ODgsLTAuMjk4IDAuOTgzNTksLTAuNDMyNzRjMCwwIDEuNzEwMjcsLTAuNTQyMTcgMy4zMjA2NiwtMC42ODQ3N2MxLjc3NDQyLC0wLjE1NzEyIDMuMzg5MzMsMC4wOTA2MSAzLjM4OTMzLDAuMDkwNjFjMC4zNTA4OCwwLjA1OTEgMC42ODgxNiwwLjEzNDQzIDEuMDI4MDksMC4yMzk1OHYwYzEuMTcxNTMsMC4zMzIwOCAyLjI2ODEyLDAuODM2MDkgMy4yNzIyMiwxLjQ4MzU1YzEuNjQyNzksMS4wNzE4IDMuMDM1MjgsMi41NDE0NyA0LjAxNTE1LDQuMjczMDljMC4yNDgzNywwLjQyODg1IDAuNDUyMDEsMC44NjE2NiAwLjY0MjA0LDEuMzEwN2MwLjQ3NDQ0LDEuMTE1MTQgMC43Nzc4OCwyLjMzNTYgMC44OTAxMSwzLjYwMzA0YzAuMTQ5MiwxLjY4NDk1IC0wLjA1MjQ4LDMuMzEwODEgLTAuNTQ5MzUsNC44Mjc1NWMtMS4wOTc1NywzLjM4ODMyIC0zLjYzMjk4LDYuMTUyNTYgLTYuOTUyNTYsNy41Mjg1MmMtMS4xMTY0NiwwLjQ1OTUzIC0yLjMyMjAxLDAuNzYxNjUgLTMuNTg5NDUsMC44NzM4OGMtMS4yNjc0NCwwLjExMjIzIC0yLjUwNzMxLDAuMDI2NjUgLTMuNjg3MTYsLTAuMjI5NTVjLTUuMDcyODksLTEuMTEzNzEgLTkuMDU5NTQsLTUuNDA0MzUgLTkuNTQxNDcsLTEwLjg0NjljLTAuMTU3MTIsLTEuNzc0NDIgMC4xMTExOSwtMy40OTYzNCAwLjYzMTI4LC01LjA5MDI4eiIgc3Ryb2tlPSIjZTBjZGI4IiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxwYXRoIGQ9Ik0yOTUuNzUyODMsMTg0Ljc0NjE4Yy0xLjg3ODgsMC4xNjYzNyAtMy42ODcxNiwtMC4yMjk1NSAtMy42ODcxNiwtMC4yMjk1NWwwLjM3NjgxLC0xLjE3NTQ5YzEuMDE4NDYsMC4zMDA1NCAyLjA4NjM5LDAuMzExMTggMy4yMDQ3MiwwLjIxMjE1YzEuMTE4MzMsLTAuMDk5MDMgMi4xNjc3NywtMC4yOTcxNSAzLjExNzU4LC0wLjc3MTk4bDAuNTc3NSwxLjA5MDk4YzAsMCAtMS43MTA2NSwwLjcwNzUyIC0zLjU4OTQ1LDAuODczODh6IiBzdHJva2U9IiNlMGNkYjgiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PGcgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjk3LjgyMTU2LDE2MC43NTg2bDAuNzEzMDIsMS4wOTQwMmMwLjA4MzE4LDAuOTM5NCAtMS45NjU5MiwyLjA2NzYxIC00LjYwNTE4LDIuMzAxMzJjLTIuNjM5MjYsMC4yMzM3IC00Ljg1NDczLC0wLjUxNjg4IC00LjkzNzkxLC0xLjQ1NjI4bDAuNTExMDEsLTEuMTg3MzhsLTAuMDQ3NzYsMC4xMzk0OGMwLjA3MjYyLDAuODIwMTEgMi4wMjY2OCwxLjUwMzY4IDQuMzUyODEsMS4yOTc3YzIuMzI2MTMsLTAuMjA1OTggNC4xMjk2NiwtMS4yMjIyOCA0LjA1NzA0LC0yLjA0MjM5Yy0wLjAxNDkxLDAuMDAxMzIgLTAuMDQzMDMsLTAuMTQ2NDcgLTAuMDQzMDMsLTAuMTQ2NDd6IiBzdHJva2U9IiNlMGNkYjgiLz48cGF0aCBkPSJNMjk2LjEzNjI2LDE1OS44ODU5MmMxLjAwNzksMC4xODEyNiAxLjY4NzM3LDAuNTU2OSAxLjcyOTYyLDEuMDM0MDZjMC4wNzI2MiwwLjgyMDExIC0xLjczMDkxLDEuODM2NDEgLTQuMDU3MDUsMi4wNDIzOGMtMi4zMjYxMywwLjIwNTk4IC00LjI4MDE5LC0wLjQ3NzU5IC00LjM1MjgxLC0xLjI5NzdjLTAuMDQzNTcsLTAuNDkyMDcgMC41NTkzMSwtMC45ODEyNyAxLjUzNDU5LC0xLjMzODEzdjAiIHN0cm9rZS1vcGFjaXR5PSIwLjMwNTg4IiBzdHJva2U9IiNjOWI4YTUiLz48cGF0aCBkPSJNMjk1LjI2MzgzLDE1OC4wMDk1N2wxLjcxNTE5LDIuNTY4MTl2MGMwLjA1OTQyLDAuNjcxIC0xLjM4MTUyLDEuMzY5NjYgLTMuMjQ1NDEsMS41MzQ3MWMtMS44NjM4OSwwLjE2NTA1IC0zLjQwNTE3LC0wLjI2OTU1IC0zLjQ2NDU5LC0wLjk0MDU0djBsMS4yMzcyMSwtMi44Mjk2MiIgc3Ryb2tlPSIjZTBjZGI4Ii8+PHBhdGggZD0iTTI5MS40ODk2MywxNTguNDk0MDVjLTAuMDMzNTQsLTAuMzc4ODIgMC43OTM3OCwtMC43NjE1NyAxLjg0Nzg4LC0wLjg1NDkxYzEuMDU0MSwtMC4wOTMzNCAxLjkzNTgxLDAuMTM4MDggMS45NjkzNiwwLjUxNjljMC4wMzM1NCwwLjM3ODgyIC0wLjc5Mzc4LDAuNzYxNTggLTEuODQ3ODgsMC44NTQ5MmMtMS4wNTQxLDAuMDkzMzQgLTEuOTM1ODEsLTAuMTM4MDggLTEuOTY5MzUsLTAuNTE2OXoiIHN0cm9rZT0iI2UwY2RiOCIvPjwvZz48L2c+PHBhdGggZD0iTTI4MC42MDE0NiwxNDMuODY5NDR2LTYuMjIzMTVoMTIuNzI5MTl2Ni4yMjMxNXoiIGZpbGw9IiNmZmQyMzciIHN0cm9rZT0iI2NhYjhhNSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxwYXRoIGQ9Ik0yOTUuMDI2NDcsMTQzLjg2OHYtNi4yMjMxNWgxMi43MjkxOHY2LjIyMzE1eiIgZmlsbD0iI2U5OTU5NSIgc3Ryb2tlPSIjY2FiOGE1IiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTMxNy4yMjEzNywyMDUuNTA1OTdjMCwwIC03LjUxNjYyLC03LjA2MzEyIC0xMC43NzA3OSwtMTEuNDcyN2MtMi45MzA2NywtMy45NzEyNCAtNy44ODU1MSwtMTMuODA3NyAtNy44ODU1MSwtMTMuODA3N2MwLDAgOS45MjEyLDMuMjM2MDMgMTUuNDExMjIsMy41NDUxOWM3LjA2MTE4LDAuMzk3NjUgMjMuNDQxMjQsLTEuMzU3MjYgMjMuNDQxMjQsLTEuMzU3MjYiIGZpbGw9IiNlZWVlZWUiIHN0cm9rZT0iI2UwY2RiOCIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxnIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2NhYjhhNSIgc3Ryb2tlLXdpZHRoPSIyLjUiPjxnIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMzIzLjExNTc4LDE4NC4xMDEwNWMtMy44NjIsLTcuODU4NzYgMC44MDQ4NCwtMTYuMjI0NTcgMC44MDQ4NCwtMTYuMjI0NTdjMi4wNzk4Miw2Ljc5MTk2IDcuMTY1NDgsOC44MjI1NSA3LjE2NTQ4LDguODIyNTVjMCwwIC03LjkyNjQ1LDcuMzQwNTEgLTcuOTcwMzIsNy40MDIwMnoiLz48cGF0aCBkPSJNMzIyLjU5NDU3LDE4NC44MDU5MmMyLjgxNTA5LC0zLjc2NTE0IDUuNDYyMzMsLTYuNDYyMDIgOC45ODMyNSwtOC40MDU5bDIuMjcxLDEuNjU2NzJjLTMuODk2NzEsMi4xNTg0OCAtNy4yMjM1Miw1LjI2MTY5IC05LjY5NDMsOS4wMTI1MmwtMS41NTk5NiwtMi4yNjMzNHoiLz48L2c+PGcgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0zNzYuMjI4MDcsMTkyLjQ0NjcydjBjLTAuMDIyODksLTAuMDcyMDEgLTUuMzE2MDgsLTkuNDg5NzUgLTUuMzE2MDgsLTkuNDg5NzVjMCwwIDUuNDYzMzUsLTAuMzcyOTkgOS41MjU5OCwtNi4xOTk3OGMtMC4wMzMzOCwtMC4wMDUyNSAxLjg0MjgzLDkuMzg4NjkgLTQuMjA5OSwxNS42ODk1MnoiLz48cGF0aCBkPSJNMzc2LjUwODAyLDE5My4yNzc0NWwtMi4xNzg5MywxLjY3NTg0Yy0xLjIwMTM1LC00LjMyNzg0IC0zLjQ0OTQ5LC04LjMwNzA1IC02LjQ2MzA0LC0xMS41NTEzN2wyLjY2OTY2LC0wLjg4MDM4YzIuNzU1MDcsMi45MzAwMyA0LjQ0NzYyLDYuMzA4ODQgNS45NzIzMSwxMC43NTU5eiIvPjwvZz48cGF0aCBkPSJNMzIwLjUyMzY0LDIwOC44NzAyM2wtMy4wNzg4NiwtMS4zMDQ3NmMwLDAgLTEuNzU3NDEsLTMuMTgzNzUgLTEuMzIwNjMsLTguNzkzNTJjMC40MDkxMywtNC45OTgzNyAyLjc3NjQyLC04LjUyNjAyIDIuNzc2NDIsLTguNTI2MDJsMy42NzQ5OCwtMC4zMTE5M2MwLDAgLTEuNjk2MywzLjM5MzYyIC0yLjYzNTI1LDkuMzY5MTdjLTAuNzc2MzQsNC45NDA2NyAwLjU4MzM0LDkuNTY3MDUgMC41ODMzNCw5LjU2NzA1eiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTM3NC4zNTQ0OSwyMDcuODUzNDJjMC45Mzg5NSwtNS45NzU1NCAwLjM2NTIxLC05LjcyNTg3IDAuMzY1MjEsLTkuNzI1ODdsMy40MDIyMSwxLjQyMzk4YzAsMCAxLjEzNzkyLDQuMDc4NDMgLTAuMDA1NjMsOC45NjE0Yy0xLjMwNDczLDUuNDczMzcgLTMuOTUzODgsNy45NjQ3MiAtMy45NTM4OCw3Ljk2NDcybC0zLjM2NDA0LDAuMjkyMzdjMCwwIDIuNzQ2NDEsLTMuOTgxMTcgMy41NTYxMywtOC45MTY2eiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTMyNC4yODI4MiwxODcuMTIzNjJjMy43MDA2NywtNS45MTc4NyA5LjY5NDI5LC05LjAxMjUzIDkuNjk0MjksLTkuMDEyNTNjMi4zMjY3OCwtMS4zMTA1NCA0LjkwNjc5LC0yLjI3MzQyIDcuNTYyNjIsLTIuODQ4MTFjMC43ODE2NCwtMC4xODUwNCAxLjU4NjE2LC0wLjI5ODA4IDIuMzkwNjksLTAuNDExMTFjMCwwIDQuMDQyMTksLTAuMjU0MjMgNy42NDc1NCwwLjMxMjI5YzMuOTcyNTcsMC42MjQyMiA3LjM3NDc4LDIuMDQ4MiA3LjM3NDc4LDIuMDQ4MmMwLjczNjMzLDAuMzIwOTUgMS40MzQwNCwwLjY3MDAzIDIuMTIxMjYsMS4wODU4OHYwYzIuMzg0OTgsMS4zNjY3NyA0LjUxMTk2LDMuMDY5MjcgNi4zNTgwNiw1LjAzNTVjMy4wMTM1NiwzLjI0NDMxIDUuMjYxNjksNy4yMjM1MiA2LjQ2MzA0LDExLjU1MTM3YzAuMzEsMS4wNzQ5MyAwLjUxOTg1LDIuMTM0MTIgMC42OTEwNiwzLjIyMTQ0YzAuNDMwNjcsMi43MDE2MiAwLjQyOTI2LDUuNTQwNiAtMC4wMTY2MSw4LjM3ODE1Yy0wLjU5Mjc1LDMuNzcyMjcgLTEuOTIxODMsNy4yMjM2IC0zLjgzNzk3LDEwLjI3NDgxYy00LjI1MzM4LDYuODIzMDMgLTExLjMxNTczLDExLjQ5NDMyIC0xOS4zMzgxLDEyLjY5NjY2Yy0yLjY5NjM4LDAuMzk3MjggLTUuNTAxOTgsMC40MDExMyAtOC4zMzk1MywtMC4wNDQ3NGMtMi44Mzc1NSwtMC40NDU4NyAtNS41MDY3NiwtMS4zMDk5OSAtNy45NTEzNSwtMi41MTUwOWMtMTAuNTA0MjIsLTUuMjA4MSAtMTYuODk1MjUsLTE2Ljc4MjM1IC0xNC45ODA2MiwtMjguOTY3MTNjMC42MjQyMiwtMy45NzI1NyAyLjE1MTY5LC03LjU5Nzk2IDQuMTYwODMsLTEwLjgwNTZ6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxwYXRoIGQ9Ik0zNDMuMDgyMTEsMjI5LjQ1MDA3Yy00LjIwNjI1LC0wLjY2MDk0IC03Ljk1MTM1LC0yLjUxNTA5IC03Ljk1MTM1LC0yLjUxNTA5bDEuNDY2OTEsLTIuMzY5MjRjMi4wNjY4OSwxLjIxNDE2IDQuNDAwMzcsMS44MjAyOCA2LjkwNDA4LDIuMjEzNjljMi41MDM3MiwwLjM5MzQyIDQuOTEwNjMsMC41MzIxNyA3LjI1MDI4LDAuMDEwNDJsMC42Njk1OSwyLjcwNDk2YzAsMCAtNC4xMzMyNywwLjYxNjIgLTguMzM5NTIsLTAuMDQ0NzR6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxnIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTM2MC43MDQ4OSwxNzguMDM0OTlsMC45NjQ3OSwyLjc4NTU1Yy0wLjMzMDQ3LDIuMTAzMTIgLTUuNDM0NjksMy40NTYxNCAtMTEuMzQzNDgsMi41Mjc2OGMtNS45MDg3OCwtMC45Mjg0NiAtMTAuMzUyMDcsLTMuNzgxNyAtMTAuMDIxNiwtNS44ODQ4M2wxLjc2NzM2LC0yLjMyMjA0bC0wLjE4MDc0LDAuMjc5NDZjLTAuMjg4NSwxLjgzNjA2IDMuNjE4NzUsNC4zOTk4MyA4LjgyNjQ5LDUuMjE4MTNjNS4yMDc3NCwwLjgxODMgOS43MTI5OCwtMC40MjM1OSAxMC4wMDE0OSwtMi4yNTk2NWMtMC4wMzMzOCwtMC4wMDUyNSAtMC4wMTQzMSwtMC4zNDQzMiAtMC4wMTQzMSwtMC4zNDQzMnoiLz48cGF0aCBkPSJNMzU3LjQ4OTYxLDE3NS4yMDM3YzIuMTA4ODUsMC45NDcxIDMuMzkyMiwyLjE0MDc2IDMuMjI0MzQsMy4yMDkwMmMtMC4yODg1LDEuODM2MDYgLTQuNzkzNzUsMy4wNzc5NSAtMTAuMDAxNDksMi4yNTk2NWMtNS4yMDc3NCwtMC44MTgzIC05LjExNDk5LC0zLjM4MjA3IC04LjgyNjQ5LC01LjIxODEzYzAuMTczMSwtMS4xMDE2NCAxLjc2MDY5LC0xLjg0NDE5IDQuMDkxNzcsLTIuMDkzNjN2MCIvPjxwYXRoIGQ9Ik0zNTYuNjAyNTMsMTcwLjYxNzM3bDIuMzU1NDcsNi41NjE2MnYwYy0wLjIzNjA1LDEuNTAyMjMgLTMuNzczNjcsMi4yNDYyMyAtNy45NDY1NCwxLjU5MDU0Yy00LjE3Mjg3LC0wLjY1NTY5IC03LjMxMTgzLC0yLjQ0ODggLTcuMDc1NzgsLTMuOTUxMDN2MGw0LjI1NDM1LC01LjUyMyIvPjxwYXRoIGQ9Ik0zNDguMDcwOCwxNjkuNjE4ODRjMC4xMzMyNiwtMC44NDgxIDIuMTU0MzksLTEuMjM1IDQuNTE0MywtMC44NjQxOGMyLjM1OTkyLDAuMzcwODIgNC4xNjQ5OCwxLjM1ODk0IDQuMDMxNzIsMi4yMDcwNGMtMC4xMzMyNiwwLjg0ODEgLTIuMTU0MzksMS4yMzUgLTQuNTE0MzEsMC44NjQxOGMtMi4zNTk5MiwtMC4zNzA4MiAtNC4xNjQ5OCwtMS4zNTg5NCAtNC4wMzE3MiwtMi4yMDcwNHoiLz48L2c+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==';
  const COVER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIABQABNjN9GQAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAA0lEQVQI12NgYPgPAAEDAQAR3X3ZAAAASUVORK5CYII=';
  const SMALL_ICON = BLOCK_ICON_BASE64;

  class WebWalker {
    constructor() {
      this.states = new Map();
      this.runtime = null;
      this._lastActivity = Date.now();
      this._pollInterval = null;

      this.overlay = document.createElement('div');
      this.overlay.id = 'scratch-web-walker-overlay';
      this.overlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; pointer-events:none; z-index:99999;';
      document.body.appendChild(this.overlay);

      this.mouseX = 0;
      this.mouseY = 0;
      this._onMouseMove = (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      };
      window.addEventListener('mousemove', this._onMouseMove);

      this.mouseDown = false;
      this._onMouseDown = () => { this.mouseDown = true; };
      this._onMouseUp = () => { this.mouseDown = false; };
      window.addEventListener('mousedown', this._onMouseDown);
      window.addEventListener('mouseup', this._onMouseUp);

      this._onBeforeUnload = () => this.dispose();
      window.addEventListener('beforeunload', this._onBeforeUnload);

      this.canvas = null;
      this._resizeObserver = null;
      this._cache = {
        screenCenterX: 0,
        screenCenterY: 0,
        screenWidth: 0,
        screenHeight: 0,
        coordWidth: 480,
        coordHeight: 360,
        lastScreenWidth: 0,
        lastScreenHeight: 0
      };

      this.stageResizedFlag = false;

      this._initStageTracking();

      this._onResize = () => {
        this.repositionAll();
      };
      window.addEventListener('resize', this._onResize);

      this._onProjectStopped = null;
      this._onTargetUpdated = null;
    }

    _registerRuntime(runtime) {
      this.runtime = runtime;
      this._onProjectStopped = () => this.dispose();
      runtime.on('PROJECT_STOPPED', this._onProjectStopped);

      this._onTargetUpdated = (args) => {
        const target = args.target;
        if (target && !target.isStage && this.states.has(target.id)) {
          const state = this.states.get(target.id);
          if (state.isOnWeb && state.element) {
            this.updateElementAppearance(state);
          }
        }
      };
      runtime.on('targetWasUpdated', this._onTargetUpdated);

      this._startWatchdog();
    }

    _startWatchdog() {
      if (this._pollInterval) clearInterval(this._pollInterval);
      this._pollInterval = setInterval(() => {
        if (this.states.size > 0 && Date.now() - this._lastActivity > 10000) {
          this.dispose();
        }
      }, 2000);
    }

    _stopPolling() {
      if (this._pollInterval) {
        clearInterval(this._pollInterval);
        this._pollInterval = null;
      }
    }

    _updateActivity() {
      this._lastActivity = Date.now();
    }

    _initStageTracking() {
      const wrapper = document.getElementById('stage-canvas-wrapper');
      this.canvas = wrapper ? wrapper.querySelector('canvas') : null;
      if (!this.canvas) {
        this.canvas = document.querySelector('canvas');
      }

      if (this.canvas) {
        this._updateStageInfo();
        this._resizeObserver = new ResizeObserver(() => this._updateStageInfo());
        this._resizeObserver.observe(this.canvas);
      } else {
        console.warn('[网页漫步者] 未找到舞台 canvas，相对舞台中心的坐标将使用视口中心作为参考。');
      }

      this._onScrollResize = () => this._updateStageInfo();
      window.addEventListener('scroll', this._onScrollResize, true);
      window.addEventListener('resize', this._onScrollResize);
    }

    _updateStageInfo() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      this._cache.screenCenterX = rect.left + rect.width / 2;
      this._cache.screenCenterY = rect.top + rect.height / 2;
      this._cache.screenWidth = rect.width;
      this._cache.screenHeight = rect.height;
      this._setCoordSize(this.canvas.height, this.canvas.width);

      if (this._cache.screenWidth !== this._cache.lastScreenWidth ||
          this._cache.screenHeight !== this._cache.lastScreenHeight) {
        this._cache.lastScreenWidth = this._cache.screenWidth;
        this._cache.lastScreenHeight = this._cache.screenHeight;
        this.stageResizedFlag = true;
      }
    }

    _setCoordSize(h, w) {
      let coordW;
      if (Math.abs(h / w - 9 / 16) < Math.abs(h / w - 3 / 4)) {
        coordW = 640;
      } else {
        coordW = 480;
      }
      this._cache.coordWidth = coordW;
      this._cache.coordHeight = 360;
    }

    // 获取当前所有网页角色的z-index范围
    _getZIndexBounds() {
      let min = Infinity;
      let max = -Infinity;
      for (const state of this.states.values()) {
        if (state.isOnWeb && state.element) {
          const z = state.zIndex;
          if (z < min) min = z;
          if (z > max) max = z;
        }
      }
      if (min === Infinity) min = 0;
      if (max === -Infinity) max = 0;
      return { min, max };
    }

    getInfo() {
      return {
        id: 'webWalker',
        name: '西瓜の网页漫步者',
        blockIconURI: BLOCK_ICON_BASE64,
        menuIconURI: SMALL_ICON,
        coverURI: COVER_IMAGE,
        color1: '#E8746B',
        blocks: [
          '--- 移动',
          {
            opcode: 'goToWeb',
            blockType: Scratch.BlockType.COMMAND,
            text: '将角色释放到相对网页中心 x: [X] y: [Y]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'returnToStage',
            blockType: Scratch.BlockType.COMMAND,
            text: '将角色带回舞台'
          },
          {
            opcode: 'moveStepsOnWeb',
            blockType: Scratch.BlockType.COMMAND,
            text: '网页角色移动 [STEPS] 步',
            arguments: {
              STEPS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'changeWebX',
            blockType: Scratch.BlockType.COMMAND,
            text: '将网页角色的 x 坐标增加 [DX]',
            arguments: {
              DX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'changeWebY',
            blockType: Scratch.BlockType.COMMAND,
            text: '将网页角色的 y 坐标增加 [DY]',
            arguments: {
              DY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'pointTowardsWebMouse',
            blockType: Scratch.BlockType.COMMAND,
            text: '面向网页鼠标'
          },
          '--- 行为',
          {
            opcode: 'setWebClickThrough',
            blockType: Scratch.BlockType.COMMAND,
            text: '网页角色 [ENABLED]穿透鼠标',
            arguments: {
              ENABLED: {
                type: Scratch.ArgumentType.STRING,
                menu: 'boolMenu',
                defaultValue: '否'
              }
            }
          },
          {
            opcode: 'setWebCursor',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置网页角色触碰鼠标样式为 [CURSOR]',
            arguments: {
              CURSOR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'cursorMenu',
                defaultValue: 'pointer'
              }
            }
          },
          '--- 外观',
          {
            opcode: 'setWebSize',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置网页角色大小为 [SIZE] %',
            arguments: {
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'changeWebSize',
            blockType: Scratch.BlockType.COMMAND,
            text: '将网页角色大小增加 [DELTA] %',
            arguments: {
              DELTA: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'setWebDirection',
            blockType: Scratch.BlockType.COMMAND,
            text: '网页角色面向 [DIRECTION] 度',
            arguments: {
              DIRECTION: { type: Scratch.ArgumentType.NUMBER, defaultValue: 90 }
            }
          },
          {
            opcode: 'changeWebDirection',
            blockType: Scratch.BlockType.COMMAND,
            text: '将网页角色方向增加 [DELTA] 度',
            arguments: {
              DELTA: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 }
            }
          },
          {
            opcode: 'refreshRender',
            blockType: Scratch.BlockType.COMMAND,
            text: '同步角色造型'
          },
          {
            opcode: 'setWebEffect',
            blockType: Scratch.BlockType.COMMAND,
            text: '设置网页角色的 [EFFECT] 特效为 [VALUE]',
            arguments: {
              EFFECT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'effectMenu',
                defaultValue: '颜色'
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50
              }
            }
          },
          {
            opcode: 'changeWebEffect',
            blockType: Scratch.BlockType.COMMAND,
            text: '将网页角色的 [EFFECT] 特效增加 [VALUE]',
            arguments: {
              EFFECT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'effectMenu',
                defaultValue: '颜色'
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 25
              }
            }
          },
          {
            opcode: 'getWebEffect',
            blockType: Scratch.BlockType.REPORTER,
            text: '网页角色的 [EFFECT] 特效值',
            arguments: {
              EFFECT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'effectMenu',
                defaultValue: '颜色'
              }
            },
            disableMonitor: false
          },
          {
            opcode: 'showWebSprite',
            blockType: Scratch.BlockType.COMMAND,
            text: '显示网页角色'
          },
          {
            opcode: 'hideWebSprite',
            blockType: Scratch.BlockType.COMMAND,
            text: '隐藏网页角色'
          },
          '--- 图层',
          {
            opcode: 'setWebLayer',
            blockType: Scratch.BlockType.COMMAND,
            text: '将网页角色的图层设为 [LEVEL]',
            arguments: {
              LEVEL: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'moveWebLayerUp',
            blockType: Scratch.BlockType.COMMAND,
            text: '将网页角色图层上移 [N] 层',
            arguments: {
              N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'moveWebLayerDown',
            blockType: Scratch.BlockType.COMMAND,
            text: '将网页角色图层下移 [N] 层',
            arguments: {
              N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'moveToTopLayer',
            blockType: Scratch.BlockType.COMMAND,
            text: '将网页角色移至最上层'
          },
          {
            opcode: 'moveToBottomLayer',
            blockType: Scratch.BlockType.COMMAND,
            text: '将网页角色移至最下层'
          },
          {
            opcode: 'getWebLayer',
            blockType: Scratch.BlockType.REPORTER,
            text: '网页角色的图层值',
            disableMonitor: false
          },
          '--- 清理',
          {
            opcode: 'clearAllWebSprites',
            blockType: Scratch.BlockType.COMMAND,
            text: '清理所有网页角色'
          },
          '--- 侦测',
          {
            opcode: 'getWebProperty',
            blockType: Scratch.BlockType.REPORTER,
            text: '网页角色的 [PROPERTY]',
            arguments: {
              PROPERTY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'propertyMenu',
                defaultValue: 'x坐标'
              }
            },
            disableMonitor: false
          },
          {
            opcode: 'isTouchingMouse',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '网页角色被鼠标触碰？'
          },
          {
            opcode: 'isOnWeb',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '网页角色已释放到网页？'
          },
          {
            opcode: 'isMouseDown',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '舞台外按下鼠标？'
          },
          {
            opcode: 'hasStageResized',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '舞台屏幕大小变化？'
          },
          '--- 舞台信息',
          {
            opcode: 'getWebMouseProperty',
            blockType: Scratch.BlockType.REPORTER,
            text: '网页鼠标 [PROPERTY] (相对中心)',
            arguments: {
              PROPERTY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'mouseMenu',
                defaultValue: 'x'
              }
            },
            disableMonitor: false
          },
          {
            opcode: 'getStageScreenCenterProperty',
            blockType: Scratch.BlockType.REPORTER,
            text: '舞台中心相对网页中心的 [PROPERTY]坐标',
            arguments: {
              PROPERTY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'centerMenu',
                defaultValue: 'x'
              }
            },
            disableMonitor: false
          },
          {
            opcode: 'getStageScaleRatio',
            blockType: Scratch.BlockType.REPORTER,
            text: '舞台的屏幕缩放比'
          },
          {
            opcode: 'getStageCoordWidth',
            blockType: Scratch.BlockType.REPORTER,
            text: '舞台的内部坐标宽度'
          },
          {
            opcode: 'getStageCoordHeight',
            blockType: Scratch.BlockType.REPORTER,
            text: '舞台的内部坐标高度'
          },
          '--- 坐标转换',
          {
            opcode: 'getRelativeToStageOffset',
            blockType: Scratch.BlockType.REPORTER,
            text: '计算网页坐标 x: [X] y: [Y] 相对舞台中心的 [OFFSET]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              OFFSET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'offsetMenu',
                defaultValue: 'x偏移'
              }
            },
            disableMonitor: false
          }
        ],
        menus: {
          effectMenu: {
            acceptReporters: true,
            items: [
              { text: '颜色', value: '颜色' },
              { text: '虚像', value: '虚像' },
              { text: '亮度', value: '亮度' }
            ]
          },
          propertyMenu: {
            acceptReporters: true,
            items: [
              { text: 'x 坐标 (相对网页中心)', value: 'x坐标' },
              { text: 'y 坐标 (相对网页中心)', value: 'y坐标' },
              { text: '大小 (%)', value: '大小' },
              { text: '方向 (度)', value: '方向' },
              { text: '相对舞台中心的 x (像素)', value: '相对于舞台中心的x' },
              { text: '相对舞台中心的 y (像素)', value: '相对于舞台中心的y' }
            ]
          },
          offsetMenu: {
            acceptReporters: true,
            items: [
              { text: 'x 偏移', value: 'x偏移' },
              { text: 'y 偏移', value: 'y偏移' }
            ]
          },
          mouseMenu: {
            acceptReporters: true,
            items: [
              { text: 'x', value: 'x' },
              { text: 'y', value: 'y' }
            ]
          },
          centerMenu: {
            acceptReporters: true,
            items: [
              { text: 'x', value: 'x' },
              { text: 'y', value: 'y' }
            ]
          },
          boolMenu: {
            acceptReporters: true,
            items: [
              { text: '是', value: '是' },
              { text: '否', value: '否' }
            ]
          },
          cursorMenu: {
            acceptReporters: true,
            items: [
              { text: '默认', value: 'default' },
              { text: '手指', value: 'pointer' },
              { text: '移动', value: 'move' },
              { text: '十字', value: 'crosshair' },
              { text: '文本', value: 'text' },
              { text: '等待', value: 'wait' },
              { text: '禁止', value: 'not-allowed' }
            ]
          }
        }
      };
    }

    // ========== 方向转换 ==========
    _externalToInternal(extDeg) { return ((extDeg - 90) % 360 + 360) % 360; }
    _internalToExternal(intDeg) { return ((intDeg + 90) % 360 + 360) % 360; }

    // ========== 辅助方法 ==========
    getState(target) {
      let state = this.states.get(target.id);
      if (!state) {
        state = new WebSpriteState(target);
        this.states.set(target.id, state);
      }
      return state;
    }

    getViewportCenter() {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    getStageCenter() {
      return { x: this._cache.screenCenterX, y: this._cache.screenCenterY };
    }

    logicalToScreen(logicX, logicY) {
      const c = this.getViewportCenter();
      return { x: c.x + logicX, y: c.y - logicY };
    }

    screenToLogical(screenX, screenY) {
      const c = this.getViewportCenter();
      return { x: screenX - c.x, y: c.y - screenY };
    }

    getRelativeToStage(state) {
      const stageCenter = this.getStageCenter();
      const viewportCenter = this.getViewportCenter();
      const stageRelX = stageCenter.x - viewportCenter.x;
      const stageRelY = viewportCenter.y - stageCenter.y;
      const spriteX = state.webX;
      const spriteY = state.webY;
      return {
        x: parseFloat((spriteX - stageRelX).toFixed(3)),
        y: parseFloat((spriteY - stageRelY).toFixed(3))
      };
    }

    repositionAll() {
      for (const state of this.states.values()) {
        if (state.isOnWeb && state.element) this.applyPosition(state);
      }
    }

    // ========== 积木实现 ==========
    goToWeb(args, util) {
      this._updateActivity();
      const target = util.target;
      if (!target || target.isStage) return;
      const state = this.getState(target);
      target.setVisible(false);
      if (!state.element) this.createElement(state);
      state.isOnWeb = true;
      state.webX = args.X;
      state.webY = args.Y;
      state.visible = true;
      this.applyPosition(state);
    }

    returnToStage(args, util) {
      this._updateActivity();
      const target = util.target;
      const state = this.states.get(target.id);
      if (state) {
        this._removeElement(state);
        target.setVisible(true);
      }
    }

    moveStepsOnWeb(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb) return;
      const radians = (state.webDirection * Math.PI) / 180;
      const dx = args.STEPS * Math.sin(radians);
      const dy = args.STEPS * Math.cos(radians);
      state.webX += dx;
      state.webY += dy;
      this.applyPosition(state);
    }

    changeWebX(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb) return;
      state.webX += args.DX;
      this.applyPosition(state);
    }

    changeWebY(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb) return;
      state.webY += args.DY;
      this.applyPosition(state);
    }

    pointTowardsWebMouse(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb) return;
      const mouseLog = this.screenToLogical(this.mouseX, this.mouseY);
      const dx = mouseLog.x - state.webX;
      const dy = mouseLog.y - state.webY;
      let internalAngle = (Math.atan2(dx, dy) * 180) / Math.PI;
      internalAngle = ((internalAngle % 360) + 360) % 360;
      state.webDirection = internalAngle;
      if (state.element) this.updateElementAppearance(state);
    }

    setWebClickThrough(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      state.clickThrough = (args.ENABLED === '是');
      if (state.element) {
        state.element.style.pointerEvents = state.clickThrough ? 'none' : 'auto';
      }
    }

    setWebCursor(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      state.cursorStyle = args.CURSOR;
      if (state.element) {
        state.element.style.cursor = state.cursorStyle;
      }
    }

    setWebSize(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      state.webSize = Math.max(1, Math.abs(args.SIZE));
      if (state.element) this.updateElementAppearance(state);
    }

    changeWebSize(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb || !state.element) return;
      state.webSize = Math.max(1, state.webSize + Number(args.DELTA || 0));
      this.updateElementAppearance(state);
    }

    setWebDirection(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      const externalDir = ((args.DIRECTION % 360) + 360) % 360;
      state.webDirection = this._externalToInternal(externalDir);
      if (state.element) this.updateElementAppearance(state);
    }

    changeWebDirection(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb || !state.element) return;
      const currentExternal = this._internalToExternal(state.webDirection);
      const newExternal = ((currentExternal + Number(args.DELTA || 0)) % 360 + 360) % 360;
      state.webDirection = this._externalToInternal(newExternal);
      this.updateElementAppearance(state);
    }

    refreshRender(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb || !state.element) return;
      this.updateElementAppearance(state);
    }

    setWebEffect(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb || !state.element) return;
      const effect = args.EFFECT;
      const value = Number(args.VALUE) || 0;
      if (state.effects.hasOwnProperty(effect)) {
        state.effects[effect] = value;
        this.updateElementAppearance(state);
      }
    }

    changeWebEffect(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb || !state.element) return;
      const effect = args.EFFECT;
      const value = Number(args.VALUE) || 0;
      if (state.effects.hasOwnProperty(effect)) {
        state.effects[effect] += value;
        this.updateElementAppearance(state);
      }
    }

    getWebEffect(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state) return 0;
      return state.effects[args.EFFECT] || 0;
    }

    showWebSprite(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      state.visible = true;
      if (state.element) state.element.style.display = '';
    }

    hideWebSprite(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      state.visible = false;
      if (state.element) state.element.style.display = 'none';
    }

    // ========== 图层积木 ==========
    setWebLayer(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb || !state.element) return;
      state.zIndex = Math.floor(Number(args.LEVEL) || 0);
      state.element.style.zIndex = state.zIndex;
    }

    moveWebLayerUp(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb || !state.element) return;
      state.zIndex += Math.floor(Number(args.N) || 1);
      state.element.style.zIndex = state.zIndex;
    }

    moveWebLayerDown(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb || !state.element) return;
      state.zIndex -= Math.floor(Number(args.N) || 1);
      state.element.style.zIndex = state.zIndex;
    }

    moveToTopLayer(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb || !state.element) return;
      const { max } = this._getZIndexBounds();
      state.zIndex = max + 1;
      state.element.style.zIndex = state.zIndex;
    }

    moveToBottomLayer(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      if (!state.isOnWeb || !state.element) return;
      const { min } = this._getZIndexBounds();
      state.zIndex = min - 1;
      state.element.style.zIndex = state.zIndex;
    }

    getWebLayer(args, util) {
      this._updateActivity();
      const state = this.getState(util.target);
      return state ? state.zIndex : 0;
    }

    clearAllWebSprites() {
      this._updateActivity();
      for (const state of this.states.values()) {
        if (state.isOnWeb) {
          this._removeElement(state);
          state.target.setVisible(true);
        }
      }
    }

    // ========== 侦测 ==========
    getWebProperty(args, util) {
      this._updateActivity();
      const state = this.states.get(util.target.id);
      if (!state) return 0;
      switch (args.PROPERTY) {
        case 'x坐标': return state.webX;
        case 'y坐标': return state.webY;
        case '大小': return state.webSize;
        case '方向': return this._internalToExternal(state.webDirection);
        case '相对于舞台中心的x': {
          const rel = this.getRelativeToStage(state);
          return Math.round(rel.x);
        }
        case '相对于舞台中心的y': {
          const rel = this.getRelativeToStage(state);
          return Math.round(rel.y);
        }
        default: return 0;
      }
    }

    isTouchingMouse(args, util) {
      this._updateActivity();
      const state = this.states.get(util.target.id);
      if (!state || !state.isOnWeb || !state.element) return false;
      const rect = state.element.getBoundingClientRect();
      return (
        this.mouseX >= rect.left &&
        this.mouseX <= rect.right &&
        this.mouseY >= rect.top &&
        this.mouseY <= rect.bottom
      );
    }

    isOnWeb(args, util) {
      this._updateActivity();
      const state = this.states.get(util.target.id);
      return state ? state.isOnWeb : false;
    }

    isMouseDown() {
      this._updateActivity();
      return this.mouseDown;
    }

    hasStageResized() {
      this._updateActivity();
      if (this.stageResizedFlag) {
        this.stageResizedFlag = false;
        return true;
      }
      return false;
    }

    getWebMouseProperty(args) {
      this._updateActivity();
      return args.PROPERTY === 'x'
        ? this.mouseX - window.innerWidth / 2
        : window.innerHeight / 2 - this.mouseY;
    }

    getStageScreenCenterProperty(args) {
      this._updateActivity();
      const viewportCenter = this.getViewportCenter();
      if (args.PROPERTY === 'x') {
        return parseFloat((this._cache.screenCenterX - viewportCenter.x).toFixed(3));
      } else {
        return parseFloat((viewportCenter.y - this._cache.screenCenterY).toFixed(3));
      }
    }

    getStageScaleRatio() {
      this._updateActivity();
      return this._cache.screenWidth / this._cache.coordWidth;
    }

    getStageCoordWidth() { this._updateActivity(); return this._cache.coordWidth; }
    getStageCoordHeight() { this._updateActivity(); return this._cache.coordHeight; }

    getRelativeToStageOffset(args) {
      this._updateActivity();
      const stageCenter = this.getStageCenter();
      const viewportCenter = this.getViewportCenter();
      const screenX = viewportCenter.x + args.X;
      const screenY = viewportCenter.y - args.Y;
      const ox = screenX - stageCenter.x;
      const oy = stageCenter.y - screenY;
      return args.OFFSET === 'x偏移' ? parseFloat(ox.toFixed(3)) : parseFloat(oy.toFixed(3));
    }

    // ========== DOM ==========
    _removeElement(state) {
      if (state.element) {
        state.element.remove();
        state.element = null;
        state.clickHandler = null;
      }
      state.isOnWeb = false;
    }

    createElement(state) {
      const element = document.createElement('img');
      element.draggable = false;
      element.addEventListener('dragstart', (e) => e.preventDefault());

      element.style.position = 'absolute';
      element.style.pointerEvents = state.clickThrough ? 'none' : 'auto';
      element.style.userSelect = 'none';
      element.style.cursor = state.cursorStyle || 'pointer';
      element.style.transformOrigin = 'center center';
      element.style.setProperty('-webkit-user-drag', 'none');
      element.style.setProperty('user-drag', 'none');
      element.style.zIndex = state.zIndex;

      element.addEventListener('click', () => {
        this._updateActivity();
      });

      this.updateElementAppearance(state, element);
      this.overlay.appendChild(element);
      state.element = element;
    }

    updateElementAppearance(state, element) {
      element = element || state.element;
      if (!element) return;
      const target = state.target;
      if (!target) return;
      try {
        const costumes = target.getCostumes();
        if (costumes && costumes.length > 0) {
          const costume = costumes[target.currentCostume];
          if (costume && costume.asset && typeof costume.asset.encodeDataURI === 'function') {
            const dataUri = costume.asset.encodeDataURI();
            if (dataUri) element.src = dataUri;
          }
        }
      } catch (e) {}
      const scale = state.webSize / 100;
      element.style.transform = `translate(-50%, -50%) rotate(${state.webDirection - 90}deg) scale(${scale})`;
      element.style.display = state.visible ? '' : 'none';
      element.style.pointerEvents = state.clickThrough ? 'none' : 'auto';
      element.style.cursor = state.cursorStyle || 'pointer';
      element.style.zIndex = state.zIndex;

      // 特效滤镜
      let filter = '';
      const eff = state.effects;
      if (eff['颜色'] && eff['颜色'] !== 0) {
        const deg = (eff['颜色'] / 100) * 360;
        filter += `hue-rotate(${deg}deg) `;
      }
      if (eff['虚像'] && eff['虚像'] !== 0) {
        const opacity = Math.max(0, 1 - eff['虚像'] / 100);
        filter += `opacity(${opacity}) `;
      }
      if (eff['亮度'] && eff['亮度'] !== 0) {
        const brightness = 1 + eff['亮度'] / 100;
        filter += `brightness(${brightness}) `;
      }
      element.style.filter = filter.trim() || 'none';
    }

    applyPosition(state) {
      if (!state.element) return;
      const screen = this.logicalToScreen(state.webX, state.webY);
      state.element.style.left = screen.x + 'px';
      state.element.style.top = screen.y + 'px';
    }

    dispose() {
      this._stopPolling();
      this.clearAllWebSprites();

      window.removeEventListener('mousemove', this._onMouseMove);
      window.removeEventListener('mousedown', this._onMouseDown);
      window.removeEventListener('mouseup', this._onMouseUp);
      window.removeEventListener('beforeunload', this._onBeforeUnload);
      window.removeEventListener('resize', this._onResize);

      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
      }
      window.removeEventListener('scroll', this._onScrollResize, true);
      window.removeEventListener('resize', this._onScrollResize);

      if (this.runtime) {
        this.runtime.off('PROJECT_STOPPED', this._onProjectStopped);
        this.runtime.off('targetWasUpdated', this._onTargetUpdated);
      }

      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
    }
  }

  class WebSpriteState {
    constructor(target) {
      this.effects = {
        '颜色': 0,
        '虚像': 0,
        '亮度': 0
      };
      this.target = target;
      this.isOnWeb = false;
      this.webX = 0;
      this.webY = 0;
      this.webDirection = 0;
      this.webSize = 100;
      this.visible = true;
      this.element = null;
      this.clickThrough = false;
      this.cursorStyle = 'pointer';
      this.zIndex = 0;
    }
  }

  Scratch.extensions.register(new WebWalker());
})(Scratch);