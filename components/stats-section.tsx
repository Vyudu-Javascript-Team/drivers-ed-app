import { Card } from "@/components/ui/card";

interface Stat {
  label: string;
  value: string;
}

export function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center bg-background/50 backdrop-blur">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}