# Hook: PreToolUse — chặn lệnh nguy hiểm (Windows PowerShell)
# Flower Shop Project — Next.js + Supabase + Stripe + Cloudinary
# Đặt tại: .claude/hooks/pre-tool-use.ps1

$INPUT_DATA = $input | ConvertFrom-Json
$COMMAND = $INPUT_DATA.tool_input.command

if (-not $COMMAND) { exit 0 }

# ─────────────────────────────────────────────
# NHÓM 1: Lệnh hệ thống nguy hiểm
# ─────────────────────────────────────────────
$SYSTEM_DANGEROUS = @(
    "rm -rf",
    "rm -r /",
    "rm -rf /",
    "rmdir /s /q C:\\",
    "format c:",
    "del /f /s /q",
    "curl .* \| bash",
    "wget .* \| sh",
    "curl .* \| sh",
    "chmod -R 777 /"
)

# ─────────────────────────────────────────────
# NHÓM 2: Git — thao tác không thể hoàn tác
# ─────────────────────────────────────────────
$GIT_DANGEROUS = @(
    "git push --force",
    "git push -f",
    "git push origin main --force",
    "git push origin master --force",
    "git reset --hard HEAD",
    "git clean -fd",
    "git clean -fxd",
    "git branch -D main",
    "git branch -D master"
)

# ─────────────────────────────────────────────
# NHÓM 3: Database — Supabase / PostgreSQL
# ─────────────────────────────────────────────
$DB_DANGEROUS = @(
    "DROP TABLE",
    "DROP DATABASE",
    "DROP SCHEMA",
    "DELETE FROM",
    "TRUNCATE TABLE",
    "ALTER TABLE.*DROP COLUMN",
    "supabase db reset",
    "supabase db push --force"
)

# ─────────────────────────────────────────────
# NHÓM 4: Biến môi trường & secrets
# ─────────────────────────────────────────────
$SECRETS_DANGEROUS = @(
    "cat \.env",
    "cat \.env\.local",
    "echo.*STRIPE_SECRET",
    "echo.*SUPABASE_SERVICE_ROLE",
    "echo.*CLOUDINARY_API_SECRET",
    "printenv STRIPE",
    "printenv SUPABASE",
    "curl.*Authorization.*Bearer",   # Không log token ra ngoài
    "git add \.env",                 # Không commit file env
    "git add \.env\.local"
)

# ─────────────────────────────────────────────
# NHÓM 5: Stripe — thao tác production nguy hiểm
# ─────────────────────────────────────────────
$STRIPE_DANGEROUS = @(
    "stripe.*--live",                # Chỉ dùng test mode
    "stripe payment-intents cancel", # Không hủy payment thủ công
    "stripe refunds create"          # Refund phải qua dashboard
)

# ─────────────────────────────────────────────
# NHÓM 6: Node / Package — thao tác phá cấu trúc
# ─────────────────────────────────────────────
$NODE_DANGEROUS = @(
    "rm -rf node_modules",           # Dùng npm ci thay thế
    "rm -rf \.next",                 # Dùng npm run build thay thế
    "npm publish",                   # Không publish package
    "npx.*--yes.*uninstall",
    "npm uninstall react\b",         # Không gỡ core dependencies
    "npm uninstall next\b"
)

# ─────────────────────────────────────────────
# NHÓM 7: Vercel / Deployment
# ─────────────────────────────────────────────
$DEPLOY_DANGEROUS = @(
    "vercel --prod",                 # Deploy production phải làm thủ công
    "vercel env rm",                 # Không xóa env var trên Vercel
    "vercel remove"                  # Không xóa project Vercel
)

# ─────────────────────────────────────────────
# Gộp tất cả nhóm
# ─────────────────────────────────────────────
$ALL_GROUPS = @{
    "Hệ thống"    = $SYSTEM_DANGEROUS
    "Git"          = $GIT_DANGEROUS
    "Database"     = $DB_DANGEROUS
    "Secrets/Env"  = $SECRETS_DANGEROUS
    "Stripe"       = $STRIPE_DANGEROUS
    "Node/Package" = $NODE_DANGEROUS
    "Deployment"   = $DEPLOY_DANGEROUS
}

# ─────────────────────────────────────────────
# Kiểm tra từng nhóm
# ─────────────────────────────────────────────
foreach ($group in $ALL_GROUPS.GetEnumerator()) {
    foreach ($pattern in $group.Value) {
        if ($COMMAND -match $pattern) {
            Write-Error ""
            Write-Error "🚫 BLOCKED [$($group.Key)]: Lệnh nguy hiểm bị chặn"
            Write-Error "   Pattern : $pattern"
            Write-Error "   Command : $COMMAND"
            Write-Error ""
            Write-Error "   Nếu thực sự cần, hãy chạy thủ công trong terminal."
            Write-Error ""
            exit 1
        }
    }
}

exit 0