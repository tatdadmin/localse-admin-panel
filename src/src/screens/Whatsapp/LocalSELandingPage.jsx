import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export default function LocalSELandingPage() {
  const [downloadClicked, setDownloadClicked] = useState(false);

  useEffect(() => {
    instantApi();
  }, []);
  const [searchParams] = useSearchParams();
  const referrer = searchParams.get("referrer");
  console.log(referrer, "oitfdvb");
  const instantApi = async () => {
    try {
      const res = await axios({
        url: "http://api.localse.in:5001/api/trigger/whatsapp-campaign/link-click",
        method: "POST",
        data: {
          campaign_id: referrer,
        },
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDownload = async (platform) => {
    // Backend API call for tracking
    // const response = await fetch('/api/track-download', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ platform, referral: 'sjsjd-fjfjfj-9999172990' })
    // });

    setDownloadClicked(true);

    if (platform === "android") {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.localse";
    } else {
      window.location.href =
        "https://apps.apple.com/in/app/localse/id6743470526";
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          overflow-x: hidden;
        }
        
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .glow-effect {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
          from { box-shadow: 0 0 20px rgba(25, 118, 210, 0.3); }
          to { box-shadow: 0 0 30px rgba(25, 118, 210, 0.6), 0 0 40px rgba(25, 118, 210, 0.4); }
        }
        
        .slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }
        
        @keyframes slideInLeft {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .gradient-text {
        background: linear-gradient(135deg, #d32f2f, #e53935, #f44336);

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite;
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .morphing-blob {
          animation: morphing 8s ease-in-out infinite;
        }
        
        @keyframes morphing {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
      `}</style>

      {/* Header Section */}
      <header style={styles.header}>
        <div style={styles.headerBackground}></div>
        <div style={styles.headerBackground2}></div>
        <div style={styles.headerContent}>
          <div
            style={styles.logoIcon}
            className="floating-animation glow-effect"
          >
            🔧
          </div>
          <h1 style={styles.mainTitle} className="gradient-text">
            LocalSe
          </h1>
          <p style={styles.subtitle} className="slide-in-left">
            आपके आस-पास के बेहतरीन Service Providers
          </p>
          <p style={styles.description} className="slide-in-right">
            Electrician • Plumber • Carpenter • AC Repair • और भी बहुत कुछ
          </p>

          <div style={styles.downloadButtons}>
            <button
              style={styles.androidButton}
              className="pulse-animation"
              onClick={() => handleDownload("android")}
              onMouseEnter={(e) =>
                (e.target.style.transform = "scale(1.1) translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.target.style.transform = "scale(1) translateY(0)")
              }
            >
              <span style={styles.downloadIcon}>📱</span>
              <div style={styles.buttonText}>
                <div style={styles.buttonSubtext}>Download for</div>
                <div style={styles.buttonMaintext}>Android</div>
              </div>
            </button>

            <button
              style={styles.iosButton}
              className="pulse-animation"
              onClick={() => handleDownload("ios")}
              onMouseEnter={(e) =>
                (e.target.style.transform = "scale(1.1) translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.target.style.transform = "scale(1) translateY(0)")
              }
            >
              <span style={styles.downloadIcon}>🍎</span>
              <div style={styles.buttonText}>
                <div style={styles.buttonSubtext}>Download for</div>
                <div style={styles.buttonMaintext}>iOS</div>
              </div>
            </button>
          </div>

          {downloadClicked && (
            <div style={styles.successMessage} className="slide-in-left">
              🎉 धन्यवाद! आपका download जल्दी शुरू होगा।
            </div>
          )}
        </div>
      </header>

      {/* Services Section */}
      <section style={styles.servicesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>कौन सी Service चाहिए?</h2>
          <p style={styles.sectionSubtitle}>
            आपके आस-पास के trusted professionals से जुड़ें
          </p>
        </div>

        <div style={styles.servicesGrid}>
          {[
            {
              name: "Electrician",
              icon: "⚡",
              color: "linear-gradient(135deg, #ffa726, #ff9800)",
            },
            {
              name: "Plumber",
              icon: "🔧",
              color: "linear-gradient(135deg, #42a5f5, #2196f3)",
            },
            {
              name: "Carpenter",
              icon: "🔨",
              color: "linear-gradient(135deg, #ffb74d, #ff9800)",
            },
            {
              name: "AC Repair",
              icon: "❄️",
              color: "linear-gradient(135deg, #29b6f6, #03a9f4)",
            },
            {
              name: "Painter",
              icon: "🎨",
              color: "linear-gradient(135deg, #ab47bc, #9c27b0)",
            },
            {
              name: "Cleaning",
              icon: "🧹",
              color: "linear-gradient(135deg, #66bb6a, #4caf50)",
            },
            {
              name: "Mechanic",
              icon: "🔧",
              color: "linear-gradient(135deg, #78909c, #607d8b)",
            },
            {
              name: "और भी...",
              icon: "➕",
              color: "linear-gradient(135deg, #5c6bc0, #3f51b5)",
            },
          ].map((service, index) => (
            <div
              key={index}
              style={{
                ...styles.serviceCard,
                animationDelay: `${index * 0.1}s`,
              }}
              className="floating-animation"
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-10px) scale(1.05)";
                e.target.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
              }}
            >
              <div
                style={{ ...styles.serviceIcon, background: service.color }}
                className="morphing-blob"
              >
                {service.icon}
              </div>
              <h3 style={styles.serviceName}>{service.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>LocalSe क्यों चुनें?</h2>
        </div>

        <div style={styles.featuresGrid}>
          <div style={styles.featureCard} className="slide-in-left">
            <div
              style={{
                ...styles.featureIcon,
                background: "linear-gradient(135deg, #66bb6a, #4caf50)",
              }}
              className="glow-effect"
            >
              📍
            </div>
            <h3 style={styles.featureTitle}>आस-पास के Professionals</h3>
            <p style={styles.featureDescription}>
              आपके area के verified और trusted service providers से तुरंत
              connect करें।
            </p>
          </div>

          <div style={styles.featureCard} className="slide-in-right">
            <div
              style={{
                ...styles.featureIcon,
                background: "linear-gradient(135deg, #42a5f5, #2196f3)",
              }}
              className="glow-effect"
            >
              ⏰
            </div>
            <h3 style={styles.featureTitle}>Fast Service</h3>
            <p style={styles.featureDescription}>
              Same day service available। Emergency calls के लिए 24/7 support।
            </p>
          </div>

          <div style={styles.featureCard} className="slide-in-left">
            <div
              style={{
                ...styles.featureIcon,
                background: "linear-gradient(135deg, #ffa726, #ff9800)",
              }}
              className="glow-effect"
            >
              ⭐
            </div>
            <h3 style={styles.featureTitle}>Rated Professionals</h3>
            <p style={styles.featureDescription}>
              Genuine reviews और ratings के साथ best professionals को choose
              करें।
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={styles.howItWorksSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>कैसे काम करता है?</h2>
        </div>

        <div style={styles.stepsGrid}>
          {[
            {
              step: "1",
              title: "Service Select करें",
              desc: "जो service चाहिए वो choose करें",
            },
            {
              step: "2",
              title: "Professional मिलेगा",
              desc: "आपके area का best professional assign होगा",
            },
            {
              step: "3",
              title: "Work Complete",
              desc: "Quality service guarantee के साथ",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={styles.stepCard}
              className="floating-animation"
            >
              <div style={styles.stepNumber} className="pulse-animation">
                {item.step}
              </div>
              <h3 style={styles.stepTitle}>{item.title}</h3>
              <p style={styles.stepDescription}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {/* <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle} className="gradient-text">अभी Download करें!</h2>
          <p style={styles.ctaSubtitle}>हजारों customers पहले से ही LocalSe use कर रहे हैं</p>
          
          <button 
            style={styles.ctaButton}
            className="pulse-animation"
            onClick={() => handleDownload('android')}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            📱 अभी Download करें
          </button>
        </div>
      </section> */}

      {/* Footer */}
      {/* <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <div style={styles.footerLogo}>
              <span style={styles.footerIcon}>🔧</span>
              <span style={styles.footerBrandName}>LocalSe</span>
            </div>
            <p style={styles.footerDescription}>
              आपके आस-पास के बेहतरीन service providers से connect करने का सबसे आसान तरीका।
            </p>
          </div>
          
          <div style={styles.footerLinks}>
            <div style={styles.footerColumn}>
              <h4 style={styles.footerHeading}>Services</h4>
              <ul style={styles.footerList}>
                <li>Electrician</li>
                <li>Plumber</li>
                <li>Carpenter</li>
                <li>AC Repair</li>
              </ul>
            </div>
            
            <div style={styles.footerColumn}>
              <h4 style={styles.footerHeading}>Support</h4>
              <ul style={styles.footerList}>
                <li><a href="#" style={styles.footerLink}>Help Center</a></li>
                <li><a href="#" style={styles.footerLink}>Contact Us</a></li>
                <li><a href="#" style={styles.footerLink}>Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div style={styles.footerBottom}>
          <p>&copy; 2025 LocalSe. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  );
}

const styles = {

  
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #e3f2fd 0%, #ffffff 50%, #e8f5e8 100%)",
  },

  // Header Styles
  header: {
    background: "linear-gradient(135deg, #1976d2 0%, #388e3c 100%)",
    color: "white",
    padding: "100px 0",
    position: "relative",
    overflow: "hidden",
  },

  headerBackground: {
    position: "absolute",
    top: "-50%",
    right: "-50%",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
    borderRadius: "50%",
  },

  headerBackground2: {
    position: "absolute",
    bottom: "-50%",
    left: "-50%",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle, rgba(76,175,80,0.2) 0%, transparent 70%)",
    borderRadius: "50%",
  },

  headerContent: {
    textAlign: "center",
    position: "relative",
    zIndex: 2,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },

  logoIcon: {
    width: "100px",
    height: "100px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 40px",
    fontSize: "50px",
    backdropFilter: "blur(10px)",
    border: "2px solid rgba(255,255,255,0.3)",
  },

  mainTitle: {
    fontSize: "clamp(3rem, 8vw, 6rem)",
    fontWeight: "800",
    marginBottom: "30px",
    textShadow: "0 4px 20px rgba(0,0,0,0.3)",
    letterSpacing: "-2px",
  },

  subtitle: {
    fontSize: "clamp(1.2rem, 4vw, 2rem)",
    marginBottom: "20px",
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },

  description: {
    fontSize: "clamp(1rem, 3vw, 1.2rem)",
    marginBottom: "50px",
    color: "rgba(255,255,255,0.8)",
    maxWidth: "600px",
    margin: "0 auto 50px",
  },

  downloadButtons: {
    display: "flex",
    flexDirection: "row",
    gap: "30px",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },

  androidButton: {
    background: "linear-gradient(135deg, #000000, #434343)",
    color: "white",
    border: "none",
    padding: "20px 40px",
    borderRadius: "20px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    minWidth: "220px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  iosButton: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "20px 40px",
    borderRadius: "20px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    minWidth: "220px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
  },

  downloadIcon: {
    fontSize: "30px",
  },

  buttonText: {
    textAlign: "left",
  },

  buttonSubtext: {
    fontSize: "14px",
    opacity: "0.8",
  },

  buttonMaintext: {
    fontSize: "20px",
    fontWeight: "700",
  },

  successMessage: {
    marginTop: "30px",
    padding: "20px",
    background: "rgba(76, 175, 80, 0.2)",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(76, 175, 80, 0.3)",
    color: "#e8f5e8",
    fontSize: "18px",
    fontWeight: "600",
  },

  // Services Section
  servicesSection: {
    padding: "100px 0",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  sectionHeader: {
    textAlign: "center",
    marginBottom: "80px",
  },

  sectionTitle: {
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#1a1a1a",
  },

  sectionSubtitle: {
    fontSize: "1.2rem",
    color: "#666",
    maxWidth: "600px",
    margin: "0 auto",
  },

  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    padding: "0 20px",
  },

  serviceCard: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "25px",
    padding: "40px 30px",
    textAlign: "center",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  serviceIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "35px",
    margin: "0 auto 25px",
    transition: "all 0.3s ease",
  },

  serviceName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#1a1a1a",
  },

  // Features Section
  featuresSection: {
    padding: "100px 0",
    background: "rgba(248, 250, 252, 0.8)",
    backdropFilter: "blur(20px)",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },

  featureCard: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "25px",
    padding: "50px 40px",
    textAlign: "center",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
  },

  featureIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "35px",
    margin: "0 auto 30px",
  },

  featureTitle: {
    fontSize: "1.4rem",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#1a1a1a",
  },

  featureDescription: {
    fontSize: "1rem",
    color: "#666",
    lineHeight: "1.6",
  },

  // How it Works Section
  howItWorksSection: {
    padding: "100px 0",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "50px",
    padding: "0 20px",
  },

  stepCard: {
    textAlign: "center",
  },

  stepNumber: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #1976d2, #388e3c)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 auto 30px",
    boxShadow: "0 10px 30px rgba(25, 118, 210, 0.3)",
  },

  stepTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    marginBottom: "15px",
    color: "#1a1a1a",
  },

  stepDescription: {
    fontSize: "1rem",
    color: "#666",
  },

  // CTA Section
  ctaSection: {
    padding: "100px 0",
    background: "linear-gradient(135deg, #1976d2 0%, #388e3c 100%)",
    color: "white",
    textAlign: "center",
  },

  ctaContent: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "0 20px",
  },

  ctaTitle: {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    fontWeight: "800",
    marginBottom: "30px",
  },

  ctaSubtitle: {
    fontSize: "1.3rem",
    marginBottom: "50px",
    color: "rgba(255,255,255,0.9)",
  },

  ctaButton: {
    background: "rgba(255, 255, 255, 0.9)",
    color: "#1976d2",
    border: "none",
    padding: "20px 50px",
    borderRadius: "50px",
    fontSize: "1.2rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
  },

  // Footer
  footer: {
    background: "linear-gradient(135deg, #263238, #37474f)",
    color: "white",
    padding: "80px 0 30px",
  },

  footerContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "50px",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },

  footerBrand: {
    gridColumn: "span 2",
  },

  footerLogo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },

  footerIcon: {
    fontSize: "35px",
  },

  footerBrandName: {
    fontSize: "2rem",
    fontWeight: "700",
  },

  footerDescription: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.7)",
    lineHeight: "1.6",
    maxWidth: "400px",
  },

  footerLinks: {
    display: "flex",
    gap: "80px",
  },

  footerColumn: {
    minWidth: "150px",
  },

  footerHeading: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "25px",
  },

  footerList: {
    listStyle: "none",
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.7)",
  },

  footerLink: {
    color: "rgba(255,255,255,0.7)",
    textDecoration: "none",
    transition: "color 0.3s ease",
  },

  footerBottom: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    marginTop: "60px",
    paddingTop: "30px",
    textAlign: "center",
    color: "rgba(255,255,255,0.6)",
    maxWidth: "1200px",
    margin: "60px auto 0",
    padding: "30px 20px 0",
  },
};
