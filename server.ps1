$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Servidor activo en http://localhost:$port/"
Write-Host "Dejando este proceso corriendo en el fondo..."

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $response = $context.Response
        $path = $context.Request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        
        # Securing the path slightly
        $file = Join-Path $PWD.Path $path.Replace("/", "\")
        
        if (Test-Path $file -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($file)
            $response.ContentLength64 = $content.Length
            
            $ext = [System.IO.Path]::GetExtension($file).ToLower()
            if ($ext -eq ".html") { $response.ContentType = "text/html; charset=utf-8" }
            elseif ($ext -eq ".css") { $response.ContentType = "text/css; charset=utf-8" }
            elseif ($ext -eq ".js") { $response.ContentType = "application/javascript; charset=utf-8" }
            elseif ($ext -eq ".jpeg" -or $ext -eq ".jpg") { $response.ContentType = "image/jpeg" }
            elseif ($ext -eq ".png") { $response.ContentType = "image/png" }

            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $notFoundMsg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $notFoundMsg.Length
            $response.OutputStream.Write($notFoundMsg, 0, $notFoundMsg.Length)
        }
        $response.Close()
    } catch {
        # ignore errors from closed connections
    }
}
