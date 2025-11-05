# Supabase Project Information

## Credentials

**Project URL**: https://xicdommyxzsschupzvsx.supabase.co

**Anon Public Key** (for client-side):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2RvbW15eHpzc2NodXB6dnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTc3NzcsImV4cCI6MjA3Nzg5Mzc3N30.MAmu4KlsDw-GuE_PT6ApiBq58eH3r8xnbcuQjQ4PzME
```

**Service Role Key** (for server-side):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpY2RvbW15eHpzc2NodXB6dnN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjMxNzc3NywiZXhwIjoyMDc3ODkzNzc3fQ.J60hFIw4ukiS60uYctmrXt3OaD2S1gxKImyeDF_VPZs
```

> ⚠️ **QUAN TRỌNG**: Service role key có quyền admin, không được commit vào git hoặc chia sẻ công khai!

**Database Password** (for direct psql connection):
```
6-?-Dv-3Zg%.*Y@
```

**Database Connection String**:
```
postgresql://postgres:6-?-Dv-3Zg%.*Y@@db.xicdommyxzsschupzvsx.supabase.co:5432/postgres
```

> ⚠️ **QUAN TRỌNG**: Thông tin này rất nhạy cảm, không được chia sẻ công khai!

---

## ✅ Setup Status

### Database Setup
- ✅ Schema đã được tạo (tables, triggers, RLS policies)
- ✅ Demo data đã được seed
- ✅ Connection đã được verify

### Current Data
- **1 Event**: "King & Queen of the Night 2025" (Active)
  - Event ID: `d112584a-4c6e-47fa-a4da-df1e3488d374`
  - Voting time: 7 days (2025-11-04 to 2025-11-12)
  - Auth: Email required only

- **3 Categories**:
  - 🤴 King of the Night (max 3 votes)
  - 👸 Queen of the Night (max 3 votes)
  - 👔 Best Dressed (max 2 votes)

- **16 Candidates**: 5 + 5 + 6 ứng viên

- **0 Voters, 0 Votes**: Ready for testing

---

## 🔧 Maintenance Commands

### Run Schema (if needed):
```bash
PGPASSWORD='6-?-Dv-3Zg%.*Y@' psql -h db.xicdommyxzsschupzvsx.supabase.co -U postgres -d postgres -p 5432 -f supabase-schema.sql
```

### Run Seed Data (if needed):
```bash
PGPASSWORD='6-?-Dv-3Zg%.*Y@' psql -h db.xicdommyxzsschupzvsx.supabase.co -U postgres -d postgres -p 5432 -f supabase-seed.sql
```

### Verify Setup:
```bash
node scripts/setup-database.js
```

---

## 🌐 Quick Links

- **Dashboard**: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx
- **SQL Editor**: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/sql/new
- **API Settings**: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/settings/api
- **Database Settings**: https://supabase.com/dashboard/project/xicdommyxzsschupzvsx/settings/database

