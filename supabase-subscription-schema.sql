-- =============================================
-- SUBSCRIPTION & BILLING SYSTEM - DATABASE SCHEMA
-- Extension to Event Voting System
-- Updated: 2025-11-06
-- =============================================

-- =============================================
-- TABLE: users (Extends Supabase Auth)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    company_name TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

COMMENT ON TABLE users IS 'User profiles extending Supabase Auth';
COMMENT ON COLUMN users.role IS 'user: normal user, admin: can manage packages/users, super_admin: full access';

-- =============================================
-- TABLE: packages
-- =============================================
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'VND',
    billing_period TEXT NOT NULL DEFAULT 'one_time' CHECK (billing_period IN ('one_time', 'monthly', 'yearly')),

    -- Features & Limits
    max_events INTEGER,  -- NULL = unlimited
    max_participants_per_event INTEGER,
    max_categories_per_event INTEGER,
    max_candidates_per_category INTEGER,

    features JSONB DEFAULT '{
        "custom_branding": false,
        "led_display": false,
        "qr_checkin": false,
        "advanced_analytics": false,
        "priority_support": false,
        "api_access": false,
        "white_label": false,
        "sso": false,
        "dedicated_manager": false,
        "custom_development": false
    }'::jsonb,

    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    is_highlighted BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packages_slug ON packages(slug);
CREATE INDEX IF NOT EXISTS idx_packages_is_active ON packages(is_active);
CREATE INDEX IF NOT EXISTS idx_packages_display_order ON packages(display_order);

COMMENT ON TABLE packages IS 'Subscription packages (Basic, Pro, Enterprise)';
COMMENT ON COLUMN packages.features IS 'Feature flags in JSON format';

-- =============================================
-- TABLE: subscriptions
-- =============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,

    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),

    -- Pricing
    amount_paid DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'VND',

    -- Dates
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,

    -- Event tracking
    events_used INTEGER DEFAULT 0,
    events_limit INTEGER,  -- Copied from package at purchase time

    -- Invoice
    requires_invoice BOOLEAN DEFAULT false,
    invoice_id UUID,  -- Foreign key to invoices table

    -- Metadata
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_package_id ON subscriptions(package_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

COMMENT ON TABLE subscriptions IS 'User subscription purchases';
COMMENT ON COLUMN subscriptions.status IS 'pending: payment pending, active: in use, expired: time ran out, cancelled: user cancelled';

-- =============================================
-- TABLE: invoices
-- =============================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Invoice details
    invoice_number TEXT NOT NULL UNIQUE,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,

    -- Company info (for VAT invoice)
    company_name TEXT NOT NULL,
    company_tax_code TEXT NOT NULL,
    company_address TEXT NOT NULL,
    company_email TEXT,
    company_phone TEXT,

    -- Billing items
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    /*
    Example structure:
    [
        {
            "description": "Gói Pro - 1 tháng",
            "quantity": 1,
            "unit_price": 5000000,
            "total": 5000000
        }
    ]
    */

    -- Amounts
    subtotal DECIMAL(12,2) NOT NULL,
    vat_rate DECIMAL(5,2) DEFAULT 10.00,  -- VAT %
    vat_amount DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'VND',

    -- Payment
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'overdue', 'cancelled')),
    payment_method TEXT,  -- bank_transfer, credit_card, etc.
    payment_date TIMESTAMP WITH TIME ZONE,
    payment_reference TEXT,

    -- PDF
    pdf_url TEXT,

    -- Metadata
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON invoices(invoice_date DESC);

COMMENT ON TABLE invoices IS 'VAT invoices for subscriptions';
COMMENT ON COLUMN invoices.invoice_number IS 'Auto-generated unique invoice number (e.g., INV-2025-0001)';

-- =============================================
-- TABLE: transactions
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,

    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'adjustment')),

    amount DECIMAL(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'VND',

    payment_method TEXT,  -- bank_transfer, credit_card, vnpay, momo, etc.
    payment_gateway TEXT,
    payment_gateway_transaction_id TEXT,

    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),

    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_subscription_id ON transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

COMMENT ON TABLE transactions IS 'Payment transaction history';

-- =============================================
-- TABLE: subscription_history
-- =============================================
CREATE TABLE IF NOT EXISTS subscription_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    action TEXT NOT NULL CHECK (action IN ('created', 'activated', 'renewed', 'upgraded', 'downgraded', 'cancelled', 'expired')),

    old_package_id UUID REFERENCES packages(id),
    new_package_id UUID REFERENCES packages(id),

    old_status TEXT,
    new_status TEXT,

    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscription_history_subscription_id ON subscription_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_created_at ON subscription_history(created_at DESC);

COMMENT ON TABLE subscription_history IS 'Audit log for subscription changes';

-- =============================================
-- TRIGGERS: Auto-update updated_at
-- =============================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_packages_updated_at ON packages;
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_packages_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- TRIGGER: Log subscription changes
-- =============================================
CREATE OR REPLACE FUNCTION log_subscription_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO subscription_history (subscription_id, user_id, action, new_package_id, new_status, description)
        VALUES (NEW.id, NEW.user_id, 'created', NEW.package_id, NEW.status, 'Subscription created');
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != NEW.status THEN
            INSERT INTO subscription_history (subscription_id, user_id, action, old_status, new_status, description)
            VALUES (NEW.id, NEW.user_id,
                CASE
                    WHEN NEW.status = 'active' THEN 'activated'
                    WHEN NEW.status = 'cancelled' THEN 'cancelled'
                    WHEN NEW.status = 'expired' THEN 'expired'
                    ELSE 'renewed'
                END,
                OLD.status, NEW.status,
                'Status changed from ' || OLD.status || ' to ' || NEW.status
            );
        END IF;

        IF OLD.package_id != NEW.package_id THEN
            INSERT INTO subscription_history (subscription_id, user_id, action, old_package_id, new_package_id, description)
            VALUES (NEW.id, NEW.user_id,
                CASE
                    WHEN (SELECT price FROM packages WHERE id = NEW.package_id) > (SELECT price FROM packages WHERE id = OLD.package_id) THEN 'upgraded'
                    ELSE 'downgraded'
                END,
                OLD.package_id, NEW.package_id,
                'Package changed'
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscription_change_log ON subscriptions;
CREATE TRIGGER subscription_change_log
    AFTER INSERT OR UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION log_subscription_change();

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    year TEXT;
    next_num INTEGER;
    invoice_num TEXT;
BEGIN
    year := TO_CHAR(NOW(), 'YYYY');

    -- Get next sequential number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 10) AS INTEGER)), 0) + 1
    INTO next_num
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || year || '-%';

    invoice_num := 'INV-' || year || '-' || LPAD(next_num::TEXT, 4, '0');

    RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

-- Check if user can create event (based on subscription limits)
CREATE OR REPLACE FUNCTION can_user_create_event(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    active_sub RECORD;
BEGIN
    -- Get active subscription
    SELECT * INTO active_sub
    FROM subscriptions
    WHERE user_id = user_uuid
    AND status = 'active'
    AND (end_date IS NULL OR end_date > NOW())
    ORDER BY created_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN false;  -- No active subscription
    END IF;

    -- Check if unlimited events
    IF active_sub.events_limit IS NULL THEN
        RETURN true;
    END IF;

    -- Check if within limit
    RETURN active_sub.events_used < active_sub.events_limit;
END;
$$ LANGUAGE plpgsql;

-- Get user's active subscription
CREATE OR REPLACE FUNCTION get_active_subscription(user_uuid UUID)
RETURNS TABLE (
    subscription_id UUID,
    package_name TEXT,
    status TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    events_used INTEGER,
    events_limit INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        p.name,
        s.status,
        s.start_date,
        s.end_date,
        s.events_used,
        s.events_limit
    FROM subscriptions s
    JOIN packages p ON p.id = s.package_id
    WHERE s.user_id = user_uuid
    AND s.status = 'active'
    AND (s.end_date IS NULL OR s.end_date > NOW())
    ORDER BY s.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Mark subscription as expired (cron job)
CREATE OR REPLACE FUNCTION expire_subscriptions()
RETURNS INTEGER AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    UPDATE subscriptions
    SET status = 'expired'
    WHERE status = 'active'
    AND end_date IS NOT NULL
    AND end_date < NOW();

    GET DIAGNOSTICS expired_count = ROW_COUNT;
    RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
ON users FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
);

-- Packages policies (public can view active packages)
CREATE POLICY "Anyone can view active packages"
ON packages FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Admins can manage packages"
ON packages FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
ON subscriptions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create subscriptions"
ON subscriptions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions"
ON subscriptions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
);

CREATE POLICY "Admins can manage subscriptions"
ON subscriptions FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
);

-- Invoices policies
CREATE POLICY "Users can view own invoices"
ON invoices FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all invoices"
ON invoices FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
);

CREATE POLICY "Admins can manage invoices"
ON invoices FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
);

-- Transactions policies
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions"
ON transactions FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
);

-- Subscription history policies
CREATE POLICY "Users can view own subscription history"
ON subscription_history FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscription history"
ON subscription_history FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
);

-- =============================================
-- INITIAL DATA - Sample Packages
-- =============================================
INSERT INTO packages (name, slug, description, price, billing_period, max_events, max_participants_per_event, features, is_active, is_popular, display_order) VALUES
('Basic', 'basic', 'Dành cho sự kiện nhỏ và vừa', 0, 'one_time', 1, 200, '{"custom_branding": false, "led_display": false, "qr_checkin": false, "advanced_analytics": false, "priority_support": false}'::jsonb, true, false, 1),
('Pro', 'pro', 'Phổ biến nhất cho doanh nghiệp', 5000000, 'one_time', NULL, 1000, '{"custom_branding": true, "led_display": true, "qr_checkin": true, "advanced_analytics": true, "priority_support": true}'::jsonb, true, true, 2),
('Enterprise', 'enterprise', 'Giải pháp toàn diện cho tập đoàn', 0, 'one_time', NULL, NULL, '{"custom_branding": true, "led_display": true, "qr_checkin": true, "advanced_analytics": true, "priority_support": true, "api_access": true, "white_label": true, "sso": true, "dedicated_manager": true}'::jsonb, true, false, 3)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- COMPLETED
-- =============================================
-- Subscription schema created successfully!
-- Next steps:
-- 1. Create admin pages for package management
-- 2. Create user subscription pages
-- 3. Implement payment gateway integration
-- 4. Create invoice PDF generation
