import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Page } from "@/components/shell";
import { byId, load, plural, save } from "@/lib/kern";
import { useStore } from "@/lib/store";
import { tracksFor } from "@/pages/progress";

/* Certificates: drawn in the browser on Kern paper, downloaded as a PNG. Self-reported. */
const LONGDATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
type T = { k: string; name: string; ids: string[] };
function fit(c: CanvasRenderingContext2D, text: string, size: number, max: number, F: string) { c.font = "600 " + size + "px " + F; while (size > 40 && c.measureText(text).width > max) { size -= 4; c.font = "600 " + size + "px " + F; } return size; }
function clip(c: CanvasRenderingContext2D, s: string, max: number) { if (c.measureText(s).width <= max) return s; while (s.length > 4 && c.measureText(s + "…").width > max) s = s.slice(0, -1); return s + "…"; }
function drawCert(cv: HTMLCanvasElement, who: string, t: T, date: string) {
  const c = cv.getContext("2d")!, W = cv.width, H = cv.height;
  const INK = "#111110", INK2 = "#3D3B37", MUTED = "#67645E", ACC = "#17734D", F = "'Geist Mono', ui-monospace, monospace";
  c.fillStyle = "#F5F3EE"; c.fillRect(0, 0, W, H);
  c.strokeStyle = "rgba(17,17,16,.16)"; c.lineWidth = 2; c.strokeRect(48, 48, W - 96, H - 96);
  const slash = (x1: number, y1: number, x2: number, y2: number, col: string, w: number) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = "round"; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); };
  c.save(); c.translate(104, 96); c.scale(1.9, 1.9); slash(8, 5, 15, 27, INK, 4.4); slash(17, 5, 24, 27, ACC, 4.4); c.restore();
  c.fillStyle = INK; c.font = "600 40px " + F; c.textBaseline = "middle"; c.fillText("Kern", 172, 128);
  for (let k = 0; k < 5; k++) slash(W - 300 + k * 36, 104, W - 286 + k * 36, 152, ACC, 7);
  c.textBaseline = "alphabetic";
  c.fillStyle = MUTED; c.font = "400 30px " + F; c.fillText("Certificate of completion", 112, 330);
  c.fillStyle = who ? INK : "rgba(17,17,16,.25)"; c.font = "600 " + fit(c, who || "Your name", 96, W - 224, F) + "px " + F; c.fillText(who || "Your name", 112, 448);
  c.fillStyle = INK2; c.font = "400 32px " + F;
  c.fillText("completed " + (t.k === "path" ? "their path" : t.k === "core" ? "the core lessons" : "the " + t.name) + " of Kern, a course on using AI well at work", 112, 520, W - 224);
  c.font = "400 22px " + F; c.fillStyle = MUTED;
  const cols = t.ids.length > 6 ? 2 : 1, rows = Math.ceil(t.ids.length / cols), colW = (W - 224) / cols, lh = Math.min(36, 260 / rows);
  t.ids.forEach((id, i) => { const l = byId[id], x = 112 + Math.floor(i / rows) * colW, y = 600 + (i % rows) * lh; c.fillText(String(l.num).padStart(2, "0") + "  " + clip(c, l.title, colW - 80), x, y); });
  c.fillStyle = INK2; c.font = "400 26px " + F; c.fillText(date, 112, H - 112);
  c.fillStyle = MUTED; c.font = "400 20px " + F; c.textAlign = "right"; c.fillText("Self-reported. Progress is saved in the learner’s browser.", W - 112, H - 112); c.textAlign = "left";
}

export default function Certificate({ k }: { k: string }) {
  const { roles, progress } = useStore();
  const t = tracksFor(roles).find((x) => x.k === k);
  const full = !!t && t.ids.every((id) => progress[id]);
  const [name, setName] = useState<string>(() => load("gw-name", "") || "");
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("");
  const cv = useRef<HTMLCanvasElement>(null);
  const date = LONGDATE.format(new Date());
  useEffect(() => {
    if (!full || !cv.current) return;
    const draw = () => { drawCert(cv.current!, name.trim(), t!, date); setReady(true); };
    (document.fonts ? Promise.all([document.fonts.load("600 80px 'Geist Mono'"), document.fonts.load("400 20px 'Geist Mono'")]) : Promise.resolve()).then(draw, draw);
  }, [name, full]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Page className="max-w-4xl">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-4 text-muted-foreground"><a href="#progress"><ArrowLeft />Progress</a></Button>
      <h1 className="text-h1 font-semibold">Certificate</h1>
      {!full ? (<><p className="mt-4 text-sm text-muted-foreground">{t ? "Finish every lesson in this track first: " + t.ids.filter((id) => progress[id]).length + " of " + t.ids.length + " done." : "That track isn’t on your path."}</p><Button asChild className="mt-4"><a href="#progress">Back to progress</a></Button></>) : (
        <div className="mt-2 grid gap-5">
          <p className="text-ink-2">{t!.name}, {plural(t!.ids.length, "lesson")}. Add your name as you want it to appear, then download the image.</p>
          <div className="grid max-w-sm gap-2"><Label htmlFor="ct-name">Your name</Label><Input id="ct-name" maxLength={48} autoComplete="name" value={name} onChange={(e) => { setName(e.target.value); save("gw-name", e.target.value.trim()); }} /></div>
          <div className="relative overflow-hidden rounded-xl border">
            <canvas ref={cv} width={1600} height={1000} className="block h-auto w-full" role="img" aria-label="Certificate preview" />
            {!ready && <div className="absolute inset-0 animate-pulse bg-muted" role="status"><span className="sr-only">Drawing your certificate</span></div>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => {
              if (!name.trim()) { setMsg("Add your name first."); document.getElementById("ct-name")?.focus(); return; }
              cv.current!.toBlob((b) => { const url = URL.createObjectURL(b!), a = document.createElement("a"); a.href = url; a.download = "kern-certificate-" + k + ".png"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); setMsg("Downloaded"); }, "image/png");
            }}><Download />Download the image</Button>
            <span className="text-sm text-muted-foreground" aria-live="polite">{msg}</span>
          </div>
          <p className="text-xs text-muted-foreground">Self-reported: progress is saved in your browser, and the certificate isn’t verified by anyone.</p>
        </div>
      )}
    </Page>
  );
}
