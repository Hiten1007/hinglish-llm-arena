import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Eye, 
  Lock, 
  Zap, 
  Radio, 
  Target, 
  AlertTriangle, 
  Check, 
  X, 
  ChevronRight,
  ShieldCheck,
  Crosshair,
  Activity,
  Smartphone,
  Video,
  Bell,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import heroImage from "@/assets/generated_images/security_command_center_hero.png";
import sentinelCam from "@/assets/generated_images/sentinel_security_camera_product.png";
import smartLock from "@/assets/generated_images/smart_lock_product_image.png";
import commandCenter from "@/assets/generated_images/command_center_tablet_interface.png";
import networkViz from "@/assets/generated_images/network_visualization_dashboard_graphic.png";

export default function Home() {
  const [defconLevel, setDefconLevel] = useState(1);
  const [threatsNeutralized, setThreatsNeutralized] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [activeDeployments, setActiveDeployments] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const dashboardSection = useScrollAnimation({ threshold: 0.2 });
  const arsenalSection = useScrollAnimation({ threshold: 0.2 });
  const comparisonSection = useScrollAnimation({ threshold: 0.2 });
  const missionSection = useScrollAnimation({ threshold: 0.2 });
  const tiersSection = useScrollAnimation({ threshold: 0.2 });
  const contactSection = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    const timer = setInterval(() => {
      setThreatsNeutralized(prev => Math.min(prev + 47, 12847));
      setResponseTime(prev => Math.min(prev + 0.02, 2.3));
      setActiveDeployments(prev => Math.min(prev + 3, 847));
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let ticking = false;
    let animationFrameId: number;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(() => {
          if (heroRef.current) {
            const scrolled = window.scrollY;
            const heroHeight = heroRef.current.offsetHeight;
            if (scrolled < heroHeight) {
              setParallaxOffset(scrolled * 0.5);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const products = [
    {
      name: "Sentinel X-3",
      model: "Model X-3",
      image: sentinelCam,
      tagline: "AI-Powered Surveillance",
      specs: [
        "4K Resolution + Thermal Imaging",
        "Military-Grade Night Vision",
        "5000-Lumen Intruder Strobe",
        "Local Blast-Proof Storage"
      ],
      icon: Video
    },
    {
      name: "Iron-Gate Lock",
      model: "Smart Security",
      image: smartLock,
      tagline: "Reinforced Access Control",
      specs: [
        "Steel Deadbolt + AES-256",
        "Duress Mode Protection",
        "7-Day Battery Backup",
        "Hardwired Connection Only"
      ],
      icon: Lock
    },
    {
      name: "Command Center",
      model: "Control Hub",
      image: commandCenter,
      tagline: "Tactical Operations Platform",
      specs: [
        "YubiKey + Biometric 2FA",
        "Panic Protocol System",
        "Real-Time Threat Analysis",
        "Encrypted Communications"
      ],
      icon: Smartphone
    }
  ];

  const tiers = [
    {
      name: "THE RECRUIT",
      price: "$99",
      period: "/month",
      description: "Basic monitoring. You get yelled at if you forget to arm it.",
      features: [
        "24/7 System Monitoring",
        "Mobile App Access",
        "Email Alerts",
        "Basic Support"
      ],
      icon: Shield,
      popular: false
    },
    {
      name: "THE OPERATOR",
      price: "$250",
      period: "/month",
      description: "24/7 Active Watch. We call you if a leaf blows across your lawn.",
      features: [
        "Everything in Recruit",
        "Active 24/7 Watch",
        "Phone Call Alerts",
        "Priority Support",
        "Monthly System Check"
      ],
      icon: Eye,
      popular: true
    },
    {
      name: "THE FORTRESS",
      price: "$500",
      period: "/month",
      description: "Armed response dispatch and monthly perimeter penetration testing.",
      features: [
        "Everything in Operator",
        "Armed Response Team",
        "Monthly Penetration Tests",
        "Dedicated Security Manager",
        "VIP Support Hotline"
      ],
      icon: ShieldCheck,
      popular: false
    }
  ];

  const comparisonFeatures = [
    { name: "Response Time", civilian: "15-30 min", vanguard: "< 2.3 sec", status: "superior" },
    { name: "Connection Type", civilian: "Wireless (Jammable)", vanguard: "Hardwired Only", status: "superior" },
    { name: "Monitoring", civilian: "Passive Watch", vanguard: "Active Defense", status: "superior" },
    { name: "Data Storage", civilian: "Cloud (Hackable)", vanguard: "Local Encrypted", status: "superior" },
    { name: "Power Backup", civilian: "Battery 24hrs", vanguard: "7-Day Hardline", status: "superior" },
    { name: "Threat Analysis", civilian: "None", vanguard: "AI-Powered Real-Time", status: "superior" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div className="flex flex-col">
                <span className="font-tactical font-bold text-lg tracking-wider">VANGUARD</span>
                <span className="text-xs text-muted-foreground font-mono">HOME SECURITY</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#arsenal" className="text-sm hover:text-primary transition-colors" data-testid="link-arsenal">ARSENAL</a>
              <a href="#tiers" className="text-sm hover:text-primary transition-colors" data-testid="link-tiers">DEPLOYMENT</a>
              <a href="#contact" className="text-sm hover:text-primary transition-colors" data-testid="link-contact">CONTACT</a>
              <Button size="sm" data-testid="button-deploy">
                DEPLOY NOW <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background with dark overlay and parallax */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10" />
          <img 
            src={heroImage} 
            alt="Security Command Center" 
            className="w-full h-full object-cover opacity-40 transition-transform duration-100"
            style={{ transform: `translateY(${parallaxOffset}px)` }}
          />
          {/* Hexagonal pattern overlay */}
          <div className="absolute inset-0 opacity-10 z-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2300d9ff' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 text-center">
          {/* DEFCON Indicator */}
          <div className="inline-flex items-center gap-3 bg-destructive/20 border border-destructive/50 px-4 py-2 rounded-md mb-8" data-testid="badge-defcon">
            <Target className="w-5 h-5 text-destructive animate-pulse" />
            <span className="font-tactical font-bold text-sm tracking-widest">DEFCON {defconLevel}</span>
          </div>

          <h1 className="font-tactical font-black text-6xl md:text-8xl lg:text-9xl tracking-wider mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent" data-testid="text-hero-title">
            TOTAL PERIMETER
            <br />
            DOMINANCE
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium" data-testid="text-hero-subtitle">
            Military-Grade Home Defense Systems with Active Threat Response
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="text-base px-8" data-testid="button-hero-deploy">
              <Shield className="w-5 h-5 mr-2" />
              DEPLOY SECURITY
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 backdrop-blur-md bg-background/10" data-testid="button-hero-threat">
              <Crosshair className="w-5 h-5 mr-2" />
              CALCULATE THREAT LEVEL
            </Button>
          </div>

          {/* Tactical Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-md border-primary/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <Badge variant="outline" className="text-primary border-primary/50" data-testid="badge-response-time">OPTIMAL</Badge>
                </div>
                <div className="text-3xl font-tactical font-bold text-primary mb-1" data-testid="text-response-time">
                  {responseTime.toFixed(1)}s
                </div>
                <div className="text-xs text-muted-foreground tracking-wide">AVG RESPONSE TIME</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-md border-primary/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <Badge variant="outline" className="text-primary border-primary/50" data-testid="badge-deployments">ACTIVE</Badge>
                </div>
                <div className="text-3xl font-tactical font-bold text-primary mb-1" data-testid="text-deployments">
                  {activeDeployments}
                </div>
                <div className="text-xs text-muted-foreground tracking-wide">ACTIVE DEPLOYMENTS</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-md border-primary/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <Badge variant="outline" className="text-primary border-primary/50" data-testid="badge-threats">SECURED</Badge>
                </div>
                <div className="text-3xl font-tactical font-bold text-primary mb-1" data-testid="text-threats">
                  {threatsNeutralized.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground tracking-wide">THREATS NEUTRALIZED</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Threat Dashboard */}
      <section 
        ref={dashboardSection.ref} 
        className={`py-24 px-6 lg:px-12 transition-all duration-700 ${dashboardSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline" data-testid="badge-section-dashboard">
              <Radio className="w-3 h-3 mr-2 animate-pulse" />
              LIVE TACTICAL OVERVIEW
            </Badge>
            <h2 className="font-tactical font-bold text-4xl md:text-5xl tracking-wider mb-4" data-testid="text-section-dashboard">
              REAL-TIME THREAT INTELLIGENCE
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered monitoring systems provide instant threat analysis and response coordination
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Metrics Dashboard */}
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="font-tactical text-xl tracking-wider flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  SYSTEM METRICS
                </CardTitle>
                <CardDescription>Operational status and performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Perimeter Integrity</span>
                    <span className="text-sm text-primary font-bold">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Sensor Network</span>
                    <span className="text-sm text-primary font-bold">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">AI Detection Accuracy</span>
                    <span className="text-sm text-primary font-bold">99.7%</span>
                  </div>
                  <Progress value={99.7} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Power Redundancy</span>
                    <span className="text-sm text-primary font-bold">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-4 bg-primary/10 rounded-md border border-primary/30">
                    <div className="text-2xl font-tactical font-bold text-primary mb-1" data-testid="text-cameras">42</div>
                    <div className="text-xs text-muted-foreground">ACTIVE CAMERAS</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-md border border-primary/30">
                    <div className="text-2xl font-tactical font-bold text-primary mb-1" data-testid="text-sensors">128</div>
                    <div className="text-xs text-muted-foreground">PERIMETER SENSORS</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Visualization */}
            <Card className="border-primary/30 overflow-hidden">
              <CardHeader>
                <CardTitle className="font-tactical text-xl tracking-wider flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  NETWORK TOPOLOGY
                </CardTitle>
                <CardDescription>Secured perimeter detection grid</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-md overflow-hidden border border-primary/30">
                  <img 
                    src={networkViz} 
                    alt="Network Visualization" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-primary" />
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-primary" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-primary" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-muted-foreground">ALL SYSTEMS OPERATIONAL</span>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/50" data-testid="badge-network-status">
                    SECURED
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Arsenal Grid */}
      <section 
        ref={arsenalSection.ref}
        id="arsenal" 
        className={`py-24 px-6 lg:px-12 bg-muted/30 transition-all duration-700 ${arsenalSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline" data-testid="badge-section-arsenal">
              <Zap className="w-3 h-3 mr-2" />
              TACTICAL HARDWARE
            </Badge>
            <h2 className="font-tactical font-bold text-4xl md:text-5xl tracking-wider mb-4" data-testid="text-section-arsenal">
              THE ARSENAL
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Military-spec equipment designed for total perimeter dominance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="group hover:border-primary/50 transition-all duration-300 overflow-hidden" data-testid={`card-product-${index}`}>
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-background to-muted">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Corner brackets */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <product.icon className="w-6 h-6 text-primary" />
                    <Badge variant="outline" className="text-xs" data-testid={`badge-product-model-${index}`}>{product.model}</Badge>
                  </div>
                  <CardTitle className="font-tactical text-2xl tracking-wider" data-testid={`text-product-name-${index}`}>
                    {product.name}
                  </CardTitle>
                  <CardDescription className="font-medium">{product.tagline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {product.specs.map((spec, specIndex) => (
                      <div key={specIndex} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{spec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all" data-testid={`button-product-specs-${index}`}>
                    VIEW FULL SPECS
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tactical Specifications Comparison */}
      <section 
        ref={comparisonSection.ref}
        className={`py-24 px-6 lg:px-12 transition-all duration-700 ${comparisonSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline" data-testid="badge-section-comparison">
              <Target className="w-3 h-3 mr-2" />
              PERFORMANCE ANALYSIS
            </Badge>
            <h2 className="font-tactical font-bold text-4xl md:text-5xl tracking-wider mb-4" data-testid="text-section-comparison">
              CIVILIAN VS. VANGUARD
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Why settle for passive monitoring when you can have active defense?
            </p>
          </div>

          <Card className="border-primary/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-tactical text-sm tracking-wider text-muted-foreground">SPECIFICATION</th>
                    <th className="text-center p-4 font-tactical text-sm tracking-wider text-muted-foreground">CIVILIAN SYSTEMS</th>
                    <th className="text-center p-4 font-tactical text-sm tracking-wider bg-primary/10">
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-primary">VANGUARD</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors" data-testid={`row-comparison-${index}`}>
                      <td className="p-4 font-medium">{feature.name}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <X className="w-4 h-4 text-destructive" />
                          <span className="text-sm text-muted-foreground">{feature.civilian}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center bg-primary/5">
                        <div className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">{feature.vanguard}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Mission Briefing */}
      <section 
        ref={missionSection.ref}
        className={`py-24 px-6 lg:px-12 bg-muted/30 transition-all duration-700 ${missionSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline" data-testid="badge-section-mission">
              <ShieldCheck className="w-3 h-3 mr-2" />
              CLASSIFIED
            </Badge>
            <h2 className="font-tactical font-bold text-4xl md:text-5xl tracking-wider mb-4" data-testid="text-section-mission">
              THE VANGUARD CODE
            </h2>
          </div>

          <Card className="border-destructive/30 relative overflow-hidden">
            {/* Classified watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <div className="font-tactical text-9xl tracking-widest rotate-[-15deg] text-destructive">
                CLASSIFIED
              </div>
            </div>

            <CardContent className="pt-8 space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-tactical text-xl tracking-wider mb-2 text-primary">ZERO TRUST</h3>
                    <p className="text-muted-foreground">
                      We assume everyone at the door is a threat until verified. Even the pizza delivery guy.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <Radio className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-tactical text-xl tracking-wider mb-2 text-primary">HARDLINE ONLY</h3>
                    <p className="text-muted-foreground">
                      Wireless signals can be jammed. Batteries die. We only install hardwired, copper/fiber connections. If you want Wi-Fi, go to Best Buy.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-tactical text-xl tracking-wider mb-2 text-primary">DISCIPLINE IS SAFETY</h3>
                    <p className="text-muted-foreground">
                      A security system is only as good as the operator. If you forget to arm the system, you deserve the consequences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
                <p className="text-sm text-center font-mono text-destructive">
                  MISSION: Replace passive "monitoring" with active "defense"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Deployment Tiers */}
      <section 
        ref={tiersSection.ref}
        id="tiers" 
        className={`py-24 px-6 lg:px-12 transition-all duration-700 ${tiersSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline" data-testid="badge-section-tiers">
              <Users className="w-3 h-3 mr-2" />
              DEPLOYMENT OPTIONS
            </Badge>
            <h2 className="font-tactical font-bold text-4xl md:text-5xl tracking-wider mb-4" data-testid="text-section-tiers">
              CHOOSE YOUR DEFENSE TIER
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From basic monitoring to full tactical response teams
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`relative ${tier.popular ? 'border-primary shadow-lg shadow-primary/20 scale-105' : ''} transition-all hover:border-primary/50`}
                data-testid={`card-tier-${index}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground border-0" data-testid="badge-popular">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="w-12 h-12 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center mb-4">
                    <tier.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-tactical text-2xl tracking-wider" data-testid={`text-tier-name-${index}`}>
                    {tier.name}
                  </CardTitle>
                  <CardDescription className="text-sm min-h-12">{tier.description}</CardDescription>
                  <div className="pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-tactical font-bold text-primary" data-testid={`text-tier-price-${index}`}>
                        {tier.price}
                      </span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  <div className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={tier.popular ? "default" : "outline"} 
                    className="w-full" 
                    data-testid={`button-tier-select-${index}`}
                  >
                    SELECT {tier.name}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Threat Assessment Form */}
      <section 
        ref={contactSection.ref}
        id="contact" 
        className={`py-24 px-6 lg:px-12 bg-muted/30 transition-all duration-700 ${contactSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline" data-testid="badge-section-contact">
              <Bell className="w-3 h-3 mr-2" />
              REQUEST BRIEFING
            </Badge>
            <h2 className="font-tactical font-bold text-4xl md:text-5xl tracking-wider mb-4" data-testid="text-section-contact">
              THREAT ASSESSMENT REQUEST
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our tactical team will conduct a full perimeter analysis and provide a customized defense strategy
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="font-tactical text-xl tracking-wider">
                    SECURE CONTACT FORM
                  </CardTitle>
                  <CardDescription>All communications are encrypted end-to-end</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-tactical tracking-wider">FULL NAME</Label>
                        <Input id="name" placeholder="John Operator" data-testid="input-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-tactical tracking-wider">EMAIL ADDRESS</Label>
                        <Input id="email" type="email" placeholder="secure@email.com" data-testid="input-email" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-tactical tracking-wider">CONTACT NUMBER</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" data-testid="input-phone" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-xs font-tactical tracking-wider">PROPERTY LOCATION</Label>
                        <Input id="location" placeholder="City, State" data-testid="input-location" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-xs font-tactical tracking-wider">THREAT ASSESSMENT DETAILS</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Describe your security concerns, property details, and any specific threats..." 
                        className="min-h-32"
                        data-testid="input-message"
                      />
                    </div>

                    <Button size="lg" className="w-full" data-testid="button-submit-form">
                      <Shield className="w-5 h-5 mr-2" />
                      REQUEST SECURITY BRIEFING
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="font-tactical text-lg tracking-wider">
                    DIRECT CONTACT
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="text-sm font-medium mb-1">Emergency Hotline</div>
                      <div className="text-sm text-muted-foreground font-mono">+1 (800) VHS-DEFN</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="text-sm font-medium mb-1">Secure Email</div>
                      <div className="text-sm text-muted-foreground">ops@vanguardhomesec.com</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="text-sm font-medium mb-1">Headquarters</div>
                      <div className="text-sm text-muted-foreground">[REDACTED]<br />Northern Virginia</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/10 border-primary/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="font-tactical text-sm tracking-wider text-primary mb-2">
                      24/7 TACTICAL SUPPORT
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Our response teams are always ready
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-primary" />
                <div className="flex flex-col">
                  <span className="font-tactical font-bold text-lg tracking-wider">VANGUARD</span>
                  <span className="text-xs text-muted-foreground font-mono">HOME SECURITY</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Total Perimeter Dominance. Military-grade home defense systems.
              </p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs" data-testid="badge-compliance-iso">ISO 27001</Badge>
                <Badge variant="outline" className="text-xs" data-testid="badge-compliance-mil">MIL-SPEC</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-tactical text-sm tracking-wider mb-4">PRODUCTS</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Sentinel X-3</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Iron-Gate Lock</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Command Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Perimeter Grid</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-tactical text-sm tracking-wider mb-4">SERVICES</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">The Recruit</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">The Operator</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">The Fortress</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Custom Solutions</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-tactical text-sm tracking-wider mb-4">COMPANY</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About VHS</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              © 2023 Vanguard Home Security. All rights reserved. Founded in the Post-Compliance Era.
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                SECURED CONNECTION
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
