
# Generate-Video.ps1
# Text-to-video generation using fal.ai

$ErrorActionPreference = "Stop"

# Set your NEW fal.ai API key in the FAL_KEY environment variable.
$FalKey = $env:FAL_KEY

if ([string]::IsNullOrWhiteSpace($FalKey)) {
    throw "FAL_KEY is missing. Set your fal.ai API key in the environment first."
}

$Model = "fal-ai/kling-video/v3/standard/text-to-video"
$BaseUrl = "https://queue.fal.run/$Model"

$Headers = @{
    Authorization = "Key $FalKey"
    "Content-Type" = "application/json"
}

# Change this prompt to create your own video.
$Body = @{
    prompt = "A cinematic futuristic digital payment animation, glowing blue and purple data streams, floating holographic payment icons, smooth camera movement, premium fintech website landing page background."
    duration = "5"
    aspect_ratio = "16:9"
    generate_audio = $false
} | ConvertTo-Json -Depth 10

try {
    Write-Host "Submitting video generation request..." -ForegroundColor Cyan

    $Job = Invoke-RestMethod `
        -Uri $BaseUrl `
        -Method Post `
        -Headers $Headers `
        -Body $Body

    $RequestId = $Job.request_id

    if (-not $RequestId) {
        throw "No request ID returned: $($Job | ConvertTo-Json -Depth 10)"
    }

    Write-Host "Request ID: $RequestId"
    Write-Host "Waiting for video generation..."

    $StatusUrl = "$BaseUrl/requests/$RequestId/status"
    $ResultUrl = "$BaseUrl/requests/$RequestId"

    while ($true) {
        Start-Sleep -Seconds 5

        $Status = Invoke-RestMethod `
            -Uri $StatusUrl `
            -Method Get `
            -Headers $Headers

        Write-Host "Status: $($Status.status)"

        if ($Status.status -eq "COMPLETED") {
            break
        }

        if ($Status.status -in @("FAILED", "CANCELLED")) {
            throw "Video generation failed: $($Status | ConvertTo-Json -Depth 10)"
        }
    }

    $Result = Invoke-RestMethod `
        -Uri $ResultUrl `
        -Method Get `
        -Headers $Headers

    $VideoUrl = $Result.video.url

    if (-not $VideoUrl) {
        throw "The API response did not contain a video URL."
    }

    $OutputPath = Join-Path $PSScriptRoot "generated-video.mp4"

    Write-Host "Downloading video..." -ForegroundColor Cyan

    Invoke-WebRequest `
        -Uri $VideoUrl `
        -OutFile $OutputPath

    Write-Host "Video generated successfully!" -ForegroundColor Green
    Write-Host "Saved to: $OutputPath"
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red

    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    }

    exit 1
}