"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Save, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { AdminPageHeader, AdminLoading } from "@/components/admin"
import { useAppSelector } from "@/store/hooks"
import { useGetEventQuery, useUpdateEventMutation } from "@/store/api/hono/eventsApi"
import { DangerZone } from "./components"

interface ScheduleItem { time: string; title: string; description?: string }
interface WaitingSlide { title: string; subtitle?: string; image_url?: string }
interface FormData {
  name: string; subtitle: string; venue: string; dateDisplay: string; description: string
  brandConfig: { primary_color: string; logo_url: string; banner_url: string }
  startAt: string; endAt: string; countdownEndAt: string; status: 'draft' | 'published' | 'ended'
  features: { voting: boolean; checkin: boolean; minigame: boolean; results: boolean; waiting_screen: boolean; welcome_led: boolean; result_led: boolean }
  schedule: ScheduleItem[]; galleryUrls: string[]
  waitingScreenConfig: { speed_ms: number; show_quotes: boolean; slides: WaitingSlide[] }
  welcomeLedConfig: { animation_type: 'fade' | 'slide' | 'zoom'; show_counter: boolean }
  resultLedConfig: { layout: 'chart' | 'list'; auto_switch: boolean; switch_interval_ms: number; show_confetti: boolean }
}

const TABS = [
  { id: 'general', label: 'Tổng quát' }, { id: 'timing', label: 'Thời gian' },
  { id: 'features', label: 'Tính năng' }, { id: 'content', label: 'Nội dung' },
  { id: 'pages', label: 'Trang' },
] as const
type TabId = typeof TABS[number]['id']

const toLocal = (iso?: string) => { try { return iso ? new Date(iso).toISOString().slice(0, 16) : '' } catch { return '' } }

function defaultForm(): FormData {
  return {
    name: '', subtitle: '', venue: '', dateDisplay: '', description: '',
    brandConfig: { primary_color: '#FFD700', logo_url: '', banner_url: '' },
    startAt: '', endAt: '', countdownEndAt: '', status: 'draft',
    features: { voting: true, checkin: false, minigame: false, results: true, waiting_screen: false, welcome_led: false, result_led: false },
    schedule: [], galleryUrls: [],
    waitingScreenConfig: { speed_ms: 5000, show_quotes: false, slides: [] },
    welcomeLedConfig: { animation_type: 'fade', show_counter: true },
    resultLedConfig: { layout: 'chart', auto_switch: false, switch_interval_ms: 5000, show_confetti: true },
  }
}

// ── Primitives ──
const cls = { input: 'w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFD700]/50 text-sm', card: 'bg-[#111111] border border-white/10 rounded-xl p-6' }
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => <div className={`${cls.card} ${className}`}>{children}</div>
const Lbl = ({ children }: { children: React.ReactNode }) => <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">{children}</label>
const Inp = (p: React.InputHTMLAttributes<HTMLInputElement>) => <input className={cls.input} {...p} />
const Sel = ({ children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) => <select className="w-full px-3 py-2.5 rounded-lg bg-[#1a1a1a] border border-white/10 text-white focus:outline-none focus:border-[#FFD700]/50 text-sm" {...p}>{children}</select>

function Toggle({ on, onChange, label, desc }: { on: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
      <div><p className="text-sm font-medium text-white">{label}</p>{desc && <p className="text-xs text-white/40">{desc}</p>}</div>
      <div onClick={() => onChange(!on)} className="relative w-11 h-6 rounded-full cursor-pointer transition-colors shrink-0" style={{ background: on ? '#FFD700' : 'rgba(255,255,255,0.1)' }}>
        <motion.div animate={{ x: on ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-1 w-4 h-4 rounded-full" style={{ background: on ? '#000' : 'rgba(255,255,255,0.4)' }} />
      </div>
    </div>
  )
}

function SaveBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <motion.button onClick={onClick} disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }} className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm" style={{ background: loading ? 'rgba(255,255,255,0.1)' : '#FFD700', color: loading ? 'rgba(255,255,255,0.4)' : '#000', cursor: loading ? 'not-allowed' : 'pointer' }}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {loading ? 'Đang lưu...' : 'Lưu'}
    </motion.button>
  )
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-xs transition-colors"><Plus className="w-3.5 h-3.5" />{label}</button>
}

function DelBtn({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="p-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
}

// ── Main ──
export default function AdminSettingsPage() {
  const activeEvent = useAppSelector((state) => state.adminSettings.activeEvent)
  const [tab, setTab] = useState<TabId>('general')
  const [form, setForm] = useState<FormData>(defaultForm())

  const { data: raw, isLoading } = useGetEventQuery(activeEvent?.id ?? '', { skip: !activeEvent?.id }) as { data: any; isLoading: boolean }
  const [updateEvent, { isLoading: saving }] = useUpdateEventMutation()

  useEffect(() => {
    if (!raw) return
    setForm({
      name: raw.name ?? '', subtitle: raw.subtitle ?? '', venue: raw.venue ?? '',
      dateDisplay: raw.dateDisplay ?? '', description: raw.description ?? '',
      brandConfig: { primary_color: raw.brandConfig?.primary_color ?? '#FFD700', logo_url: raw.brandConfig?.logo_url ?? '', banner_url: raw.brandConfig?.banner_url ?? '' },
      startAt: toLocal(raw.startAt), endAt: toLocal(raw.endAt), countdownEndAt: toLocal(raw.countdownEndAt),
      status: raw.status ?? 'draft',
      features: { voting: raw.features?.voting ?? true, checkin: raw.features?.checkin ?? false, minigame: raw.features?.minigame ?? false, results: raw.features?.results ?? true, waiting_screen: raw.features?.waiting_screen ?? false, welcome_led: raw.features?.welcome_led ?? false, result_led: raw.features?.result_led ?? false },
      schedule: raw.schedule ?? [], galleryUrls: raw.galleryUrls ?? [],
      waitingScreenConfig: { speed_ms: raw.waitingScreenConfig?.speed_ms ?? 5000, show_quotes: raw.waitingScreenConfig?.show_quotes ?? false, slides: raw.waitingScreenConfig?.slides ?? [] },
      welcomeLedConfig: { animation_type: raw.welcomeLedConfig?.animation_type ?? 'fade', show_counter: raw.welcomeLedConfig?.show_counter ?? true },
      resultLedConfig: { layout: raw.resultLedConfig?.layout ?? 'chart', auto_switch: raw.resultLedConfig?.auto_switch ?? false, switch_interval_ms: raw.resultLedConfig?.switch_interval_ms ?? 5000, show_confetti: raw.resultLedConfig?.show_confetti ?? true },
    })
  }, [raw])

  const save = async (fields: Partial<FormData>) => {
    if (!activeEvent?.id) return
    try {
      const p: Record<string, unknown> = { id: activeEvent.id, ...fields }
      if ('startAt' in fields && fields.startAt) p.startAt = new Date(fields.startAt!).toISOString()
      if ('endAt' in fields && fields.endAt) p.endAt = new Date(fields.endAt!).toISOString()
      if ('countdownEndAt' in fields && fields.countdownEndAt) p.countdownEndAt = new Date(fields.countdownEndAt!).toISOString()
      await (updateEvent as any)(p).unwrap()
      toast.success('Đã lưu thay đổi!')
    } catch { toast.error('Không thể lưu thay đổi') }
  }

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm(f => ({ ...f, [k]: v }))

  if (!activeEvent) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <AdminPageHeader title="Cài đặt Sự kiện" description="Cấu hình đầy đủ cho sự kiện" icon={Settings} />
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><Settings className="w-8 h-8 text-white/30" /></div>
          <p className="text-white/60">Vui lòng chọn sự kiện ở header trước</p>
        </div>
      </div>
    </motion.div>
  )

  if (isLoading) return <AdminLoading message="Đang tải cài đặt sự kiện..." />

  const FEATURES: [keyof FormData['features'], string, string][] = [
    ['voting', 'Bình chọn', 'Cho phép khách vote'], ['checkin', 'Check-in', 'Quét mã check-in'],
    ['minigame', 'Minigame', 'Trò chơi mini'], ['results', 'Kết quả', 'Hiển thị kết quả vote'],
    ['waiting_screen', 'Màn hình chờ', 'Slide show khi chờ'], ['welcome_led', 'Welcome LED', 'Màn hình chào mừng'],
    ['result_led', 'Result LED', 'Màn hình kết quả LED'],
  ]

  const tabContent: Record<TabId, React.ReactNode> = {
    general: (
      <Card>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div><Lbl>Tên sự kiện</Lbl><Inp value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tên sự kiện" /></div>
          <div><Lbl>Phụ đề</Lbl><Inp value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Subtitle" /></div>
          <div><Lbl>Địa điểm</Lbl><Inp value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="Venue" /></div>
          <div><Lbl>Hiển thị ngày</Lbl><Inp value={form.dateDisplay} onChange={e => set('dateDisplay', e.target.value)} placeholder="VD: 25/12/2024" /></div>
        </div>
        <div className="mb-4"><Lbl>Mô tả</Lbl><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Mô tả sự kiện..." className={`${cls.input} resize-none`} /></div>
        <div className="border-t border-white/10 pt-4 mb-4">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">Brand Config</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div><Lbl>Primary Color</Lbl><Inp type="color" value={form.brandConfig.primary_color} onChange={e => set('brandConfig', { ...form.brandConfig, primary_color: e.target.value })} className="h-10 cursor-pointer" /></div>
            <div><Lbl>Logo URL</Lbl><Inp value={form.brandConfig.logo_url} onChange={e => set('brandConfig', { ...form.brandConfig, logo_url: e.target.value })} placeholder="https://..." /></div>
            <div><Lbl>Banner URL</Lbl><Inp value={form.brandConfig.banner_url} onChange={e => set('brandConfig', { ...form.brandConfig, banner_url: e.target.value })} placeholder="https://..." /></div>
          </div>
        </div>
        <div className="flex justify-end"><SaveBtn loading={saving} onClick={() => save({ name: form.name, subtitle: form.subtitle, venue: form.venue, dateDisplay: form.dateDisplay, description: form.description, brandConfig: form.brandConfig })} /></div>
      </Card>
    ),
    timing: (
      <Card>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div><Lbl>Bắt đầu</Lbl><Inp type="datetime-local" value={form.startAt} onChange={e => set('startAt', e.target.value)} /></div>
          <div><Lbl>Kết thúc</Lbl><Inp type="datetime-local" value={form.endAt} onChange={e => set('endAt', e.target.value)} /></div>
          <div><Lbl>Đếm ngược đến</Lbl><Inp type="datetime-local" value={form.countdownEndAt} onChange={e => set('countdownEndAt', e.target.value)} /></div>
          <div><Lbl>Trạng thái</Lbl><Sel value={form.status} onChange={e => set('status', e.target.value as FormData['status'])}><option value="draft">Draft</option><option value="published">Published</option><option value="ended">Ended</option></Sel></div>
        </div>
        <div className="flex justify-end"><SaveBtn loading={saving} onClick={() => save({ startAt: form.startAt, endAt: form.endAt, countdownEndAt: form.countdownEndAt, status: form.status })} /></div>
      </Card>
    ),
    features: (
      <Card>
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {FEATURES.map(([k, label, desc]) => <Toggle key={k} label={label} desc={desc} on={form.features[k]} onChange={v => set('features', { ...form.features, [k]: v })} />)}
        </div>
        <div className="flex justify-end"><SaveBtn loading={saving} onClick={() => save({ features: form.features })} /></div>
      </Card>
    ),
    content: (
      <div className="space-y-4">
        <Card>
          <div className="flex items-center justify-between mb-3"><p className="text-sm font-semibold text-white">Lịch trình</p><AddBtn onClick={() => set('schedule', [...form.schedule, { time: '', title: '' }])} label="Thêm" /></div>
          <div className="space-y-2">
            {form.schedule.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Inp className="w-24 shrink-0" placeholder="09:00" value={item.time} onChange={e => { const s = [...form.schedule]; s[i] = { ...s[i], time: e.target.value }; set('schedule', s) }} />
                <Inp placeholder="Tiêu đề" value={item.title} onChange={e => { const s = [...form.schedule]; s[i] = { ...s[i], title: e.target.value }; set('schedule', s) }} />
                <Inp placeholder="Mô tả" value={item.description ?? ''} onChange={e => { const s = [...form.schedule]; s[i] = { ...s[i], description: e.target.value }; set('schedule', s) }} />
                <DelBtn onClick={() => set('schedule', form.schedule.filter((_, j) => j !== i))} />
              </div>
            ))}
            {!form.schedule.length && <p className="text-sm text-white/30 text-center py-3">Chưa có lịch trình</p>}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-3"><p className="text-sm font-semibold text-white">Gallery URLs</p><AddBtn onClick={() => set('galleryUrls', [...form.galleryUrls, ''])} label="Thêm" /></div>
          <div className="space-y-2">
            {form.galleryUrls.map((url, i) => (
              <div key={i} className="flex gap-2"><Inp placeholder="https://..." value={url} onChange={e => { const g = [...form.galleryUrls]; g[i] = e.target.value; set('galleryUrls', g) }} /><DelBtn onClick={() => set('galleryUrls', form.galleryUrls.filter((_, j) => j !== i))} /></div>
            ))}
            {!form.galleryUrls.length && <p className="text-sm text-white/30 text-center py-3">Chưa có ảnh</p>}
          </div>
        </Card>
        <div className="flex justify-end"><SaveBtn loading={saving} onClick={() => save({ schedule: form.schedule, galleryUrls: form.galleryUrls })} /></div>
      </div>
    ),
    pages: (
      <div className="space-y-4">
        <Card>
          <p className="text-sm font-semibold text-white mb-3">Màn hình chờ</p>
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <div><Lbl>Tốc độ (ms)</Lbl><Inp type="number" min={500} step={500} value={form.waitingScreenConfig.speed_ms} onChange={e => set('waitingScreenConfig', { ...form.waitingScreenConfig, speed_ms: Number(e.target.value) })} /></div>
          </div>
          <div className="mb-3"><Toggle label="Hiển thị quotes" on={form.waitingScreenConfig.show_quotes} onChange={v => set('waitingScreenConfig', { ...form.waitingScreenConfig, show_quotes: v })} /></div>
          <div className="flex items-center justify-between mb-2"><p className="text-xs text-white/50 uppercase tracking-wide">Slides</p><AddBtn onClick={() => set('waitingScreenConfig', { ...form.waitingScreenConfig, slides: [...form.waitingScreenConfig.slides, { title: '' }] })} label="Thêm slide" /></div>
          <div className="space-y-2">
            {form.waitingScreenConfig.slides.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Inp placeholder="Tiêu đề" value={s.title} onChange={e => { const sl = [...form.waitingScreenConfig.slides]; sl[i] = { ...sl[i], title: e.target.value }; set('waitingScreenConfig', { ...form.waitingScreenConfig, slides: sl }) }} />
                <Inp placeholder="Phụ đề" value={s.subtitle ?? ''} onChange={e => { const sl = [...form.waitingScreenConfig.slides]; sl[i] = { ...sl[i], subtitle: e.target.value }; set('waitingScreenConfig', { ...form.waitingScreenConfig, slides: sl }) }} />
                <Inp placeholder="Image URL" value={s.image_url ?? ''} onChange={e => { const sl = [...form.waitingScreenConfig.slides]; sl[i] = { ...sl[i], image_url: e.target.value }; set('waitingScreenConfig', { ...form.waitingScreenConfig, slides: sl }) }} />
                <DelBtn onClick={() => set('waitingScreenConfig', { ...form.waitingScreenConfig, slides: form.waitingScreenConfig.slides.filter((_, j) => j !== i) })} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-white mb-3">Welcome LED</p>
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <div><Lbl>Animation Type</Lbl><Sel value={form.welcomeLedConfig.animation_type} onChange={e => set('welcomeLedConfig', { ...form.welcomeLedConfig, animation_type: e.target.value as any })}><option value="fade">Fade</option><option value="slide">Slide</option><option value="zoom">Zoom</option></Sel></div>
          </div>
          <Toggle label="Hiển thị bộ đếm" on={form.welcomeLedConfig.show_counter} onChange={v => set('welcomeLedConfig', { ...form.welcomeLedConfig, show_counter: v })} />
        </Card>
        <Card>
          <p className="text-sm font-semibold text-white mb-3">Result LED</p>
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <div><Lbl>Layout</Lbl><Sel value={form.resultLedConfig.layout} onChange={e => set('resultLedConfig', { ...form.resultLedConfig, layout: e.target.value as any })}><option value="chart">Chart</option><option value="list">List</option></Sel></div>
            <div><Lbl>Switch Interval (ms)</Lbl><Inp type="number" min={1000} step={500} value={form.resultLedConfig.switch_interval_ms} onChange={e => set('resultLedConfig', { ...form.resultLedConfig, switch_interval_ms: Number(e.target.value) })} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <Toggle label="Auto switch" on={form.resultLedConfig.auto_switch} onChange={v => set('resultLedConfig', { ...form.resultLedConfig, auto_switch: v })} />
            <Toggle label="Confetti" on={form.resultLedConfig.show_confetti} onChange={v => set('resultLedConfig', { ...form.resultLedConfig, show_confetti: v })} />
          </div>
        </Card>
        <div className="flex justify-end"><SaveBtn loading={saving} onClick={() => save({ waitingScreenConfig: form.waitingScreenConfig, welcomeLedConfig: form.welcomeLedConfig, resultLedConfig: form.resultLedConfig })} /></div>
      </div>
    ),
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="space-y-6">
      <AdminPageHeader title="Cài đặt Sự kiện" description={`Cấu hình: ${activeEvent.name}`} icon={Settings} />
      <div className="flex border-b border-white/10 gap-0">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t.id ? 'border-[#FFD700] text-[#FFD700]' : 'border-transparent text-white/50 hover:text-white/80'}`}>{t.label}</button>
        ))}
      </div>
      <div>{tabContent[tab]}</div>
      {tab === 'general' && <DangerZone />}
    </motion.div>
  )
}
