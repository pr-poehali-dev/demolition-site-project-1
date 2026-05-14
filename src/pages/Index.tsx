import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const IMG_HERO = "https://cdn.poehali.dev/projects/6c469352-41c5-4b96-8df3-570bbd28f50e/files/a41182e1-4a2f-4cf4-b2b4-78e4b0705c16.jpg";
const IMG_PORTFOLIO_1 = "https://cdn.poehali.dev/projects/6c469352-41c5-4b96-8df3-570bbd28f50e/files/1f32d02f-06fd-454b-8870-2747114443d8.jpg";
const IMG_PORTFOLIO_2 = "https://cdn.poehali.dev/projects/6c469352-41c5-4b96-8df3-570bbd28f50e/files/7ca8820c-d81a-4ff2-97d5-165a6ce68732.jpg";
const IMG_PORTFOLIO_3 = "https://cdn.poehali.dev/projects/6c469352-41c5-4b96-8df3-570bbd28f50e/files/c35da9c4-7e95-487f-a311-ecd1245bef62.jpg";

const SERVICES = [
  { icon: "Home", title: "Демонтаж домов", desc: "Снос деревянных, кирпичных и каркасных жилых домов любой площади с вывозом мусора", price: "от 50 000 ₽" },
  { icon: "Flame", title: "Снос бань", desc: "Демонтаж банных строений, вывоз материалов, зачистка участка под новое строительство", price: "от 15 000 ₽" },
  { icon: "Warehouse", title: "Снос сараев и гаражей", desc: "Быстрый демонтаж хозяйственных построек, металлических и деревянных конструкций", price: "от 8 000 ₽" },
  { icon: "Fence", title: "Снос заборов и ограждений", desc: "Демонтаж металлических, деревянных, кирпичных заборов и ограждений любой длины", price: "от 500 ₽/м" },
  { icon: "Layers", title: "Частичный демонтаж", desc: "Снос отдельных стен, перекрытий, кровли без повреждения остальных конструкций", price: "по проекту" },
  { icon: "Truck", title: "Вывоз строительного мусора", desc: "Сортировка, погрузка и транспортировка строительных отходов на сертифицированные полигоны", price: "от 3 000 ₽/м³" },
];

const ADVANTAGES = [
  { icon: "ShieldCheck", title: "Лицензия и страховка", desc: "Работаем по договору с полным пакетом разрешительной документации и страхованием ответственности" },
  { icon: "Clock", title: "Сроки под контролем", desc: "Объект сдаём точно в срок. Штрафные санкции за каждый день просрочки — прописаны в договоре" },
  { icon: "Recycle", title: "Экологичный вывоз", desc: "Весь мусор отвозим на лицензированные полигоны, металл сдаём в переработку — экономим ваши деньги" },
  { icon: "Wrench", title: "Своя техника", desc: "Экскаваторы, самосвалы и спецтехника в собственности — никаких посредников, ниже цены" },
  { icon: "UserCheck", title: "Опыт 10+ лет", desc: "Более 500 объектов демонтировано. Работаем с частными клиентами и юридическими лицами по всей области" },
  { icon: "FileText", title: "Договор и акты", desc: "Полная юридическая прозрачность: договор, акт выполненных работ, все документы для банка и налоговой" },
];

const PORTFOLIO = [
  { img: IMG_PORTFOLIO_1, title: "Жилой дом 120 м²", tag: "Деревянный дом", year: "2024", days: "3 дня" },
  { img: IMG_PORTFOLIO_2, title: "Хозяйственные постройки", tag: "Сарай + баня", year: "2024", days: "1 день" },
  { img: IMG_PORTFOLIO_3, title: "Кирпичный дом 200 м²", tag: "Кирпичный дом", year: "2023", days: "5 дней" },
];

const BUILDING_TYPES = [
  { id: "wooden_house", label: "Деревянный дом", basePrice: 800 },
  { id: "brick_house", label: "Кирпичный дом", basePrice: 1200 },
  { id: "stone_house", label: "Каменный дом", basePrice: 1400 },
  { id: "frame_house", label: "Каркасный дом", basePrice: 700 },
  { id: "bath", label: "Баня", basePrice: 600 },
  { id: "garage", label: "Гараж", basePrice: 500 },
  { id: "barn", label: "Сарай", basePrice: 400 },
];

const EXTRAS = [
  { id: "garbage", label: "Вывоз мусора", price: 3000 },
  { id: "foundation", label: "Демонтаж фундамента", price: 5000 },
  { id: "sorting", label: "Сортировка материалов", price: 2000 },
];

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function AnimSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [buildingType, setBuildingType] = useState(BUILDING_TYPES[0]);
  const [area, setArea] = useState(80);
  const [extras, setExtras] = useState<string[]>([]);
  const [floors, setFloors] = useState(1);

  const totalPrice = (() => {
    const base = buildingType.basePrice * area * floors;
    const extraTotal = extras.reduce((sum, id) => {
      const e = EXTRAS.find(x => x.id === id);
      return sum + (e?.price || 0);
    }, 0);
    const raw = base + extraTotal;
    return Math.max(25000, raw);
  })();

  const areaPercent = ((area - 10) / (500 - 10)) * 100;

  const toggleExtra = (id: string) => {
    setExtras(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const navLinks = [
    { href: "#services", label: "Услуги" },
    { href: "#portfolio", label: "Портфолио" },
    { href: "#advantages", label: "Преимущества" },
    { href: "#prices", label: "Цены" },
    { href: "#calculator", label: "Калькулятор" },
    { href: "#contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0f1012", color: "#f0f0f0" }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "rgba(15,16,18,0.95)", borderColor: "#2a2d35", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded" style={{ background: "#F97316" }}>
              <Icon name="Hammer" size={16} className="text-black" />
            </div>
            <span className="text-xl font-bold tracking-widest uppercase" style={{ fontFamily: "Oswald, sans-serif", color: "#fff" }}>
              СносПро
            </span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="text-sm font-medium tracking-wide transition-colors hover:text-orange-400" style={{ fontFamily: "Oswald, sans-serif", color: "#a0a0a0" }}>
                {l.label}
              </a>
            ))}
            <a href="#contacts" className="px-4 py-2 text-sm font-bold tracking-wide uppercase rounded" style={{ background: "#F97316", color: "#0f1012", fontFamily: "Oswald, sans-serif" }}>
              Позвонить
            </a>
          </div>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} className="text-white" />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-3" style={{ background: "#0f1012", borderTop: "1px solid #2a2d35" }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium tracking-wide" style={{ fontFamily: "Oswald, sans-serif", color: "#a0a0a0" }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center" style={{ paddingTop: "64px" }}>
        <div className="absolute inset-0 z-0">
          <img src={IMG_HERO} alt="Демонтаж дома" className="w-full h-full object-cover" style={{ filter: "brightness(0.22)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,16,18,0.85) 0%, rgba(15,16,18,0.35) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.4)", color: "#F97316" }}>Работаем по всей Кемеровской и Свердловской области</div>
            <h1 className="text-5xl md:text-7xl font-bold leading-none mb-6 uppercase tracking-tight" style={{ fontFamily: "Oswald, sans-serif" }}>
              Демонтаж<br />
              <span style={{ color: "#F97316" }}>любых</span><br />
              построек
            </h1>
            <p className="text-lg md:text-xl mb-10 leading-relaxed" style={{ color: "#a0a0a0", maxWidth: "520px" }}>Профессиональный снос домов, бань, сараев и гаражей, ларьков и других сооружений. Работаем быстро, чисто, с полным вывозом мусора и юридическим оформлением.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#calculator" className="inline-flex items-center gap-2 px-8 py-4 font-bold text-lg uppercase tracking-wide rounded transition-opacity hover:opacity-90" style={{ background: "#F97316", color: "#0f1012", fontFamily: "Oswald, sans-serif" }}>
                <Icon name="Calculator" size={20} />
                Рассчитать стоимость
              </a>
              <a href="#contacts" className="inline-flex items-center gap-2 px-8 py-4 font-bold text-lg uppercase tracking-wide rounded transition-colors hover:bg-white hover:text-black" style={{ border: "1px solid #fff", color: "#fff", fontFamily: "Oswald, sans-serif" }}>
                <Icon name="Phone" size={20} />
                Бесплатная консультация
              </a>
            </div>
            <div className="flex flex-wrap gap-8 mt-12">
              {[["100+", "объектов сдано"], ["10 лет", "на рынке"], ["3 часа", "выезд на объект"]].map(([num, label]) => (
                <div key={num}>
                  <div className="text-3xl font-bold" style={{ fontFamily: "Oswald, sans-serif", color: "#F97316" }}>{num}</div>
                  <div className="text-sm" style={{ color: "#a0a0a0" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimSection>
            <div className="mb-14">
              <div className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#F97316", fontFamily: "Oswald, sans-serif" }}>— Что мы делаем</div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>Наши услуги</h2>
            </div>
          </AnimSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <AnimSection key={s.title}>
                <div
                  className="group p-6 rounded-lg border transition-all duration-300 hover:border-orange-400 cursor-default h-full"
                  style={{ background: "#16181c", borderColor: "#2a2d35" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded flex items-center justify-center" style={{ background: "rgba(249,115,22,0.12)" }}>
                      <Icon name={s.icon} size={22} style={{ color: "#F97316" }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#F97316", fontFamily: "Oswald, sans-serif" }}>{s.price}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#808080" }}>{s.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-24 px-4" style={{ background: "#111316" }}>
        <div className="max-w-6xl mx-auto">
          <AnimSection>
            <div className="mb-14">
              <div className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#F97316", fontFamily: "Oswald, sans-serif" }}>— Наши работы</div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>Портфолио</h2>
            </div>
          </AnimSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PORTFOLIO.map((p) => (
              <AnimSection key={p.title}>
                <div className="group relative overflow-hidden rounded-lg">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.05) 60%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="inline-block text-xs font-bold px-2 py-1 rounded mb-2 uppercase tracking-wide" style={{ background: "#F97316", color: "#0f1012", fontFamily: "Oswald, sans-serif" }}>
                      {p.tag}
                    </span>
                    <h3 className="text-lg font-bold uppercase text-white" style={{ fontFamily: "Oswald, sans-serif" }}>{p.title}</h3>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs" style={{ color: "#a0a0a0" }}>{p.year}</span>
                      <span className="text-xs" style={{ color: "#F97316" }}>{p.days}</span>
                    </div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimSection>
            <div className="mb-14">
              <div className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#F97316", fontFamily: "Oswald, sans-serif" }}>— Почему мы</div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>Преимущества</h2>
            </div>
          </AnimSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ADVANTAGES.map((a) => (
              <AnimSection key={a.title}>
                <div className="flex gap-4 p-6 rounded-lg border h-full" style={{ background: "#16181c", borderColor: "#2a2d35" }}>
                  <div className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: "rgba(249,115,22,0.12)" }}>
                    <Icon name={a.icon} size={18} style={{ color: "#F97316" }} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>{a.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#808080" }}>{a.desc}</p>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* PRICES */}
      <section id="prices" className="py-24 px-4" style={{ background: "#111316" }}>
        <div className="max-w-6xl mx-auto">
          <AnimSection>
            <div className="mb-14">
              <div className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#F97316", fontFamily: "Oswald, sans-serif" }}>— Прайс-лист</div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>Цены</h2>
            </div>
          </AnimSection>
          <AnimSection>
            <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#2a2d35" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#F97316" }}>
                    <th className="text-left p-4 font-bold uppercase text-sm tracking-wide" style={{ fontFamily: "Oswald, sans-serif", color: "#0f1012" }}>Вид работ</th>
                    <th className="text-right p-4 font-bold uppercase text-sm tracking-wide" style={{ fontFamily: "Oswald, sans-serif", color: "#0f1012" }}>Стоимость</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Демонтаж деревянного дома", "от 700 ₽/м²"],
                    ["Демонтаж кирпичного дома", "от 1 100 ₽/м²"],
                    ["Снос каркасного дома", "от 600 ₽/м²"],
                    ["Снос бани", "от 500 ₽/м²"],
                    ["Демонтаж гаража / сарая", "от 400 ₽/м²"],
                    ["Демонтаж фундамента", "от 5 000 ₽"],
                    ["Вывоз мусора самосвалом", "от 3 000 ₽/м³"],
                    ["Снос забора", "от 500 ₽/пог.м"],
                  ].map(([name, price], i) => (
                    <tr key={name} className="border-t transition-colors hover:bg-white/5" style={{ borderColor: "#2a2d35", background: i % 2 === 0 ? "#16181c" : "#1a1c21" }}>
                      <td className="p-4 text-sm" style={{ color: "#d0d0d0" }}>{name}</td>
                      <td className="p-4 text-right font-bold" style={{ color: "#F97316", fontFamily: "Oswald, sans-serif" }}>{price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm" style={{ color: "#606060" }}>* Окончательная стоимость определяется после осмотра объекта. Цены указаны без учёта НДС.</p>
          </AnimSection>
        </div>
      </section>

      {/* CALCULATOR */}
      <section id="calculator" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimSection>
            <div className="mb-14">
              <div className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#F97316", fontFamily: "Oswald, sans-serif" }}>— Онлайн-расчёт</div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>Калькулятор стоимости</h2>
              <p className="mt-3 text-base" style={{ color: "#808080" }}>Получите предварительный расчёт за 30 секунд</p>
            </div>
          </AnimSection>
          <AnimSection>
            <div className="rounded-xl p-8 border" style={{ background: "#16181c", borderColor: "#2a2d35" }}>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-3" style={{ fontFamily: "Oswald, sans-serif", color: "#a0a0a0" }}>
                    Тип постройки
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {BUILDING_TYPES.map(bt => (
                      <button
                        key={bt.id}
                        onClick={() => setBuildingType(bt)}
                        className="p-3 rounded-lg border text-sm font-medium transition-all duration-200"
                        style={{
                          background: buildingType.id === bt.id ? "rgba(249,115,22,0.15)" : "#1a1c21",
                          borderColor: buildingType.id === bt.id ? "#F97316" : "#2a2d35",
                          color: buildingType.id === bt.id ? "#F97316" : "#a0a0a0",
                        }}
                      >
                        {bt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-3" style={{ fontFamily: "Oswald, sans-serif", color: "#a0a0a0" }}>
                    Площадь: <span style={{ color: "#F97316" }}>{area} м²</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={5}
                    value={area}
                    onChange={e => setArea(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      accentColor: "#F97316",
                      background: `linear-gradient(to right, #F97316 ${areaPercent}%, #2a2d35 ${areaPercent}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: "#606060" }}>
                    <span>10 м²</span>
                    <span>500 м²</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-3" style={{ fontFamily: "Oswald, sans-serif", color: "#a0a0a0" }}>
                    Этажность: <span style={{ color: "#F97316" }}>{floors} эт.</span>
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 3].map(f => (
                      <button
                        key={f}
                        onClick={() => setFloors(f)}
                        className="w-14 h-14 rounded-lg border text-lg font-bold transition-all duration-200"
                        style={{
                          background: floors === f ? "rgba(249,115,22,0.15)" : "#1a1c21",
                          borderColor: floors === f ? "#F97316" : "#2a2d35",
                          color: floors === f ? "#F97316" : "#a0a0a0",
                          fontFamily: "Oswald, sans-serif",
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-3" style={{ fontFamily: "Oswald, sans-serif", color: "#a0a0a0" }}>
                    Дополнительные работы
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {EXTRAS.map(ex => (
                      <button
                        key={ex.id}
                        onClick={() => toggleExtra(ex.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all duration-200"
                        style={{
                          background: extras.includes(ex.id) ? "rgba(249,115,22,0.15)" : "#1a1c21",
                          borderColor: extras.includes(ex.id) ? "#F97316" : "#2a2d35",
                          color: extras.includes(ex.id) ? "#F97316" : "#a0a0a0",
                        }}
                      >
                        <Icon name={extras.includes(ex.id) ? "CheckSquare" : "Square"} size={14} />
                        {ex.label}
                        <span className="text-xs opacity-70">+{ex.price.toLocaleString()} ₽</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)" }}>
                  <div>
                    <div className="text-sm uppercase tracking-wide mb-1" style={{ color: "#a0a0a0", fontFamily: "Oswald, sans-serif" }}>Предварительная стоимость</div>
                    <div className="text-4xl font-bold transition-all duration-300" style={{ fontFamily: "Oswald, sans-serif", color: "#F97316" }}>
                      {totalPrice.toLocaleString("ru-RU")} ₽
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#606060" }}>
                      {buildingType.label} · {area} м² · {floors} эт.
                      {totalPrice === 25000 && <span className="ml-2 text-orange-400/70">минимальная стоимость</span>}
                    </div>
                  </div>
                  <a
                    href="#contacts"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wide transition-opacity hover:opacity-90 whitespace-nowrap"
                    style={{ background: "#F97316", color: "#0f1012", fontFamily: "Oswald, sans-serif" }}
                  >
                    <Icon name="Send" size={16} />
                    Получить точный расчёт
                  </a>
                </div>
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-4" style={{ background: "#111316" }}>
        <div className="max-w-6xl mx-auto">
          <AnimSection>
            <div className="mb-14">
              <div className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: "#F97316", fontFamily: "Oswald, sans-serif" }}>— Связаться с нами</div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase" style={{ fontFamily: "Oswald, sans-serif" }}>Контакты</h2>
            </div>
          </AnimSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <AnimSection>
              <div className="space-y-4">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (999) 000-00-00", href: "tel:+79990000000" },
                  { icon: "MessageCircle", label: "WhatsApp / Telegram", value: "+7 (999) 000-00-00", href: "#" },
                  { icon: "Mail", label: "Email", value: "info@snospro.ru", href: "mailto:info@snospro.ru" },
                  { icon: "MapPin", label: "Адрес", value: "Московская область", href: "#" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Вс: 8:00 – 20:00", href: "#" },
                ].map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 p-4 rounded-lg border transition-colors"
                    style={{ background: "#16181c", borderColor: "#2a2d35" }}
                  >
                    <div className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(249,115,22,0.12)" }}>
                      <Icon name={item.icon} size={18} style={{ color: "#F97316" }} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide mb-0.5" style={{ color: "#606060", fontFamily: "Oswald, sans-serif" }}>{item.label}</div>
                      <div className="font-medium" style={{ color: "#e0e0e0" }}>{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </AnimSection>

            <AnimSection>
              <div className="rounded-xl p-8 border" style={{ background: "#16181c", borderColor: "#2a2d35" }}>
                <h3 className="text-2xl font-bold uppercase mb-6" style={{ fontFamily: "Oswald, sans-serif" }}>Заказать бесплатный выезд</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Oswald, sans-serif", color: "#a0a0a0" }}>Ваше имя</label>
                    <input
                      type="text"
                      placeholder="Иван Петров"
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                      style={{ background: "#1a1c21", border: "1px solid #2a2d35", color: "#e0e0e0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Oswald, sans-serif", color: "#a0a0a0" }}>Телефон</label>
                    <input
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                      style={{ background: "#1a1c21", border: "1px solid #2a2d35", color: "#e0e0e0" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide mb-2" style={{ fontFamily: "Oswald, sans-serif", color: "#a0a0a0" }}>Что нужно снести?</label>
                    <textarea
                      rows={3}
                      placeholder="Опишите объект, его примерный размер и адрес..."
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
                      style={{ background: "#1a1c21", border: "1px solid #2a2d35", color: "#e0e0e0" }}
                    />
                  </div>
                  <button
                    className="w-full py-4 font-bold uppercase tracking-wide text-lg rounded-lg transition-opacity hover:opacity-90"
                    style={{ background: "#F97316", color: "#0f1012", fontFamily: "Oswald, sans-serif" }}
                  >
                    Отправить заявку
                  </button>
                  <p className="text-xs text-center" style={{ color: "#505050" }}>
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                  </p>
                </div>
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-4 border-t" style={{ background: "#0c0d0f", borderColor: "#1e2025" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center rounded" style={{ background: "#F97316" }}>
              <Icon name="Hammer" size={13} className="text-black" />
            </div>
            <span className="font-bold text-lg uppercase tracking-widest" style={{ fontFamily: "Oswald, sans-serif" }}>СносПро</span>
          </div>
          <p className="text-sm" style={{ color: "#505050" }}>© 2024 СносПро. Профессиональный демонтаж построек</p>
          <div className="flex flex-wrap gap-4">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="text-xs hover:text-orange-400 transition-colors" style={{ color: "#505050" }}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;