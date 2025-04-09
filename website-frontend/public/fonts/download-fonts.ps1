# PowerShell脚本下载Inter字体文件
$url_regular = "https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap"
$url_medium = "https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap" 
$url_semibold = "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap"
$url_bold = "https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap"

function Download-Font {
    param (
        [string]$url,
        [string]$weight
    )
    
    Write-Host "正在下载Inter字体 ($weight)..."
    
    # 获取CSS文件内容
    $css = Invoke-WebRequest -Uri $url -Headers @{
        "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }
    
    # 从CSS中提取字体URL
    $fontUrls = ($css.Content | Select-String -Pattern "https://fonts\.gstatic\.com/s/inter/[^)]*" -AllMatches).Matches.Value

    foreach ($fontUrl in $fontUrls) {
        # 获取文件名
        $fileName = "inter-$weight-" + ($fontUrl -split "/" | Select-Object -Last 1)
        
        Write-Host "从 $fontUrl 下载到 $fileName"
        
        # 下载字体文件
        Invoke-WebRequest -Uri $fontUrl -OutFile $fileName
    }
}

# 下载不同权重的字体
Download-Font -url $url_regular -weight "regular"
Download-Font -url $url_medium -weight "medium"
Download-Font -url $url_semibold -weight "semibold"
Download-Font -url $url_bold -weight "bold"

Write-Host "所有字体已下载完成!" 