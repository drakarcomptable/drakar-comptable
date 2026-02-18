
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';

const Blog: React.FC = () => {
  const posts = [
    {
      id: 1,
      title: "Loi de finances 2024 : ce qui change pour les PME",
      excerpt: "Analyse détaillée des nouvelles mesures fiscales et de leur impact sur la trésorerie des entreprises en croissance.",
      date: "12 Mars 2024",
      readTime: "8 min",
      category: "Fiscalité",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Facture électronique : comment préparer votre transition",
      excerpt: "Le guide complet Drakar pour anticiper l'obligation de facturation électronique et moderniser vos flux.",
      date: "05 Mars 2024",
      readTime: "6 min",
      category: "Digital",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "Optimisation de la rémunération du dirigeant",
      excerpt: "Arbitrage dividendes vs salaires : les stratégies gagnantes pour maximiser vos revenus nets.",
      date: "28 Fév 2024",
      readTime: "10 min",
      category: "Conseil",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="pt-40 pb-32 bg-brand-slate/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-brand-orange rounded-full text-[10px] font-black uppercase tracking-widest">
            <BookOpen className="w-3 h-3" /> Veille Institutionnelle
          </div>
          <h1 className="text-6xl lg:text-7xl font-black text-brand-blue tracking-tighter leading-none">
            Analyses & Décryptages <span className="text-brand-orange">Experts.</span>
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            La vision Drakar sur les évolutions comptables, fiscales et stratégiques de votre secteur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group flex flex-col">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-brand-blue/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-xl">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-10 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-2xl font-black text-brand-blue mb-6 leading-tight group-hover:text-brand-orange transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 font-medium mb-8 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-slate-100">
                  <button className="flex items-center gap-2 text-brand-orange font-black text-xs uppercase tracking-widest group/btn">
                    Consulter l'analyse <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter placeholder */}
        <div className="mt-32 bg-brand-blue rounded-[60px] p-12 lg:p-24 text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-10">
            <h2 className="text-5xl font-black tracking-tighter">Recevez notre veille mensuelle.</h2>
            <p className="text-xl text-slate-400 font-medium">L'essentiel de l'actualité fiscale et sociale sélectionné par nos experts pour votre entreprise.</p>
            <div className="flex flex-col sm:flex-row gap-4">
               <input 
                type="email" 
                placeholder="votre@email.com" 
                className="flex-grow px-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-brand-orange transition-all font-bold"
               />
               <button className="bg-brand-orange text-white px-10 py-5 rounded-2xl font-black hover:bg-brand-orange-hover transition-all">
                S'abonner
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
