"use client";

export default function Background() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [html[data-theme='light']_&]:bg-[linear-gradient(rgba(31,35,40,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(31,35,40,0.03)_1px,transparent_1px)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-secondary/18 via-primary/12 to-transparent rounded-full blur-[120px] [html[data-theme='light']_&]:from-secondary/10 [html[data-theme='light']_&]:via-primary/8" />
      <div className="absolute left-[14%] top-[22%] h-[320px] w-[320px] rounded-full bg-primary/8 blur-[110px] [html[data-theme='light']_&]:bg-primary/14" />
      <div className="absolute bottom-[16%] right-[14%] h-[280px] w-[280px] rounded-full bg-secondary/8 blur-[110px] [html[data-theme='light']_&]:bg-secondary/12" />
    </div>
  );
}
