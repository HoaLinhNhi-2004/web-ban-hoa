# Hook: PostToolUse — phát hiện secrets trong code được tạo (Windows PowerShell)
# Flower Shop Project — Next.js + Supabase + Stripe + Cloudinary
# Đặt tại: .claude/hooks/post-tool-use.ps1

$INPUT_DATA = $input | ConvertFrom-Json
$CONTENT = $INPUT_DATA.tool_input.content
if (-not $CONTENT) { $CONTENT = $INPUT_DATA.tool_input.new_content }
if (-not $CONTENT) { exit 0 }

# ─────────────────────────────────────────────
# NHÓM 1: API Keys chung
# ─────────────────────────────────────────────
$GENERIC_SECRETS = @{
    "OpenAI API key"         = "sk-[a-zA-Z0-9]{20,}"
    "AWS Access Key"         = "AKIA[0-9A-Z]{16}"
    "GitHub Personal Token"  = "ghp_[a-zA-Z0-9]{36}"
    "Private Key (PEM)"      = "-----BEGIN.*PRIVATE KEY-----"
    "Generic password"       = "password\s*=\s*['""][^'""]{8,}"
    "Generic secret"         = "secret\s*=\s*['""][^'""]{8,}"
    "Bearer token hardcoded" = "Bearer [a-zA-Z0-9\-_]{20,}"
}

# ─────────────────────────────────────────────
# NHÓM 2: Stripe — flower shop payment
# ─────────────────────────────────────────────
$STRIPE_SECRETS = @{
    "Stripe Secret Key (live)"    = "sk_live_[a-zA-Z0-9]{24,}"
    "Stripe Secret Key (test)"    = "sk_test_[a-zA-Z0-9]{24,}"
    "Stripe Webhook Secret"       = "whsec_[a-zA-Z0-9]{32,}"
    "Stripe Restricted Key"       = "rk_live_[a-zA-Z0-9]{24,}"
}

# ─────────────────────────────────────────────
# NHÓM 3: Supabase — flower shop database & auth
# ─────────────────────────────────────────────
$SUPABASE_SECRETS = @{
    "Supabase Service Role Key" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+"
    "Supabase URL hardcoded"    = "https://[a-z]{20}\.supabase\.co"
    "Supabase anon key"         = "SUPABASE_ANON_KEY\s*=\s*['""][a-zA-Z0-9._-]{20,}"
    "Supabase service role"     = "SUPABASE_SERVICE_ROLE_KEY\s*=\s*['""][a-zA-Z0-9._-]{20,}"
}

# ─────────────────────────────────────────────
# NHÓM 4: Cloudinary — flower shop image upload
# ─────────────────────────────────────────────
$CLOUDINARY_SECRETS = @{
    "Cloudinary API Secret hardcoded" = "CLOUDINARY_API_SECRET\s*=\s*['""][a-zA-Z0-9_-]{20,}"
    "Cloudinary API Key hardcoded"    = "CLOUDINARY_API_KEY\s*=\s*['""][0-9]{10,}"
    "Cloudinary URL with credentials" = "cloudinary://[0-9]+:[a-zA-Z0-9_-]+@"
}

# ─────────────────────────────────────────────
# NHÓM 5: Patterns nguy hiểm trong code
# ─────────────────────────────────────────────
$CODE_PATTERNS = @{
    "process.env in client component"     = "'use client'[\s\S]{0,500}process\.env\.(STRIPE_SECRET|SUPABASE_SERVICE_ROLE|CLOUDINARY_API_SECRET)"
    "NEXT_PUBLIC on private key"          = "NEXT_PUBLIC_(STRIPE_SECRET|SUPABASE_SERVICE_ROLE|CLOUDINARY_API_SECRET|CLOUDINARY_API_KEY)"
    "Hardcoded price (not from DB)"       = "price\s*[:=]\s*[0-9]{5,}"    # Giá hardcode, không lấy từ DB
    "console.log with env var"            = "console\.log\(.*process\.env"
    "dangerouslySetInnerHTML no sanitize" = "dangerouslySetInnerHTML=\{\{.*__html.*\}\}"
}

# ─────────────────────────────────────────────
# Gộp tất cả nhóm
# ─────────────────────────────────────────────
$ALL_GROUPS = @{
    "API Keys chung" = $GENERIC_SECRETS
    "Stripe"         = $STRIPE_SECRETS
    "Supabase"       = $SUPABASE_SECRETS
    "Cloudinary"     = $CLOUDINARY_SECRETS
    "Code nguy hiểm" = $CODE_PATTERNS
}

# ─────────────────────────────────────────────
# Kiểm tra từng nhóm
# ─────────────────────────────────────────────
$FOUND = $false

foreach ($group in $ALL_GROUPS.GetEnumerator()) {
    foreach ($check in $group.Value.GetEnumerator()) {
        if ($CONTENT -match $check.Value) {
            Write-Error ""
            Write-Error "⚠️  SECRET DETECTED [$($group.Key)]"
            Write-Error "   Loại    : $($check.Key)"
            Write-Error "   Pattern : $($check.Value)"
            Write-Error ""
            Write-Error "   → Dùng process.env.[TEN_BIEN] thay vì hardcode"
            Write-Error "   → Kiểm tra .env.local và đảm bảo file này có trong .gitignore"
            Write-Error "   → Không dùng NEXT_PUBLIC_ cho private keys"
            Write-Error ""
            $FOUND = $true
        }
    }
}

if ($FOUND) {
    Write-Error "❌ Kiểm tra lại code trước khi commit!"
    exit 2
}

exit 0