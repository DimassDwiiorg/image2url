import React from 'react';
import { Zap, ShieldCheck, Link2, Smartphone } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Fast Upload',
      description: 'Get your image URL in just a few seconds.',
    },
    {
      icon: ShieldCheck,
      title: 'Reliable Storage',
      description: 'Your images are stored securely and reliably.',
    },
    {
      icon: Link2,
      title: 'Direct URL',
      description: 'Get a clean, direct link to your image.',
    },
    {
      icon: Smartphone,
      title: 'Works Everywhere',
      description: 'Access your images from any device, anytime.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mt-20 pt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 text-left">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="flex flex-col space-y-2.5 group">
              <div className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h3 className="font-semibold text-base text-slate-800 dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
