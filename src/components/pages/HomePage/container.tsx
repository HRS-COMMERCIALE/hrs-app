import React from 'react';
import BusinessPlan from "./businessPlan"
import AboutUs from "./AboutUs"

const Container: React.FC = () => {
  return (
    <section className="py-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      
      <div className="relative z-10">
        {/* BusinessPlan with 40px border radius - no margin bottom */}
        <div className="rounded-t-[40px] overflow-hidden">
          <BusinessPlan/>
        </div>
        
        {/* AboutUs with 40px border radius - no margin top */}
        <div className="rounded-b-[40px] overflow-hidden">
          <AboutUs/>
        </div>
      </div>
    </section>
  );
};

export default Container;
