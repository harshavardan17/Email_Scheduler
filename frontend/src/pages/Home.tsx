import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  ShieldCheck,
  Sparkles,
  Mail,
  Upload,
  Clock,
  BarChart3,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="text-center">

          <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20">
            <Sparkles size={18} />
            Smart Email Automation
          </span>

          <h1 className="mt-8 text-6xl font-extrabold leading-tight">
            Schedule Emails
            <span className="text-blue-500"> Smarter</span>
          </h1>

          <p className="mt-6 text-slate-400 text-xl max-w-3xl mx-auto leading-8">
            Schedule single or bulk emails effortlessly using BullMQ,
            Redis, PostgreSQL and React. Upload CSV files, automate email
            delivery, monitor progress and manage campaigns from one dashboard.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition"
            >
              Get Started
            </button>

            <Link
              to="/compose"
              className="border border-slate-700 hover:bg-slate-800 px-8 py-4 rounded-xl transition"
            >
              Compose Email
            </Link>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="max-w-7xl mx-auto px-8 py-10">

        <h2 className="text-4xl font-bold text-center mb-12">
          Everything You Need
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <FeatureCard
            icon={<Mail className="text-blue-500" size={34} />}
            title="Single Email"
            description="Schedule emails with custom date and time."
            to="/compose"
          />

          <FeatureCard
            icon={<Upload className="text-green-400" size={34} />}
            title="Bulk CSV Upload"
            description="Upload hundreds of recipients using CSV."
            to="/upload"
          />

          <FeatureCard
            icon={<Clock className="text-yellow-400" size={34} />}
            title="Smart Scheduling"
            description="Delay emails and configure hourly limits."
            to="/scheduled"
          />

          <FeatureCard
            icon={<BarChart3 className="text-purple-400" size={34} />}
            title="Analytics"
            description="Track pending, sent and failed emails."
            to="/sent"
          />

        </div>

      </section>

      {/* Why Choose */}

      <section className="max-w-7xl mx-auto px-8 py-20">

        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose Email Scheduler?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <InfoCard
            icon={<ShieldCheck className="text-green-400" size={40} />}
            title="Reliable"
            description="Redis + BullMQ ensures every email is processed safely."
          />

          <InfoCard
            icon={<CreditCard className="text-blue-400" size={40} />}
            title="Scalable"
            description="Handle thousands of scheduled emails with ease."
          />

          <InfoCard
            icon={<Sparkles className="text-yellow-400" size={40} />}
            title="Modern"
            description="Built with React, Prisma, PostgreSQL and TypeScript."
          />

        </div>

      </section>

      {/* Stats */}

      <section className="bg-slate-900 py-20">

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          <StatCard number="1000+" label="Emails Scheduled" />
          <StatCard number="99.9%" label="Delivery Reliability" />
          <StatCard number="24/7" label="Queue Processing" />
          <StatCard number="100%" label="Automation" />

        </div>

      </section>

      {/* Footer */}

      <footer className="border-t border-slate-800 py-8 text-center text-slate-400">
        <p>© 2026 Email Scheduler • Built with React, BullMQ & PostgreSQL</p>
      </footer>

    </div>
  );
}

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
};

function FeatureCard({ icon, title, description, to }: FeatureProps) {
  return (
    <Link
      to={to}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:-translate-y-2 transition-all"
    >
      {icon}
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-slate-400">{description}</p>
    </Link>
  );
}

type InfoProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function InfoCard({ icon, title, description }: InfoProps) {
  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-center hover:border-blue-500 transition">
      <div className="flex justify-center">{icon}</div>
      <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
      <p className="mt-4 text-slate-400">{description}</p>
    </div>
  );
}

type StatProps = {
  number: string;
  label: string;
};

function StatCard({ number, label }: StatProps) {
  return (
    <div>
      <h3 className="text-5xl font-bold text-blue-500">{number}</h3>
      <p className="mt-3 text-slate-400">{label}</p>
    </div>
  );
}

export default Home;