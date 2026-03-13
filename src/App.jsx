import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  useNavigate,
  useParams
} from 'react-router-dom';
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Alert,
  Table
} from 'react-bootstrap';
import {
  Phone,
  MapPin,
  Clock,
  Calendar,
  Activity,
  Heart,
  HeartPulse,
  ChevronRight,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Facebook,
  Instagram,
  Mail,
  Users,
  LogOut,
  LayoutDashboard,
  FileText,
  Briefcase,
  Image as ImageIcon,
  Plus,
  Download,
  ArrowLeft,
  Tag,
  CalendarDays,
  Edit
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const API_BASE = `http://${window.location.hostname}:5000/api`;

const IconMap = {
  Activity: <Activity />,
  HeartPulse: <HeartPulse />,
  Heart: <Heart />,
  Users: <Users />
};

// --- Components ---

const CustomNavbar = ({ onBookClick, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`navbar-custom ${scrolled || !isHome ? 'scrolled' : ''}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
          <img src="images/logo.webp" alt="Logo" className="logo-shadow" style={{ height: '45px', width: 'auto' }} />
        </Navbar.Brand>
        <Navbar.Toggle className="border-0 shadow-none" aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="mx-auto gap-2 fw-medium">
            <Nav.Link as={Link} to="/">หน้าแรก</Nav.Link>
            {isHome ? (
              <>
                <Nav.Link href="#services">บริการ</Nav.Link>
              </>

            ) : null}


            {/* Dropdown: เกี่ยวกับเรา (About Us) */}
            <div className="nav-dropdown-wrapper">
              <button className="nav-dropdown-btn nav-link">
                เกี่ยวกับเรา <ChevronRight size={14} className="nav-chevron" />
              </button>
              <div className="nav-dropdown-menu">
                <Link to="/about" className="nav-dropdown-item">ประวัติความเป็นมา</Link>
                <Link to="/vision-mission" className="nav-dropdown-item">วิสัยทัศน์ พันธกิจ</Link>
                <Link to="/organization-structure" className="nav-dropdown-item">โครงสร้างหน่วยงาน</Link>
                <Link to="/mission-responsibilities" className="nav-dropdown-item">ภารกิจและหน้าที่</Link>
              </div>
            </div>

            {/* Dropdown: แฟ้มงาน (Work Folders) */}
            <div className="nav-dropdown-wrapper">
              <button className="nav-dropdown-btn nav-link">
                แฟ้มงาน <ChevronRight size={14} className="nav-chevron" />
              </button>
              <div className="nav-dropdown-menu">
                <Link to="/news" className="nav-dropdown-item">ประชาสัมพันธ์</Link>
                <Link to="/activities" className="nav-dropdown-item">การดำเนินงาน</Link>
                <Link to="/jobs" className="nav-dropdown-item">รับสมัครงาน</Link>
                <Link to="/bidding" className="nav-dropdown-item">ข่าวประกวดราคา</Link>
                <Link to="/median-prices" className="nav-dropdown-item">ราคากลาง</Link>
                <div className="nav-dropdown-divider my-1 border-bottom"></div>
                <Link to="/ita/2567" className="nav-dropdown-item">ITA 2567</Link>
                <Link to="/ita/2568" className="nav-dropdown-item">ITA 2568</Link>
                <Link to="/ita/2569" className="nav-dropdown-item">ITA 2569</Link>
              </div>
            </div>

            {/* Dropdown: เอกสารวิชาการ (Academic Docs) */}
            <div className="nav-dropdown-wrapper">
              <button className="nav-dropdown-btn nav-link">
                เอกสารวิชาการ <ChevronRight size={14} className="nav-chevron" />
              </button>
              <div className="nav-dropdown-menu">
                <Link to="/academic-docs/research" className="nav-dropdown-item">งานวิจัย</Link>
                <Link to="/academic-docs/innovation" className="nav-dropdown-item">นวัตกรรม</Link>
                <Link to="/academic-docs/cqi" className="nav-dropdown-item">CQI</Link>
                <div className="nav-dropdown-divider my-1 border-bottom"></div>
                <Link to="/academic-docs" className="nav-dropdown-item text-sub small font-italic">ดูทั้งหมด</Link>
              </div>
            </div>

            <Nav.Link href="#contact">ติดต่อเรา</Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/admin" className="text-primary-pink fw-bold">กระดานควบคุม</Nav.Link>
            )}
          </Nav>
          <div className="d-flex align-items-center gap-3">
            {!user ? (
              <Button variant="" onClick={onBookClick} className="btn-modern btn-modern-pink px-4">
                <Calendar size={18} />
                นัดหมายแพทย์
              </Button>
            ) : (
              <>
                <div className="d-none d-md-block text-end me-2">
                  <div className="small text-sub fw-bold">ยินดีต้อนรับ</div>
                  <div className="fw-bold text-primary-pink">เจ้าหน้าที่: {user.username}</div>
                </div>
                <Button variant="outline-danger" onClick={onLogout} className="rounded-pill px-4 d-flex align-items-center gap-2">
                  <LogOut size={18} /> ออกจากระบบ
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// --- Home Page Components ---

const Hero = ({ onBookClick }) => {
  const [stats, setStats] = useState({ specialists: '50+', emergency: '24/7', clients: '15k' });

  useEffect(() => {
    fetch(`${API_BASE}/stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  return (
    <div className="hero-section" id="home">
      <div className="hero-blob blob-1"></div>
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="d-inline-flex align-items-center gap-2 mb-4 py-2 px-3 rounded-pill bg-white shadow-soft border border-light">
                <Sparkles size={16} className="text-warning" />
                <span className="small fw-bold text-slate-600">ประสบการณ์การดูแลสุขภาพระดับพรีเมียม</span>
              </div>
              <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: 1.1, letterSpacing: '-0.04em' }}>
                การดูแลที่ยอดเยี่ยม <br />
                <span className="text-gradient">เพื่อคนที่คุณรัก</span>
              </h1>
              <p className="lead text-sub mb-5 pe-lg-5">
                เราผสมผสานความใส่ใจและนวัตกรรมการแพทย์ที่ทันสมัย
                เพื่อผลลัพธ์การรักษาที่ดีที่สุดในภูมิภาค
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button href="#services" variant="" className="btn-modern btn-modern-pink py-3 px-5">
                  บริการของเรา <ArrowRight size={20} />
                </Button>
                <Button variant="" onClick={onBookClick} className="btn-modern bg-white text-dark shadow-soft border py-3 px-5">
                  นัดหมายทันที
                </Button>
              </div>

              <div className="d-flex gap-4 mt-5 pt-4">
                <div className="stat-card text-center" style={{ minWidth: '100px' }}>
                  <h3 className="fw-bold mb-0">{stats.specialists}</h3>
                  <p className="small text-sub mb-0">แพทย์ผู้เชี่ยวชาญ</p>
                </div>
                <div className="stat-card text-center" style={{ minWidth: '100px' }}>
                  <h3 className="fw-bold mb-0">{stats.emergency}</h3>
                  <p className="small text-sub mb-0">ฉุกเฉิน 24/7</p>
                </div>
                <div className="stat-card text-center" style={{ minWidth: '100px' }}>
                  <h3 className="fw-bold mb-0">{stats.clients}</h3>
                  <p className="small text-sub mb-0">ผู้รับบริการ</p>
                </div>
              </div>
            </Motion.div>
          </Col>

          <Col lg={6} className="position-relative">
            <Motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="position-relative"
            >
              <img
                // src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1000"
                src="/images/16840.jpg"
                alt="Health Icon"
                className="img-fluid rounded-[50px] shadow-lg"
              />
              <Motion.div
                className="position-absolute floating-ui bg-white p-4 rounded-4 shadow-lg border-0"
                style={{ top: '20%', left: '-10%', width: '175px' }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Heart className="text-danger" fill="currentColor" size={20} />
                  <span className="fw-bold small">เราใส่ใจทุกระดับ</span>
                </div>
                <div className="h-2 bg-light rounded-pill overflow-hidden">
                  <Motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="h-100 bg-primary-pink"
                  ></Motion.div>
                </div>
              </Motion.div>
            </Motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/services`)
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error('Error fetching services:', err));
  }, []);

  return (
    <section className="section-modern bg-soft-slate" id="services">
      <Container>
        <div className="text-center mb-5 pb-4">
          <h4 className="fw-bold text-primary-pink mb-3">บริการของเรา</h4>
          <h2 className="display-5 fw-bold" style={{ letterSpacing: '-0.02em' }}>ทางเลือกใหม่เพื่อสุขภาพที่ดีกว่า</h2>
        </div>
        <Row className="g-4">
          {services.map((s, i) => (
            <Col lg={3} md={6} key={i}>
              <Motion.div
                whileHover={{ y: -10 }}
                className="card-modern"
              >
                <div className={`icon-circle ${s.color}-icon`}>
                  {IconMap[s.icon] || <Activity />}
                </div>
                <h4 className="fw-bold mb-3">{s.title}</h4>
                <p className="text-sub small mb-0">{s.desc}</p>
              </Motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="py-5" id="about">
      <Container className="py-5">
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <div className="position-relative">
              <div className="rounded-[40px] overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000"
                  alt="Modern Hospital"
                  className="img-fluid"
                />
              </div>
              <div className="position-absolute bottom-0 end-0 bg-white p-4 m-4 rounded-4 shadow-lg border border-light">
                <h5 className="fw-bold mb-1 text-primary-pink">คุณภาพต้องมาก่อน</h5>
                <p className="small text-sub mb-0">ได้รับการรับรองมาตรฐาน HA</p>
              </div>
            </div>
          </Col>
          <Col lg={6} className="ps-lg-5">
            <h4 className="fw-bold text-primary-pink mb-3">เกี่ยวกับเรา</h4>
            <h2 className="display-5 fw-bold mb-4" style={{ letterSpacing: '-0.02em' }}>กำหนดอนาคต <br />การดูแลสุขภาพในชุมชน</h2>
            <p className="text-sub mb-4 lead">
              "โรงพยาบาลชุมชนชายแดนที่ได้มาตรฐาน ผู้รับบริการประทับใจ
              เป็นเลิศด้านสิ่งแวดล้อม ภายในปี 2569"
            </p>
            <div className="mb-5">
              {[
                // "ค่านิยมองค์กร (Core Values) : สโลแกน คือ H E A R T คลองหาด หัวใจมาตราฐาน ใส่ใจบริการ รักษ์สิ่งแวดล้อม",
                // "H - High Standard (มาตราฐานสูง) -มุ่งมั่นพัฒนาคุณภาพบริการตามมาตราฐานวิชาชีพและมาตราฐานโรงพยาบาลอย่างต่อเนื่อง",
                // "E - Environment (ใส่ใจสิ่งแวดล้อม) -ดำเนินงานอย่างเป็นมิตรต่อสิ่งแวดล้อม สร้างโรงพยาบาลที่สะอาด ปลอดภัย และยั่งยืน",
                // "A - Accountability (ความรับผิดชอบ) -ปฏิบัติงานด้วยความโปร่งใส ซื่อสัตย์ และมีความรับผิดชอบต่อผู้ป่วย ชุมชน และองค์กร",
                // "R - Relationship (เคารพและสร้างสัมพันธ์) -ให้ความสำคัญกับความต้องการและความรู้ึสึก สร้างความประทับใจในการดูแลสร้างความร่วมมือที่ดีกับชุมชนและภาคีเครือข่าย",
                // "T - Teamwork (การทำงานเป็นทีม) -การทำงานเป็นทีม ร่วมมือกันเพื่อเป้าหมายเดียวกัน"
                "การดูแลที่ยึดเอาผู้ป่วยเป็นศูนย์กลาง",
                "เครื่องมือวินิจฉัยที่ทันสมัยและแม่นยำ",
                "บริการฉุกเฉินระดับพรีเมียม 24 ชั่วโมง"
              ].map((t, i) => (
                <div key={i} className="d-flex align-items-center gap-2 mb-2">
                  <div className="p-1 bg-primary-pink rounded-circle text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="fw-bold text-slate-700">{t}</span>
                </div>
              ))}
            </div>
            <Button as={Link} to="/about" variant="" className="btn-modern btn-modern-pink px-5">ดูข้อมูลหน่วยงาน</Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

const NewsSection = ({ user }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/news`)
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.error('Error fetching news:', err));
  }, []);

  return (
    <section className="py-5" id="news">
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h4 className="fw-bold text-primary-pink mb-3">ข่าวประชาสัมพันธ์</h4>
            <h2 className="display-5 fw-bold mb-0" style={{ letterSpacing: '-0.02em' }}>ติดตามข่าวสารล่าสุด</h2>
          </div>
          <Button as={Link} to="/news" variant="" className="btn-modern bg-white shadow-soft border d-none d-md-flex">ดูข่าวทั้งหมด</Button>
        </div>

        <Row className="g-4">
          {news.map((item) => (
            <Col lg={4} md={6} key={item.id}>
              <Motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-soft border border-light h-100 d-flex flex-column"
              >
                <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                  <img
                    src={item.image.startsWith('http') ? item.image : `${API_BASE.replace('/api', '')}${item.image}`}
                    alt={item.title}
                    className="w-100 h-100 object-cover"
                  />
                  <div className="position-absolute top-0 start-0 m-3 badge-pink bg-white shadow-sm">
                    {item.tag}
                  </div>
                </div>
                <div className="p-4 flex-grow-1 d-flex flex-column">
                  <div className="small text-sub fw-bold mb-2">{item.date}</div>
                  <h4 className="fw-bold mb-3" style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>{item.title}</h4>
                  <p className="text-sub small mb-4 line-clamp-2">{item.desc}</p>
                  {item.author && <div className="extra-small text-primary-pink mb-3 fw-bold">โดย: {item.author}</div>}
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <Link to={`/news/${item.id}`} className="text-decoration-none text-primary-pink fw-bold small d-flex align-items-center gap-2">
                      อ่านต่อ <ChevronRight size={14} />
                    </Link>
                    {user && (
                      <Link to="/admin" state={{ editItem: item, tab: 'news' }} className="btn btn-sm btn-outline-warning rounded-pill px-3">
                        <Edit size={12} className="me-1" /> แก้ไข
                      </Link>
                    )}
                  </div>
                </div>
              </Motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

const CTA = ({ onBookClick }) => {
  return (
    <section className="section-modern bg-soft-pink">
      <Container className="text-center py-5">
        <div className="max-w-[800px] mx-auto">
          <h2 className="display-4 fw-bold mb-4">เริ่มต้นการดูแล <br /><span className="text-gradient">สุขภาพที่ดีตั้งแต่วันนี้</span></h2>
          <p className="lead text-sub mb-5">
            ทีมผู้เชี่ยวชาญของเราพร้อมช่วยเหลือคุณ สัมผัสประสบการณ์การรักษา
            ที่ทันสมัยและใส่ใจในทุกรายละเอียด
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="" onClick={onBookClick} className="btn-modern btn-modern-pink py-3 px-5">
              นัดหมายแพทย์
            </Button>
            <Button variant="" className="btn-modern bg-white shadow-soft border py-3 px-5">
              ติดต่อเรา
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

// --- About Agency Page ---

const AboutAgencyPage = () => {
  return (
    <div className="about-agency-page">
      <div className="breadcrumb-container">
        <Container>
          <div className="breadcrumb-nav">
            <Link to="/">หน้าแรก</Link> / ประวัติความเป็นมา
          </div>
        </Container>
      </div>

      <header className="page-header">
        <Container>
          <h1>ประวัติความเป็นมา</h1>
        </Container>
      </header>

      <Container className="py-5">
        <div className="bg-white rounded-[40px] p-5 shadow-soft border border-light">
          <Row className="g-5 align-items-center">
            <Col lg={7}>
              <h2 className="fw-bold text-primary-pink mb-4">ความเป็นมาของเรา</h2>
              <div className="content-modern text-sub">
                <p>
                  โรงพยาบาลคลองหาด เริ่มก่อตั้งครั้งแรก เมื่อวันที่ 3 มกราคม พ.ศ. 2531 พัฒนายกระดับมาจากโรงพยาบาลสาขาของโรงพยาบาลวังน้ำเย็น ยกระดับเป็นโรงพยาบาลชุมชนขนาด 10 เตียง ในปี 2535 และ 30 เตียงในปี 2541 ปัจจุบันเป็นโรงพยาบาลชุมชน ขนาด 30 เตียง ระดับ F2 บนพื้นที่ประมาณ 60 ไร่ บริหารจัดการตามกรอบ นโยบายและการกำกับของทางราชการ สังกัดสำนักงานปลัดกระทรวง กระทรวงสาธารณสุข
                </p>
                <p>
                  มีความมุ่งมั่นพัฒนายกระดับมาตรฐานและคุณภาพการบริการ ผ่านการประเมิน HA ครั้งแรก วันที่ 23 พฤศจิกายน 2555 ผ่านการ Re-accredit เมื่อวันที่ 20 เมษายน 2558 แบะคุณภาพการบริการอย่างต่อเนื่อง
                </p>
              </div>
            </Col>
            <Col lg={5}>
              <div className="rounded-4 overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15521.92672368206!2d102.28774810649139!3d13.444378548541883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311b450af283b167%3A0x452c0c172df85a68!2z4LmC4Lij4LiH4Lie4Lii4Liy4Lia4Liy4Lil4LiE4Lil4Lit4LiH4Lir4Liy4LiU!5e0!3m2!1sth!2sth!4v1771483278276!5m2!1sth!2sth"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </Col>
          </Row>

          <hr className="my-5 opacity-50" />

          <h3 className="fw-bold text-center mb-5">ทำเนียบผู้บริหาร</h3>
          <div className="table-responsive rounded-4 border overflow-hidden">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 ps-4">ลำดับ</th>
                  <th className="py-3">ชื่อ-นามสกุล</th>
                  <th className="py-3">ปีที่ดำรงตำแหน่ง</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: 'นางสาวละอองจันทร์ ทรัพย์เจริญ', period: '2531 – 2535' },
                  { id: 2, name: 'นพ.ยุทธนา จันวะโร', period: '2535 – พ.ย. 2537' },
                  { id: 3, name: 'นพ.ราเชษฎ เชิงพนม', period: 'พ.ย. 2537 – ม.ค. 2557' },
                  { id: 4, name: 'นพ.สุขุม พิริยะพรพิพัฒน์', period: '2557 – 2559' },
                  { id: 5, name: 'นพ.จตุนิษฐ์ อัคคะปัญญาพงศ์', period: '2563 – 2567' },
                  { id: 6, name: 'นพ.วัฒนินทร์ บรรณสาร', period: '2568 - ปัจจุบัน' }
                ].map((exec) => (
                  <tr key={exec.id}>
                    <td className="ps-4">{exec.id}</td>
                    <td className="fw-bold">{exec.name}</td>
                    <td className="text-sub">{exec.period}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
};

const VisionMissionPage = () => (
  <div className="pub-page">
    <PageHeader breadcrumb="วิสัยทัศน์ และพันธกิจ" title="วิสัยทัศน์ และพันธกิจ" subtitle="เป้าหมายและแนวทางการดำเนินงานของโรงพยาบาลคลองหาด" />
    <Container className="py-5">
      <div className="bg-white rounded-[40px] p-5 shadow-soft border border-light mb-5">
        <h3 className="fw-bold text-primary-pink mb-4">วิสัยทัศน์ (Vision)</h3>
        <p className="lead mb-0 text-dark fw-bold">"โรงพยาบาลชุมชนชายแดนที่ได้มาตรฐาน ผู้รับบริการประทับใจ เป็นเลิศด้านสิ่งแวดล้อม ภายในปี 2569"</p>
      </div>
      <Row className="g-4">
        <Col md={6}>
          <div className="bg-white rounded-[40px] p-5 shadow-soft border border-light h-100">
            <h3 className="fw-bold text-primary-pink mb-4">พันธกิจ (Mission)</h3>
            <ul className="list-unstyled d-flex flex-column gap-3 text-sub">
              <li className="d-flex gap-3"><CheckCircle2 className="text-primary-pink flex-shrink-0" size={20} /> พัฒนาระบบบริการสุขภาพให้ได้มาตรฐานสากล</li>
              <li className="d-flex gap-3"><CheckCircle2 className="text-primary-pink flex-shrink-0" size={20} /> จัดระบบสิ่งแวดล้อมทางกายภาพให้น่าอยู่ น่ารับบริการ และเป็นมิตรต่อสิ่งแวดล้อม</li>
              <li className="d-flex gap-3"><CheckCircle2 className="text-primary-pink flex-shrink-0" size={20} /> พัฒนาสมรรถนะบุคลากร และเสริมสร้างความสุขในการทำงาน</li>
              <li className="d-flex gap-3"><CheckCircle2 className="text-primary-pink flex-shrink-0" size={20} /> สร้างความเข้มแข็งของภาคีเครือข่ายสุขภาพ</li>
            </ul>
          </div>
        </Col>
        <Col md={6}>
          <div className="bg-white rounded-[40px] p-5 shadow-soft border border-light h-100">
            <h3 className="fw-bold text-primary-pink mb-4">ค่านิยมองค์กร (Core Values)</h3>
            <div className="h2 fw-bold text-primary-pink mb-4">"H E A R T"</div>
            <div className="d-flex flex-column gap-3">
              {[
                { l: 'H', t: 'High Standard', d: 'มาตรฐานสูง มุ่งมั่นพัฒนาคุณภาพอย่างต่อเนื่อง' },
                { l: 'E', t: 'Environment', d: 'เป็นมิตรต่อสิ่งแวดล้อม สะอาด ปลอดภัย' },
                { l: 'A', t: 'Accountability', d: 'ความรับผิดชอบ โปร่งใส และซื่อสัตย์' },
                { l: 'R', t: 'Relationship', d: 'เคารพและสร้างสัมพันธ์อันดีกับชุมชน' },
                { l: 'T', t: 'Teamwork', d: 'การทำงานเป็นทีม ร่วมมือกันเพื่อเป้าหมายเดียว' }
              ].map((v, i) => (
                <div key={i} className="d-flex gap-3 align-items-start">
                  <div className="bg-primary-pink text-white fw-bold rounded-pill px-3 py-1">{v.l}</div>
                  <div>
                    <div className="fw-bold">{v.t}</div>
                    <div className="small text-sub">{v.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </div>
);

const OrgStructurePage = () => (
  <div className="pub-page">
    <PageHeader breadcrumb="โครงสร้างหน่วยงาน" title="โครงสร้างหน่วยงาน" subtitle="แผนผังการบริหารงานและโครงสร้างบุคลากรโรงพยาบาลคลองหาด" />
    <Container className="py-5 text-center">
      <div className="bg-white rounded-[40px] p-5 shadow-soft border border-light">
        <div className="p-5 bg-light rounded-4 border-dashed border mb-5">
          <Users size={64} className="text-primary-pink mb-4 opacity-20" />
          <h4 className="fw-bold mb-3">กำลังอัปเดตแผนผังโครงสร้างหน่วยงาน</h4>
          <p className="text-sub">ท่านสามารถติดตามโครงสร้างการบริหารงานทั้งหมดได้ในเร็วๆ นี้</p>
        </div>
        <div className="text-start max-w-[800px] mx-auto">
          <h4 className="fw-bold mb-4">ส่วนงานหลักภายในองค์กร</h4>
          <Row className="g-4">
            {[
              'ผู้อำนวยการโรงพยาบาล',
              'ฝ่ายการพยาบาล',
              'ฝ่ายการแพทย์',
              'กลุ่มงานเทคนิคการแพทย์',
              'กลุ่มงานเภสัชกรรม',
              'กลุ่มงานบริหารทั่วไป',
              'กลุ่มงานทันตกรรม'
            ].map((item, i) => (
              <Col md={6} key={i}>
                <div className="p-3 bg-white border rounded-4 d-flex align-items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-3 text-slate-500"><ChevronRight size={18} /></div>
                  <span className="fw-bold">{item}</span>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </Container>
  </div>
);

const MissionDutyPage = () => (
  <div className="pub-page">
    <PageHeader breadcrumb="ภารกิจและหน้าที่" title="ภารกิจและหน้าที่" subtitle="ขอบเขตความรับผิดชอบและหน้าที่หลักของโรงพยาบาลคลองหาด" />
    <Container className="py-5">
      <div className="row g-4">
        {[
          { title: 'บริการรักษาพยาบาล', desc: 'ให้การรักษาโรคทั่วไปและโรคเฉพาะทางตามมาตรฐานวิชาชีพ ครอบคลุมผู้ป่วยนอกและผู้ป่วยใน' },
          { title: 'การส่งเสริมสุขภาพ', desc: 'จัดโครงการรณรงค์และให้ความรู้ด้านสุขภาวะแก่ประชาชนในเขตพื้นที่รับผิดชอบและใกล้เคียง' },
          { title: 'งานป้องกันและควบคุมโรค', desc: 'เฝ้าระวังและสะกัดกั้นการแพร่ระบาดของโรคติดต่อในชุมชน รวมถึงงานฉีดวัคซีนป้องกันโรค' },
          { title: 'การฟื้นฟูสมรรถภาพ', desc: 'ให้บริการกายภาพบำบัดและฟื้นฟูผู้ป่วยหลังการรักษาให้กลับมาดำรงชีวิตประจำวันได้ตามปกติ' },
          { title: 'งานบริการสุขภาพชายแดน', desc: 'ดูแลและจัดการปัญหาสุขภาพในพื้นที่ชายแดน รวมถึงความมั่นคงทางสุขภาพ' },
          { title: 'งานคุ้มครองผู้บริโภค', desc: 'ตรวจสอบและกำกับดูแลมาตรฐานสินค้าและบริการด้านสุขภาพในพื้นที่ให้ปลอดภัย' }
        ].map((item, index) => (
          <div className="col-md-6" key={index}>
            <div className="bg-white rounded-[40px] p-4 p-lg-5 shadow-soft border border-light h-100 d-flex gap-4 align-items-start">
              <div className="p-3 bg-primary-pink bg-opacity-10 rounded-4 text-primary-pink">
                <Activity size={28} />
              </div>
              <div>
                <h4 className="fw-bold mb-2">{item.title}</h4>
                <p className="text-sub mb-0">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </div>
);

// --- LoginPage ---

const LoginPage = ({ setAuthUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('hospital_user', JSON.stringify(data.user));
          setAuthUser(data.user);
          navigate('/admin');
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError('เกิดข้อผิดพลาดในการเชื่อมต่อ'));
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="fw-bold mb-4">เข้าสู่ระบบเจ้าหน้าที่</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3 text-start">
            <Form.Label className="form-label-modern">ชื่อผู้ใช้งาน</Form.Label>
            <Form.Control
              type="text"
              className="input-modern"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4 text-start">
            <Form.Label className="form-label-modern">รหัสผ่าน</Form.Label>
            <Form.Control
              type="password"
              className="input-modern"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="btn-modern btn-modern-pink w-100 py-3">
            เข้าสู่ระบบ
          </Button>
          <div className="mt-4 d-flex justify-content-between align-items-center">
            <Link to="/" className="text-sub small fw-bold">กลับสู่หน้าหลัก</Link>
            <Link to="/register" className="text-primary-pink small fw-bold">สมัครสมาชิกใหม่</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage(data.message);
          setTimeout(() => navigate('/login'), 5000);
        } else {
          setError(data.message);
        }
      })
      .catch(() => setError('เกิดข้อผิดพลาด'));
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="fw-bold mb-4">ลงทะเบียนเจ้าหน้าที่</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {!message && (
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3 text-start">
              <Form.Label className="form-label-modern">ชื่อผู้ใช้งาน</Form.Label>
              <Form.Control type="text" className="input-modern" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3 text-start">
              <Form.Label className="form-label-modern">อีเมล</Form.Label>
              <Form.Control type="email" className="input-modern" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-4 text-start">
              <Form.Label className="form-label-modern">รหัสผ่าน</Form.Label>
              <Form.Control type="password" className="input-modern" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </Form.Group>
            <Button type="submit" className="btn-modern btn-modern-pink w-100 py-3">ลงทะเบียน</Button>
            <div className="mt-4">
              <Link to="/login" className="text-sub small fw-bold">มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</Link>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

// --- Admin Dashboard ---

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('news');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', desc: '', tag: '', image: '', date: '', pdfUrl: '', deadline: '', year: '2567', category: 'ข้อมูลพื้นฐานของหน่วยงาน', status: 'open' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const isAdmin = user.role === 'admin';
  const canEdit = user.permissions.includes('edit') || isAdmin;
  const canDelete = user.permissions.includes('delete') || isAdmin;
  const canAdd = user.permissions.includes('add') || isAdmin;

  const location = useLocation();

  const fetchContent = () => {
    if (activeTab === 'users' && isAdmin) {
      fetch(`${API_BASE}/users`).then(res => res.json()).then(setUsers);
      return;
    }
    const endpointMap = {
      'median': 'median-prices',
      'academic': 'academic-docs',
      'ita': 'ita',
      'bidding': 'bidding'
    };
    let endpoint = endpointMap[activeTab] || activeTab;
    fetch(`${API_BASE}/${endpoint}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
        else setPosts([]);
      })
      .catch(() => {
        console.error('Error fetching');
        setPosts([]);
      });
  };

  useEffect(() => {
    if (location.state?.editItem && location.state?.tab) {
      setActiveTab(location.state.tab);
      setEditingId(location.state.editItem.id);
      setFormData({ ...location.state.editItem });
    }
  }, [location.state]);

  useEffect(() => {
    fetchContent();
    if (!editingId) {
      setFormData({ title: '', desc: '', tag: '', image: '', date: new Date().toLocaleDateString('th-TH'), pdfUrl: '', deadline: '' });
      setSelectedFile(null);
    }
  }, [activeTab]);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
  };

  const handleDelete = (id) => {
    if (!window.confirm('ยืนยันการลบข้อมูลนี้?')) return;
    const endpointMap = {
      'median': 'median-prices',
      'academic': 'academic-docs',
      'ita': 'ita',
      'bidding': 'bidding'
    };
    let endpoint = endpointMap[activeTab] || activeTab;
    fetch(`${API_BASE}/${endpoint}/${id}`, { method: 'DELETE' })
      .then(() => fetchContent());
  };

  const updateUserStatus = (userId, status) => {
    let perms = status === 'active' ? ['add', 'edit', 'read'] : ['read'];
    fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, permissions: perms })
    }).then(() => fetchContent());
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) return null;
    const data = new FormData();
    data.append('file', selectedFile);

    try {
      const res = await fetch(`${API_BASE.replace('/api', '')}/api/upload`, {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      return result.url;
    } catch (err) {
      console.error('Upload failed', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const resultUrl = await uploadFile();
    let finalData = {
      ...formData,
      author: user.username,
      updatedAt: new Date().toLocaleString('th-TH', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    };

    const hasPdf = ['median', 'jobs', 'bidding', 'academic', 'ita'].includes(activeTab);

    if (resultUrl) {
      if (hasPdf) {
        // If it looks like a PDF, put in pdfUrl, else image.
        if (resultUrl.toLowerCase().endsWith('.pdf')) finalData.pdfUrl = resultUrl;
        else finalData.image = resultUrl;
      } else {
        finalData.image = resultUrl;
      }
    }

    // Auto-generate image if not present
    if (!finalData.image) {
      const keywordMap = {
        'news': 'hospital,news',
        'median': 'document,finance',
        'jobs': 'career,office',
        'activities': 'volunteer,health',
        'bidding': 'construction,paper',
        'academic': 'university,research',
        'ita': 'integrity,government'
      };
      const keyword = keywordMap[activeTab] || 'medical';
      finalData.image = `https://images.unsplash.com/photo-1576091160550-217359f42f8c?auto=format&fit=crop&q=80&w=800&sig=${Date.now()}`;
      if (activeTab === 'median') finalData.image = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800';
      if (activeTab === 'jobs') finalData.image = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800';
      if (activeTab === 'activities') finalData.image = 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800';
    }

    let uploadEndpoint = activeTab;
    if (activeTab === 'median') uploadEndpoint = 'median-prices';
    if (activeTab === 'academic') uploadEndpoint = 'academic-docs';

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `${API_BASE}/${uploadEndpoint}/${editingId}`
      : `${API_BASE}/${uploadEndpoint}`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData)
    })
      .then(res => res.json())
      .then(() => {
        setMessage('บันทึกข้อมูลสำเร็จ');
        fetchContent();
        setFormData({ title: '', desc: '', tag: '', image: '', date: new Date().toLocaleDateString('th-TH'), pdfUrl: '', deadline: '', year: '2567', category: 'ข้อมูลพื้นฐานของหน่วยงาน', status: 'open' });
        setSelectedFile(null);
        setEditingId(null);
        setIsUploading(false);
        setTimeout(() => setMessage(null), 3000);
      })
      .catch(() => setIsUploading(false));
  };

  return (
    <div className="admin-page min-vh-100">
      <div className="admin-header">
        <Container>
          <div className="d-flex align-items-center gap-3">
            <LayoutDashboard size={28} />
            <h2 className="mb-0 fw-bold">ระบบบริหารจัดการข้อมูล</h2>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <div className="admin-nav-tabs">
          <div className={`admin-tab ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>
            <ImageIcon size={18} /> ข่าวประชาสัมพันธ์
          </div>
          <div className={`admin-tab ${activeTab === 'median' ? 'active' : ''}`} onClick={() => setActiveTab('median')}>
            <FileText size={18} /> ราคากลาง
          </div>
          <div className={`admin-tab ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
            <Briefcase size={18} /> สมัครงาน
          </div>
          <div className={`admin-tab ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>
            <Activity size={18} /> กิจกรรม
          </div>
          <div className={`admin-tab ${activeTab === 'bidding' ? 'active' : ''}`} onClick={() => setActiveTab('bidding')}>
            <FileText size={18} /> ประกวดราคา
          </div>
          <div className={`admin-tab ${activeTab === 'academic' ? 'active' : ''}`} onClick={() => setActiveTab('academic')}>
            <FileText size={18} /> เอกสารวิชาการ
          </div>
          <div className={`admin-tab ${activeTab === 'ita' ? 'active' : ''}`} onClick={() => setActiveTab('ita')}>
            <Activity size={18} /> ITA
          </div>
          <div className={`admin-tab ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            <Calendar size={18} /> นัดหมาย
          </div>
          {isAdmin && (
            <div className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
              <Users size={18} /> จัดการเจ้าหน้าที่
            </div>
          )}
        </div>

        {message && <Alert variant="success">{message}</Alert>}

        {activeTab === 'users' ? (
          <Row>
            <Col lg={12}>
              <div className="admin-content-card">
                <h4 className="fw-bold mb-4">รายชื่อเจ้าหน้าที่</h4>
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr>
                      <th>ชื่อผู้ใช้</th>
                      <th>อีเมล</th>
                      <th>บทบาท</th>
                      <th>สถานะ</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>
                          <span className={`badge ${u.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                            {u.status === 'active' ? 'เบิกใช้งาน' : 'รอยืนยัน'}
                          </span>
                        </td>
                        <td>
                          {u.status === 'pending' && (
                            <Button size="sm" variant="success" className="me-2" onClick={() => updateUserStatus(u.id, 'active')}>อนุมัติ</Button>
                          )}
                          {u.id !== user.id && (u.status === 'active' ?
                            <Button size="sm" variant="warning" onClick={() => updateUserStatus(u.id, 'pending')}>ระงับ</Button> : null
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        ) : activeTab === 'appointments' ? (
          <Row>
            <Col lg={12}>
              <div className="admin-content-card">
                <h4 className="fw-bold mb-4">รายการนัดหมายแพทย์ล่วงหน้า</h4>
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr>
                      <th>ชื่อ-นามสกุล</th>
                      <th>เบอร์โทรศัพท์</th>
                      <th>วันที่นัดหมาย</th>
                      <th>แผนก</th>
                      <th>หมายเหตุ</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(a => (
                      <tr key={a.id}>
                        <td className="fw-bold">{a.name}</td>
                        <td>{a.phone}</td>
                        <td>{a.date}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {a.department === 'general' ? 'ตรวจสุขภาพทั่วไป' :
                              a.department === 'heart' ? 'ศูนย์โรคหัวใจ' :
                                a.department === 'kidney' ? 'ศูนย์ฟอกไต' :
                                  a.department === 'pediatrics' ? 'แผนกกุมารเวช' : a.department}
                          </span>
                        </td>
                        <td className="small text-sub">{a.message || '-'}</td>
                        <td>
                          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(a.id)}>ลบ</Button>
                        </td>
                      </tr>
                    ))}
                    {posts.length === 0 && <tr><td colSpan="5" className="text-center py-4">ไม่มีรายการนัดหมาย</td></tr>}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col lg={4}>
              <div className="admin-content-card">
                <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <Plus size={20} className="text-primary-pink" />
                  {editingId ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'}
                </h4>
                {!canAdd && !editingId && <Alert variant="warning">ท่านไม่มีสิทธิ์เพิ่มข้อมูล</Alert>}
                {editingId && !canEdit && <Alert variant="warning">ท่านไม่มีสิทธิ์แก้ไขข้อมูล</Alert>}

                {(editingId ? canEdit : canAdd) && (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-modern">หัวข้อ</Form.Label>
                      <Form.Control
                        type="text" className="input-modern"
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </Form.Group>

                    {activeTab === 'news' && (
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-modern">หมวดหมู่ (Tag)</Form.Label>
                        <Form.Control
                          type="text" className="input-modern" placeholder="เช่น ข่าวเด่น"
                          value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })}
                        />
                      </Form.Group>
                    )}

                    {activeTab === 'academic' && (
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-modern">หมวดหมู่วิชาการ</Form.Label>
                        <Form.Select
                          className="input-modern"
                          value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })}
                        >
                          <option value="">เลือกหมวดหมู่</option>
                          <option value="งานวิจัย">งานวิจัย</option>
                          <option value="นวัตกรรม">นวัตกรรม</option>
                          <option value="CQI">CQI</option>
                        </Form.Select>
                      </Form.Group>
                    )}

                    {activeTab === 'ita' && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label-modern">ปีงบประมาณ (พ.ศ.)</Form.Label>
                          <Form.Select className="input-modern" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}>
                            <option value="2567">2567</option>
                            <option value="2568">2568</option>
                            <option value="2569">2569</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="form-label-modern">หมวดหมู่ ITA</Form.Label>
                          <Form.Select className="input-modern" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            <option value="ข้อมูลพื้นฐานของหน่วยงาน">ข้อมูลพื้นฐานของหน่วยงาน</option>
                            <option value="การประชาสัมพันธ์">การประชาสัมพันธ์</option>
                            <option value="การปฏิบัติหน้าที่">การปฏิบัติหน้าที่</option>
                            <option value="มาตรการส่งเสริมคุณธรรม">มาตรการส่งเสริมคุณธรรม</option>
                            <option value="การบริหารงานเงิน">การบริหารงานเงิน</option>
                          </Form.Select>
                        </Form.Group>
                      </>
                    )}

                    {/* All tabs now support images and descriptions */}
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-modern">แนบรูปภาพ/ไฟล์ (JPG/PDF)</Form.Label>
                      <Form.Control
                        type="file" className="input-modern"
                        onChange={handleFileChange}
                      />
                      <div className="small text-sub-pink mt-1">* รองรับทั้งรูปภาพหน้าปก และไฟล์ PDF สำหรับประกาศ</div>
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label className="form-label-modern">รายละเอียด / เนื้อหา</Form.Label>
                      <Form.Control
                        as="textarea" rows={4} className="input-modern"
                        placeholder="กรอกรายละเอียดเนื้อหาที่นี่..."
                        value={formData.desc || ''} onChange={e => setFormData({ ...formData, desc: e.target.value })}
                      />
                    </Form.Group>

                    {(activeTab === 'jobs' || activeTab === 'bidding') && (
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-modern">หมดเขตวันที่ (ถ้ามี)</Form.Label>
                        <Form.Control
                          type="text" className="input-modern" placeholder="เช่น 31 มี.ค. 2567"
                          value={formData.deadline || ''} onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                        />
                      </Form.Group>
                    )}

                    {activeTab === 'jobs' && (
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-modern">สถานะการเปิดรับ</Form.Label>
                        <Form.Select
                          className="input-modern"
                          value={formData.status || 'open'} onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="open">เปิดรับสมัคร (สีเขียว)</option>
                          <option value="closed">ปิดรับสมัคร (สีเทา)</option>
                        </Form.Select>
                      </Form.Group>
                    )}

                    <Button type="submit" className="btn-modern btn-modern-pink w-100 py-3 mt-3" disabled={isUploading}>
                      {isUploading ? 'กำลังอัปโหลด...' : (editingId ? 'ปรับปรุงข้อมูล' : 'บันทึกข้อมูล')}
                    </Button>
                    {editingId && (
                      <Button variant="light" className="w-100 py-3 mt-2 rounded-pill" onClick={() => { setEditingId(null); setFormData({ title: '', desc: '', tag: '', image: '', date: '', pdfUrl: '', deadline: '' }); }}>
                        ยกเลิกการแก้ไข
                      </Button>
                    )}
                  </Form>
                )}
              </div>
            </Col>
            <Col lg={8}>
              <div className="admin-content-card">
                <h4 className="fw-bold mb-4">รายการข้อมูลทั้งหมด</h4>
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>วันที่</th>
                        <th>หัวข้อ</th>
                        {(activeTab === 'news' || activeTab === 'academic') && <th>หมวดหมู่</th>}
                        {activeTab === 'ita' && <th>ปี/หมวด</th>}
                        {(activeTab === 'jobs' || activeTab === 'bidding') && <th>หมดเขต</th>}
                        <th>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map(p => (
                        <tr key={p.id}>
                          <td className="small text-sub">{p.date || '...'}</td>
                          <td className="fw-bold">{p.title}</td>
                          {(activeTab === 'news' || activeTab === 'academic') && <td><span className="badge-pink small">{p.tag}</span></td>}
                          {activeTab === 'ita' && <td className="small">{p.year} / {p.category}</td>}
                          {(activeTab === 'jobs' || activeTab === 'bidding') && <td>{p.deadline}</td>}
                          <td>
                            {canEdit && <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(p)}>แก้ไข</Button>}
                            {canDelete && <Button size="sm" variant="outline-danger" onClick={() => handleDelete(p.id)}>ลบ</Button>}
                          </td>
                        </tr>
                      ))}
                      {posts.length === 0 && <tr><td colSpan="5" className="text-center py-4">ไม่มีข้อมูล</td></tr>}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

// ─── PUBLIC PAGES ─────────────────────────────────────────────────────────────

const PageHeader = ({ breadcrumb, title, subtitle }) => (
  <div className="page-pub-header">
    <Container>
      <div className="breadcrumb-nav mb-3">
        <Link to="/">หน้าแรก</Link> / {breadcrumb}
      </div>
      <h1 className="fw-bold mb-2">{title}</h1>
      {subtitle && <p className="text-sub mb-0">{subtitle}</p>}
    </Container>
  </div>
);

// Helper to format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generic Detail Page
const PubDetailPage = ({ category = 'news', user }) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const navigate = useNavigate();

  const endpointMap = {
    'news': 'news',
    'median': 'median-prices',
    'jobs': 'jobs',
    'activities': 'activities',
    'bidding': 'bidding',
    'academic': 'academic-docs',
    'ita': 'ita'
  };

  const breadcrumbMap = {
    'news': 'ข่าวประชาสัมพันธ์',
    'median': 'ราคากลาง',
    'jobs': 'สมัครงาน',
    'activities': 'กิจกรรม',
    'bidding': 'ประกวดราคา',
    'academic': 'เอกสารวิชาการ',
    'ita': 'ITA'
  };

  useEffect(() => {
    fetch(`${API_BASE}/${endpointMap[category]}`)
      .then(r => r.json())
      .then(data => {
        const found = data.find(n => String(n.id) === String(id));
        setItem(found || null);
      });
  }, [id, category]);

  useEffect(() => {
    if (item?.pdfUrl) {
      const url = item.pdfUrl.startsWith('http') ? item.pdfUrl : `${API_BASE.replace('/api', '')}${item.pdfUrl}`;
      fetch(url, { method: 'HEAD' })
        .then(res => {
          const size = res.headers.get('content-length');
          if (size) setFileSize(parseInt(size));
        })
        .catch(() => { });
    }
  }, [item]);

  if (!item) return <div className="text-center py-5 mt-5"><p>กำลังโหลด...</p></div>;

  const displayImage = item.image || (category === 'news' ? null : '/placeholder.jpg');

  return (
    <div className="pub-page">
      <PageHeader breadcrumb={breadcrumbMap[category]} title={item.title} />
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="" className="btn-modern bg-white shadow-soft border d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> ย้อนกลับ
          </Button>
          {(user) && (
            <Button
              as={Link}
              to="/admin"
              state={{ editItem: item, tab: category === 'median' ? 'median' : (category === 'academic' ? 'academic' : category) }}
              className="btn btn-warning rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <Edit size={16} /> แก้ไขเนื้อหา
            </Button>
          )}
        </div>
        <Row>
          <Col lg={8}>
            {item.image && (
              <div className="rounded-4 overflow-hidden mb-4 shadow-soft bg-light">
                <img
                  src={item.image.startsWith('http') ? item.image : `${API_BASE.replace('/api', '')}${item.image}`}
                  alt={item.title} className="w-100" style={{ maxHeight: '500px', objectFit: 'contain' }}
                />
              </div>
            )}
            <div className="d-flex gap-3 align-items-center mb-4">
              {item.tag && <span className="badge-pink">{item.tag}</span>}
              <span className="small text-sub d-flex align-items-center gap-1"><CalendarDays size={14} /> {item.date || item.deadline}</span>
            </div>
            <h2 className="fw-bold mb-4">{item.title}</h2>
            <div className="content-modern text-sub" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
              {item.desc || 'ไม่มีรายละเอียดเพิ่มเติม'}
            </div>

            {item.author && (
              <div className="mt-5 p-4 bg-light rounded-4 border-start border-4 border-primary-pink">
                <div className="small text-sub">เผยแพร่โดย</div>
                <div className="fw-bold text-dark d-flex align-items-center gap-2">
                  <Users size={16} className="text-primary-pink" /> {item.author}
                </div>
                {item.updatedAt && (
                  <div className="extra-small text-sub mt-1">
                    แก้ไขล่าสุดเมื่อ: {item.updatedAt}
                  </div>
                )}
              </div>
            )}
          </Col>
          <Col lg={4}>
            <div className="admin-content-card sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-4">เอกสารแนบ</h5>
              {item.pdfUrl ? (
                <div className="d-flex flex-column gap-3">
                  <div className="p-3 rounded-4 bg-light border border-dashed d-flex align-items-center gap-3">
                    <div className="bg-danger bg-opacity-10 p-2 rounded-3 text-danger">
                      <FileText size={20} />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="small fw-bold text-truncate">{item.pdfUrl.split('/').pop()}</div>
                      <div className="extra-small text-sub">{fileSize ? formatFileSize(fileSize) : 'เอกสาร PDF'}</div>
                    </div>
                  </div>
                  <a
                    href={item.pdfUrl.startsWith('http') ? item.pdfUrl : `${API_BASE.replace('/api', '')}${item.pdfUrl}`}
                    target="_blank" rel="noreferrer"
                    className="btn btn-modern btn-modern-pink w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    <Download size={18} /> ดาวน์โหลดตอนนี้
                  </a>
                </div>
              ) : (
                <p className="text-sub small py-3">ไม่มีเอกสารดาวน์โหลดสำหรับรายการนี้</p>
              )}

              <hr className="my-4 opacity-50" />
              <h5 className="fw-bold mb-3">สรุปข้อมูล</h5>
              <ul className="list-unstyled small text-sub d-flex flex-column gap-2 mb-0">
                <li className="d-flex justify-content-between"><span>วันที่ลงประกาศ:</span> <span className="fw-bold">{item.date || '-'}</span></li>
                {item.deadline && <li className="d-flex justify-content-between"><span>หมดเขต:</span> <span className="fw-bold text-danger">{item.deadline}</span></li>}
                {item.tag && <li className="d-flex justify-content-between"><span>หมวดหมู่:</span> <span className="fw-bold">{item.tag}</span></li>}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Median Prices Public Page
const MedianPricesPage = ({ user }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/median-prices`).then(r => r.json()).then(setItems);
  }, []);
  return (
    <div className="pub-page">
      <PageHeader breadcrumb="ราคากลาง" title="ประกาศราคากลาง" subtitle="ประกาศจัดซื้อจัดจ้างและราคากลางของโรงพยาบาลคลองหาด" />
      <Container className="py-5">
        <Row className="g-4">
          {items.length === 0 && <Col><p className="text-center text-sub py-5">ไม่มีข้อมูล</p></Col>}
          {items.map(item => (
            <Col lg={6} key={item.id}>
              <div className="pub-card flex-column align-items-start gap-3 p-0 overflow-hidden">
                {item.image && (
                  <div className="w-100" style={{ height: '180px', overflow: 'hidden' }}>
                    <img
                      src={item.image.startsWith('http') ? item.image : `${API_BASE.replace('/api', '')}${item.image}`}
                      alt={item.title} className="w-100 h-100" style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="p-4 w-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="pub-card-icon" style={{ width: '50px', height: '50px' }}>
                      <FileText size={24} className="text-primary-pink" />
                    </div>
                    <div>
                      <div className="small text-sub mb-0">{item.date}</div>
                      <h5 className="fw-bold mb-0">{item.title}</h5>
                    </div>
                  </div>
                  {item.desc && <p className="small text-sub mb-3 line-clamp-2">{item.desc}</p>}
                  {item.author && <div className="extra-small text-primary-pink mb-3 fw-bold">โดย: {item.author}</div>}
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                      <Button as={Link} to={`/median-prices/${item.id}`} variant="" className="btn-sm btn-modern btn-modern-pink px-3 d-flex align-items-center gap-2 rounded-pill">
                        รายละเอียด <ChevronRight size={12} />
                      </Button>
                      {item.pdfUrl && (
                        <a href={item.pdfUrl.startsWith('http') ? item.pdfUrl : `${API_BASE.replace('/api', '')}${item.pdfUrl}`}
                          target="_blank" rel="noreferrer"
                          className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center gap-2 w-auto">
                          <Download size={14} /> ดาวน์โหลด PDF
                        </a>
                      )}
                    </div>
                    {user && (
                      <Link to="/admin" state={{ editItem: item, tab: 'median' }} className="btn btn-sm btn-outline-warning rounded-pill px-3">
                        <Edit size={12} className="me-1" /> แก้ไข
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

// Jobs Public Page
const JobsPage = ({ user }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/jobs`).then(r => r.json()).then(setItems);
  }, []);
  return (
    <div className="pub-page">
      <PageHeader breadcrumb="สมัครงาน" title="รับสมัครงาน" subtitle="ตำแหน่งว่างที่เปิดรับสมัครของโรงพยาบาลคลองหาด" />
      <Container className="py-5">
        <Row className="g-4">
          {items.length === 0 && <Col><p className="text-center text-sub py-5">ไม่มีประกาศรับสมัครในขณะนี้</p></Col>}
          {items.map(item => (
            <Col lg={12} key={item.id}>
              <div className="pub-card flex-md-row flex-column align-items-md-center justify-content-between gap-4 p-0 overflow-hidden">
                <div className="d-flex flex-md-row flex-column align-items-md-center gap-4 flex-grow-1">
                  {item.image && (
                    <div className="flex-shrink-0" style={{ width: '150px', height: '150px' }}>
                      <img
                        src={item.image.startsWith('http') ? item.image : `${API_BASE.replace('/api', '')}${item.image}`}
                        alt={item.title} className="w-100 h-100" style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h5 className="fw-bold mb-1">{item.title}</h5>
                    <div className="small text-sub d-flex align-items-center gap-2 mb-2">
                      <CalendarDays size={13} /> หมดเขต: {item.deadline || 'ภายในประกาศ'}
                    </div>
                    {item.desc && <p className="small text-sub mb-2 line-clamp-1">{item.desc}</p>}
                    {item.author && <div className="extra-small text-primary-pink fw-bold">โดย: {item.author}</div>}
                  </div>
                </div>
                <div className="d-flex flex-column gap-2 p-4">
                  <div className="d-flex gap-2">
                    <Button as={Link} to={`/jobs/${item.id}`} variant="" className="btn-sm btn-modern btn-modern-pink px-3 d-flex align-items-center gap-1 rounded-pill">
                      รายละเอียด
                    </Button>
                    {item.pdfUrl && (
                      <a href={item.pdfUrl.startsWith('http') ? item.pdfUrl : `${API_BASE.replace('/api', '')}${item.pdfUrl}`}
                        target="_blank" rel="noreferrer"
                        className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center gap-1">
                        <Download size={13} /> PDF
                      </a>
                    )}
                  </div>
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <span className={`badge rounded-pill d-flex align-items-center px-3 ${item.status === 'open' ? 'bg-success' : 'bg-secondary'}`}>
                      {item.status === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                    </span>
                    {user && (
                      <Link to="/admin" state={{ editItem: item, tab: 'jobs' }} className="btn btn-sm btn-outline-warning rounded-pill px-3">
                        <Edit size={12} className="me-1" /> แก้ไข
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

// Activities Public Page
const ActivitiesPage = ({ user }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/activities`).then(r => r.json()).then(setItems);
  }, []);
  return (
    <div className="pub-page">
      <PageHeader breadcrumb="กิจกรรม" title="กิจกรรมโรงพยาบาล" subtitle="ข่าวสารอัปเดตกิจกรรมและโครงการต่างๆ ของเรา" />
      <Container className="py-5">
        <Row className="g-4">
          {items.length === 0 && <Col><p className="text-center text-sub py-5">ไม่มีข้อมูล</p></Col>}
          {items.map(item => (
            <Col lg={4} md={6} key={item.id}>
              <Motion.div whileHover={{ y: -8 }} className="pub-card p-0 overflow-hidden">
                {item.image && (
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={item.image.startsWith('http') ? item.image : `${API_BASE.replace('/api', '')}${item.image}`}
                      alt={item.title} className="w-100 h-100" style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className="p-4 flex-grow-1 d-flex flex-column">
                  <div className="small text-sub mb-2 d-flex align-items-center gap-1"><CalendarDays size={13} /> {item.date}</div>
                  <h5 className="fw-bold mb-1">{item.title}</h5>
                  <p className="small text-sub mb-3 flex-grow-1 line-clamp-2">{item.desc}</p>
                  {item.author && <div className="extra-small text-primary-pink mb-3 fw-bold">โดย: {item.author}</div>}
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <Link to={`/activities/${item.id}`} className="text-decoration-none text-primary-pink fw-bold small d-flex align-items-center gap-1">
                      อ่านต่อ <ChevronRight size={14} />
                    </Link>
                    {user && (
                      <Link to="/admin" state={{ editItem: item, tab: 'activities' }} className="btn btn-sm btn-outline-warning rounded-pill px-3">
                        <Edit size={12} className="me-1" /> แก้ไข
                      </Link>
                    )}
                  </div>
                </div>
              </Motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};
// ITA Year Page (generalized)
const ITAPage = ({ user }) => {
  const { year } = useParams();
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/ita?year=${year}`)
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data.filter(d => String(d.year) === String(year)) : []))
      .catch(() => setItems([]));
  }, [year]);

  const ITA_CATEGORIES = [
    '\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e1e\u0e37\u0e49\u0e19\u0e10\u0e32\u0e19\u0e02\u0e2d\u0e07\u0e2b\u0e19\u0e48\u0e27\u0e22\u0e07\u0e32\u0e19',
    '\u0e01\u0e32\u0e23\u0e1b\u0e23\u0e30\u0e0a\u0e32\u0e2a\u0e31\u0e21\u0e1e\u0e31\u0e19\u0e18\u0e4c',
    '\u0e01\u0e32\u0e23\u0e1b\u0e0f\u0e34\u0e1a\u0e31\u0e15\u0e34\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48',
    '\u0e21\u0e32\u0e15\u0e23\u0e01\u0e32\u0e23\u0e2a\u0e48\u0e07\u0e40\u0e2a\u0e23\u0e34\u0e21\u0e04\u0e38\u0e13\u0e18\u0e23\u0e23\u0e21',
    '\u0e01\u0e32\u0e23\u0e1a\u0e23\u0e34\u0e2b\u0e32\u0e23\u0e07\u0e32\u0e19\u0e40\u0e07\u0e34\u0e19',
  ];

  return (
    <div className="pub-page">
      <PageHeader
        breadcrumb={`ITA ${year}`}
        title={`\u0e01\u0e32\u0e23\u0e1b\u0e23\u0e30\u0e40\u0e21\u0e34\u0e19\u0e04\u0e38\u0e13\u0e18\u0e23\u0e23\u0e21 (ITA) \u0e1b\u0e35 ${year}`}
        subtitle="\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e40\u0e08\u0e49\u0e32\u0e2b\u0e19\u0e49\u0e32\u0e17\u0e35\u0e48\u0e41\u0e25\u0e30\u0e1c\u0e39\u0e49\u0e21\u0e35\u0e2a\u0e48\u0e27\u0e19\u0e44\u0e14\u0e49\u0e2a\u0e48\u0e27\u0e19\u0e40\u0e2a\u0e35\u0e22"
      />
      <Container className="py-5">
        {ITA_CATEGORIES.map((cat, ci) => {
          const catItems = items.filter(i => i.category === cat);
          return (
            <div key={ci} className="mb-5">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <span className="ita-cat-badge">{ci + 1}</span> {cat}
              </h5>
              <Row className="g-3">
                {catItems.length === 0 && (
                  <Col><p className="text-sub small">\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e40\u0e2d\u0e01\u0e2a\u0e32\u0e23\u0e43\u0e19\u0e2b\u0e21\u0e27\u0e14\u0e2b\u0e21\u0e39\u0e48\u0e19\u0e35\u0e49</p></Col>
                )}
                {catItems.map(item => (
                  <Col lg={6} key={item.id}>
                    <div className="pub-card d-flex align-items-center gap-3 py-3">
                      <div className="pub-card-icon" style={{ width: '48px', height: '48px' }}>
                        <FileText size={22} className="text-primary-pink" />
                      </div>
                      <div className="flex-grow-1">
                        <div className="small fw-bold">{item.title}</div>
                        <div className="small text-sub d-flex align-items-center gap-2">
                          {item.date}
                          {item.author && <span className="text-primary-pink fw-bold">/ {item.author}</span>}
                        </div>
                      </div>
                      {user && (
                        <Link to="/admin" state={{ editItem: item, tab: 'ita' }} className="btn btn-sm btn-outline-warning rounded-pill px-2">
                          <Edit size={12} />
                        </Link>
                      )}
                      <Link to={`/ita/${year}/${item.id}`} className="btn btn-sm btn-light rounded-pill px-2">
                        <ChevronRight size={14} />
                      </Link>
                      {item.pdfUrl && (
                        <a
                          href={item.pdfUrl.startsWith('http') ? item.pdfUrl : `${API_BASE.replace('/api', '')}${item.pdfUrl}`}
                          target="_blank" rel="noreferrer"
                          className="btn btn-sm btn-outline-danger rounded-pill flex-shrink-0 d-flex align-items-center gap-1"
                        >
                          <Download size={13} />
                        </a>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          );
        })}
      </Container>
    </div>
  );
};

// Bidding News Page
const BiddingNewsPage = ({ user }) => {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch(`${API_BASE}/bidding`).then(r => r.json()).then(setItems); }, []);
  return (
    <div className="pub-page">
      <PageHeader breadcrumb="ประกาศประกวดราคา" title="ข่าวประกวดราคา" subtitle="ติดตามข้อมูลการจัดซื้อจัดจ้างและประกาศประกวดราคา" />
      <Container className="py-5">
        <Row className="g-4">
          {items.length === 0 && <Col><p className="text-center text-sub py-5">ยังไม่มีประกาศ</p></Col>}
          {items.map(item => (
            <Col lg={6} key={item.id}>
              <div className="pub-card d-flex align-items-center gap-3">
                <div className="pub-card-icon" style={{ background: '#f8fafc' }}><FileText size={24} className="text-primary-pink" /></div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-1">{item.title}</h6>
                  <div className="small text-sub">
                    {item.date}
                    {item.author && <span className="ms-2 text-primary-pink fw-bold">โดย: {item.author}</span>}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/bidding/${item.id}`} className="btn btn-sm btn-light rounded-pill px-3 py-1">รายละเอียด</Link>
                  {user && (
                    <Link to="/admin" state={{ editItem: item, tab: 'bidding' }} className="btn btn-sm btn-outline-warning rounded-pill px-2">
                      <Edit size={14} />
                    </Link>
                  )}
                  {item.pdfUrl && (
                    <a href={item.pdfUrl.startsWith('http') ? item.pdfUrl : `${API_BASE.replace('/api', '')}${item.pdfUrl}`}
                      target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-danger px-3 rounded-pill d-flex align-items-center gap-1">
                      <Download size={13} /> PDF
                    </a>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

// Academic Documents Page
const AcademicDocsPage = ({ user }) => {
  const { sub } = useParams();
  const [items, setItems] = useState([]);

  const subMap = {
    'research': 'งานวิจัย',
    'innovation': 'นวัตกรรม',
    'cqi': 'CQI'
  };

  const title = sub ? subMap[sub] || 'เอกสารวิชาการ' : 'เอกสารวิชาการทั้งหมด';

  useEffect(() => {
    fetch(`${API_BASE}/academic-docs`).then(r => r.json()).then(d => {
      let filtered = Array.isArray(d) ? d : [];
      if (sub && subMap[sub]) {
        filtered = filtered.filter(i => i.tag === subMap[sub]);
      }
      setItems(filtered);
    }).catch(() => setItems([]));
  }, [sub]);

  return (
    <div className="pub-page">
      <PageHeader
        breadcrumb={title}
        title={title}
        subtitle="คลังความรู้ งานวิจัย นวัตกรรม และความร่วมมือทางการแพทย์"
      />
      <Container className="py-5">
        <Row className="g-4">
          {items.length === 0 && <Col><p className="text-center text-sub py-5">ไม่พบข้อมูลในหมวดหมู่นี้</p></Col>}
          {items.map(item => (
            <Col lg={6} key={item.id}>
              <div className="pub-card d-flex align-items-center gap-4">
                <div className="pub-card-icon">
                  <FileText size={28} className="text-primary-pink" />
                </div>
                <div className="flex-grow-1">
                  <div className="small text-sub mb-1">{item.date}</div>
                  <h5 className="fw-bold mb-1">{item.title}</h5>
                  {item.tag && <span className="extra-small badge bg-light text-primary-pink border mb-2 me-2">{item.tag}</span>}
                  <p className="small text-sub mb-2">{item.desc}</p>
                  {item.author && <div className="extra-small text-primary-pink mb-2 fw-bold">โดย: {item.author}</div>}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex gap-2">
                      <Link to={`/academic-docs/detail/${item.id}`} className="btn btn-sm btn-modern btn-modern-pink px-3 rounded-pill">อ่านต่อ</Link>
                      {item.pdfUrl && (
                        <a
                          href={item.pdfUrl.startsWith('http') ? item.pdfUrl : `${API_BASE.replace('/api', '')}${item.pdfUrl}`}
                          target="_blank" rel="noreferrer"
                          className="btn btn-sm btn-outline-danger rounded-pill d-flex align-items-center gap-2 w-auto"
                        >
                          <Download size={14} /> PDF
                        </a>
                      )}
                    </div>
                    {user && (
                      <Link to="/admin" state={{ editItem: item, tab: 'academic' }} className="btn btn-sm btn-outline-warning rounded-pill px-3">
                        <Edit size={12} className="me-1" /> แก้ไข
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

const Footer = ({ user }) => {
  return (
    <footer className="pt-5 mt-5" id="contact">
      <Container className="py-5">
        <Row className="g-5 border-bottom pb-5 mb-4">
          <Col lg={4}>
            <a href="/home"><img src="images/logo.webp" alt="Logo" className="logo-shadow" style={{ height: '45px', width: 'auto' }} /></a>
            {/* <div className="d-flex align-items-center gap-3 mb-4">
              <div className="bg-primary-pink p-2 rounded-4 text-white">
                <Activity size={24} />
              </div>
              <span className="fw-bold h4 mb-0" style={{ color: 'var(--primary-pink)' }}>KHLONGHAT HOSPITAL</span>
            </div> */}

            <br /><br />

            <p className="text-sub mb-4" style={{ padding: '10px' }}>
              ให้บริการทางการแพทย์ระดับพรีเมียมด้วยหัวใจ
              เพื่อสุขภาพที่ดีที่สุดของคุณคือเป้าหมายสำคัญของเรา
            </p>
            <div className="d-flex gap-3">
              <div className="p-3 bg-white shadow-md rounded-circle text-primary-pink cursor-pointer transition-all hover:bg-slate-100"><Facebook size={20} /></div>
              <div className="p-3 bg-white shadow-md rounded-circle text-primary-pink cursor-pointer transition-all hover:bg-slate-100"><Instagram size={20} /></div>
              <div className="p-3 bg-white shadow-md rounded-circle text-primary-pink cursor-pointer transition-all hover:bg-slate-100"><Mail size={20} /></div>
            </div>
          </Col>
          <Col lg={2} md={6}>
            <h5 className="fw-bold mb-4">ลิงก์ด่วน</h5>
            <ul className="list-unstyled d-flex flex-column gap-3 text-sub small fw-bold">
              <li><Link to="/" className="text-decoration-none text-sub">หน้าแรก</Link></li>
              <li><Link to="/about" className="text-decoration-none text-sub">เกี่ยวกับเรา</Link></li>
              <li><a href="#" className="text-decoration-none text-sub">สิทธิการรักษา</a></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5 className="fw-bold mb-4">ข้อมูลติดต่อ</h5>
            <ul className="list-unstyled d-flex flex-column gap-3 text-sub small">
              <li className="d-flex gap-3"><MapPin size={18} className="text-primary-pink" /> 626 หมู่ 1 ต.คลองหาด อ.คลองหาด จ.สระแก้ว 27260</li>
              <li className="d-flex gap-3"><Phone size={18} className="text-primary-pink" /> 037-445-096 โทรสาร : 037-445-096 ต่อ 100</li>
              <li className="d-flex gap-3"><Clock size={18} className="text-primary-pink" /> เปิดทำการ 24 ชั่วโมง</li>
            </ul>
          </Col>
          <Col lg={3}>
            <div className="bg-white p-4 rounded-[32px] shadow-md border border-light">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Users size={18} className="text-primary-pink" /> สำหรับเจ้าหน้าที่
              </h5>
              {!user ? (
                <Link to="/login">
                  <Button className="w-100 btn-modern btn-modern-pink py-3">เข้าสู่ระบบ</Button>
                </Link>
              ) : (
                <Link to="/admin">
                  <Button className="w-100 btn-modern btn-modern-slate py-3">จัดการข้อมูล</Button>
                </Link>
              )}
            </div>
          </Col>
        </Row>
        <p className="text-center text-sub small fw-bold">© 2026 โรงพยาบาลคลองหาด. มุ่งมั่นในคุณภาพชีวิตที่ดี.</p>
      </Container>
    </footer>
  );
};

const AppointmentModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: 'general',
    date: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        setStatus({ type: 'success', message: 'จองคิวเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด' });
        setFormData({ name: '', phone: '', department: 'general', date: '', message: '' });
        setTimeout(() => {
          setStatus(null);
          handleClose();
        }, 3000);
      })
      .catch(() => setStatus({ type: 'danger', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }));
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md" className="modal-modern">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">นัดหมายแพทย์ล่วงหน้า</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {status && <Alert variant={status.type}>{status.message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">ชื่อ-นามสกุล</Form.Label>
            <Form.Control
              type="text"
              placeholder="กรอกชื่อของคุณ"
              className="bg-light border-0 p-3"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">เบอร์โทรศัพท์</Form.Label>
            <Form.Control
              type="tel"
              placeholder="08X-XXX-XXXX"
              className="bg-light border-0 p-3"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">วันที่ต้องการนัดหมาย</Form.Label>
            <Form.Control
              type="date"
              className="bg-light border-0 p-3"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">แผนกที่ต้องการปรึกษา</Form.Label>
            <Form.Select
              className="bg-light border-0 p-3"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="general">ตรวจสุขภาพทั่วไป</option>
              <option value="heart">ศูนย์โรคหัวใจ</option>
              <option value="kidney">ศูนย์ฟอกไต</option>
              <option value="pediatrics">แผนกกุมารเวช</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">หมายเหตุเพิ่มเติม</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              className="bg-light border-0 p-3"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </Form.Group>
          <Button type="submit" className="w-100 btn-modern btn-modern-pink py-3 mt-3">
            ยืนยันการนัดหมาย
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// --- App Root ---

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('hospital_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('hospital_user');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <CustomNavbar
          onBookClick={() => setShowModal(true)}
          user={user}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={
            <>
              <Hero onBookClick={() => setShowModal(true)} />
              <Services />
              <AboutSection />
              <NewsSection user={user} />
              <CTA onBookClick={() => setShowModal(true)} />
            </>
          } />
          <Route path="/about" element={<AboutAgencyPage />} />
          <Route path="/vision-mission" element={<VisionMissionPage />} />
          <Route path="/organization-structure" element={<OrgStructurePage />} />
          <Route path="/mission-responsibilities" element={<MissionDutyPage />} />
          <Route path="/news" element={<NewsSection user={user} />} />
          <Route path="/news/:id" element={<PubDetailPage category="news" user={user} />} />
          <Route path="/median-prices" element={<MedianPricesPage user={user} />} />
          <Route path="/median-prices/:id" element={<PubDetailPage category="median" user={user} />} />
          <Route path="/jobs" element={<JobsPage user={user} />} />
          <Route path="/jobs/:id" element={<PubDetailPage category="jobs" user={user} />} />
          <Route path="/activities" element={<ActivitiesPage user={user} />} />
          <Route path="/activities/:id" element={<PubDetailPage category="activities" user={user} />} />
          <Route path="/bidding" element={<BiddingNewsPage user={user} />} />
          <Route path="/bidding/:id" element={<PubDetailPage category="bidding" user={user} />} />
          <Route path="/ita/:year" element={<ITAPage user={user} />} />
          <Route path="/ita/:year/:id" element={<PubDetailPage category="ita" user={user} />} />
          <Route path="/academic-docs" element={<AcademicDocsPage user={user} />} />
          <Route path="/academic-docs/:sub" element={<AcademicDocsPage user={user} />} />
          <Route path="/academic-docs/detail/:id" element={<PubDetailPage category="academic" user={user} />} />
          <Route path="/login" element={!user ? <LoginPage setAuthUser={setUser} /> : <Navigate to="/admin" />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={user ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />
        </Routes>
        <Footer user={user} />
        <AppointmentModal show={showModal} handleClose={() => setShowModal(false)} />
      </div>
    </Router>
  );
};

export default App;
