'use client';


export default function PlayBackground({ zone }: { zone: 'mode-selector' | 'lobby'}) {

  return (
    <div className={`play-background-layers ${zone === 'lobby' ? "in-room" : ""}`}>
      <div className="bg-layer bg-lobby" />
      <div className="bg-layer bg-room" />
    </div>
  );
}
