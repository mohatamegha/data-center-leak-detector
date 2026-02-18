import { useSimulation } from '@/context/SimulationContext';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  const { sensitivity, setSensitivity, autoContainment, setAutoContainment, alertDelay, setAlertDelay } = useSimulation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure detection and response behavior</p>
      </div>

      <div className="max-w-xl space-y-6">
        {/* Sensitivity */}
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Detection Sensitivity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Higher values detect more anomalies but may cause false positives</p>
            </div>
            <span className="font-mono text-sm text-primary">{sensitivity}%</span>
          </div>
          <Slider
            value={[sensitivity]}
            onValueChange={([v]) => setSensitivity(v)}
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Auto-containment */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Auto-Containment</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically contain threats after countdown expires</p>
            </div>
            <Switch checked={autoContainment} onCheckedChange={setAutoContainment} />
          </div>
        </div>

        {/* Alert Delay */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Alert Delay</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Seconds before first alert is triggered</p>
            </div>
            <Select value={String(alertDelay)} onValueChange={v => setAlertDelay(Number(v))}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Instant</SelectItem>
                <SelectItem value="5">5 seconds</SelectItem>
                <SelectItem value="10">10 seconds</SelectItem>
                <SelectItem value="15">15 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
