$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
Set-Location 'C:\Users\Kat\projects\sowsmart'
npx.cmd playwright test --reporter=list
