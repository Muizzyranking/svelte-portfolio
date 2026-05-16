<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let prefersReduced = false;

  onMount(() => {
    prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    // Read the current accent colour from CSS
    function getAccentRgb(): string {
      const style = getComputedStyle(document.documentElement);
      const hex = style.getPropertyValue('--green').trim() || '#9fbf6b';
      // Convert hex to r,g,b
      const r = parseInt(hex.slice(1,3), 16);
      const g = parseInt(hex.slice(3,5), 16);
      const b = parseInt(hex.slice(5,7), 16);
      return `${r},${g},${b}`;
    }

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number; opacity: number;
      opacityDir: number;
    }

    const COUNT = Math.min(55, Math.floor((W * H) / 18000));
    const particles: Particle[] = [];

    function spawn(): Particle {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        size: Math.random() * 1.5 + 0.4,
        opacity: Math.random() * 0.35 + 0.05,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
      };
    }

    for (let i = 0; i < COUNT; i++) particles.push(spawn());

    let raf: number;
    let rgb = getAccentRgb();
    let rgbTick = 0;

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Refresh rgb every 120 frames (accent may change)
      rgbTick++;
      if (rgbTick % 120 === 0) rgb = getAccentRgb();

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.opacityDir * 0.003;
        if (p.opacity > 0.4) p.opacityDir = -1;
        if (p.opacity < 0.03) p.opacityDir = 1;

        // Wrap edges
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${rgb},${p.opacity})`;
        ctx!.fill();
      }

      // Draw faint connecting lines for nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 100) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(${rgb},${0.06 * (1 - dist / 100)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  });
</script>

<canvas bind:this={canvas} class="particles" aria-hidden="true"></canvas>

<style>
  .particles {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .particles { display: none; }
  }
</style>
