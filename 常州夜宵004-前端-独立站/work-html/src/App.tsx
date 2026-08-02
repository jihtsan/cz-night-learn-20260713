import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentType, CSSProperties, FormEvent } from 'react'
import { motion } from 'motion/react'
import {
  ArrowUpRight,
  Bot,
  ChevronRight,
  Command,
  Grid2X2,
  Heart,
  Info,
  Music2,
  MessagesSquare,
  Pause,
  Palette,
  Play,
  Search,
  SkipBack,
  SkipForward,
  Star,
  TrendingUp,
  Volume2,
  VolumeX,
} from 'lucide-react'
import {
  SiAnthropic,
  SiBilibili,
  SiDribbble,
  SiFigma,
  SiGithub,
  SiGoogle,
  SiLinear,
  SiNotion,
  SiPerplexity,
  SiStackoverflow,
  SiVercel,
  SiYoutube,
  SiX,
} from 'react-icons/si'

import { RadialIntro, type RadialIntroItem } from './components/animate-ui/radial-intro'
import { AnimatedGridPattern } from './components/magicui/animated-grid-pattern'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Input } from './components/ui/input'
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs'
import { cn } from './lib/utils'

type Category = 'all' | 'ai' | 'design' | 'development' | 'productivity' | 'learning'

type Site = {
  name: string
  description: string
  url: string
  category: Exclude<Category, 'all'>
  icon: ComponentType<{ className?: string }>
  color: string
  iconColor: string
}

type TrendingRepository = {
  fullName: string
  url: string
  language: string
  stars: number
}

type GitHubSearchRepository = {
  full_name: string
  html_url: string
  language: string | null
  stargazers_count: number
}

type MusicTrack = {
  title: string
  artist: string
  album: string
  artwork: string
  previewUrl: string
  trackUrl: string
  duration: number
}

type ITunesTrack = {
  trackName: string
  artistName: string
  collectionName: string
  artworkUrl100?: string
  previewUrl?: string
  trackViewUrl?: string
  trackTimeMillis?: number
}

type CreatorInsight = {
  name: string
  handle: string
  avatar: string
  text: string
  href: string
  topic: string
}

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'ai', label: 'AI 工具' },
  { value: 'design', label: '设计灵感' },
  { value: 'development', label: '开发技术' },
  { value: 'productivity', label: '效率办公' },
  { value: 'learning', label: '视频学习' },
]

const sites: Site[] = [
  { name: 'ChatGPT', description: 'AI 对话与创作助手', url: 'https://chatgpt.com', category: 'ai', icon: Bot, color: '#edf8f4', iconColor: '#10a37f' },
  { name: 'Claude', description: '长文分析与智能协作', url: 'https://claude.ai', category: 'ai', icon: SiAnthropic, color: '#f7efe8', iconColor: '#d97757' },
  { name: 'Gemini', description: 'Google 多模态 AI 助手', url: 'https://gemini.google.com', category: 'ai', icon: SiGoogle, color: '#eef4ff', iconColor: '#4285f4' },
  { name: 'Perplexity', description: '带来源的 AI 搜索引擎', url: 'https://www.perplexity.ai', category: 'ai', icon: SiPerplexity, color: '#eaf7f7', iconColor: '#1f8d91' },
  { name: 'Figma', description: '协作式产品设计工具', url: 'https://www.figma.com', category: 'design', icon: SiFigma, color: '#f5efff', iconColor: '#7c3aed' },
  { name: 'Canva', description: '轻量平面与社交设计', url: 'https://www.canva.com', category: 'design', icon: Palette, color: '#eaf9fb', iconColor: '#00a8b5' },
  { name: 'Dribbble', description: '设计作品与视觉灵感', url: 'https://dribbble.com', category: 'design', icon: SiDribbble, color: '#fff0f6', iconColor: '#ea4c89' },
  { name: 'GitHub', description: '代码托管与开源社区', url: 'https://github.com', category: 'development', icon: SiGithub, color: '#f0f1f3', iconColor: '#181717' },
  { name: 'Vercel', description: '前端应用部署平台', url: 'https://vercel.com', category: 'development', icon: SiVercel, color: '#f2f2f2', iconColor: '#000000' },
  { name: 'Stack Overflow', description: '程序员问答与知识库', url: 'https://stackoverflow.com', category: 'development', icon: SiStackoverflow, color: '#fff3e8', iconColor: '#f58025' },
  { name: 'Notion', description: '笔记、文档与项目管理', url: 'https://www.notion.so', category: 'productivity', icon: SiNotion, color: '#f2f2f2', iconColor: '#111111' },
  { name: 'Linear', description: '快速的产品研发管理', url: 'https://linear.app', category: 'productivity', icon: SiLinear, color: '#f1efff', iconColor: '#5e6ad2' },
  { name: 'Slack', description: '团队即时沟通与协作', url: 'https://slack.com', category: 'productivity', icon: MessagesSquare, color: '#fff0f5', iconColor: '#611f69' },
  { name: 'YouTube', description: '全球视频与教程平台', url: 'https://www.youtube.com', category: 'learning', icon: SiYoutube, color: '#fff0f0', iconColor: '#ff0000' },
  { name: '哔哩哔哩', description: '中文视频与学习社区', url: 'https://www.bilibili.com', category: 'learning', icon: SiBilibili, color: '#edf8ff', iconColor: '#00aeec' },
]

const fallbackTrendingRepositories: TrendingRepository[] = [
  { fullName: 'block/buzz', url: 'https://github.com/block/buzz', language: 'Rust', stars: 20724 },
  { fullName: 'virgiliojr94/book-to-skill', url: 'https://github.com/virgiliojr94/book-to-skill', language: 'Python', stars: 15077 },
  { fullName: 'ayghri/i-have-adhd', url: 'https://github.com/ayghri/i-have-adhd', language: 'Python', stars: 15425 },
  { fullName: 'microsoft/AI-For-Beginners', url: 'https://github.com/microsoft/AI-For-Beginners', language: 'Jupyter Notebook', stars: 58352 },
  { fullName: '1jehuang/jcode', url: 'https://github.com/1jehuang/jcode', language: 'Rust', stars: 15094 },
]

const languageColors: Record<string, string> = {
  Rust: '#dea584',
  Python: '#3572A5',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Go: '#00ADD8',
  Swift: '#F05138',
  'Jupyter Notebook': '#DA5B0B',
}

const compactNumber = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const fallbackTrack: MusicTrack = {
  title: 'That Girl',
  artist: 'Olly Murs',
  album: '24 HRS (Expanded Edition)',
  artwork: '',
  previewUrl: '',
  trackUrl: 'https://music.apple.com/us/song/1520411331',
  duration: 176,
}

const aiCreators: RadialIntroItem[] = [
  { id: 1, name: 'Boris Cherny', handle: '@bcherny', src: 'https://unavatar.io/x/bcherny', href: 'https://x.com/bcherny' },
  { id: 2, name: 'Thariq', handle: '@trq212', src: 'https://unavatar.io/x/trq212', href: 'https://x.com/trq212' },
  { id: 3, name: 'Andrej Karpathy', handle: '@karpathy', src: 'https://unavatar.io/x/karpathy', href: 'https://x.com/karpathy' },
  { id: 4, name: 'Sam Altman', handle: '@sama', src: 'https://unavatar.io/x/sama', href: 'https://x.com/sama' },
  { id: 5, name: 'Greg Brockman', handle: '@gdb', src: 'https://unavatar.io/x/gdb', href: 'https://x.com/gdb' },
  { id: 6, name: 'swyx', handle: '@swyx', src: 'https://unavatar.io/x/swyx', href: 'https://x.com/swyx' },
  { id: 7, name: 'Simon Willison', handle: '@simonw', src: 'https://unavatar.io/x/simonw', href: 'https://x.com/simonw' },
  { id: 8, name: '0xDesigner', handle: '@0xDesigner', src: 'https://unavatar.io/x/0xDesigner', href: 'https://x.com/0xDesigner' },
]

const creatorInsights: CreatorInsight[] = [
  {
    name: 'Simon Willison',
    handle: '@simonw',
    avatar: 'https://unavatar.io/x/simonw',
    text: '让 Claude Code 在后台启动开发服务并随时查看日志，是一个非常实用的工作流。',
    href: 'https://x.com/simonw/status/1954282856529945063',
    topic: 'Claude Code',
  },
  {
    name: 'Andrej Karpathy',
    handle: '@karpathy',
    avatar: 'https://unavatar.io/x/karpathy',
    text: 'CLI 之所以适合 Agent，是因为模型能在终端中原生地调用、组合和自动化它们。',
    href: 'https://x.com/code_rams/status/2026428310402572726',
    topic: 'Agent UX',
  },
  {
    name: 'Thariq',
    handle: '@trq212',
    avatar: 'https://unavatar.io/x/trq212',
    text: 'Skills 应从少量规则开始，通过 Gotchas、日志和辅助脚本持续累积经验。',
    href: 'https://x.com/NickSpisak_/status/2033974734723887333',
    topic: 'Claude Skills',
  },
  {
    name: 'swyx',
    handle: '@swyx',
    avatar: 'https://unavatar.io/x/swyx',
    text: 'AI 软件开发正在从代码补全、编程 Agent，继续走向新的工作形态。',
    href: 'https://x.com/swyx/status/2026869648034255037',
    topic: 'AI Engineer',
  },
  {
    name: '0xDesigner',
    handle: '@0xDesigner',
    avatar: 'https://unavatar.io/x/0xDesigner',
    text: 'Claude Code 不只用来写应用，也能进入研究、运营和个人管理工作流。',
    href: 'https://x.com/0xDesigner/status/2008202211738648767',
    topic: 'AI Workflow',
  },
]

function formatTime(seconds: number) {
  const wholeSeconds = Math.round(seconds)
  const minutes = Math.floor(wholeSeconds / 60)
  return `${minutes}:${String(wholeSeconds % 60).padStart(2, '0')}`
}

function InsightList({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="space-y-3 pb-3" aria-hidden={duplicate || undefined}>
      {creatorInsights.map((insight) => (
        <a
          key={`${duplicate ? 'copy-' : ''}${insight.handle}`}
          href={insight.href}
          target="_blank"
          rel="noreferrer"
          tabIndex={duplicate ? -1 : undefined}
          className="group flex min-h-[92px] gap-3 rounded-[20px] border border-white/10 bg-white/[0.07] p-3.5 transition-colors hover:bg-white/[0.12]"
        >
          <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white/10 text-xs font-bold text-white">
            {insight.name.slice(0, 1)}
            <img
              src={insight.avatar}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              className="absolute inset-0 size-full object-cover"
              onError={(event) => { event.currentTarget.style.display = 'none' }}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-[12px] font-semibold text-white/90">
                {insight.name} <span className="font-normal text-white/40">{insight.handle}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <span className="hidden rounded-full bg-white/[0.08] px-2 py-0.5 text-[9px] font-medium text-white/45 sm:inline">{insight.topic}</span>
                <ArrowUpRight className="size-3.5 text-white/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </span>
            <span className="mt-1.5 block text-[12px] leading-[1.55] text-white/62">{insight.text}</span>
          </span>
        </a>
      ))}
    </div>
  )
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [query, setQuery] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [previewDuration, setPreviewDuration] = useState(30)
  const [musicTrack, setMusicTrack] = useState(fallbackTrack)
  const [musicSource, setMusicSource] = useState<'loading' | 'live' | 'fallback'>('loading')
  const [trendingRepositories, setTrendingRepositories] = useState(fallbackTrendingRepositories)
  const [trendSource, setTrendSource] = useState<'loading' | 'live' | 'fallback'>('loading')
  const searchRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    const since = new Date()
    since.setDate(since.getDate() - 7)
    const createdAfter = since.toISOString().slice(0, 10)

    fetch(`https://api.github.com/search/repositories?q=created:%3E%3D${createdAfter}&sort=stars&order=desc&per_page=5`, {
      cache: 'no-store',
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('GitHub trending request failed')
        return response.json() as Promise<{ items?: GitHubSearchRepository[] }>
      })
      .then((data) => {
        if (!data.items || data.items.length < 5) throw new Error('GitHub trending data is incomplete')
        setTrendingRepositories(data.items.slice(0, 5).map((repository) => ({
          fullName: repository.full_name,
          url: repository.html_url,
          language: repository.language ?? '其他',
          stars: repository.stargazers_count,
        })))
        setTrendSource('live')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setTrendSource('fallback')
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const searchTerm = encodeURIComponent('That Girl Olly Murs')

    fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=song&limit=10&country=US`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('iTunes music request failed')
        return response.json() as Promise<{ results?: ITunesTrack[] }>
      })
      .then((data) => {
        const result = data.results?.find((track) => (
          track.trackName.toLowerCase() === 'that girl'
          && track.artistName.toLowerCase().includes('olly murs')
          && track.previewUrl
        ))
        if (!result?.previewUrl) throw new Error('That Girl preview is unavailable')

        setMusicTrack({
          title: result.trackName,
          artist: result.artistName,
          album: result.collectionName,
          artwork: result.artworkUrl100?.replace('100x100bb', '600x600bb') ?? '',
          previewUrl: result.previewUrl,
          trackUrl: result.trackViewUrl ?? fallbackTrack.trackUrl,
          duration: Math.round((result.trackTimeMillis ?? fallbackTrack.duration * 1000) / 1000),
        })
        setMusicSource('live')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setMusicSource('fallback')
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  const filteredSites = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return sites.filter((site) => {
      const matchesCategory = activeCategory === 'all' || site.category === activeCategory
      const matchesQuery = !normalizedQuery || `${site.name} ${site.description}`.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    document.getElementById('site-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio || !musicTrack.previewUrl) return

    if (audio.paused) {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }
      return
    }

    audio.pause()
    setIsPlaying(false)
  }

  const updateProgress = (value: number) => {
    setProgress(value)
    const audio = audioRef.current
    if (audio && Number.isFinite(audio.duration)) {
      audio.currentTime = (value / 100) * audio.duration
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-[#1d1d1f]">
      <AnimatedGridPattern className="pointer-events-none fixed inset-0 h-full w-full opacity-45" />
      <div className="pointer-events-none fixed -left-32 top-[-8rem] h-[32rem] w-[32rem] rounded-full bg-[#d9e8ff]/65 blur-[120px]" />
      <div className="pointer-events-none fixed -right-20 top-32 h-[28rem] w-[28rem] rounded-full bg-[#f5dfff]/60 blur-[120px]" />

      <header className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center gap-4 px-5 py-5 md:px-8 lg:py-7">
        <a href="#" className="flex shrink-0 items-center gap-3" aria-label="导航站首页">
          <span className="grid size-11 place-items-center rounded-[15px] bg-[#1d1d1f] text-white shadow-[0_8px_24px_rgba(0,0,0,.16)]">
            <Command className="size-5" />
          </span>
          <span className="hidden text-[17px] font-semibold tracking-[-0.02em] sm:block">拾光导航</span>
        </a>

        <form onSubmit={handleSearch} className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-[22px] border border-white/90 bg-white/75 p-1.5 pl-4 shadow-[0_16px_50px_rgba(38,42,50,.08)] backdrop-blur-2xl">
          <Search className="size-[18px] shrink-0 text-[#85858a]" aria-hidden="true" />
          <Input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索网站、工具或内容"
            className="h-10 border-0 bg-transparent px-1 text-[15px] shadow-none focus-visible:ring-0"
            aria-label="搜索导航站"
          />
          <span className="hidden items-center gap-1 rounded-lg bg-[#f0f0f2] px-2 py-1 text-[11px] font-medium text-[#77777c] md:flex">
            <Command className="size-3" />K
          </span>
          <Button type="submit" className="h-10 rounded-[15px] px-5">搜索</Button>
        </form>

        <Button variant="ghost" size="icon" className="hidden shrink-0 rounded-full bg-white/60 md:inline-flex" aria-label="关于导航站">
          <Info className="size-[18px]" />
        </Button>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-10 md:px-8">
        <section className="grid gap-4 lg:grid-cols-[1.16fr_.46fr_1fr]">
          <Card className="glass-card overflow-hidden p-5 md:p-6">
            <div className="mb-3.5 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">GitHub Trending</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em]">趋势项目 Top 5</h1>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#edf7f0] px-2.5 py-1 text-[11px] font-semibold text-[#348255]">
                <span className={cn('size-1.5 rounded-full bg-[#42a66c]', trendSource === 'loading' && 'animate-pulse')} />
                {trendSource === 'live' ? '实时' : trendSource === 'fallback' ? '本周' : '更新中'}
              </span>
            </div>
            <div className="space-y-1">
              {trendingRepositories.map((repository, index) => (
                <motion.a
                  key={repository.fullName}
                  href={repository.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-[16px] px-2.5 py-2.5 text-left transition-colors hover:bg-white/90"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.055 * index, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <span className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-[10px] text-xs font-bold tabular-nums',
                    index === 0 ? 'bg-[#1d1d1f] text-white' : 'bg-[#f0f0f2] text-[#737378]',
                  )}>
                    {index + 1}
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-[12px] bg-[#f2f2f4] text-[#242427]">
                    <SiGithub className="size-[17px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold tracking-[-0.01em]">{repository.fullName}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#929298]">
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: languageColors[repository.language] ?? '#8b8b91' }} />
                      <span className="truncate">{repository.language}</span>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold tabular-nums text-[#737378]">
                    <Star className="size-3 fill-[#f3c963] text-[#d9aa35]" />
                    {compactNumber.format(repository.stars)}
                  </span>
                </motion.a>
              ))}
            </div>
            <a href="https://github.com/trending?since=weekly" target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-1.5 border-t border-[#ededf0] pt-3 text-[11px] font-semibold text-[#77777d] transition-colors hover:text-[#1d1d1f]">
              <TrendingUp className="size-3.5" />
              查看 GitHub 完整趋势榜
            </a>
          </Card>

          <Card className="glass-card flex min-h-[410px] flex-col items-center overflow-hidden p-4 text-center">
            <div className="w-full text-left">
              <p className="eyebrow">AI Creators</p>
              <p className="mt-1 text-[15px] font-semibold tracking-[-0.025em]">值得关注的博主</p>
            </div>

            <div className="relative -my-1 grid flex-1 place-items-center">
              <RadialIntro
                orbitItems={aiCreators}
                stageSize={260}
                imageSize={46}
                className="relative scale-[.9] overflow-visible sm:scale-100 lg:scale-[.78]"
              />
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="打开 X"
                className="absolute left-1/2 top-1/2 z-20 grid size-[4.35rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[#1d1d1f] transition-transform hover:scale-105"
              >
                <SiX className="size-6" />
              </a>
            </div>

            <p className="text-[12px] font-semibold">OpenAI · Claude Code · AI</p>
            <p className="mt-1 text-[10px] text-[#96969c]">点击头像前往 X 主页</p>
          </Card>

          <Card className="relative min-h-[410px] overflow-hidden border-0 bg-[#232326] p-0 text-white shadow-[0_25px_70px_rgba(25,25,30,.17)]">
            <div className="absolute -right-8 -top-12 size-44 rounded-full bg-[#8e78ff]/40 blur-[58px]" />
            <div className="absolute -bottom-16 left-1/4 size-48 rounded-full bg-[#5179d9]/20 blur-[70px]" />
            <div className="relative flex h-full min-h-[410px] flex-col">
              <div className="flex items-center justify-between px-5 pb-3 pt-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-white/40">X / AI Signals</p>
                  <p className="mt-1 text-[17px] font-semibold tracking-[-0.025em]">AI 博主正在说</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-white/[0.08] px-2.5 py-1 text-[10px] text-white/55">
                  <span className="size-1.5 rounded-full bg-[#70d79b]" />
                  自动滚动
                </span>
              </div>

              <div className="x-insight-viewport relative mx-2 min-h-0 flex-1 overflow-hidden px-3">
                <div className="x-insight-track">
                  <InsightList />
                  <InsightList duplicate />
                </div>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-[#232326] to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-[#232326] to-transparent" />
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3 text-[10px] text-white/35">
                <span>观点摘要 · 点击阅读原帖</span>
                <SiX className="size-3.5" />
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-4 grid items-stretch gap-4 lg:grid-cols-[350px_minmax(0,1fr)]">
          <Card className="music-card relative min-h-[480px] overflow-hidden border-0 p-0 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(255,255,255,.34),transparent_28%),linear-gradient(145deg,#ef87a2_0%,#b467a9_40%,#42446f_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/35" />
            <div className="relative flex h-full min-h-[480px] flex-col p-6">
              <audio
                ref={audioRef}
                src={musicTrack.previewUrl || undefined}
                preload="none"
                muted={isMuted}
                onLoadedMetadata={(event) => setPreviewDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 30)}
                onTimeUpdate={(event) => {
                  const duration = event.currentTarget.duration
                  if (Number.isFinite(duration) && duration > 0) {
                    setProgress((event.currentTarget.currentTime / duration) * 100)
                  }
                }}
                onEnded={() => {
                  setIsPlaying(false)
                  setProgress(0)
                }}
              />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Now playing</p>
                  <p className="mt-1 text-[13px] font-medium text-white/85">
                    {musicSource === 'live' ? 'Apple Music 在线试听' : musicSource === 'fallback' ? '今日单曲' : '正在获取音乐'}
                  </p>
                </div>
                <Music2 className="size-5 text-white/80" />
              </div>

              <motion.div
                className="mx-auto mt-8 grid aspect-square w-full max-w-[238px] place-items-center overflow-hidden rounded-[34px] border border-white/20 bg-[radial-gradient(circle_at_35%_30%,#ffd9d0_0%,#ed91aa_24%,#925c9b_58%,#313450_100%)] shadow-[0_30px_70px_rgba(41,32,68,.38)]"
                animate={isPlaying ? { scale: [1, 1.015, 1] } : { scale: 1 }}
                transition={{ repeat: isPlaying ? Infinity : 0, duration: 3.2, ease: 'easeInOut' }}
              >
                {musicTrack.artwork && (
                  <img src={musicTrack.artwork} alt={`${musicTrack.title} 专辑封面`} className="absolute inset-0 size-full object-cover" />
                )}
                <span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-xl">
                  <Music2 className="size-5" />
                </span>
              </motion.div>

              <div className="mt-auto pt-7">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-[26px] font-semibold tracking-[-0.04em]">{musicTrack.title}</h2>
                    <p className="mt-1 text-[14px] text-white/65">{musicTrack.artist}</p>
                    <p className="mt-1 max-w-52 truncate text-[11px] text-white/45">{musicTrack.album}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/15 hover:text-white" aria-label="收藏歌曲">
                    <Heart className="size-[19px]" />
                  </Button>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(event) => updateProgress(Number(event.target.value))}
                  className="music-progress mt-5 w-full"
                  style={{ '--progress': `${progress}%` } as CSSProperties}
                  aria-label="歌曲进度"
                />
                <div className="mt-1.5 flex justify-between text-[11px] font-medium text-white/55">
                  <span>{formatTime((progress / 100) * previewDuration)}</span>
                  <span>{formatTime(previewDuration)} 试听</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Button variant="ghost" size="icon" className="rounded-full text-white/70 hover:bg-white/10 hover:text-white" onClick={() => setIsMuted((value) => !value)} aria-label={isMuted ? '取消静音' : '静音'}>
                    {isMuted ? <VolumeX className="size-[18px]" /> : <Volume2 className="size-[18px]" />}
                  </Button>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10 hover:text-white" aria-label="上一首">
                      <SkipBack className="size-5 fill-current" />
                    </Button>
                    <Button size="icon" disabled={!musicTrack.previewUrl} className="size-12 rounded-full bg-white text-[#5d4f72] shadow-lg hover:bg-white/90" onClick={togglePlayback} aria-label={isPlaying ? '暂停' : '播放'}>
                      {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="ml-0.5 size-5 fill-current" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10 hover:text-white" aria-label="下一首">
                      <SkipForward className="size-5 fill-current" />
                    </Button>
                  </div>
                  <span className="size-10" aria-hidden="true" />
                </div>
                <a href={musicTrack.trackUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-1 text-[10px] font-medium text-white/48 transition-colors hover:text-white/75">
                  在 Apple Music 上查看 · provided courtesy of iTunes
                  <ArrowUpRight className="size-3" />
                </a>
              </div>
            </div>
          </Card>

          <Card id="navigation" className="glass-card overflow-hidden p-5 md:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">导航分类</p>
                <h2 className="mt-1 text-[26px] font-semibold tracking-[-0.04em]">发现值得收藏的网站</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#85858a]">
                <Grid2X2 className="size-3.5" />
                <span>{filteredSites.length} 个结果</span>
              </div>
            </div>

            <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as Category)} className="mt-6">
              <TabsList className="scrollbar-none flex w-full justify-start gap-1 overflow-x-auto rounded-[18px] bg-[#f1f1f3]/85 p-1.5">
                {categories.map((category) => (
                  <TabsTrigger key={category.value} value={category.value} className="shrink-0 rounded-[13px] px-4 py-2 text-[13px]">
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <motion.div id="site-results" layout className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filteredSites.map((site, index) => (
                <motion.a
                  layout
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noreferrer"
                  className="site-tile group flex min-h-[94px] items-center gap-3.5 rounded-[21px] border border-[#eeeeef] bg-white/78 p-3.5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.035, 0.25), duration: 0.3 }}
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-[16px]" style={{ backgroundColor: site.color, color: site.iconColor }}>
                    <site.icon className="size-[22px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">{site.name}</span>
                    <span className="mt-1 block truncate text-xs text-[#8a8a90]">{site.description}</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-[#c1c1c5] transition-transform group-hover:translate-x-0.5 group-hover:text-[#6e6e73]" />
                </motion.a>
              ))}
            </motion.div>

            {filteredSites.length === 0 && (
              <div className="grid min-h-52 place-items-center text-center">
                <div>
                  <Search className="mx-auto size-7 text-[#b4b4b8]" />
                  <p className="mt-3 text-sm font-medium">没有找到相关网站</p>
                  <button type="button" onClick={() => { setQuery(''); setActiveCategory('all') }} className="mt-1 text-xs text-[#737379] underline underline-offset-4">
                    清除筛选条件
                  </button>
                </div>
              </div>
            )}
          </Card>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 px-2 pt-6 text-xs text-[#8c8c91] sm:flex-row">
          <p>拾光导航 · 把时间留给更重要的事</p>
          <p>持续收录好用的数字工具</p>
        </footer>
      </main>
    </div>
  )
}

export default App
