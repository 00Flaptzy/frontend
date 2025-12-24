import React, { useEffect, useState, useRef } from "react";
import NavBar from "./navBar";
import "../index.css";
import { defineCookiesToken } from "../utils/cookieHandling";
import { Link } from "react-router-dom";

// Importaciones de lucide-react (incluyendo Plus que faltaba)
import {
  Sparkles,
  ArrowRight,
  Rocket,
  Clock,
  CalendarDays,
  CheckCircle,
  Zap,
  Target,
  TrendingUp,
  Trophy,
  Users,
  BarChart3,
  Shield,
  Moon,
  Sun,
  Star,
  Heart,
  Award,
  Bell,
  Calendar,
  Coffee,
  BookOpen,
  Dumbbell,
  Brain,
  Music,
  PenTool,
  Cloud,
  Cpu,
  BatteryCharging,
  Palette,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  PieChart,
  LineChart,
  Activity,
  Eye,
  EyeOff,
  Battery,
  Wind,
  Droplets,
  Thermometer,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudSun,
  ThermometerSun,
  MoonStar,
  SunDim,
  CloudMoon,
  BrainCircuit,
  CircuitBoard,
  Cogs,
  Infinity,
  Satellite,
  Atom,
  Binary,
  Code,
  CpuCog,
  Database,
  HardDrive,
  Network,
  Router,
  Server,
  Terminal,
  Wifi,
  WifiOff,
  Bluetooth,
  Radio,
  SatelliteDish,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Gauge,
  Timer,
  TimerOff,
  TimerReset,
  Watch,
  AlarmClock,
  AlarmClockCheck,
  AlarmClockMinus,
  AlarmClockOff,
  AlarmClockPlus,
  CalendarClock,
  CalendarHeart,
  CalendarCheck,
  CalendarPlus,
  CalendarRange,
  CalendarSearch,
  CalendarX,
  Clock1,
  Clock10,
  Clock11,
  Clock12,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Hourglass,
  SandTimer,
  WatchIcon,
  BrainCog,
  BrainIcon,
  CircuitBoardIcon,
  Cog,
  CogIcon,
  CpuIcon,
  CogsIcon,
  Crosshair,
  CrosshairIcon,
  Radar,
  SatelliteIcon,
  Settings,
  Settings2,
  Sliders,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  UserCog,
  UsersCog,
  Wrench,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  BatteryWarning,
  BluetoothConnected,
  BluetoothSearching,
  Cast,
  Airplay,
  Monitor,
  MonitorSmartphone,
  Smartphone,
  Tablet,
  Tv,
  Tv2,
  Video,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Headphones,
  Speaker,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Music2,
  Music3,
  Music4,
  Play,
  Pause,
  StopCircle,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Repeat,
  Repeat1,
  Shuffle,
  ListMusic,
  ListVideo,
  Film,
  Clapperboard,
  TvIcon,
  VideoIcon,
  Youtube,
  Twitch,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Gitlab,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  GitCompare,
  GitFork,
  Code2,
  Brackets,
  Braces,
  Parentheses,
  CurlyBraces,
  TerminalSquare,
  Command,
  SquareCode,
  BracketsSquare,
  BracesSquare,
  ParenthesesSquare,
  CurlyBracesSquare,
  FileCode,
  FileJson,
  FileText,
  File,
  Folder,
  FolderOpen,
  FolderClosed,
  FolderInput,
  FolderOutput,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderSync,
  FolderSearch,
  FolderTree,
  HardDriveDownload,
  HardDriveUpload,
  Save,
  Upload,
  Download,
  Share,
  Share2,
  Copy,
  CopyCheck,
  CopyX,
  Cut,
  Scissors,
  Clipboard,
  ClipboardCheck,
  ClipboardCopy,
  ClipboardList,
  ClipboardPaste,
  ClipboardSignature,
  ClipboardType,
  ClipboardX,
  FileDigit,
  FileArchive,
  FileAudio,
  FileImage,
  FileVideo,
  FileSpreadsheet,
  FilePresentation,
  FileDatabase,
  FileCog,
  FileSearch,
  FileSymlink,
  FileUp,
  FileDown,
  FileInput,
  FileOutput,
  FilePlus,
  FileMinus,
  FileX,
  FileCheck,
  FileWarning,
  FileQuestion,
  FileHeart,
  FileCode2,
  FileJson2,
  FileText2,
  FolderCog,
  FolderHeart,
  FolderKey,
  FolderLock,
  FolderMinus2,
  FolderOpen2,
  FolderPlus2,
  FolderRoot,
  FolderSearch2,
  FolderSymlink,
  FolderTree2,
  FolderUp,
  FolderX2,
  CloudUpload,
  CloudDownload,
  CloudOff,
  CloudSnowIcon,
  CloudRainIcon,
  CloudLightningIcon,
  CloudFog,
  CloudDrizzle,
  CloudHail,
  CloudSunRain,
  CloudMoonRain,
  Cloudy,
  Haze,
  Hurricane,
  Tornado,
  Waves,
  Droplet,
  DropletsIcon,
  ThermometerIcon,
  ThermometerSnowflake,
  ThermometerSunIcon,
  SunsetIcon,
  SunriseIcon,
  MoonIcon,
  SunIcon,
  StarIcon,
  Planet,
  Globe2,
  Map,
  MapPin,
  Navigation,
  Navigation2,
  Compass,
  Flag,
  Landmark,
  Building,
  Home,
  Hotel,
  Store,
  Bank,
  Factory,
  Warehouse,
  Church,
  Mosque,
  Synagogue,
  Temple,
  Castle,
  Tent,
  Car,
  Bike,
  Bus,
  Train,
  Ship,
  Plane,
  UFO,
  Alien,
  Ghost,
  Skull,
  Bone,
  HeartPulse,
  Heartbeat,
  Pulse,
  ActivityIcon,
  BrainActivity,
  BrainWave,
  BrainSynapse,
  Neuron,
  Dna,
  AtomIcon,
  FlaskConical,
  FlaskRound,
  TestTube,
  TestTube2,
  Microscope,
  Telescope,
  Beaker,
  Dropper,
  Pill,
  Syringe,
  Stethoscope,
  Hospital,
  Ambulance,
  FirstAid,
  Bandage,
  Thermometer2,
  EyeDropper,
  Scale,
  Weight,
  Swimming,
  Running,
  Walking,
  Hiking,
  Cycling,
  Skateboard,
  Surfing,
  Skiing,
  Snowboarding,
  Yoga,
  Meditation,
  Prayer,
  Zen,
  Lotus,
  Om,
  YinYang,
  Peace,
  Love,
  HeartIcon,
  HeartCrack,
  HeartOff,
  HeartPulseIcon,
  HeartbeatIcon,
  HeartHandshake,
  HeartSparkles,
  Stars,
  ShootingStar,
  Comet,
  Meteor,
  Galaxy,
  Constellation,
  Orbit,
  SpaceShuttle,
  Astronaut,
  MoonRover,
  RadarIcon,
  Antenna,
  Broadcast,
  RadioTower,
  SignalIcon,
  WifiIcon,
  BluetoothIcon,
  Nfc,
  QrCode,
  Barcode,
  Scan,
  ScanFace,
  ScanText,
  Fingerprint,
  FaceId,
  EyeScan,
  RetinaScan,
  Hand,
  HandMetal,
  HandPeace,
  HandHeart,
  Handshake,
  ThumbsUp,
  ThumbsDown,
  Clap,
  OkHand,
  V,
  PeaceHand,
  CallMeHand,
  PointUp,
  PointDown,
  PointLeft,
  PointRight,
  RaiseHand,
  Wave,
  Salute,
  CrossedFingers,
  LoveYou,
  Metal,
  Horns,
  Vulcan,
  WritingHand,
  Paintbrush,
  Paintbrush2,
  ColorPicker,
  EyedropperIcon,
  Contrast,
  DropletIcon,
  Gradient,
  Palette2,
  SwatchBook,
  Brush,
  Pen,
  PenLine,
  PenOff,
  Pencil,
  PencilLine,
  PencilOff,
  PencilRuler,
  Ruler,
  Crop,
  CropIcon,
  Frame,
  Grid,
  Grid3x3,
  Grid4x4,
  Grid9x3,
  Grid9,
  Layout,
  LayoutGrid,
  LayoutList,
  LayoutPanelLeft,
  LayoutPanelTop,
  LayoutTemplate,
  Columns,
  Rows,
  Sidebar,
  SidebarClose,
  SidebarOpen,
  SidebarLeft,
  SidebarRight,
  Split,
  SplitSquareHorizontal,
  SplitSquareVertical,
  Square,
  SquareChart,
  SquareDashed,
  SquareEqual,
  SquareKanban,
  SquareSplitHorizontal,
  SquareSplitVertical,
  Table,
  Table2,
  TableProperties,
  Kanban,
  KanbanSquare,
  List,
  ListCheck,
  ListChecks,
  ListEnd,
  ListFilter,
  ListMinus,
  ListOrdered,
  ListPlus,
  ListRestart,
  ListStart,
  ListTodo,
  ListTree,
  ListX,
  Menu,
  MenuSquare,
  MoreHorizontal,
  MoreVertical,
  PanelBottom,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRight,
  PanelRightClose,
  PanelRightOpen,
  PanelTop,
  PanelTopClose,
  PanelTopOpen,
  AlignCenter,
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeEnd,
  AlignHorizontalDistributeStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  AlignVerticalDistributeEnd,
  AlignVerticalDistributeStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalSpaceAround,
  AlignVerticalSpaceBetween,
  Center,
  DistributeHorizontal,
  DistributeVertical,
  FlexAlignBottom,
  FlexAlignCenter,
  FlexAlignEnd,
  FlexAlignStart,
  FlexAlignTop,
  FlexAlignVerticalCenter,
  Grid2x2,
  Grid3x3Icon,
  Grid4x4Icon,
  Grid9Icon,
  GridKanban,
  GridLayout,
  GridTable,
  LayoutAlt,
  LayoutDashboard,
  LayoutHorizontal,
  LayoutVertical,
  Masonry,
  StretchHorizontal,
  StretchVertical,
  WrapText,
  Type,
  TypeOutline,
  Font,
  FontBold,
  FontItalic,
  FontRoman,
  FontSize,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Paragraph,
  Pilcrow,
  Quote,
  Text,
  TextCursor,
  TextCursorInput,
  TextQuote,
  TextSelect,
  TextSize,
  TextWrap,
  Underline,
  AlignBottom,
  AlignMiddle,
  AlignTop,
  Baseline,
  LineHeight,
  ListIndent,
  ListOutdent,
  PilcrowIcon,
  RemoveFormatting,
  SpellCheck,
  SpellCheck2,
  TextIcon,
  TextNone,
  CaseSensitive,
  CaseUpper,
  CaseLower,
  CaseCapitalize,
  Regex,
  Replace,
  ReplaceAll,
  Search,
  SearchCheck,
  SearchCode,
  SearchSlash,
  SearchX,
  Find,
  FindReplace,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Minimize2,
  Move,
  Move3d,
  MoveDiagonal,
  MoveDiagonal2,
  MoveHorizontal,
  MoveVertical,
  Rotate3d,
  RotateCcw,
  RotateCw,
  Scale3d,
  ScanBarcode,
  ScanEye,
  ScanLine,
  ScanQrCode,
  ScanSearch,
  ScanSmile,
  ScanUser,
  ScanVolume,
  SearchIcon,
  SearchMenu,
  SearchSettings,
  Shrink,
  SquareExpand,
  SquareMinus,
  SquarePlus,
  SquareX,
  TargetIcon,
  TelescopeIcon,
  Toggle,
  ToggleLeftIcon,
  ToggleRightIcon,
  UnfoldHorizontal,
  UnfoldVertical,
  ZoomInIcon,
  ZoomOutIcon,
  Plus // Añadido este icono que faltaba
} from "lucide-react";

/* ============================
   CONSTANTES Y DATOS DEMO
============================ */
const MOTIVATIONAL_PHRASES = [
  "La disciplina es el puente entre tus metas y tus logros.",
  "Pequeños hábitos, grandes transformaciones.",
  "No cuentes los días, haz que los días cuenten.",
  "La consistencia es la clave del dominio.",
  "Tu futuro self te agradecerá por empezar hoy.",
  "Cada hábito es un ladrillo en el castillo de tu éxito.",
  "La motivación te hace empezar, el hábito te hace continuar.",
  "No busques tiempo, créalo con hábitos.",
  "Los hábitos son el software de tu cerebro.",
  "Hoy es el primer día del resto de tus hábitos."
];

// Componente Bed personalizado (ahora definido ANTES de usarse)
const Bed = ({ className = "" }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path d="M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v9" />
  </svg>
);

const DEMO_SCHEDULE = {
  morning: [
    { time: "06:00", activity: "Despertar y meditación", icon: <Sunrise className="text-yellow-500" />, duration: "30 min", priority: "Alta" },
    { time: "06:30", activity: "Ejercicio matutino", icon: <Dumbbell className="text-blue-500" />, duration: "45 min", priority: "Alta" },
    { time: "07:15", activity: "Desayuno nutritivo", icon: <Coffee className="text-orange-500" />, duration: "30 min", priority: "Media" },
    { time: "07:45", activity: "Planificación del día", icon: <Calendar className="text-purple-500" />, duration: "15 min", priority: "Alta" }
  ],
  afternoon: [
    { time: "12:00", activity: "Almuerzo consciente", icon: <Heart className="text-red-500" />, duration: "45 min", priority: "Media" },
    { time: "13:00", activity: "Sesión de estudio", icon: <BookOpen className="text-green-500" />, duration: "90 min", priority: "Alta" },
    { time: "14:30", activity: "Revisión de proyectos", icon: <CheckCircle className="text-teal-500" />, duration: "60 min", priority: "Alta" },
    { time: "15:30", activity: "Descanso activo", icon: <Brain className="text-indigo-500" />, duration: "15 min", priority: "Baja" }
  ],
  evening: [
    { time: "18:00", activity: "Ejercicio físico", icon: <Activity className="text-pink-500" />, duration: "60 min", priority: "Alta" },
    { time: "19:00", activity: "Cena ligera", icon: <Heart className="text-rose-500" />, duration: "30 min", priority: "Media" },
    { time: "19:30", activity: "Lectura o aprendizaje", icon: <BookOpen className="text-amber-500" />, duration: "45 min", priority: "Media" },
    { time: "20:15", activity: "Reflexión del día", icon: <Brain className="text-violet-500" />, duration: "15 min", priority: "Alta" },
    { time: "20:30", activity: "Preparación para dormir", icon: <Moon className="text-blue-400" />, duration: "30 min", priority: "Alta" },
    { time: "21:00", activity: "Sueño reparador", icon: <Bed className="text-indigo-400" />, duration: "8 horas", priority: "Crítica" }
  ]
};

const WEEKLY_PROGRESS = [
  { day: "Lun", progress: 85, habits: 6 },
  { day: "Mar", progress: 92, habits: 7 },
  { day: "Mié", progress: 78, habits: 5 },
  { day: "Jue", progress: 95, habits: 8 },
  { day: "Vie", progress: 88, habits: 7 },
  { day: "Sáb", progress: 65, habits: 4 },
  { day: "Dom", progress: 70, habits: 5 }
];

const HABIT_CATEGORIES = [
  { name: "Salud", count: 4, icon: <Heart className="text-red-500" />, color: "from-red-500 to-pink-500" },
  { name: "Productividad", count: 5, icon: <Target className="text-blue-500" />, color: "from-blue-500 to-cyan-500" },
  { name: "Aprendizaje", count: 3, icon: <Brain className="text-purple-500" />, color: "from-purple-500 to-violet-500" },
  { name: "Bienestar", count: 4, icon: <Sparkles className="text-yellow-500" />, color: "from-yellow-500 to-orange-500" },
  { name: "Social", count: 2, icon: <Users className="text-green-500" />, color: "from-green-500 to-emerald-500" },
  { name: "Finanzas", count: 3, icon: <TrendingUp className="text-teal-500" />, color: "from-teal-500 to-cyan-500" }
];

const ACHIEVEMENTS = [
  { title: "Racha de 30 días", description: "Hábito de ejercicio", icon: <Trophy className="text-yellow-500" />, unlocked: true },
  { title: "Maestro de la mañana", description: "5:00 AM por 2 semanas", icon: <Sunrise className="text-orange-500" />, unlocked: true },
  { title: "Lector voraz", description: "20 libros en 3 meses", icon: <BookOpen className="text-blue-500" />, unlocked: false },
  { title: "Meditador zen", description: "100 horas de meditación", icon: <Brain className="text-purple-500" />, unlocked: true },
  { title: "Atleta consistente", description: "50 sesiones de gym", icon: <Dumbbell className="text-red-500" />, unlocked: false },
  { title: "Finanzas sanas", description: "3 meses de ahorro", icon: <TrendingUp className="text-green-500" />, unlocked: true }
];

const SYSTEM_STATS = {
  cpu: 42,
  memory: 78,
  storage: 65,
  network: 92,
  battery: 85,
  temperature: 36,
  humidity: 45,
  pressure: 1013
};

/* ============================
   COMPONENTES PERSONALIZADOS
============================ */
const GlowingOrb = ({ className = "" }) => (
  <div className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`}></div>
);

const ProgressBar = ({ percentage, color = "from-blue-500 to-purple-500", showLabel = true }) => (
  <div className="relative">
    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
    {showLabel && (
      <div className="text-xs text-gray-400 mt-1 text-right">{percentage}%</div>
    )}
  </div>
);

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
};

const SystemMonitor = () => {
  const [stats, setStats] = useState(SYSTEM_STATS);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpu: Math.min(100, Math.max(20, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(30, prev.memory + (Math.random() * 8 - 4))),
        network: Math.min(100, Math.max(40, prev.network + (Math.random() * 12 - 6)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "CPU", value: stats.cpu, icon: <Cpu className="text-cyan-500" />, color: "from-cyan-500 to-blue-500" },
        { label: "RAM", value: stats.memory, icon: <Database className="text-purple-500" />, color: "from-purple-500 to-pink-500" },
        { label: "RED", value: stats.network, icon: <Wifi className="text-green-500" />, color: "from-green-500 to-emerald-500" },
        { label: "BAT", value: stats.battery, icon: <BatteryCharging className="text-yellow-500" />, color: "from-yellow-500 to-orange-500" }
      ].map((stat, idx) => (
        <div key={idx} className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {stat.icon}
              <span className="text-sm text-gray-300">{stat.label}</span>
            </div>
            <span className="text-lg font-bold">{stat.value}%</span>
          </div>
          <ProgressBar percentage={stat.value} color={stat.color} showLabel={false} />
        </div>
      ))}
    </div>
  );
};

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 100;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.5)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none opacity-20"
    />
  );
};

/* ============================
   COMPONENTE PRINCIPAL
============================ */
function MainPage() {
  const [token] = defineCookiesToken();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [time, setTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("today");
  const [theme, setTheme] = useState("dark");
  const [notificationCount, setNotificationCount] = useState(3);
  const [weather, setWeather] = useState({ temp: 22, condition: "Soleado", icon: <Sun className="text-yellow-500" /> });

  /* Efectos de animación */
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhraseIndex(prev => (prev + 1) % MOTIVATIONAL_PHRASES.length);
    }, 5000);

    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const weatherInterval = setInterval(() => {
      const conditions = [
        { temp: 22, condition: "Soleado", icon: <Sun className="text-yellow-500" /> },
        { temp: 18, condition: "Parcialmente nublado", icon: <CloudSun className="text-orange-500" /> },
        { temp: 15, condition: "Lluvioso", icon: <CloudRain className="text-blue-500" /> }
      ];
      setWeather(conditions[Math.floor(Math.random() * conditions.length)]);
    }, 10000);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(timeInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /* ============================
     USUARIO LOGUEADO
  ============================ */
  if (token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/30 text-white overflow-hidden">
        <ParticleBackground />
        
        {/* Orbital Glows */}
        <GlowingOrb className="top-20 left-10 w-96 h-96 bg-purple-600" />
        <GlowingOrb className="bottom-20 right-10 w-96 h-96 bg-blue-600" />
        <GlowingOrb className="top-1/2 left-1/2 w-64 h-64 bg-pink-600" />

        <NavBar />

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header Principal */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                  <Sparkles className="text-purple-400" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Dashboard de Hábitos</h1>
                  <p className="text-gray-400">{formatDate(time)}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Hora Actual</div>
                  <DigitalClock />
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Clima</div>
                  <div className="flex items-center gap-3">
                    {weather.icon}
                    <div>
                      <div className="text-xl font-bold">{weather.temp}°C</div>
                      <div className="text-sm text-gray-400">{weather.condition}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
                  <div className="text-sm text-gray-400 mb-1">Notificaciones</div>
                  <div className="flex items-center gap-3">
                    <Bell className="text-yellow-500" />
                    <div className="text-xl font-bold">{notificationCount}</div>
                    <div className="text-sm text-gray-400">Pendientes</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                to="/habits"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
              >
                <Rocket className="group-hover:rotate-12 transition-transform" />
                Mis Hábitos
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>

              <Link
                to="/user-profile"
                className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white font-bold text-lg transition-all duration-300"
              >
                Mi Perfil
              </Link>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Columna Izquierda - Agenda */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="text-purple-400" size={28} />
                    <h2 className="text-2xl font-bold">Agenda del Día</h2>
                  </div>
                  <div className="flex gap-2">
                    {["today", "week", "month"].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          activeTab === tab 
                            ? "bg-purple-600 text-white" 
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {tab === "today" ? "Hoy" : tab === "week" ? "Semana" : "Mes"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {Object.entries(DEMO_SCHEDULE).map(([period, activities]) => (
                    <div key={period}>
                      <h3 className="text-xl font-bold mb-4 capitalize flex items-center gap-2">
                        {period === "morning" && <Sunrise className="text-yellow-500" />}
                        {period === "afternoon" && <Sun className="text-orange-500" />}
                        {period === "evening" && <Moon className="text-blue-500" />}
                        {period === "morning" ? "Mañana" : period === "afternoon" ? "Tarde" : "Noche"}
                      </h3>
                      <div className="space-y-4">
                        {activities.map((item, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-6 rounded-2xl bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50 transition-all duration-300 group hover:border-purple-500/30"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-xl bg-gray-900/50 group-hover:scale-110 transition-transform">
                                {item.icon}
                              </div>
                              <div>
                                <div className="text-xl font-bold">{item.time}</div>
                                <div className="text-gray-300">{item.activity}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="px-3 py-1 rounded-full bg-gray-900 text-sm">
                                {item.duration}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                item.priority === "Alta" 
                                  ? "bg-red-500/20 text-red-300" 
                                  : item.priority === "Media"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-green-500/20 text-green-300"
                              }`}>
                                {item.priority}
                              </span>
                              <button className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition">
                                <CheckCircle className="text-green-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sistema y Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Cpu className="text-cyan-400" />
                    Sistema
                  </h3>
                  <SystemMonitor />
                  <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="text-sm text-gray-400 mb-4">Ambiente</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50">
                        <div className="flex items-center gap-2">
                          <Thermometer className="text-red-400" />
                          <span>Temperatura</span>
                        </div>
                        <span className="font-bold">36°C</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50">
                        <div className="flex items-center gap-2">
                          <Droplets className="text-blue-400" />
                          <span>Humedad</span>
                        </div>
                        <span className="font-bold">45%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <BarChart3 className="text-green-400" />
                    Progreso Semanal
                  </h3>
                  <div className="space-y-6">
                    {WEEKLY_PROGRESS.map((day, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{day.day}</span>
                          <span className="text-gray-400">{day.habits} hábitos</span>
                        </div>
                        <ProgressBar 
                          percentage={day.progress} 
                          color={
                            day.progress >= 90 ? "from-green-500 to-emerald-500" :
                            day.progress >= 70 ? "from-blue-500 to-cyan-500" :
                            "from-orange-500 to-red-500"
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                        82%
                      </div>
                      <div className="text-gray-400">Promedio semanal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Stats y Logros */}
            <div className="space-y-8">
              {/* Frase Motivacional */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-3xl border border-purple-500/20 p-8">
                <div className="text-2xl font-bold mb-4">💭 Reflexión del Día</div>
                <div className="text-lg text-gray-200 italic">
                  "{MOTIVATIONAL_PHRASES[phraseIndex]}"
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                  <span>Actualiza en {5 - (time.getSeconds() % 5)}s</span>
                  <button className="hover:text-white transition">
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>

              {/* Categorías de Hábitos */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Target className="text-purple-400" />
                  Categorías
                </h3>
                <div className="space-y-4">
                  {HABIT_CATEGORIES.map((category, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gray-800/50 hover:bg-gray-800/80 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gray-900">
                          {category.icon}
                        </div>
                        <div>
                          <div className="font-bold">{category.name}</div>
                          <div className="text-sm text-gray-400">{category.count} hábitos</div>
                        </div>
                      </div>
                      <div className="w-24">
                        <ProgressBar 
                          percentage={(category.count / 8) * 100}
                          color={category.color}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logros */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Trophy className="text-yellow-400" />
                  Logros
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {ACHIEVEMENTS.map((achievement, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl transition-all ${
                        achievement.unlocked
                          ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                          : "bg-gray-800/50 border border-gray-700/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {achievement.icon}
                        <div className={`text-xs font-bold ${
                          achievement.unlocked ? "text-yellow-300" : "text-gray-400"
                        }`}>
                          {achievement.unlocked ? "DESBLOQUEADO" : "BLOQUEADO"}
                        </div>
                      </div>
                      <div className="font-bold">{achievement.title}</div>
                      <div className="text-sm text-gray-400">{achievement.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-3xl border border-blue-500/20 p-8">
                <h3 className="text-xl font-bold mb-6">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition border border-white/10">
                    <Plus className="text-green-400 mb-2" />
                    <span className="text-sm">Nuevo Hábito</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition border border-white/10">
                    <Calendar className="text-blue-400 mb-2" />
                    <span className="text-sm">Agendar</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition border border-white/10">
                    <BarChart3 className="text-purple-400 mb-2" />
                    <span className="text-sm">Reporte</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition border border-white/10">
                    <Settings className="text-gray-400 mb-2" />
                    <span className="text-sm">Ajustes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                42
              </div>
              <div className="text-gray-400">Días de racha</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                89%
              </div>
              <div className="text-gray-400">Tasa de éxito</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                1,240
              </div>
              <div className="text-gray-400">Hábitos totales</div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                28
              </div>
              <div className="text-gray-400">Logros</div>
            </div>
          </div>

          {/* Motivación Final */}
          <div className="text-center p-12 rounded-3xl bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-6">
              <Zap className="text-yellow-400" />
              <span className="font-bold">¡Sigue así!</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Cada día es una nueva oportunidad para{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                ser mejor
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Tu consistencia hoy construye el éxito de mañana. Mantén el ritmo y celebra cada pequeño logro.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ============================
     USUARIO NO LOGUEADO (LANDING PAGE)
  ============================ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900/20 text-white overflow-hidden">
      <ParticleBackground />
      
      {/* Efectos de fondo */}
      <GlowingOrb className="top-20 right-1/4 w-96 h-96 bg-blue-600" />
      <GlowingOrb className="bottom-20 left-1/4 w-96 h-96 bg-purple-600" />

      <NavBar />

      <div className="container mx-auto px-4 py-24 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-8">
            <Zap className="text-yellow-400" />
            <span className="font-bold">PLATAFORMA PREMIUM</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            <span className="block">Transforma tu vida</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              con hábitos inteligentes
            </span>
          </h1>

          <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
            La plataforma más avanzada para construir hábitos sostenibles, con análisis predictivo, 
            comunidad global y tecnología de punta.
          </p>

          {/* Stats en tiempo real */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold">15K+</div>
              <div className="text-gray-400">Usuarios activos</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-gray-400">Tasa de éxito</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold">42</div>
              <div className="text-gray-400">Países</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-gray-400">Soporte</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="group flex items-center gap-4 px-12 py-6 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Rocket className="group-hover:rotate-12 transition-transform" />
              <span>Comienza Gratis</span>
              <ArrowRight className="group-hover:translate-x-3 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="px-12 py-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white font-bold text-xl transition-all duration-300"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Demo Interactiva */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-12 mb-24">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Demo Interactiva
            </span>
            {" "}del Sistema
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Panel de Control Demo */}
            <div className="space-y-8">
              <div className="bg-gray-800/50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Cpu className="text-cyan-400" />
                  Panel de Control
                </h3>
                <SystemMonitor />
                
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <div className="text-sm text-gray-400 mb-4">Reloj en Tiempo Real</div>
                  <div className="font-mono text-3xl font-bold text-center p-6 rounded-xl bg-gray-900/50">
                    {formatTime(time)}
                  </div>
                </div>
              </div>

              {/* Agenda Demo */}
              <div className="bg-gray-800/50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <CalendarDays className="text-purple-400" />
                  Agenda de Hoy (Demo)
                </h3>
                <div className="space-y-4">
                  {DEMO_SCHEDULE.morning.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <div>
                          <div className="font-bold">{item.time}</div>
                          <div className="text-sm text-gray-400">{item.activity}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-300">{item.duration}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats y Features */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 rounded-2xl border border-blue-500/20">
                <h3 className="text-2xl font-bold mb-6">✨ Frase del Día</h3>
                <div className="text-2xl italic text-gray-200 mb-6">
                  "{MOTIVATIONAL_PHRASES[phraseIndex]}"
                </div>
                <div className="text-sm text-gray-400">
                  Actualiza cada 5 segundos
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Shield className="text-green-500" />, label: "Seguridad", value: "100%" },
                  { icon: <TrendingUp className="text-blue-500" />, label: "Crecimiento", value: "+45%" },
                  { icon: <Users className="text-purple-500" />, label: "Comunidad", value: "15K+" },
                  { icon: <Zap className="text-yellow-500" />, label: "Velocidad", value: "0.2ms" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-gray-800/50 p-6 rounded-2xl text-center">
                    <div className="flex justify-center mb-3">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800/50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">🚀 Características Exclusivas</h3>
                <div className="space-y-4">
                  {[
                    "Análisis predictivo de hábitos",
                    "Comunidad global motivacional",
                    "Tecnología blockchain segura",
                    "Inteligencia artificial personalizada",
                    "Sistema de recompensas NFT",
                    "Integración con wearables"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Final */}
        <div className="text-center p-16 rounded-3xl bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-white/10">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-6">
            <Rocket className="text-yellow-400" />
            <span className="font-bold">¿LISTO PARA COMENZAR?</span>
          </div>
          
          <h2 className="text-5xl font-bold mb-8">
            Únete a la{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              revolución de hábitos
            </span>
          </h2>
          
          <p className="text-2xl text-gray-300 max-w-2xl mx-auto mb-12">
            Miles de personas ya están transformando sus vidas. ¿Qué esperas para ser la próxima historia de éxito?
          </p>
          
          <Link
            to="/register"
            className="inline-flex items-center gap-4 px-16 py-6 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
          >
            <Zap className="group-hover:animate-pulse" />
            <span>Crear Cuenta Gratis</span>
            <ArrowRight className="group-hover:translate-x-3 transition-transform" />
          </Link>
          
          <p className="text-gray-400 mt-8">
            Sin tarjeta de crédito • Cancelación gratuita • 14 días de prueba premium
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="text-gray-400 hover:text-white transition">Términos</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Privacidad</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Contacto</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Soporte</a>
          </div>
          <div className="text-gray-500">
            © {new Date().getFullYear()} HabitTracker Pro. Todos los derechos reservados.
            <div className="text-sm mt-2">Demo interactiva • No se almacenan datos reales</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainPage;