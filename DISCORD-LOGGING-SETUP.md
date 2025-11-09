# 📊 Discord Logging Service Setup

Hệ thống logging tự động gửi notifications về Discord channel khi có các events quan trọng từ users.

---

## 🎯 Features

### Events được track:

1. **Authentication**
   - ✅ User Login (email/google)
   - ✅ User Register
   - ✅ User Logout

2. **Page Views**
   - ✅ Pricing page
   - ✅ Event page
   - ✅ Demo page
   - ✅ Homepage

3. **Event Actions**
   - ✅ Join Event
   - ✅ Create Event
   - ✅ View Event
   - ✅ Vote Submit

4. **Payment Actions**
   - ✅ Payment Initiated
   - ✅ Payment Confirmed

5. **Errors**
   - ✅ Application errors
   - ✅ API errors

---

## 🔧 Environment Detection

### Production vs Development

**✅ Production (logs to Discord):**
- `NODE_ENV === 'production'`
- `NEXT_PUBLIC_VERCEL_ENV === 'production'`
- Deployed on Vercel/production server

**❌ Development (logs to console only):**
- Running `npm run dev` locally
- `NODE_ENV === 'development'`
- Logs appear in browser console with prefix: `[Discord Logger - DEV]`

### Why This Matters:

- **Avoid spam**: No Discord notifications during development
- **Debug easily**: See logs in console when developing
- **Save bandwidth**: Reduce unnecessary webhook calls
- **Privacy**: Don't expose local testing data

---

## ⚙️ Setup

### 1. Create Discord Webhook

1. Mở Discord server của bạn
2. Vào **Server Settings** → **Integrations** → **Webhooks**
3. Click **New Webhook**
4. Đặt tên: `GalaVote Logs`
5. Chọn channel để nhận logs (VD: `#galavote-logs`)
6. Copy **Webhook URL**

### 2. Add to Environment Variables

Thêm vào file `.env.local`:

```env
# Discord Logging
NEXT_PUBLIC_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
```

⚠️ **Important**: URL này sẽ public nên chỉ nên dùng cho non-sensitive logs.

### 3. Restart Dev Server

```bash
npm run dev
```

---

## 🎨 Message Format

### Example Discord Message:

```
🎯 User Login
━━━━━━━━━━━━━━━━━━━━
Email: user@example.com
Method: email
Timestamp: 10/11/2025 14:30:45

GalaVote Event Tracking
```

### Color Codes:

- 🔵 **Blue (INFO)**: General info, page views
- 🟢 **Green (SUCCESS)**: Login, register, payment confirmed
- 🟠 **Orange (WARNING)**: Warnings
- 🔴 **Red (ERROR)**: Errors
- 🟣 **Purple (USER_ACTION)**: User actions (vote, join event)
- 🟡 **Gold (PAYMENT)**: Payment initiated

---

## 📝 Usage Examples

### Basic Usage

```typescript
import DiscordLogger from '@/lib/discord-logger'

// Log user login
await DiscordLogger.userLogin('user@example.com', 'email')

// Log page view
await DiscordLogger.pageView('/pricing', 'user@example.com')

// Log event join
await DiscordLogger.eventJoin('event123', 'Gala Night 2025', 'user@example.com')
```

### Custom Events

```typescript
await DiscordLogger.custom('Custom Event', {
  'Custom Field': 'value',
  'Another Field': '123',
}, 'INFO')
```

### Error Logging

```typescript
try {
  // Some code
} catch (error) {
  await DiscordLogger.error(error.message, {
    Component: 'PaymentFlow',
    User: user?.email,
  })
}
```

---

## 🔌 Integration Points

### Already Integrated:

1. **PaymentFlow.tsx**
   - Login events
   - Register events
   - Payment initiated/confirmed

2. **Pricing Page**
   - Page view
   - Plan selection

3. **Event Pages**
   - Event join
   - Event view
   - Vote submit

4. **Homepage**
   - Page view

### To Be Integrated:

- Admin dashboard actions
- Event creation
- Settings changes
- User profile updates

---

## 🧪 Testing

### Test Discord Logging:

```typescript
// In browser console or test file
import DiscordLogger from '@/lib/discord-logger'

await DiscordLogger.custom('Test Event', {
  'Test Field': 'Test Value',
}, 'INFO')
```

### Verify:
- Check Discord channel for message
- Verify formatting and color
- Check all fields are present

---

## 📊 Analytics Use Cases

### Track Conversion Funnel:

```
Page View (Pricing) → Plan Selection → Login → Payment → Event Created
```

### Monitor User Activity:

- Peak login times
- Most popular events
- Payment conversion rate
- Error frequency

### Identify Issues:

- Failed payments
- Login errors
- Event join errors
- API failures

---

## 🔒 Security Notes

⚠️ **Do NOT log**:
- Passwords
- Credit card numbers
- Full API keys
- Sensitive personal data

✅ **Safe to log**:
- Email addresses
- Event IDs
- Timestamps
- Error messages (sanitized)

---

## 🚀 Production Considerations

### Rate Limiting:
- Discord webhooks: 30 requests/min per webhook
- Consider batching logs for high-traffic apps

### Monitoring:
- Set up alerts for error spikes
- Monitor webhook health
- Track log volume

### Privacy:
- Add opt-out for sensitive users
- Anonymize data where possible
- Comply with GDPR/privacy laws

---

## 📚 API Reference

### DiscordLogger Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `userLogin(email, method)` | email: string, method?: 'email' \| 'google' | Log user login |
| `userRegister(email, method)` | email: string, method?: 'email' \| 'google' | Log new registration |
| `userLogout(email)` | email: string | Log user logout |
| `pageView(page, userEmail?)` | page: string, userEmail?: string | Log page view |
| `eventJoin(eventId, name, email?)` | eventId: string, name: string, email?: string | Log event join |
| `eventCreate(eventId, name, email)` | eventId: string, name: string, email: string | Log event creation |
| `voteSubmit(eventId, category, candidate, email?)` | eventId: string, category: string, candidate: string, email?: string | Log vote submission |
| `paymentInitiated(plan, amount, email, needInvoice)` | plan: string, amount: string, email: string, needInvoice: boolean | Log payment start |
| `paymentConfirmed(plan, amount, email)` | plan: string, amount: string, email: string | Log payment success |
| `error(message, context?)` | message: string, context?: Record<string, any> | Log error |
| `custom(name, details, type?)` | name: string, details: Record<string, any>, type?: string | Custom event |

---

## 🎉 Example Discord Channel Setup

Create a dedicated channel structure:

```
📊 analytics
  ├─ 📈 #galavote-logs (all events)
  ├─ ✅ #galavote-success (login, register, payments)
  ├─ 🚨 #galavote-errors (errors only)
  └─ 💰 #galavote-payments (payment events)
```

Use multiple webhooks to route events to different channels.

---

**🎯 Discord Logging Service is Ready!**
