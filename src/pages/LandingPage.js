import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Sparkles, Zap, Clock, BarChart3, Twitter, Check } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-brand-600" />,
      title: "AI-Powered Content",
      description: "Generate engaging tweets automatically with GPT-5.1"
    },
    {
      icon: <Clock className="w-6 h-6 text-brand-600" />,
      title: "Smart Scheduling",
      description: "Set it and forget it - automate your posting schedule"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-brand-600" />,
      title: "Analytics Dashboard",
      description: "Track performance and optimize your content strategy"
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-600" />,
      title: "Lightning Fast",
      description: "Deploy and start posting within minutes"
    }
  ];

  const benefits = [
    "Save 10+ hours per week on content creation",
    "Maintain consistent posting schedule",
    "Grow your Twitter audience on autopilot",
    "Never run out of content ideas again"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Twitter className="w-8 h-8 text-brand-600" />
              <span className="text-2xl font-heading font-extrabold gradient-text">ContentHub AI</span>
            </div>
            <Button 
              onClick={() => navigate('/auth')} 
              data-testid="nav-get-started-btn"
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-brand-50 rounded-full border border-brand-200">
                <Sparkles className="w-4 h-4 text-brand-600 mr-2" />
                <span className="text-sm font-medium text-brand-700">AI-Powered Content Automation</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-900 leading-tight">
                Automate Your Twitter Growth with{' '}
                <span className="gradient-text">AI Magic</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                Generate and schedule engaging tweets automatically. Connect your Twitter account, configure your AI content preferences, and let the platform handle the rest.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/auth')} 
                  data-testid="hero-get-started-btn"
                  size="lg"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg hover:shadow-glow transition-all text-lg px-8 py-6"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-slate-300 hover:border-brand-600 hover:text-brand-600 text-lg px-8 py-6"
                  data-testid="learn-more-btn"
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-5">
              <img 
                src="https://images.unsplash.com/photo-1664526936810-ec0856d31b92?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG5ldHdvcmslMjBub2RlcyUyMGJsdWUlMjB0ZWNobm9sb2d5fGVufDB8fHx8MTc2NTk2NzEwM3ww&ixlib=rb-4.1.0&q=85" 
                alt="AI Network"
                className="rounded-2xl shadow-2xl border border-slate-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-4">
              Everything You Need to Scale Your Twitter Presence
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to help you grow your audience and save time
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-slate-50 hover:bg-white border border-slate-200 rounded-xl p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                data-testid={`feature-card-${index}`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-heading font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1758874384722-ab97b4c9af89?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b3JraW5nJTIwb24lMjBsYXB0b3AlMjBtb2Rlcm4lMjBvZmZpY2V8ZW58MHx8fHwxNzY1OTY3MTA1fDA&ixlib=rb-4.1.0&q=85" 
                alt="Professional Working"
                className="rounded-2xl shadow-xl border border-slate-200"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">
                Why Content Creators Choose ContentHub AI
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3" data-testid={`benefit-${index}`}>
                    <div className="flex-shrink-0 w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-brand-600" />
                    </div>
                    <p className="text-lg text-slate-700">{benefit}</p>
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => navigate('/auth')} 
                data-testid="benefits-cta-btn"
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold mt-8 px-8 py-6 text-lg"
              >
                Start Automating Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-600 to-twitter">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6">
            Ready to Transform Your Twitter Strategy?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of content creators who are growing their audience on autopilot
          </p>
          <Button 
            onClick={() => navigate('/auth')} 
            data-testid="final-cta-btn"
            size="lg"
            className="bg-white text-brand-600 hover:bg-slate-50 font-bold shadow-xl hover:shadow-2xl transition-all px-10 py-6 text-lg"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Twitter className="w-6 h-6" />
            <span className="text-xl font-heading font-bold">ContentHub AI</span>
          </div>
          <p className="text-slate-400">AI-Powered Twitter Content Automation Platform</p>
          <p className="text-slate-500 text-sm mt-4">© 2025 ContentHub AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;